Page({
  data: {
    authType: "login", // login 或 register
    phone: "",
    code: "",
    name: "",
    age: "",
    agreed: false,
    codeSent: false,
    countdown: 60,
  },

  // 切换登录/注册标签
  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      authType: type,
      phone: "",
      code: "",
      name: "",
      age: "",
      codeSent: false,
    });
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value,
    });
  },

  // 输入验证码
  onCodeInput(e) {
    this.setData({
      code: e.detail.value,
    });
  },

  // 输入姓名
  onNameInput(e) {
    this.setData({
      name: e.detail.value,
    });
  },

  // 输入年龄
  onAgeInput(e) {
    this.setData({
      age: e.detail.value,
    });
  },

  // 同意用户协议
  onAgreementChange(e) {
    this.setData({
      agreed: e.detail.value.length > 0,
    });
  },

  // 显示用户协议
  showAgreement() {
    wx.navigateTo({
      url: "/pages/agreement/agreement",
    });
  },

  // 发送验证码
  async sendCode() {
    if (!this.validatePhone()) return;

    try {
      wx.showLoading({
        title: "发送中...",
      });

      // TODO: 调用发送验证码API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      wx.hideLoading();
      wx.showToast({
        title: "发送成功",
        icon: "success",
      });

      this.setData({
        codeSent: true,
      });

      this.startCountdown();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: "发送失败",
        icon: "error",
      });
    }
  },

  // 开始倒计时
  startCountdown() {
    let countdown = 60;
    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          codeSent: false,
          countdown: 60,
        });
      } else {
        this.setData({
          countdown,
        });
      }
    }, 1000);
  },

  // 验证手机号
  validatePhone() {
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return false;
    }
    return true;
  },

  // 验证验证码
  validateCode() {
    if (this.data.code.length !== 6) {
      wx.showToast({
        title: "请输入6位验证码",
        icon: "none",
      });
      return false;
    }
    return true;
  },

  // 验证注册信息
  validateRegister() {
    if (!this.data.name) {
      wx.showToast({
        title: "请输入姓名",
        icon: "none",
      });
      return false;
    }
    if (!this.data.age) {
      wx.showToast({
        title: "请输入年龄",
        icon: "none",
      });
      return false;
    }
    return true;
  },

  // 验证用户协议
  validateAgreement() {
    if (!this.data.agreed) {
      wx.showToast({
        title: "请同意用户协议",
        icon: "none",
      });
      return false;
    }
    return true;
  },

  // 登录
  async login() {
    if (
      !this.validatePhone() ||
      !this.validateCode() ||
      !this.validateAgreement()
    )
      return;

    try {
      wx.showLoading({
        title: "登录中...",
      });

      // TODO: 调用登录API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模拟登录成功数据
      const userInfo = {
        id: 1,
        nickName: "测试用户",
        avatarUrl: "",
        phone: this.data.phone,
      };

      // 保存用户信息
      wx.setStorageSync("userInfo", userInfo);

      wx.hideLoading();
      wx.showToast({
        title: "登录成功",
        icon: "success",
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: "登录失败",
        icon: "error",
      });
    }
  },

  // 注册
  async register() {
    if (
      !this.validatePhone() ||
      !this.validateCode() ||
      !this.validateRegister() ||
      !this.validateAgreement()
    )
      return;

    try {
      wx.showLoading({
        title: "注册中...",
      });

      // TODO: 调用注册API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模拟注册成功数据
      const userInfo = {
        id: 1,
        nickName: this.data.name,
        avatarUrl: "",
        phone: this.data.phone,
      };

      // 保存用户信息
      wx.setStorageSync("userInfo", userInfo);

      wx.hideLoading();
      wx.showToast({
        title: "注册成功",
        icon: "success",
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: "注册失败",
        icon: "error",
      });
    }
  },

  // 微信登录
  async onGetUserInfo(e) {
    if (!this.validateAgreement()) return;

    if (e.detail.userInfo) {
      try {
        wx.showLoading({
          title: "登录中...",
        });

        // TODO: 调用微信登录API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 保存用户信息
        wx.setStorageSync("userInfo", {
          ...e.detail.userInfo,
          id: 1,
        });

        wx.hideLoading();
        wx.showToast({
          title: "登录成功",
          icon: "success",
        });

        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } catch (error) {
        wx.hideLoading();
        wx.showToast({
          title: "登录失败",
          icon: "error",
        });
      }
    }
  },
});
