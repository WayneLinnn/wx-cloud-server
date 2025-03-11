const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 微信登录
router.post("/wx-login", authController.wxLogin);

// 发送验证码
router.post("/send-code", authController.sendVerificationCode);

// 验证码登录
router.post("/verify-code", authController.verifyCodeLogin);

// 获取用户信息（需要认证）
router.get("/user/info", authMiddleware, authController.getUserInfo);

module.exports = router;
