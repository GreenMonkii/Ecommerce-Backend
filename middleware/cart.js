const { Cart } = require("../models/cart");
const User = require("../models/user");

async function getCart(req, res, next) {
  let cart;
  try {
    const user = await User.findById(req.session.userId);
    cart = await Cart.findById(user.shoppingCart);
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
