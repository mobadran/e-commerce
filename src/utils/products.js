import Product from '../models/product.model.js';

export const validateProductIds = async (items) => {
  const productIds = items.map(item => item.product);
  const existingProducts = await Product.find({ _id: { $in: productIds } }).select("_id");
  const existingProductIds = existingProducts.map(p => p._id.toString());
  const invalidProducts = productIds.filter(id => !existingProductIds.includes(id.toString()));
  if (invalidProducts.length > 0) {
    return { error: true, message: `Invalid product IDs: ${invalidProducts.join(", ")}` };
  }
  return { error: false };
};