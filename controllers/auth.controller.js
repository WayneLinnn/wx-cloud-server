const jwt = require("jsonwebtoken");
const axios = require("axios");
const moment = require("moment");
const config = require("../config/config");
const { User, LoginRecord, VerificationCode } = require("../models");

class AuthController {
  // 微信登录
  async wxLogin(req, res) {
    try {
      const { code, encryptedData, iv } = req.body;

      // 获取微信openid和session_key
      const wxResponse = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid: config.wxapp.appId,
            secret: config.wxapp.appSecret,
            js_code: code,
            grant_type: "authorization_code",
          },
        }
      );

      const { openid, session_key } = wxResponse.data;

      // 查找或创建用户
      let [user, created] = await User.findOrCreate({
        where: { openid },
        defaults: {
          status: 1,
        },
      });

      // 创建登录记录
      await LoginRecord.create({
        user_id: user.id,
        login_type: "wechat",
        ip_address: req.ip,
      });

      // 更新最后登录时间
      await user.update({ last_login: new Date() });

      // 生成token
      const token = jwt.sign(
        { id: user.id, openid: user.openid },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            openid: user.openid,
            phone: user.phone,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
          },
        },
      });
    } catch (error) {
      console.error("微信登录失败:", error);
      res.status(500).json({
        success: false,
        message: "登录失败",
        error: error.message,
      });
    }
  }

  // 发送验证码
  async sendVerificationCode(req, res) {
    try {
      const { phone } = req.body;

      // 生成验证码
      const code = Math.random().toString().slice(-6);
      const expires_at = moment()
        .add(config.verificationCode.expiresIn, "seconds")
        .toDate();

      // 保存验证码
      await VerificationCode.create({
        phone,
        code,
        expires_at,
      });

      // TODO: 调用短信服务发送验证码
      console.log(`验证码已发送到 ${phone}: ${code}`);

      res.json({
        success: true,
        message: "验证码已发送",
      });
    } catch (error) {
      console.error("发送验证码失败:", error);
      res.status(500).json({
        success: false,
        message: "发送验证码失败",
        error: error.message,
      });
    }
  }

  // 验证码登录
  async verifyCodeLogin(req, res) {
    try {
      const { phone, code } = req.body;

      // 验证验证码
      const verificationCode = await VerificationCode.findOne({
        where: {
          phone,
          code,
          used: false,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },
      });

      if (!verificationCode) {
        return res.status(400).json({
          success: false,
          message: "验证码无效或已过期",
        });
      }

      // 标记验证码为已使用
      await verificationCode.update({ used: true });

      // 查找或创建用户
      let [user, created] = await User.findOrCreate({
        where: { phone },
        defaults: {
          status: 1,
        },
      });

      // 创建登录记录
      await LoginRecord.create({
        user_id: user.id,
        login_type: "phone",
        ip_address: req.ip,
      });

      // 更新最后登录时间
      await user.update({ last_login: new Date() });

      // 生成token
      const token = jwt.sign(
        { id: user.id, phone: user.phone },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            openid: user.openid,
            phone: user.phone,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
          },
        },
      });
    } catch (error) {
      console.error("验证码登录失败:", error);
      res.status(500).json({
        success: false,
        message: "登录失败",
        error: error.message,
      });
    }
  }

  // 获取用户信息
  async getUserInfo(req, res) {
    try {
      const userId = req.user.id; // 从JWT中获取
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "用户不存在",
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          openid: user.openid,
          phone: user.phone,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
        },
      });
    } catch (error) {
      console.error("获取用户信息失败:", error);
      res.status(500).json({
        success: false,
        message: "获取用户信息失败",
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
