const Product = require("../models/product");

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.productId);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find Product" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "The server responded to your request with an error" });
  }
  res.product = product;
  next();
}

module.exports = { getProduct };
