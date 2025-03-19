import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  price: { type: Number, required: true, },
  description: { type: String, required: true, },
  // image: { type: String, required: true, }, 
  image: { type: String, }, // ! Make it required when I set up cloudinary
  category: { type: String, required: true, },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
  createdAt: { type: Date, default: Date.now, },
  updatedAt: { type: Date, default: Date.now, },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;