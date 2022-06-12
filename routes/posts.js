var express = require('express');
var router = express.Router();
const postController = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth } = require('../services/isAuth');

router.get('/', handleErrorAsync(postController.getPosts));
router.get('/:id', handleErrorAsync(postController.getOnePost));
router.post(
  '/',
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.createPost)
);
router.post(
  '/:id/like',
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.likePost)
);
router.delete(
  '/:id/unlike',
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.dislikePost)
);
router.post(
  '/:id/comment',
  handleErrorAsync(isAuth),
  handleErrorAsync(postController.commentPost)
);

module.exports = router;
