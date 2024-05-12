const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, "Quantity cannot be less than 1"],
  },
});

cartItemSchema.virtual("price").get(function () {
  return this.product.Price;
});

const shoppingCartSchema = new mongoose.Schema({
  items: [cartItemSchema],
});

const Cart = mongoose.model("ShoppingCart", shoppingCartSchema);
const cartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = { Cart, cartItem };
