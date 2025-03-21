import Product from '../models/product.model.js';
import Review from '../models/review.model.js';


export const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let { page = 1, limit = 10 } = req.query;

    if (limit > 100) limit = 100;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
    }

    try {
      page = parseInt(page);
      limit = parseInt(limit);
    } catch {
      return res.status(400).json({ message: "Invalid page, limit, minPrice or maxPrice" });
    }

    const results = await Product.find(filter).skip((page - 1) * limit).limit(limit).select('-reviews');

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const postReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    let review;
    try {
      review = await Review.create({
        product: productId,
        user: req.user.userId,
        rating,
        comment: comment ? comment : null
      });
    } catch (error) {
      if (error.name === "ProductNotFoundError") {
        return res.status(404).json({ message: "Product not found" });
      } else if (error.code === 11000) {
        // Update existing review
        review = await Review.findOneAndUpdate(
          { product: productId, user: req.user.userId },
          { rating, comment: comment ? comment : null },
          { new: true }
        );
        return res.status(200).json({ message: "Review updated", review });
        // return res.status(400).json({ message: "You already reviewed this product" });
      } else {
        return next(error);
      }
    }

    return res.status(201).json({ message: "Review created", review });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate('user', 'name -_id');

    if (!reviews) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};