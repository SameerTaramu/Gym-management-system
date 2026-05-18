import Booking from "../model/bookingModel.js";
import jwt from "jsonwebtoken";

export const verifyAttendance = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_QR_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired QR" });
    }

    const booking = await Booking.findById(decoded.bookingId).populate("class");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (!booking.class) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (booking.class.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this class" });
    }

    if (booking.attended) {
      return res.status(400).json({ message: "QR already used" });
    }

    if (booking.qrExpiresAt && new Date() > booking.qrExpiresAt) {
      return res.status(400).json({ message: "QR expired" });
    }

    booking.attended = true;
    booking.status = "Completed";
    await booking.save();

    res.status(200).json({
      message: "Attendance marked",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
