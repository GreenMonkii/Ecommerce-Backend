const Product = require("../models/product");

const listProducts = (req, res, _next) => {
  const queryParams = req.query;
  const category = queryParams["category"] || null;
  const search = queryParams["search"] || "";
  const sortBy = queryParams["sortBy"] || "createdAt";
  const page = Number.parseInt(queryParams["page"]) - 1 || 0;
  const perPage = Number.parseInt(queryParams["perPage"]) || 5;
  const escapedSearch = search.replace(/[.*+?${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedSearch, "i");

  const query = { Name: regex };
  if (category) {
    query.categories = { $in: [category] };
  }

  Product.find(query)
    .sort(sortBy)
    .limit(perPage)
    .skip(page * perPage)
    .then((result) => {
      const products = [...result];
      res.json(products);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const getProductById = (_req, res, _next) => {
  res.json(res.product);
};

const createProduct = (req, res, _next) => {
  const product = new Product(req.body);
  product
    .save()
    .then((_result) => {
      res.statusCode = 201;
      res.json({ message: "Product Created Successfully" });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
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

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.productId });
    res.status(204);
    res.json({ message: "Product Deleted Successfully" });
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
  deleteProduct,
};
