const mongoose = require("mongoose");
const { Cart } = require("./cart");
const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: String,
    },
    orderHistory: [],
    shoppingCart: Cart,
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


/* // Hash the Password before saving it.
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }

  //Compare the given password with the hashed password in the database
  userSchema.methods.comparePassword = async (password) => {
    return bcrypt.compare(password, this.password);
  };
}); */

const User = mongoose.model("User", userSchema);

module.exports = User;
