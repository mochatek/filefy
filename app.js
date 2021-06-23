const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const createError = require("http-errors");

const app = express();

app.set("views", path.join(__dirname, "views"));
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.json({ error: err }), statusCode;
});

module.exports = app;
