const Product = require("../models/product");

const addReview = async (req, res) => {
  try {
    const review = req.body;
    if (!review.rating || !review.comment) {
      throw new Error("Product, rating, and comment are required");
    }
    const product = await Product.findById(req.params.productId);
    if (!product) {
      throw new Error("Product does not exist");
    }
    const reviewExists = product.Reviews.some(
      (rev) => rev.user.toString() === req.user.toString()
    );

    if (reviewExists) {
      res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    product.Reviews.push({
      user: req.user,
      rating: review.rating,
      comment: review.comment,
    });
    await product.save();
    res
      .status(201)
      .json({ message: "Review has been successfully added to the product" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addReview };
