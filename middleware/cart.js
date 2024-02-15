const Cart = require("../models/cart");

async function getCart(req, res, next) {
  let cart;
  try {
    cart = await Cart.findById(req.params.cartId);
    if (cart == null) {
      return res.status(404).json({ message: "Cannot find Cart" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cart = cart;
  next();
}

module.exports = { getCart };
