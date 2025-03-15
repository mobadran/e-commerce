import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  logoutAll,
  deleteAccount,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
} from "../controllers/auth.controller.js";

import {
  registerValidator,
  loginValidator,
  logoutAllValidator,
  deleteAccountValidator,
  sendOTPValidator,
  verifyOTPValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  refreshTokenValidator,
} from "../validators/auth.validator.js";

import { authenticatedUser } from '../middlewares/auth.middleware.js';

// Register new user
// Body: email, password, name
router.post("/register", registerValidator, register);

// Login
// Body: email, password
router.post("/login", loginValidator, login);

// Logout this device
// No request content (Will just clear refresh token cookie)
router.delete("/logout", logout);

// Logout all devices (Remove refresh token from database)
router.delete("/logoutAll", authenticatedUser, logoutAllValidator, logoutAll);

// Get Access Token
// Cookie: refreshToken
router.get("/refreshToken", refreshTokenValidator, refreshToken);

// Delete account
// Query: email, password
router.delete("/deleteAccount", authenticatedUser, deleteAccountValidator, deleteAccount);

// Send OTP to user's email
// Body: email
router.post("/sendOTP", sendOTPValidator, sendOTP);

// Verify OTP
// Body: email, otp
router.post("/verifyOTP", verifyOTPValidator, verifyOTP);

// Forgot password (Send password reset link to user's email)
// Body: email
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);

// Reset password (Reset password using a valid reset token) (This step is after the user clicks on the link in the email when they forgot their password)
// Body: resetToken, password
router.post("/resetPassword", resetPasswordValidator, resetPassword);

// Change password (Allow logged-in users to change their password)
// Body: email, oldPassword, newPassword
router.patch("/changePassword", authenticatedUser, changePasswordValidator, changePassword);

// ! Not here
// Get User's Profile
// Authorization: Bearer <access_token>
// GET /me


export default router;