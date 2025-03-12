const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 微信登录
router.post("/wechat-login", authController.wechatLogin);

// 发送验证码
router.post("/send-code", authController.sendVerificationCode);

// 手机验证码登录
router.post("/phone-login", authController.phoneLogin);

module.exports = router;
