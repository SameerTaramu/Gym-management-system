import Booking from "../model/bookingModel.js";

export const getTrainerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $in: ["Scheduled", "Completed"] },
    })
      .populate({
        path: "class",
        match: { trainer: req.user._id },
        select: "name schedule startTime",
      })
      .populate("user", "name email membershipStatus");

    const filtered = bookings.filter((b) => b.class !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};