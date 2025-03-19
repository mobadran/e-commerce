import { body, param } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

export const orderValidator = [
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID format"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate,
];

export const addToWishlistValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID format"),
  validate,
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validate,
];

export const orderIdParamValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  validate,
];

export const addToCartValidator = [
  body("product").isMongoId().withMessage("Invalid product ID format"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate,
];