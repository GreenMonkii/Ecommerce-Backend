const mongoose = require("mongoose");
const crypto = require("crypto");
const { Cart } = require("./cart");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: String,
    },
    orderHistory: [],
    shoppingCart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateUserName = function () {
  this.username = this.email.split("@")[0];
};

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  try {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
    return this.hash === hash;
  } catch (err) {
    throw new Error("Invalid Password");
  }
};

userSchema.methods.createCart = function () {
  try {
    const userCart = new Cart({
      items: [],
    });
    userCart.save().then((cart) => {
      this.shoppingCart = cart._id;
    });
  } catch (err) {
    throw new Error("Cart could not be created");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
