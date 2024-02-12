const mongoose = require("mongoose");
const productSchema = require("./product").schema;

const cartItemSchema = new mongoose.Schema({
  product: productSchema,
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const shoppingCartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  total: {
    type: Number,
    reqquired: true,
    default: 0,
  },
});

const Cart = mongoose.model("ShoppingCart", shoppingCartSchema);

module.exports = Cart;
