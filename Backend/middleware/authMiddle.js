import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Payment from "../model/paymentModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });

      next();
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export const verifyPayment = async (req, res, next) => {
  const payment = await Payment.findOne({
  user: req.user._id,
  status: "success",
}).sort({ createdAt: -1 });


  if (!payment) {
    return res.status(403).json({ message: "Payment required" });
  }

  next();
};
