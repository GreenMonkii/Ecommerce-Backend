const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const requireAuth = require("./middleware/auth");

require("dotenv").config();
const app = express();
const PORT = process.env.NODE_ENV === "test" ? 3001 : process.env.PORT || 8080;

// Connecting to the MongoDB database
const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_DB_URI
    : process.env.DEV_DB_URI;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

mongoose
  .connect(dbURI)
  .then((_res) => {
    // Listen for Requests
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    console.log("Connected to Database");
  })
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com/"],
      styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com/"],
      imgSrc: ["'self'", "https://via.placeholder.com/"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://stackpath.bootstrapcdn.com/"],
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/", indexRouter, requireAuth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
