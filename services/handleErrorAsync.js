const handleErrorAsync = function handleErrorAsync(fn) {
  // Middlware 接收 router 資料
  // 將傳入的 async function 帶入 fn 變數中儲存
  // i.e. const fn = async function (req, res, next) {}
  // 將 fn 增加 catch 的函式後回傳
  // 回傳後，再次執行函式，async 可再用 catch 統一捕捉
  return function (req, res, next) {
    fn(req, res, next).catch(function (error) {
      return next(error);
    });
  };
};

module.exports = handleErrorAsync;
