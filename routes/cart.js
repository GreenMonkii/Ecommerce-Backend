const express = require("express");
const router = express.Router();
const getCart = require("../middleware/cart");
const cartController = require("../controllers/cartController");

router.get("/", getCart, cartController.getCartItems);

router.post("/add", getCart, cartController.addItemToCart);

router.post("/remove", getCart, cartController.removeItemFromCart);

module.exports = router;
