var express = require("express");
var router = express.Router();
const postController = require("../controllers/posts");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/isAuth");

router.get(
  "/",
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.getPosts)
);
router.post(
  "/",
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.createPost)
);
router.delete(
  "/",
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.deleteAllPosts)
);
router.delete(
  "/:id",
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.deleteOnePost)
);
router.patch(
  "/:id",
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.patchOnePost)
);

module.exports = router;
