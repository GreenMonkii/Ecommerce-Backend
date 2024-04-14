const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired" });
    }
    return res.status(400).send({ message: "Invalid token" });
  }
};

module.exports = requireAuth;
