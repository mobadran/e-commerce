import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m',
  },
  otp: {
    type: String,
    default: "",
  },
  otpExpires: {
    type: Date,
    default: null,
  },
});

const PendingUser = mongoose.model("PendingUser", PendingUserSchema);

export default PendingUser;