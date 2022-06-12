const validator = require('validator');
const bcrypt = require('bcryptjs');
const errorHandle = require('../services/errorHandle');
const successHandle = require('../services/successHandle');
const { generateJWT } = require('../services/isAuth');
const userModel = require('../models/users');
const postModel = require('../models/posts');
const users = {
  async signUp(req, res, next) {
    let { email, password, confirmPassword, name } = req.body;
    const checkEmail = await userModel.find({ email: email }).exec();

    // 欄位內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(errorHandle('400', '欄位未填寫正確！', next));
    }
    // 確認密碼
    if (password !== confirmPassword) {
      return next(errorHandle('400', '密碼不一致！', next));
    }
    // 密碼長度須為 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(errorHandle('400', '密碼字數低於 8 碼', next));
    }
    // 確認Email格式
    if (!validator.isEmail(email)) {
      return next(errorHandle('400', 'Email 格式不正確', next));
    }
    if (checkEmail[0]) {
      return next(
        errorHandle('400', 'Email 已被註冊，請使用其他 Email註冊', next)
      );
    }

    // 將密碼加密
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await userModel.create({
      email,
      password,
      name,
    });

    generateJWT(201, res, newUser);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandle(400, '帳號密碼不可為空', next));
    }
    const user = await userModel.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(errorHandle(400, '您的密碼不正確', next));
    }

    generateJWT(200, res, user);
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(errorHandle('400', '密碼不一致！', next));
    }
    newPassword = await bcrypt.hash(password, 12);

    const user = await userModel.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });

    generateJWT(200, res, user);
  },
  async getProfile(req, res, next) {
    const data = {
      user: req.user,
    };

    successHandle(200, res, data);
  },
  async patchProfile(req, res, next) {
    let { email, name } = req.body;

    // 欄位內容不可為空
    if (!email || !name) {
      return next(errorHandle('400', '欄位未填寫正確！', next));
    }
    // 確認Email格式
    if (!validator.isEmail(email)) {
      return next(errorHandle('400', 'Email 格式不正確', next));
    }

    const user = await userModel.findByIdAndUpdate(req.user.id, {
      email: email,
      name: name,
    });

    generateJWT(201, res, user);
  },
  async getLikeList(req, res, next) {
    const likeList = await postModel
      .find({
        likes: { $in: [req.user.id] },
      })
      .populate({
        path: 'user',
        select: 'name _id',
      });

    successHandle(200, res, likeList);
  },
  async getFollowing(req, res, next) {
    const data = {
      following: req.user.following,
    };

    successHandle(200, res, data);
  },
  async addFollow(req, res, next) {
    if (req.params.id === req.user.id) {
      return next(errorHandle(401, '您無法追蹤自己', next));
    }
    await userModel.updateOne(
      {
        _id: req.user.id,
        'following.user': { $ne: req.params.id },
      },
      {
        $addToSet: { following: { user: req.params.id } },
      }
    );
    await userModel.updateOne(
      {
        _id: req.params.id,
        'followers.user': { $ne: req.user.id },
      },
      {
        $addToSet: { followers: { user: req.user.id } },
      }
    );

    successHandle(200, res, '您已成功追蹤！');
  },
  async delFollow(req, res, next) {
    if (req.params.id === req.user.id) {
      return next(errorHandle(401, '您無法取消追蹤自己', next));
    }
    await userModel.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: { following: { user: req.params.id } },
      }
    );
    await userModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        $pull: { followers: { user: req.user.id } },
      }
    );

    successHandle(200, res, '您已成功取消追蹤！');
  },
};

module.exports = users;
