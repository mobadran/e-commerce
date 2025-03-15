import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  refreshToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // otp: {
  //   type: String,
  //   default: "",
  // },
  // otpExpires: {
  //   type: Date,
  //   default: null,
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpires: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;