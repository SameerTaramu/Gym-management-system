import mongoose from "mongoose";

const classSlotSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    bookedSlot: {
      type: Number,
      default: 0,
    },

    status: {
    type: String,
    enum: ["open", "closed", "expired"],
    default: "open",
  },
  },
  { timestamps: true }
);

export default mongoose.model("ClassSlot", classSlotSchema);
