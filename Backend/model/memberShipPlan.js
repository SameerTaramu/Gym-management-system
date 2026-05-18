import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    canHireTrainer: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

membershipPlanSchema.index({ name: 1, duration: 1 }, { unique: true });

export default mongoose.model("MembershipPlan", membershipPlanSchema);