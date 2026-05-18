import Booking from "../model/bookingModel.js";
import Class from "../model/classModel.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "class",
        select: `
          name 
          image
          startTime
          endTime
          durationMinutes
          slots
          bookedSlots
          trainer
        `,
        populate: {
          path: "trainer",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin fetch bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "name email")
            .populate({
                path: "class",
                select: "name trainer schedule slots bookedSlots",
                populate: { path: "trainer", select: "name email" }
            })
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.status(200).json(booking);
    } catch (error) {
        console.error("Admin fetch booking details error:", error.message);
        res.status(500).json({ message: "Failed to fetch booking details" });
    }
};

export const deleteBookingAdmin = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.status === "Booked") {
            const cls = await Class.findById(booking.class);
            if (cls && cls.bookedSlots > 0) {
                cls.bookedSlots -= 1;
                await cls.save();
            }
        }

        await booking.deleteOne();

        res.status(200).json({ _id: booking._id, message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Admin delete booking error:", error.message);
        res.status(500).json({ message: "Failed to delete booking" });
    }
};
