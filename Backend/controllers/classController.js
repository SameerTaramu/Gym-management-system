import Class from "../model/classModel.js";
import Booking from "../model/bookingModel.js";

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          matrix[i][j - 1] + 1,     
          matrix[i - 1][j] + 1      
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export const getAllClasses = async (req, res) => {
  try {
    const now = new Date();

    const classes = await Class.find({
      endTime: { $gt: now },
    })
      .populate("trainer", "name email")
      .sort({ startTime: 1 });

    const formatted = classes.map((cls) => {
      const hasStarted = now >= new Date(cls.startTime);
      const hasEnded = now >= new Date(cls.endTime);

      const isBookable =
        !hasStarted &&
        !hasEnded &&
        cls.bookedSlots < cls.slots;

      return {
        ...cls.toObject(),
        hasStarted,
        hasEnded,
        isBookable,
        remainingSlots: cls.slots - cls.bookedSlots,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Fetch classes error:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const getClassDetails = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate(
      "trainer",
      "name email"
    );

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const now = new Date();
    const hasStarted = now >= cls.startTime;
    const hasEnded = now >= cls.endTime;

   const isBookable =
  !hasStarted &&
  !hasEnded &&
  cls.bookedSlots < cls.slots;

    res.status(200).json({
      ...cls.toObject(),
      hasStarted,
      hasEnded,
      isBookable,
      remainingSlots: cls.slots - cls.bookedSlots,
    });
  } catch (error) {
    console.error("Fetch class details error:", error);
    res.status(500).json({ message: "Failed to fetch class details" });
  }
};

export const getRecommendedClasses = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const userBookings = await Booking.find({
      user: userId,
      status: { $in: ["Scheduled", "Completed"] },
    }).populate({
      path: "class",
      populate: { path: "trainer", select: "_id name email" },
    });

    const bookedClassIds = new Set(
      userBookings
        .map((booking) => booking.class?._id?.toString())
        .filter(Boolean)
    );

    const trainerFreq = userBookings.reduce((acc, booking) => {
      const trainerId = booking.class?.trainer?._id?.toString();
      if (trainerId) acc[trainerId] = (acc[trainerId] || 0) + 1;
      return acc;
    }, {});

    const favoredTrainers = Object.entries(trainerFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const candidates = await Class.find({
      endTime: { $gt: now },
      _id: { $nin: Array.from(bookedClassIds) },
    }).populate("trainer", "name email");

    const scored = candidates
      .map((cls) => {
        const booked = cls.bookedSlots || 0;
        const total = cls.slots || 1;
        const utilization = total ? booked / total : 0;

        const trainerScore = favoredTrainers.includes(cls.trainer?._id?.toString())
          ? 1.0
          : 0.4;

        const timeToStart = Math.max(0, (new Date(cls.startTime) - now) / 3600000); 
        const timeScore = 1 / (1 + Math.log1p(timeToStart));

        const utilizationScore = Math.min(1, utilization * 1.2);

        const score =
          trainerScore * 0.45 +
          utilizationScore * 0.35 +
          timeScore * 0.2;

        const hasStarted = now >= cls.startTime;
        const hasEnded = now >= cls.endTime;
        const isBookable = !hasStarted && !hasEnded && booked < total;

        return {
          class: cls,
          score,
          utilization,
          isBookable,
          hasStarted,
          hasEnded,
        };
      })
      .filter((item) => item.isBookable);

    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => ({
        ...item.class.toObject(),
        score: Number(item.score.toFixed(3)),
        utilization: Number((item.utilization * 100).toFixed(1)),
        hasStarted: item.hasStarted,
        hasEnded: item.hasEnded,
        isBookable: item.isBookable,
        remainingSlots: item.class.slots - item.class.bookedSlots,
      }));

    res.status(200).json({
      message: "Recommended classes fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("GET RECOMMENDED CLASSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch recommended classes" });
  }
};

export const searchClasses = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const now = new Date();
    const classes = await Class.find({
      endTime: { $gt: now },
    }).populate("trainer", "name email");

    const threshold = 2; 
    const results = classes
      .map((cls) => {
        const nameDistance = levenshteinDistance(query.toLowerCase(), cls.name.toLowerCase());
        const descDistance = cls.description
          ? levenshteinDistance(query.toLowerCase(), cls.description.toLowerCase())
          : Infinity;
        const minDistance = Math.min(nameDistance, descDistance);

        if (minDistance <= threshold) {
          const hasStarted = now >= cls.startTime;
          const hasEnded = now >= cls.endTime;
          const isBookable = !hasStarted && !hasEnded && cls.bookedSlots < cls.slots;

          return {
            ...cls.toObject(),
            distance: minDistance,
            hasStarted,
            hasEnded,
            isBookable,
            remainingSlots: cls.slots - cls.bookedSlots,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); 

    res.status(200).json({
      message: "Classes searched successfully",
      results,
    });
  } catch (error) {
    console.error("SEARCH CLASSES ERROR:", error);
    res.status(500).json({ message: "Failed to search classes" });
  }
};