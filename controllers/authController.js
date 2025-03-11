const axios = require("axios");
const { Op } = require("sequelize");
const { User, LoginRecord, VerificationCode } = require("../models");
const { generateRandomCode, isValidPhoneNumber } = require("../utils/helpers");

const WECHAT_API = {
  CODE2SESSION: "https://api.weixin.qq.com/sns/jscode2session",
};

const APP_ID = "wx5b89b5f779f7991a";
const APP_SECRET = "0093fd72356299b864ca022824b5487f";

class AuthController {
  static async loginWithWechat(req, res) {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      // Exchange code for session info
      const response = await axios.get(WECHAT_API.CODE2SESSION, {
        params: {
          appid: APP_ID,
          secret: APP_SECRET,
          js_code: code,
          grant_type: "authorization_code",
        },
      });

      const { openid, unionid, session_key, errcode, errmsg } = response.data;

      if (errcode) {
        return res.status(400).json({ error: errmsg });
      }

      // Find or create user
      let user = await User.findOne({ where: { openId: openid } });

      if (!user) {
        user = await User.create({
          openId: openid,
          unionId: unionid,
          status: 1,
        });
      }

      // Record login
      await LoginRecord.create({
        userId: user.id,
        loginType: "wechat",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      // Update last login time
      await user.update({ lastLoginAt: new Date() });

      return res.json({
        success: true,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error("WeChat login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async loginWithPhone(req, res) {
    try {
      const { phoneNumber, verificationCode } = req.body;

      if (!phoneNumber || !verificationCode) {
        return res
          .status(400)
          .json({ error: "Phone number and verification code are required" });
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      // Verify the code
      const validCode = await VerificationCode.findOne({
        where: {
          phoneNumber,
          code: verificationCode,
          isUsed: false,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
      });

      if (!validCode) {
        return res
          .status(400)
          .json({ error: "Invalid or expired verification code" });
      }

      // Find or create user
      let user = await User.findOne({ where: { phoneNumber } });

      if (!user) {
        user = await User.create({
          phoneNumber,
          status: 1,
        });
      }

      // Mark code as used
      await validCode.update({ isUsed: true });

      // Record login
      await LoginRecord.create({
        userId: user.id,
        loginType: "phone",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      // Update last login time
      await user.update({ lastLoginAt: new Date() });

      return res.json({
        success: true,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Phone login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async sendVerificationCode(req, res) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      // Generate verification code
      const code = generateRandomCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

      // Save verification code
      await VerificationCode.create({
        phoneNumber,
        code,
        purpose: "login",
        expiresAt,
      });

      // TODO: Integrate with SMS service provider
      // For development, just return the code
      return res.json({
        success: true,
        message: "Verification code sent successfully",
        code, // Remove this in production
      });
    } catch (error) {
      console.error("Send verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
