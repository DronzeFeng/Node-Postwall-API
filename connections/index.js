const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const dbPath = process.env.DB_PATH.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(dbPath)
  .then(() => {
    console.log("伺服器連線成功");
  })
  .catch((error) => {
    console.log(error);
  });
