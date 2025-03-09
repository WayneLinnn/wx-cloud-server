const authApi = require("../../api/auth");
const { setToken, setUserInfo } = require("../../utils/auth");

Page({
  data: {
    loginType: "wechat", // 'wechat' 或 'phone'
    phone: "",
    verificationCode: "",
    countdown: 0,
    isLoading: false,
  },

  // 切换登录方式
  switchLoginType(e) {
    this.setData({
      loginType: e.currentTarget.dataset.type,
    });
  },

  // 处理手机号输入
  handlePhoneInput(e) {
    this.setData({
      phone: e.detail.value,
    });
  },

  // 处理验证码输入
  handleCodeInput(e) {
    this.setData({
      verificationCode: e.detail.value,
    });
  },

  // 发送验证码
  async sendVerificationCode() {
    if (this.data.countdown > 0) return;

    const phone = this.data.phone.trim();
    if (!phone || !/^1\d{10}$/.test(phone)) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({ isLoading: true });
      await authApi.sendVerificationCode(phone);

      // 开始倒计时
      this.setData({ countdown: 60 });
      const timer = setInterval(() => {
        if (this.data.countdown <= 1) {
          clearInterval(timer);
        }
        this.setData({
          countdown: this.data.countdown - 1,
        });
      }, 1000);

      wx.showToast({
        title: "验证码已发送",
        icon: "success",
      });
    } catch (error) {
      wx.showToast({
        title: error.message || "发送失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 微信登录
  async handleWechatLogin() {
    try {
      this.setData({ isLoading: true });

      // 获取微信登录凭证
      const { code } = await wx.login();

      // 获取用户信息
      const { encryptedData, iv } = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: "用于完善用户资料",
          success: resolve,
          fail: reject,
        });
      });

      // 调用登录接口
      const { data } = await authApi.wxLogin(code, encryptedData, iv);

      // 保存登录状态
      setToken(data.token);
      setUserInfo(data.userInfo);

      // 返回上一页或首页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: "/pages/index/index",
        });
      }
    } catch (error) {
      wx.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 手机号登录
  async handlePhoneLogin() {
    const { phone, verificationCode } = this.data;

    if (!phone || !/^1\d{10}$/.test(phone)) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return;
    }

    if (!verificationCode) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({ isLoading: true });

      // 调用验证码登录接口
      const { data } = await authApi.verifyCodeLogin(phone, verificationCode);

      // 保存登录状态
      setToken(data.token);
      setUserInfo(data.userInfo);

      // 返回上一页或首页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: "/pages/index/index",
        });
      }
    } catch (error) {
      wx.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 获取微信绑定的手机号
  async getPhoneNumber(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      return;
    }

    try {
      this.setData({ isLoading: true });

      const { code } = await wx.login();
      const { encryptedData, iv } = e.detail;

      // 调用获取手机号接口
      const { data } = await authApi.getPhoneNumber(code, encryptedData, iv);

      this.setData({
        phone: data.phone,
        loginType: "phone",
      });
    } catch (error) {
      wx.showToast({
        title: error.message || "获取手机号失败",
        icon: "none",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },
});
