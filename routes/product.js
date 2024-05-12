const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const { getProduct } = require("../middleware/product");
const productController = require("../controllers/productController");
const requireAuth = require("../middleware/auth");

const cache = apicache.middleware;

router.get("/", cache("30 minutes"), productController.listProducts);

router.get(
  "/:productId",
  cache("30 minutes"),
  getProduct,
  productController.getProductById
);

router.post("/create", requireAuth, productController.createProduct);

// EDIT a product
router.patch("/:productId", requireAuth, productController.editProduct);

// PUT (replace) a product
router.put("/:productId", requireAuth, productController.replaceProduct);

// DELETE a product
router.delete("/:productId", requireAuth, productController.deleteProduct);

module.exports = router;
