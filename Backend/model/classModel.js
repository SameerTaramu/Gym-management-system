import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
    },

    slots: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedSlots: {
      type: Number,
      default: 0,
    },

    adminReopen: {
      type: Boolean,
      default: false,
    },

    reopenedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
