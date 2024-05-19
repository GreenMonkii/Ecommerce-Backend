const { Cart } = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

const getCartItems = (_req, res, _next) => {
  res.json(res.cart);
};

const addItemToCart = async (req, res, _next) => {
  try {
    const cartItem = req.body;
    if (!cartItem.product || !cartItem.quantity) {
      throw new Error("Product and quantity are required");
    }
    const product = await Product.findById(cartItem.product);
    if (!product) {
      throw new Error("Product does not exist");
    }
    const user = await User.findById(req.user);
    let userCart = await Cart.findById(user.shoppingCart);

    // Check for a user without an attached shopping cart
    if (!userCart) {
      user.createCart();
    }

    userCart.items.push(cartItem);
    await userCart.save();
    res
      .status(201)
      .json({ message: "Item has been successfully added to cart" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeItemFromCart = async (req, res, _next) => {
  try {
    const cartItemID = req.body.cartItemID;
    const user = await User.findById(req.user);
    const userCart = await Cart.findById(user.shoppingCart);
    userCart.items = userCart.items.filter(
      (cartItem) => cartItem._id.toString() !== cartItemID
    );
    await userCart.save();
    res
      .status(201)
      .json({ message: "Item has been successfully removed from the cart" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCartItems, addItemToCart, removeItemFromCart };
