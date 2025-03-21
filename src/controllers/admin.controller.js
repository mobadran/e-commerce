import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import cloudinary from '../config/cloudinary.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category } = req.body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(req.file.buffer);
    });

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: result.secure_url,
      createdBy: req.user.userId,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { name, price, description, category } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Input atleast one field" });
    }

    let newProduct = { updatedBy: req.user.userId };

    if (name) newProduct.name = name;
    if (price) newProduct.price = price;
    if (description) newProduct.description = description;
    if (category) newProduct.category = category;

    const product = await Product.findByIdAndUpdate(productId, newProduct, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);

  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find().skip((page - 1) * limit).limit(limit).populate('items.product');

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate({ _id: orderId }, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);

  } catch (error) {
    next(error);
  }
};