import Booking from "../model/bookingModel.js";
import Class from "../model/classModel.js";
import User from "../model/userModel.js";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import sendBookingConfirm from "../utils/sendBookingConfirm.js";

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .select("+qrImage")
      .populate({
        path: "class",
        select: "name trainer startTime endTime slots bookedSlots image",
        populate: { path: "trainer", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const bookClass = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.membership || user.membership.status !== "Active") {
      return res.status(403).json({ message: "Active membership required" });
    }

    if (
      user.membership.endDate &&
      new Date() > new Date(user.membership.endDate)
    ) {
      user.membership.status = "Expired";
      await user.save();
      return res.status(403).json({ message: "Membership expired" });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (new Date() >= new Date(cls.startTime) && !cls.adminReopen) {
      return res.status(400).json({ message: "Booking closed" });
    }
    if (new Date() >= new Date(cls.endTime)) {
      return res.status(400).json({ message: "Class already ended" });
    }
    if (cls.bookedSlots >= cls.slots) {
      return res.status(400).json({ message: "Class is full" });
    }

    const existing = await Booking.findOne({
      user: req.user._id,
      class: classId,
      status: "Scheduled",
    });

    if (existing) {
      return res.status(400).json({ message: "Already booked" });
    }

    const userScheduledBookings = await Booking.find({
      user: req.user._id,
      status: "Scheduled",
    }).populate("class");

    const newClassStart = new Date(cls.startTime);
    const newClassEnd = new Date(cls.endTime);

    const hasConflict = userScheduledBookings.some((booking) => {
      if (!booking.class) return false;

      const bookedClassStart = new Date(booking.class.startTime);
      const bookedClassEnd = new Date(booking.class.endTime);

      return newClassStart < bookedClassEnd && newClassEnd > bookedClassStart;
    });

    if (hasConflict) {
      return res.status(400).json({
        message:
          "Booking conflict: You already have another class during this time",
      });
    }

    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: classId,
        bookedSlots: { $lt: cls.slots },
        $or: [{ adminReopen: true }, { startTime: { $gt: new Date() } }],
      },
      { $inc: { bookedSlots: 1 } },
      { new: true }
    );

    if (!updatedClass) {
      return res
        .status(400)
        .json({ message: "Class is full or booking is no longer available" });
    }

    let booking;
    try {
      booking = await Booking.create({
        user: req.user._id,
        class: classId,
        status: "Scheduled",
      });
    } catch (createError) {
      await Class.findByIdAndUpdate(classId, { $inc: { bookedSlots: -1 } });

      if (createError.code === 11000) {
        return res.status(400).json({ message: "Already booked" });
      }

      throw createError;
    }

    const qrExpiry = new Date(updatedClass.endTime);

    const qrToken = jwt.sign(
      {
        bookingId: booking._id,
        classId: booking.class.toString(),
        userId: booking.user.toString(),
      },
      process.env.JWT_QR_SECRET,
      { expiresIn: Math.floor((qrExpiry.getTime() - Date.now()) / 1000) },
    );

    booking.qrToken = qrToken;
    booking.qrExpiresAt = qrExpiry;

    const qrPayload = JSON.stringify({ token: qrToken });
    const qrImage = await QRCode.toDataURL(qrPayload);

    booking.qrImage = qrImage;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: "class",
      populate: { path: "trainer", select: "name email" },
    });
    if (user.email) {
      try {
        await sendBookingConfirm({
          email: user.email,
          userName: user.name,
          className: cls.name,
          trainerName: populatedBooking.class?.trainer?.name,
          startTime: cls.startTime,
          endTime: cls.endTime,
          qrImage: booking.qrImage,
        });

        console.log("✅ Booking confirmation email sent");
      } catch (mailError) {
        console.error(
          "❌ Booking confirmation email failed:",
          mailError.message,
        );
      }
    }

    res.status(201).json({
      message: "Class booked successfully",
      booking: {
        ...populatedBooking.toObject(),
        qrImage,
      },
    });
  } catch (error) {
    console.error("BOOK CLASS ERROR:", error);
    res.status(500).json({ message: "Booking failed" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("class");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    if (!booking.class) {
      return res.status(404).json({ message: "Associated class not found" });
    }

    if (new Date() >= new Date(booking.class.startTime)) {
      return res.status(400).json({
        message: "Cannot cancel. Class already started.",
      });
    }

    booking.status = "Cancelled";
    await booking.save();
    if (booking.class.bookedSlots > 0) {
      booking.class.bookedSlots -= 1;
      await booking.class.save();
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Cancel booking failed" });
  }
};
