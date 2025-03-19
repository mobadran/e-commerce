import express from "express";
const router = express.Router();

import { authenticatedUser } from '../middlewares/auth.middleware.js';
import { addOrder, addToCart, addToWishlist, cancelOrder, deleteFromCart, deleteFromWishlist, getCart, getOrder, getOrders, getWishlist } from "../controllers/user.controller.js";
import { addToCartValidator, addToWishlistValidator, orderValidator, idParamValidator } from "../validators/user.validator.js";

// * Orders
// /api/user/orders                     # GET - Get user’s orders
router.get('/orders', authenticatedUser, getOrders);

// /api/user/orders/:id            # GET - Get single order
router.get('/orders/:id', authenticatedUser, idParamValidator, getOrder);

// /api/user/orders                     # PUT - Add an order
router.put('/orders', authenticatedUser, orderValidator, addOrder);

// ! Updating an order is more advanced, so I will implement it later
// /api/user/orders/:id            # PATCH - Update an order
// router.patch('/orders/:id', authenticatedUser, orderIdParamValidator, orderValidator, updateOrder);

// /api/user/orders/:id            # PUT - Cancel an order
router.put('/orders/:id/cancel', authenticatedUser, idParamValidator, cancelOrder);

// * Wishlist
// /api/user/wishlist                   # GET - Get user’s wishlist
router.get('/wishlist', authenticatedUser, getWishlist);

// /api/user/wishlist                   # PUT - Add to Wishlist
router.put('/wishlist', authenticatedUser, addToWishlistValidator, addToWishlist);

// /api/user/wishlist                   # DELETE - Remove from Wishlist
router.delete('/wishlist/:id', authenticatedUser, idParamValidator, deleteFromWishlist);

// * Cart
// /api/user/cart                       # GET - Get user’s Cart
router.get('/cart', authenticatedUser, getCart);

// /api/user/cart                       # PUT - Add a Cart
router.put('/cart', authenticatedUser, addToCartValidator, addToCart);

// /api/user/cart                       # DELETE - Remove a Cart
router.delete('/cart/:id', authenticatedUser, idParamValidator, deleteFromCart);

export default router;