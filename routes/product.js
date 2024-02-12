const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { getProduct } = require("../middleware/product");

router.get("/", (req, res, next) => {
  const queryParams = req.query;
  const search = queryParams["search"] || "";
  const sortBy = queryParams["sortBy"] || "createdAt";
  // const filter = JSON.parse(queryParams["filter"]) || {prop: "", value: ""}
  const page = Number.parseInt(queryParams["page"]) || 1;
  const perPage = Number.parseInt(queryParams["perPage"]) || 5;
  console.log(queryParams);
  // Searching through the API Response
  Product.find({ Description: new RegExp(`.*${search}.*`) })
    // Filtering the API Response
    // .where(filter.props).equals(filter.value)
    // Sorting the API Response
    .sort(sortBy)
    .limit(perPage)
    .skip(page * perPage)
    .then((result) => {
      const products = [...result];
      res.json(products);
    });
});

router.get("/:productId", getProduct, (req, res, next) => {
  res.json(res.product);
});

router.post("/create", (req, res, next) => {
  const product = new Product(req.body);
  product
    .save()
    .then((result) => {
      res.statusCode = 201;
      res.json({ message: "Product Created Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// PATCH an product
router.patch("/:productId", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
      }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (replace) an product
router.put("/:productId", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
      }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
