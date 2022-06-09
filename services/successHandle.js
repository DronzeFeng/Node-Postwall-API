function successHandle(httpStatus, res, data) {
  // res.json() || res.send()
  // res.send()
  // 傳入型別來決定回傳格式
  // String => HTML:<h1>Hi</h1>
  // Araay || Object => JSON
  // 會自動附加 res.end()

  res.status(httpStatus).send({
    status: true,
    data: data,
  });
  res.end();
}

module.exports = successHandle;
