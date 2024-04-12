const express = require("express");
const router = express.Router();
const { getCart } = require("../middleware/cart");
const cartController = require("../controllers/cartController");
const requireAuth = require("../middleware/auth");

router.get("/", requireAuth, getCart, cartController.getCartItems);

router.post("/add", requireAuth, cartController.addItemToCart);

router.post("/remove", requireAuth, cartController.removeItemFromCart);

module.exports = router;
