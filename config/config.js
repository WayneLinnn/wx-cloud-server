module.exports = {
  // 微信小程序配置
  wxapp: {
    appId: "wx5b89b5f779f7991a",
    appSecret: "0093fd72356299b864ca022824b5487f",
  },

  // JWT配置
  jwt: {
    secret: "your-jwt-secret-key",
    expiresIn: "7d", // token有效期7天
  },

  // 验证码配置
  verificationCode: {
    length: 6,
    expiresIn: 5 * 60, // 验证码有效期5分钟
    cooldown: 60, // 发送冷却时间1分钟
  },
};
