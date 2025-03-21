import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  price: { type: Number, required: true, },
  description: { type: String, required: true, },
  image: { type: String, required: true, },
  category: { type: String, required: true, },
  reviews: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review", }],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;