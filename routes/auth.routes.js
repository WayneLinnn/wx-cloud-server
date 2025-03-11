"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 微信登录
router.post("/wx-login", authController.wxLogin);

// 获取用户信息（需要登录）
router.get("/user-info", authMiddleware, authController.getUserInfo);

// 更新用户信息（需要登录）
router.post("/update-user", authMiddleware, authController.updateUserInfo);

// 发送验证码
router.post("/send-code", authController.sendVerificationCode);

// 验证码登录
router.post("/verify-code", authController.verifyCodeLogin);

// 退出登录
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
