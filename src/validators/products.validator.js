import { body, param } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

export const postReviewValidator = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  validate,
];
