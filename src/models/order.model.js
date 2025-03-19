import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      }
    ],
    required: true,
  },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "canceled"], default: "pending", },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;