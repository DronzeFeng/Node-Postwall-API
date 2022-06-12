const errorHandle = require('../services/errorHandle');
const successHandle = require('../services/successHandle');
const postModel = require('../models/posts');
const userModel = require('../models/users');
const commentModel = require('../models/comments');
const posts = {
  async getPosts(req, res, next) {
    // ASC  遞增(由小到大，由舊到新) createdAt ;
    // DESC 遞減(由大到小、由新到舊) -createdAt
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await postModel
      .find(q)
      .populate({
        path: 'user', // 參考 model 的 user schema 的欄位
        select: 'name photo',
      })
      .populate({
        path: 'comment',
        select: 'comment user',
      })
      .sort(timeSort);

    successHandle(200, res, post);
  },
  async getOnePost(req, res, next) {
    const post = await postModel
      .findById(req.params.id)
      .populate({
        path: 'user', // Path of collection:users
        select: 'name photo',
      })
      .populate({
        path: 'comment',
        select: 'comment user',
      });

    successHandle(200, res, post);
  },
  async createPost(req, res, next) {
    const { content } = req.body;
    if (!content) {
      return next(errorHandle(400, '你沒有填寫 content 資料', next));
    }
    const newPost = await postModel.create({
      user: req.user.id,
      content,
    });

    successHandle(200, res, newPost);
  },
  async likePost(req, res, next) {
    const _id = req.params.id;
    await postModel.findOneAndUpdate(
      { _id },
      { $addToSet: { likes: req.user.id } }
    );
    const data = {
      postId: _id,
      userId: req.user.id,
    };

    successHandle(201, res, data);
  },
  async dislikePost(req, res, next) {
    const _id = req.params.id;
    await postModel.findOneAndUpdate(
      { _id },
      { $pull: { likes: req.user.id } }
    );
    const data = {
      postId: _id,
      userId: req.user.id,
    };

    successHandle(201, res, data);
  },
  async commentPost(req, res, next) {
    const user = req.user.id;
    const post = req.params.id;
    const { comment } = req.body;
    const newComment = await commentModel.create({
      post,
      user,
      comment,
    });
    const data = {
      comments: newComment,
    };

    successHandle(201, res, data);
  },
  async getUserPosts(req, res, next) {
    const user = req.params.id;
    const posts = await postModel.find({ user }).populate({
      path: 'comment',
      select: 'comment user',
    });
    const data = {
      results: posts.length,
      posts: posts,
    };

    successHandle(201, res, data);
  },
};

module.exports = posts;
