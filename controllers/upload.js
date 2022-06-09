const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");
const errorHandle = require("../services/errorHandle");
const successHandle = require("../services/successHandle");
const uploads = {
  async uploadImage(req, res, next) {
    if (!req.files.length) {
      return next(errorHandle(400, "請選擇要上傳的檔案", next));
    }

    const dimensions = sizeOf(req.files[0].buffer);
    if (dimensions.width !== dimensions.height) {
      return next(errorHandle(400, "圖片長寬不符合 1:1 尺寸。", next));
    }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    const imgUrl = response.data.link;

    successHandle(200, res, imgUrl);
  },
};

module.exports = uploads;
