const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// WeChat login
router.post("/wechat/login", AuthController.loginWithWechat);

// Phone number login
router.post("/phone/login", AuthController.loginWithPhone);

// Send verification code
router.post("/phone/send-code", AuthController.sendVerificationCode);

module.exports = router;
