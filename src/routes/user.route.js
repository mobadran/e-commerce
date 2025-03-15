import express from "express";
const router = express.Router();

import { authenticatedUser } from '../middlewares/auth.middleware.js';
import User from "../models/user.model.js";

// /api/user/profile           # GET - Get user profile
router.get('/profile', authenticatedUser, async (req, res) => {
  const user = await User.findById(req.user.userId).select('_id name email role createdAt');
  return res.status(200).json(user);
});
// /api/user/updateProfile     # PATCH - Update profile
// /api/user/orders            # GET - Get user’s orders
// /api/user/wishlist          # GET - Get wishlist
// /api/user/cart              # GET - Get cart

export default router;