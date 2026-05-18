import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin9801@gmail.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin9801@gmail.com",
      password: "Admin@123",
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
