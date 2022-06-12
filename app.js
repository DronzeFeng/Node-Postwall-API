var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');

var app = express();
require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);

// 錯誤處理：正式環境
const errorOnProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);

    // 送出罐頭預設訊息
    res.status(500).send({
      status: 'error',
      message: '系統錯誤，請洽系統管理員',
    });
  }
};

// 錯誤處理：開發環境
const errorOnDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// 404 Error
app.use(function (req, res, next) {
  res.status(404).send({
    status: 'error',
    message: '查無此路由',
  });
});

// Express Error
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  // 錯誤捕捉：開發環境
  if (process.env.NODE_ENV === 'dev') {
    return errorOnDev(err, res);
  }

  // 錯誤捕捉：正式環境
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    return errorOnProd(err, res);
  }

  errorOnProd(err, res);
});

// Uncaught Exception
// 未捕捉到的 Catch：程式碼發生了錯誤(紅字)
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err);
  process.exit(1);
});

// Unhandled Rejection
// 未捕捉到的 Catch：其他套件或 Promise 發生了未預期的錯誤
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
});

module.exports = app;
