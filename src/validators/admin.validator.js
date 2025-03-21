import { body } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

export const createProductValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").isFloat().withMessage("Price must be a number"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  // body("image").notEmpty().withMessage("Image is required"),
  validate,
];

export const updateProductValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("price").optional().isFloat().withMessage("Price must be a number"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("category").optional().isString().withMessage("Category must be a string"),
  validate,
];

const allowedStatuses = ["pending", "processing", "shipped", "delivered", "canceled"];

export const orderStatusValidator = [
  body("status").isIn(allowedStatuses).withMessage(`Status must be one of ${allowedStatuses.join(", ")}`),
  validate,
];