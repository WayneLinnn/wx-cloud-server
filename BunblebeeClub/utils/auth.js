// Token 管理
const TOKEN_KEY = "user_token";
const USER_INFO_KEY = "user_info";

// 保存token
const setToken = (token) => {
  wx.setStorageSync(TOKEN_KEY, token);
};

// 获取token
const getToken = () => {
  return wx.getStorageSync(TOKEN_KEY);
};

// 删除token
const removeToken = () => {
  wx.removeStorageSync(TOKEN_KEY);
};

// 保存用户信息
const setUserInfo = (userInfo) => {
  wx.setStorageSync(USER_INFO_KEY, userInfo);
};

// 获取用户信息
const getUserInfo = () => {
  return wx.getStorageSync(USER_INFO_KEY);
};

// 删除用户信息
const removeUserInfo = () => {
  wx.removeStorageSync(USER_INFO_KEY);
};

// 检查是否登录
const checkLogin = () => {
  const token = getToken();
  return !!token;
};

// 登出
const logout = () => {
  removeToken();
  removeUserInfo();
};

// 请求拦截器
const request = (options) => {
  const token = getToken();
  const header = {
    ...options.header,
  };

  if (token) {
    header["Authorization"] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      header,
      success: (res) => {
        if (res.statusCode === 401) {
          // token过期，清除登录状态
          logout();
          wx.navigateTo({
            url: "/pages/auth/auth",
          });
          reject(new Error("未登录或登录已过期"));
        } else {
          resolve(res);
        }
      },
      fail: reject,
    });
  });
};

module.exports = {
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  checkLogin,
  logout,
  request,
};
