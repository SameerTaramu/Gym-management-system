import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import { checkMembershipExpiry } from "./middleware/checkExpiry.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import trainerHireRoutes from "./routes/trainerHireRoutes.js";
import "./cron/membershipExpiryCron.js"
import "./cron/classReminderCron.js"
import "./cron/trainerHireExpiryCron.js";
dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
 app.use("/api/admin", adminRoutes);
 app.use("/api/classes", checkMembershipExpiry, classRoutes);
app.use("/api/bookings", checkMembershipExpiry, bookingRoutes);
app.use("/api/bookings", adminRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/trainer-hires", trainerHireRoutes);
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
