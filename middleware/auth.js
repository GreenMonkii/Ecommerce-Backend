const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(400).send({ message: "User is not authenticated." });
  }
};

module.exports = requireAuth;