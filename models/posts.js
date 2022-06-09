const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content 未填寫"],
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference by users.js in models
    required: [true, "貼文者 ID 未填寫"],
  },
  likes: {
    type: Number,
    default: 0,
  },
});
// 當寫入mongodb時，會強制轉小寫，字尾強制加上 s
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
