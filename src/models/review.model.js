import mongoose from "mongoose";
import Product from './product.model.js';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    rating: { type: Number, required: true, min: 1, max: 5, },
    comment: { type: String, default: null, trim: true, },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Add review to product
reviewSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) return next(); // Skip if it's not a new review

    // Check if the product exists
    const result = await Product.exists({ _id: this.product });
    if (!result) {
      const error = new Error("Product does not exist");
      error.name = "ProductNotFoundError";
      return next(error);
    }

    // Continue to save the review
    next();
  } catch (error) {
    next(error);
  }
});

reviewSchema.post("save", async function (doc) {
  await Product.updateOne(
    { _id: doc.product },
    { $push: { reviews: doc._id } }
  );
});

// Remove review from product
reviewSchema.post(["findOneAndDelete", "deleteOne", "deleteMany"], async function (doc) {
  if (doc) {
    await Product.updateOne(
      { _id: doc.product },
      { $pull: { reviews: doc._id } }
    );
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;