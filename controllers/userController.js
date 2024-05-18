const User = require("../models/user");
const jwt = require("jsonwebtoken");

const loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "All fields are required." });
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        req.user = user._id;
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        return res.status(201).send({ token: token });
      } else {
        return res.status(400).send({
          message: "Invalid Password",
        });
      }
    }
  });
};

const createUser = (req, res, _next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "All fields are required." });
  }

  // Check if user already exists
  User.findOne({ email: req.body.email }).then((user) => {
    if (user !== null) {
      return res.status(400).send({
        message: "User already exists.",
      });
    } else {
      // Create a new user
      let newUser = new User();
      newUser.email = req.body.email;
      newUser.setPassword(req.body.password);
      newUser.generateUserName();
      newUser.createCart();

      newUser
        .save()
        .then((result) => {
          req.user = result._id;
          const token = jwt.sign({ id: result._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          res.statusCode = 201;
          return res.send({ token: token });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .send({ message: "An error occured while creating a User!" });
        });
    }
  });
};

const changePassword = (req, _res, _next) => {
  User.findById(req.user).then((user) => {
    user.setPassword(req.body.newPassword);
  });
};

const validateToken = (_req, res, _next) => {
  res.status(200).send({ message: "Token is valid" });
};

const getUserInfo = (req, res, _next) => {
  try {
    User.findById(req.user).then((user) => {
      const { salt, hash, ...rest } = user._doc;
      res.status(200).send(rest);
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "An error occured while fetching user info!" });
  }
};

const addOrderHistory = (req, _res, _next) => {
  let user = User.findById(req.user);
  user.orderHistory.push(req.body);
};

const getOrderHistory = (req, res, _next) => {
  let user = User.findById(req.user);
  return res.send(user.orderHistory);
};

module.exports = {
  loginUser,
  createUser,
  changePassword,
  addOrderHistory,
  getUserInfo,
  getOrderHistory,
  validateToken,
};
