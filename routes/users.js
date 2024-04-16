const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/auth");

router.post("/signup", userController.createUser);
router.get("/me", requireAuth, userController.getUserInfo);
router.post("/login", userController.loginUser);
router.post("/add-order-history", requireAuth, userController.addOrderHistory);
router.get("/get-order-history", requireAuth, userController.getOrderHistory);

module.exports = router;
