const { request } = require("../utils/auth");

// API基础URL
const BASE_URL =
  "https://express-t27b-142595-4-1344851180.sh.run.tcloudbase.com/api";

// 微信登录
const wxLogin = async (code, encryptedData, iv) => {
  return request({
    url: `${BASE_URL}/auth/wx-login`,
    method: "POST",
    data: {
      code,
      encryptedData,
      iv,
    },
  });
};

// 获取手机号
const getPhoneNumber = async (code, encryptedData, iv) => {
  return request({
    url: `${BASE_URL}/auth/phone`,
    method: "POST",
    data: {
      code,
      encryptedData,
      iv,
    },
  });
};

// 发送验证码
const sendVerificationCode = async (phone) => {
  return request({
    url: `${BASE_URL}/auth/send-code`,
    method: "POST",
    data: {
      phone,
    },
  });
};

// 验证码登录
const verifyCodeLogin = async (phone, code) => {
  return request({
    url: `${BASE_URL}/auth/verify-code`,
    method: "POST",
    data: {
      phone,
      code,
    },
  });
};

// 退出登录
const logout = async () => {
  return request({
    url: `${BASE_URL}/auth/logout`,
    method: "POST",
  });
};

// 获取用户信息
const getUserInfo = async () => {
  return request({
    url: `${BASE_URL}/user/info`,
    method: "GET",
  });
};

module.exports = {
  wxLogin,
  getPhoneNumber,
  sendVerificationCode,
  verifyCodeLogin,
  logout,
  getUserInfo,
};
