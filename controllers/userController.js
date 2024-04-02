const User = require("../models/user");

const loginUser = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        req.session.userId = user._id;
        return res.status(201).send({
          message: "User Logged In",
        });
      } else {
        return res.status(400).send({
          message: "Wrong Password",
        });
      }
    }
  });
};

const createUser = (req, res, next) => {
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
      return res
        .status(400)
        .send({ message: "An error occured while creating a User!" });
    });
};

const addOrderHistory = (req, res, next) => {
  let user = User.findById(req.session.userId);
  user.orderHistory.push(req.body);
};

module.exports = {
  loginUser,
  createUser,
  addOrderHistory
}