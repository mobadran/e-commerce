import { body, cookie, query } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

const registerValidator = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  // body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters").isStrongPassword().withMessage("Password must be Strong. Please include at least one uppercase letter, one lowercase letter, one number, and one special character."),
  body("password").notEmpty().withMessage("Password is required").isStrongPassword().withMessage("Password must be Strong. Please include at least one uppercase letter, one lowercase letter, one number, and one special character. Minimum length 8 characters."),
  body("name").notEmpty().withMessage("Name is required"),
  validate,
];

const loginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// const logoutAllValidator = [
//   cookie("refreshToken").notEmpty().withMessage("Refresh token is required"),
//   validate,
// ];

const deleteAccountValidator = [
  query("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  query("password").notEmpty().withMessage("Password is required"),
  validate,
];

const sendOTPValidator = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  validate,
];

const verifyOTPValidator = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("otp").notEmpty().withMessage("OTP is required"),
  validate,
];

const forgotPasswordValidator = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  validate,
];

const resetPasswordValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is Required").isStrongPassword().withMessage("Password must be Strong. Please include at least one uppercase letter, one lowercase letter, one number, and one special character. Minimum length 8 characters."),
  body("resetToken").notEmpty().withMessage("Reset Token is Required"),
  validate,
];

const changePasswordValidator = [
  body("oldPassword").notEmpty().withMessage("Password is Required"),
  body("newPassword").notEmpty().withMessage("Password is Required").isStrongPassword().withMessage("Password must be Strong. Please include at least one uppercase letter, one lowercase letter, one number, and one special character. Minimum length 8 characters."),
  validate,
];

const refreshTokenValidator = [
  cookie("refreshToken").notEmpty().withMessage("Refresh Token is required")
];

export {
  registerValidator,
  loginValidator,
  // logoutAllValidator,
  deleteAccountValidator,
  sendOTPValidator,
  verifyOTPValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  refreshTokenValidator,
};