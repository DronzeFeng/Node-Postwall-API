var express = require("express");
var router = express.Router();
const userController = require("../controllers/users");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/isAuth");

router.post("/sign_up", handleErrorAsync(userController.signUp));
router.post("/sign_in", handleErrorAsync(userController.signIn));
router.post(
  "/updatePassword",
  handleErrorAsync(isAuth),
  handleErrorAsync(userController.updatePassword)
);
router.get(
  "/profile",
  handleErrorAsync(isAuth),
  handleErrorAsync(userController.getProfile)
);
router.patch(
  "/profile",
  handleErrorAsync(isAuth),
  handleErrorAsync(userController.patchProfile)
);

module.exports = router;
