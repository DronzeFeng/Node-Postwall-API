var express = require("express");
var router = express.Router();
const uploadController = require("../controllers/upload");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/isAuth");
const uploadImage = require("../services/uploadImage");

router.post(
  "/",
  handleErrorAsync(isAuth),
  uploadImage,
  handleErrorAsync(uploadController.uploadImage)
);

module.exports = router;
