const Product = require("../models/product");

const listProducts = (req, res, next) => {
  const queryParams = req.query;
  const search = queryParams["search"] || "";
  const sortBy = queryParams["sortBy"] || "createdAt";
  // const filter = JSON.parse(queryParams["filter"]) || {prop: "", value: ""}
  const page = Number.parseInt(queryParams["page"]) - 1 || 0;
  const perPage = Number.parseInt(queryParams["perPage"]) || 5;
  console.log(queryParams);
  // Searching through the API Response
  Product.find()
    .sort(sortBy)
    .limit(perPage)
    .skip(page * perPage)
    .then((result) => {
      const products = [...result];
      res.json(products);
    });
};

const getProductById = (req, res, next) => {
  res.json(res.product);
};

const createProduct = (req, res, next) => {
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
};

const editProduct = async (req, res) => {
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
};

const replaceProduct = async (req, res) => {
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
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  editProduct,
  replaceProduct,
};
