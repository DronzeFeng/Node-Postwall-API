const jwt = require("jsonwebtoken");
const errorHandle = require("../services/errorHandle");
const successHandle = require("../services/successHandle");
const userModel = require("../models/users");
const isAuth = async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(errorHandle(401, "您尚未登入！", next));
  }

  // 驗證 token
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await userModel.findById(decoded.id);

  req.user = currentUser;
  next();
};
const generateJWT = (statusCode, res, user) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  user.password = undefined;
  const data = {
    token,
    name: user.name,
  };

  successHandle(statusCode, res, data);
};

module.exports = {
  isAuth,
  generateJWT,
};
