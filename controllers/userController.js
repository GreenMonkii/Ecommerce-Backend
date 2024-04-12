const User = require("../models/user");

const loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "All fields are required." });
  }
  
  User.findOne({ email: req.body.email })
  .then((user) => {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        req.session.userId = user._id.toString();
        return res.status(201).send({
          message: "User Logged In",
        });
      } else {
        return res.status(400).send({
          message: "Invalid Password",
        });
      }
    }
  });
};

const createUser = (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({ message: "All fields are required." });
  }

  let newUser = new User();
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.setPassword(req.body.password);

  newUser
    .save()
    .then((result) => {
      req.session.userId = result._id;
      res.statusCode = 201;
      res.json({ message: "User Created Successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .send({ message: "An error occured while creating a User!" });
    });
};

const changePassword = (req, res, next) => {
  let user = User.findById(req.session.userId);
  user.setPassword(req.body.newPassword);
};

const addOrderHistory = (req, res, next) => {
  let user = User.findById(req.session.userId);
  user.orderHistory.push(req.body);
};

module.exports = {
  loginUser,
  createUser,
  changePassword,
  addOrderHistory,
};
