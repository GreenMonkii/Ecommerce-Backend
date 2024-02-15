const mongoose = require("mongoose");
const productSchema = require("./product").schema;
const userSchema = require("./user").schema;

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
  user: userSchema,
  items: [cartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Cart = mongoose.model("ShoppingCart", shoppingCartSchema);
const cartItem = mongoose.model("CartItem", cartItemSchema)
module.exports = {Cart, cartItem};