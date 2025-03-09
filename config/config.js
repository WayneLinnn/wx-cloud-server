module.exports = {
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "7d", // token有效期7天
  },

  // 微信小程序配置
  wx: {
    appId: process.env.WX_APP_ID,
    appSecret: process.env.WX_APP_SECRET,
  },

  // 短信服务配置
  sms: {
    // TODO: 添加短信服务配置
  },
};
