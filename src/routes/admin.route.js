import express from "express";
const router = express.Router();

import upload from "../middlewares/multer.middleware.js";
import validateFile from "../middlewares/validateFile.middleware.js";

import { authenticatedAdmin } from '../middlewares/auth.middleware.js';
import { createProduct, deleteProduct, getAllOrders, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { createProductValidator, orderStatusValidator, updateProductValidator } from "../validators/admin.validator.js";
import { idParamValidator } from '../validators/user.validator.js';

// * Products
// Create Product
router.post('/products', authenticatedAdmin, upload.single('image'), validateFile, createProductValidator, createProduct);

// Update Product
router.put('/products/:id', authenticatedAdmin, idParamValidator, updateProductValidator, updateProduct);

// Delete Product
router.delete('/products/:id', authenticatedAdmin, idParamValidator, deleteProduct);

// * Orders
// Get All Orders
router.get('/orders', authenticatedAdmin, getAllOrders);

// Update Order Status
router.patch('/orders/:id', authenticatedAdmin, idParamValidator, orderStatusValidator, updateOrderStatus);

export default router;