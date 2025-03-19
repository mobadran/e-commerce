import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";
import { createRefreshToken, createAccessToken, verifyRefreshToken } from "../utils/tokens.js";
import { sendOTPEmail, sendResetPasswordEmail } from "../utils/sendEmail.js";
import { delay, updateAverage } from "../utils/timingAttackUtils.js";

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // If email exists return 400
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "If this email is not registered, a confirmation will be sent." });
    }

    // Generate and send OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
    const pendingUser = await PendingUser.findOne({ email });
    // If pending user already exists, update their data instead of creating a new pending user
    if (pendingUser) {
      pendingUser.email = email;
      pendingUser.password = password;
      pendingUser.name = name;
      pendingUser.otp = otp;
      pendingUser.otpExpires = otpExpires;
      pendingUser.save();

      // Send OTP to user's email
      await sendOTPEmail(pendingUser.email, otp);

      return res.status(201).json({ message: "If this email is not registered, a confirmation will be sent." });
    }
    // Create a new PENDING user
    const user = await PendingUser.create({ email, password: password, name, otp, otpExpires });

    // Send OTP to user's email
    await sendOTPEmail(user.email, otp);

    return res.status(201).json({ message: "If this email is not registered, a confirmation will be sent." });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // If email is incorrect return 401
    if (!user) {
      // Simulate a password check to prevent timing attacks
      await bcrypt.compare(password, "$2b$10$NPacK818QwFprj5ISGcFOe3dRHyzFiJQ.3yh6cmnANgrDJX5gI9Sq");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Now compare the real password and if it's incorrect return 401
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign refresh, and access tokens
    const refreshToken = await createRefreshToken(user._id);
    const accessToken = createAccessToken(user._id, user.role);
    // Send refresh token as a cookie and access token as a response
    return res.status(200).cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let userId;
    try {
      userId = await verifyRefreshToken(req.cookies.refreshToken);
    } catch (JsonWebTokenError) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const user = await User.findById(userId);
    if (!user || user.refreshToken !== req.cookies.refreshToken) {
      return res.status(403).json({ error: "Refresh Token Invalid" });
    }

    // Sign Access Token
    const accessToken = createAccessToken(user._id, user.role);

    return res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear refresh token cookie
    return res.clearCookie("refreshToken").sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // Clear all refresh tokens
    await User.findByIdAndUpdate(userId, { refreshToken: "" });
    return res.clearCookie('refreshToken').sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { email, password } = req.query;
    const userId = req.user.userId;
    console.log(userId);

    const user = await User.findById(userId);
    if (!user || user.email !== email || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: "Invalid access token, email, password, or user deleted" });
    }
    // Delete user
    await User.findByIdAndDelete(userId);
    // Clear refresh token cookie
    return res.clearCookie("refreshToken").sendStatus(204);
  } catch (error) {
    next(error);
  }
};


const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await PendingUser.findOne({ email });

    // If user not found return 400 instead of 404 to prevent the attacker from knowing if the user exists
    if (!user) {
      return res.status(400).json({ error: "User either not found or already registered" });
    }
    let otp = user.otp;
    // If OTP has expired Generate a new OTP
    if (user.otpExpires < new Date()) {
      otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
      const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send OTP to user's email
    await sendOTPEmail(user.email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await PendingUser.findOne({ email });
    console.log(`
      User: ${user}
      OTP: ${otp}
      `);


    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "User not found OR User already registered OR Invalid OTP" });
    }

    // Clear OTP and OTP expiration and verify user
    // user.otp = null;
    // user.otpExpires = null;
    // user.isVerified = true;
    // await user.save();

    // Delete user from Pending Users and add them to Users
    const newUser = await User.create({ name: user.name, email: user.email, password: user.password, createdAt: user.createdAt });
    await user.deleteOne();

    // Convert to object and remove fields
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse._id;
    delete userResponse.refreshToken;
    delete userResponse.resetToken;
    delete userResponse.resetTokenExpires;

    return res.status(200).json({ message: "User successfully verified.", user: userResponse });
  } catch (error) {
    next(error);
  }
};

let avgUserSaveTime = 16;
let avgSendEmailTime = 2321;

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Simulate user.save() and sendResetPasswordEmail() to prevent timing attacks
      await Promise.allSettled([
        delay(avgUserSaveTime),
        delay(avgSendEmailTime)
      ]);
      return res.status(200).json({ message: "Reset password link sent to your email if your email is in our database" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 mins

    // Measure user.save() execution time
    const saveStart = performance.now();
    await user.save();
    const saveEnd = performance.now();
    avgUserSaveTime = updateAverage(avgUserSaveTime, saveEnd - saveStart);
    console.log("Updated avgUserSaveTime:", avgUserSaveTime);

    // Measure sendResetPasswordEmail() execution time
    const sendStart = performance.now();
    await sendResetPasswordEmail(user.email, resetToken);
    const sendEnd = performance.now();
    avgSendEmailTime = updateAverage(avgSendEmailTime, sendEnd - sendStart);
    console.log("Updated avgSendEmailTime:", avgSendEmailTime);

    return res.status(200).json({ message: "Reset password link sent to your email if your email is in our database" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, password } = req.body;
    const user = await User.findOne({ email });

    // If user not found in db, return 404
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // If reset token is not the same in db, return 403 (forbidden)
    if (user.resetToken !== resetToken) {
      return res.status(403).json({ message: "Reset Token Invalid" });
    }

    if (user.resetTokenExpires < new Date()) {
      return res.status(403).json({ message: "Reset Token Expired" });
    }

    // Compare passwords. If old password and new password are the same, return an error
    if (await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Do not use the old password' });

    // Change the password and save
    user.password = password;
    user.resetToken = '';
    user.resetTokenExpires = '';
    await user.save();
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) return res.status(400).json({ message: "Why would you do that?" });

    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (!(await bcrypt.compare(oldPassword, user.password))) return res.status(403).json({ message: "Old Password is incorrect" });

    user.password = password;
    user.save();

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  logout,
  logoutAll,
  deleteAccount,
  refreshToken,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
};