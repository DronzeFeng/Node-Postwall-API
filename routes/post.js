var express = require('express');
var router = express.Router();
const postController = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/user/:id', handleErrorAsync(postController.getUserPosts));

module.exports = router;
