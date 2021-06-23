const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const createError = require("http-errors");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

require("dotenv").config();

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
});

const app = express();

const s3 = new aws.S3();

const uploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically find Content-Type, else application/octet-stream will be assigned
    key: (req, file, cb) => {
      // Key for s3 object
      cb(null, file.originalname);
    },
  }),
});

app.set("views", path.join(__dirname, "views"));
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  const objects = await s3
    .listObjectsV2({ Bucket: process.env.S3_BUCKET })
    .promise();
  const files = objects.Contents.map((file) => file.Key);
  res.render("index", { s3_bucket: process.env.S3_BUCKET, files });
});

// Multer will parse the multipart-formdata from the request
// Save it to the specified storage
// Populate the file to req.file if we are using single file upload, else to req.files
app.post("/upload", uploader.single("file"), (req, res) => {
  if (req.file) {
    res.json({ name: req.file.key, uri: req.file.location });
  } else {
    res.json({ message: "Could not upload file" }), 400;
  }
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.json({ error: err }), statusCode;
});

module.exports = app;
