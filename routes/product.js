const express = require("express");
const router = express.Router();
const { getProduct } = require("../middleware/product");
const productController = require("../controllers/productController");

router.get("/", productController.listProducts);

router.get("/:productId", getProduct, productController.getProductById);

router.post("/create", productController.createProduct);

// EDIT a product
router.patch("/:productId", productController.editProduct);

// PUT (replace) a product
router.put("/:productId", productController.replaceProduct);

module.exports = router;
