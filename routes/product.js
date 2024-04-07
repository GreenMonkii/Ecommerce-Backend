const express = require("express");
const router = express.Router();
const { getProduct } = require("../middleware/product");
const productController = require("../controllers/productController");
const requireAuth = require("../middleware/auth");

router.get("/", productController.listProducts);

router.get("/:productId", getProduct, productController.getProductById);

router.post("/create", requireAuth, productController.createProduct);

// EDIT a product
router.patch("/:productId", requireAuth, productController.editProduct);

// PUT (replace) a product
router.put("/:productId", requireAuth, productController.replaceProduct);

module.exports = router;
