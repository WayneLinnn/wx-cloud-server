Page({
  data: {
    currentCategory: "all",
    showBuyModal: false,
    selectedCourse: null,
    courses: [
      {
        id: 1,
        name: "U12基础足球课程",
        description:
          "适合8-12岁青少年的基础足球技能训练课程，包含传球、控球、射门等基本技能训练。",
        price: 2999,
        duration: 24,
        category: "u12",
      },
      {
        id: 2,
        name: "U15进阶足球课程",
        description:
          "适合13-15岁青少年的进阶足球训练课程，包含战术训练、比赛实战等高级内容。",
        price: 3999,
        duration: 36,
        category: "u15",
      },
      {
        id: 3,
        name: "U12暑期特训营",
        description:
          "暑期密集训练营，帮助8-12岁青少年在短期内快速提升足球技能。",
        price: 4999,
        duration: 48,
        category: "u12",
      },
    ],
  },

  onLoad() {
    this.getCourseData();
  },

  getCourseData() {
    // TODO: 从服务器获取课程数据
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
    });
    // TODO: 根据分类筛选课程
  },

  onCourseTap(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/course/detail?id=${courseId}`,
    });
  },

  onBuyTap(e) {
    const courseId = e.currentTarget.dataset.id;
    const course = this.data.courses.find((c) => c.id === courseId);

    // 检查用户是否登录
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/auth/auth",
      });
      return;
    }

    this.setData({
      showBuyModal: true,
      selectedCourse: course,
    });
  },

  closeBuyModal() {
    this.setData({
      showBuyModal: false,
      selectedCourse: null,
    });
  },

  async confirmBuy() {
    if (!this.data.selectedCourse) return;

    try {
      // TODO: 调用购买课程API
      wx.showLoading({
        title: "购买中...",
      });

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      wx.hideLoading();
      wx.showToast({
        title: "购买成功",
        icon: "success",
      });

      this.closeBuyModal();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: "购买失败",
        icon: "error",
      });
    }
  },
});
