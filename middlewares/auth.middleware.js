"use strict";

const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");

module.exports = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "未提供认证token",
      });
    }

    // 验证token
    const decoded = jwt.verify(token, config.jwt.secret);

    // 查找用户
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "用户不存在",
      });
    }

    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "账号已被禁用",
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "无效的token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "token已过期",
      });
    }
    next(error);
  }
};
