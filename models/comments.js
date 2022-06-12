const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'comment can not be empty!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: ['true', 'user must belong to a post.'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    require: ['true', 'comment must belong to a post.'],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name id createdAt',
  });

  next();
});

// 當寫入mongodb時，會強制轉小寫，字尾強制加上 s
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
