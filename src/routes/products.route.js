import express from "express";
const router = express.Router();

import { getProduct, getProducts } from '../controllers/products.controller.js';
import { idParamValidator } from '../validators/user.validator.js';

// Get Products
router.get('/products', getProducts);

// Get Product by ID
router.get('/products/:id', idParamValidator, getProduct);


export default router;