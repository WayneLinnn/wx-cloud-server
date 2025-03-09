"use strict";

const jwt = require("jsonwebtoken");
const axios = require("axios");
const moment = require("moment");
const { Op } = require("sequelize");
const { User, LoginRecord, VerificationCode } = require("../models");
const config = require("../config/config");

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
            appid: config.wx.appId,
            secret: config.wx.appSecret,
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

      // 解密手机号（如果有）
      if (encryptedData && iv) {
        // TODO: 实现微信手机号解密逻辑
        // const phoneInfo = decryptWxData(encryptedData, session_key, iv);
        // user.phone = phoneInfo.phoneNumber;
        // await user.save();
      }

      // 更新登录时间
      user.last_login = new Date();
      await user.save();

      // 记录登录
      await LoginRecord.create({
        user_id: user.id,
        login_type: "wechat",
        ip_address: req.ip,
      });

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
            status: user.status,
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

      // 生成6位随机验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // 设置过期时间（5分钟）
      const expires_at = moment().add(5, "minutes").toDate();

      // 保存验证码
      await VerificationCode.create({
        phone,
        code,
        expires_at,
      });

      // TODO: 调用短信服务发送验证码
      // await sendSMS(phone, code);

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
      verificationCode.used = true;
      await verificationCode.save();

      // 查找或创建用户
      let [user, created] = await User.findOrCreate({
        where: { phone },
        defaults: {
          status: 1,
        },
      });

      // 更新登录时间
      user.last_login = new Date();
      await user.save();

      // 记录登录
      await LoginRecord.create({
        user_id: user.id,
        login_type: "phone",
        ip_address: req.ip,
      });

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
            status: user.status,
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

  // 退出登录
  async logout(req, res) {
    try {
      // 由于使用JWT，服务器端无需特殊处理
      // 客户端只需要删除本地存储的token即可
      res.json({
        success: true,
        message: "退出成功",
      });
    } catch (error) {
      console.error("退出登录失败:", error);
      res.status(500).json({
        success: false,
        message: "退出失败",
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
