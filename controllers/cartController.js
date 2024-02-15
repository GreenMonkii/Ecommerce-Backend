const { cartItem } = require("../models/cart");

const getCartItems = (req, res, next) => {
  res.json(res.cart);
};

const addItemToCart = (req, res, next) => {
  try {
    const product = new cartItem(req.body);
    res.cart.items.push(product);
    res
      .status(201)
      .json({ message: "Item has been successfully added to cart" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeItemFromCart = (req, res, next) => {
  try {
    const productId = req.body.productId;
    res.cart.items = res.cart.items.filter(
      (product) => product._id !== productId
    );
    res
      .status(201)
      .json({ message: "Item has been successfully removed from the cart" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCartItems, addItemToCart, removeItemFromCart };
