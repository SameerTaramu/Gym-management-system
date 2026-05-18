import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
    sessionId: String,
    qrToken: String,
    qrExpiresAt: Date,
    qrImage: String,
    attended: {
      type: Boolean,
      default: false,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { user: 1, class: 1 },
  { unique: true, partialFilterExpression: { status: "Scheduled" } }
);

export default mongoose.model("Booking", bookingSchema);
