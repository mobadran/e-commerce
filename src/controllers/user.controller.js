import Order from "../models/order.model.js";
import Product from '../models/product.model.js';
import User from "../models/user.model.js";
import { validateProductIds } from '../utils/products.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('_id name email role createdAt');
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const changeName = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "No data provided" });

    user.name = name;
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.product');

    return res.status(200).json(orders);

  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId).populate('items.product');
    if (!order || order.userId.toString() !== req.user.userId) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const addOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    // Check if all products exist
    const result = await validateProductIds(items);
    if (result.error) return res.status(400).json({ message: result.message });

    // Create order
    const order = await Order.create({
      userId: req.user.userId,
      items,
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// export const updateOrder = async (req, res, next) => {
//   try {
//     const { id: orderId } = req.params;
//     const { items } = req.body;

//     // Check if all products exist
//     const result = await validateProductIds(items);
//     if (result.error) return res.status(400).json({ message: result.message });

//     const order = await Order.findOneAndUpdate({ _id: orderId, userId: req.user.userId }, { items }, { new: true });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     return res.status(200).json(order);
//   } catch (error) {
//     next(error);
//   }
// };

export const cancelOrder = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user.userId, orderStatus: { $in: ["pending", "processing"] } },
      { orderStatus: "canceled" },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ message: "Order can only be canceled if it is pending or processing" });
    }

    return res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('wishlist');
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!await Product.exists({ _id: productId })) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await User.findOneAndUpdate(
      { _id: req.user.userId, wishlist: { $ne: productId } }, // $ne: productId means "not equal to productId".
      { $push: { wishlist: productId } },
      { new: true }
    );

    if (!result) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    return res.status(200).json({ wishlist: result.wishlist });
  } catch (error) {
    next(error);
  }
};

export const deleteFromWishlist = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const result = await User.findOneAndUpdate(
      { _id: req.user.userId, wishlist: productId }, // Find user AND check if product is in wishlist
      { $pull: { wishlist: productId } }, // Remove product from wishlist
      { new: true, select: "wishlist" } // Return updated document with only wishlist
    );

    if (!result) return res.status(400).json({ message: "Product not in wishlist" });

    return res.status(200).json({ wishlist: result.wishlist });
  } catch (error) {
    next(error);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    await User.findById(req.user.userId).updateOne({ $set: { wishlist: [] } });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('cart');
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;

    // If product does not exist
    if (!await Product.exists({ _id: product })) {
      return res.status(404).json({ message: "Product not found" });
    }

    let result;
    // If product is already in cart
    result = await User.findOneAndUpdate(
      { _id: req.user.userId, cart: { $elemMatch: { product } } }, // Find user AND check if product is in cart
      { $set: { "cart.$.quantity": quantity } }, // Update quantity of product in cart
      { new: true, select: "cart" } // Return updated document with only cart
    );

    // If product is not in cart, add it to cart
    if (!result) {
      result = await User.findOneAndUpdate({ _id: req.user.userId }, { $push: { cart: { product, quantity } } }, { new: true, select: "cart" });
    }

    return res.status(200).json({ cart: result.cart });

  } catch (error) {
    next(error);
  }
};

export const deleteFromCart = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const result = await User.findOneAndUpdate(
      { _id: req.user.userId, cart: { $elemMatch: { product: productId } } }, // Find user AND check if product is in cart
      { $pull: { cart: { product: productId } } }, // Remove product from cart
      { new: true, select: "cart" } // Return updated document with only cart
    );

    if (!result) return res.status(400).json({ message: "Product not in cart" });

    return res.status(200).json({ cart: result.cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await User.findById(req.user.userId).updateOne({ $set: { cart: [] } });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};