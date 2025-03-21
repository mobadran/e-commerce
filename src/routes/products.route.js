import express from "express";
const router = express.Router();

import { authenticatedUser } from '../middlewares/auth.middleware.js';
import { getProduct, getProducts, postReview, getReviews, deleteReview } from '../controllers/products.controller.js';
import { idParamValidator } from '../validators/user.validator.js';
import { postReviewValidator } from '../validators/products.validator.js';

// Get Products
router.get('/', getProducts);

// Get Product by ID
router.get('/:id', idParamValidator, getProduct);

// Get all reviews for a product
router.get('/:id/reviews', idParamValidator, getReviews);

// Post a Review
router.post('/:id/review', authenticatedUser, idParamValidator, postReviewValidator, postReview);

// Delete a review (User)
router.delete('/reviews/:id', authenticatedUser, idParamValidator, deleteReview);

// TODO: Test the three routes above

// TODO: Delete Review Admin in admin routes

export default router;