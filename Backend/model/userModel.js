import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const membershipSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
  },
  status: {
  type: String,
  enum: ["Pending", "Active", "Expired", "Cancelled", "Rejected"],
  default: "Pending",
},
  paymentMethod: {
    type: String,
    enum: ["Cash", "eSewa", "Khalti"],
  },
  paymentVerified: {
    type: Boolean,
    default: false,
  },
  transactionId: String,
  khaltiPidx: {
    type: String,
    default: null,
  },
  purchasedAt:{
  type: Date,
  default: Date.now,
  }, 
  startDate: Date,
  endDate: Date,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "trainer"],
      default: "user",
    },
    image: {
  type: String,
  default: null,
},


membership: {
  type: membershipSchema,
  default: null,
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
