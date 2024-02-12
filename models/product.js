const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Product Schema
// It consists of the following properties: Name, Price, Description, Image, Retailer, Category, Featured.
const productSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: true,
    },
    Retailer: {
      type: Map,
      required: true,
    },
    Category: [String],
    Featured: {
      type: Boolean,
      required: true,
    },
    Stock: {
      type: Number,
      required: true,
    },
    Keywords: [String]
  },
  { timestamps: true }
);

// Create a Model based on the created Schema

const Product = mongoose.model("Product", productSchema);
module.exports = Product;