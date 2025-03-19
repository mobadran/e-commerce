import Product from '../models/product.model.js';


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

    const results = await Product.find(filter).skip((page - 1) * limit).limit(limit);

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