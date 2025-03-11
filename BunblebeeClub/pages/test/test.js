const authApi = require("../../api/auth");

Page({
  data: {
    isLoading: false,
  },

  // 测试微信登录
  async testWxLogin(e) {
    try {
      this.setData({ isLoading: true });

      // 获取用户信息
      const userProfile = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: "用于测试登录功能",
          success: resolve,
          fail: reject,
        });
      });

      // 获取微信登录凭证
      const { code } = await wx.login();

      // 调用登录接口
      const res = await authApi.wxLogin(
        code,
        userProfile.encryptedData,
        userProfile.iv
      );
      console.log("登录结果：", res);

      if (res.data.success) {
        wx.showToast({
          title: "登录成功",
          icon: "success",
        });
      } else {
        throw new Error(res.data.message || "登录失败");
      }
    } catch (error) {
      console.error("登录失败：", error);
      wx.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 测试发送验证码
  async testSendCode() {
    try {
      this.setData({ isLoading: true });

      const phone = "13800138000"; // 测试手机号
      const res = await authApi.sendVerificationCode(phone);
      console.log("发送验证码结果：", res);

      wx.showToast({
        title: res.data.success ? "发送成功" : "发送失败",
        icon: res.data.success ? "success" : "none",
      });
    } catch (error) {
      console.error("发送验证码失败：", error);
      wx.showToast({
        title: error.message || "发送失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 测试获取手机号
  async testGetPhoneNumber(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      return;
    }

    try {
      this.setData({ isLoading: true });

      const { code } = await wx.login();
      const { encryptedData, iv } = e.detail;

      const res = await authApi.getPhoneNumber(code, encryptedData, iv);
      console.log("获取手机号结果：", res);

      wx.showToast({
        title: res.data.success ? "获取成功" : "获取失败",
        icon: res.data.success ? "success" : "none",
      });
    } catch (error) {
      console.error("获取手机号失败：", error);
      wx.showToast({
        title: error.message || "获取失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },
});
