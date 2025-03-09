Page({
  data: {
    dateList: [],
    currentDate: "",
    selectedField: null,
    timeSlots: [],
    selectedTimeSlots: [],
    totalPrice: 0,
    showConfirmModal: false,
    userInfo: null,
    currentCategory: "all",
    unlockedCount: 0,
    totalExp: 0,
    achievements: [
      {
        id: 1,
        icon: "⚽",
        name: "初出茅庐",
        description: "完成第一节课程",
        currentValue: 0,
        targetValue: 1,
        unlocked: false,
        expReward: 100,
      },
      {
        id: 2,
        icon: "🏃",
        name: "勤学苦练",
        description: "累计完成10节课程",
        currentValue: 0,
        targetValue: 10,
        unlocked: false,
        expReward: 500,
      },
      {
        id: 3,
        icon: "🌟",
        name: "足球达人",
        description: "累计完成50节课程",
        currentValue: 0,
        targetValue: 50,
        unlocked: false,
        expReward: 2000,
      },
      {
        id: 4,
        icon: "🏆",
        name: "场地常客",
        description: "累计预订场地10次",
        currentValue: 0,
        targetValue: 10,
        unlocked: false,
        expReward: 500,
      },
      {
        id: 5,
        icon: "📈",
        name: "技能成长",
        description: "达到10级",
        currentValue: 1,
        targetValue: 10,
        unlocked: false,
        expReward: 1000,
      },
    ],
    filteredAchievements: [],
  },

  onLoad() {
    this.initDateList();
    this.setData({
      selectedField: 1,
    });
    this.getTimeSlots();
    this.checkLogin();
    if (this.data.userInfo) {
      this.getAchievements();
    }
    this.filterAchievements();
  },

  onShow() {
    if (this.data.userInfo) {
      this.getAchievements();
    }
  },

  // 初始化日期列表（未来7天）
  initDateList() {
    const dateList = [];
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      dateList.push({
        date: this.formatDate(date),
        day: days[date.getDay()],
      });
    }

    this.setData({
      dateList,
      currentDate: dateList[0].date,
    });
  },

  // 格式化日期
  formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  // 选择日期
  onDateSelect(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({
      currentDate: date,
    });
    this.getTimeSlots();
  },

  // 选择场地
  onFieldSelect(e) {
    const field = Number(e.currentTarget.dataset.field);
    this.setData({
      selectedField: field,
      selectedTimeSlots: [],
      totalPrice: 0,
    });
    this.getTimeSlots();
  },

  // 获取时间段列表
  getTimeSlots() {
    // 模拟时间段数据，实际应该从服务器获取
    const timeSlots = [];
    const startHour = 9;
    const endHour = 22;
    const basePrice = this.data.selectedField === 1 ? 300 : 200;

    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push({
        time: `${hour}:00-${hour + 1}:00`,
        price: basePrice,
        available: Math.random() > 0.3, // 随机设置是否可预订
        selected: false,
      });
    }

    this.setData({
      timeSlots,
    });
  },

  // 选择时间段
  onTimeSlotSelect(e) {
    const time = e.currentTarget.dataset.time;
    const timeSlots = this.data.timeSlots;
    const selectedTimeSlots = [...this.data.selectedTimeSlots];
    let totalPrice = this.data.totalPrice;

    const slot = timeSlots.find((s) => s.time === time);
    if (!slot || !slot.available) return;

    const index = selectedTimeSlots.indexOf(time);
    if (index === -1) {
      selectedTimeSlots.push(time);
      totalPrice += slot.price;
    } else {
      selectedTimeSlots.splice(index, 1);
      totalPrice -= slot.price;
    }

    // 更新时间段选中状态
    timeSlots.forEach((s) => {
      if (s.time === time) {
        s.selected = !s.selected;
      }
    });

    this.setData({
      timeSlots,
      selectedTimeSlots,
      totalPrice,
    });
  },

  // 提交预订
  onBookingSubmit() {
    if (this.data.selectedTimeSlots.length === 0) return;

    // 检查用户是否登录
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/auth/auth",
      });
      return;
    }

    this.setData({
      showConfirmModal: true,
    });
  },

  // 关闭确认弹窗
  closeConfirmModal() {
    this.setData({
      showConfirmModal: false,
    });
  },

  // 确认预订
  async confirmBooking() {
    try {
      wx.showLoading({
        title: "预订中...",
      });

      // TODO: 调用预订API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      wx.hideLoading();
      wx.showToast({
        title: "预订成功",
        icon: "success",
      });

      // 重置选择状态
      this.setData({
        showConfirmModal: false,
        selectedTimeSlots: [],
        totalPrice: 0,
      });
      this.getTimeSlots();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: "预订失败",
        icon: "error",
      });
    }
  },

  checkLogin() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo,
      });
    }
  },

  login() {
    wx.navigateTo({
      url: "/pages/auth/auth",
    });
  },

  getAchievements() {
    // TODO: 从服务器获取成就数据
    // 这里使用模拟数据
    const achievements = this.data.achievements.map((achievement) => {
      if (achievement.id === 1) {
        achievement.currentValue = 1;
        achievement.unlocked = true;
      }
      return achievement;
    });

    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalExp = achievements.reduce(
      (total, a) => total + (a.unlocked ? a.expReward : 0),
      0
    );

    this.setData({
      achievements,
      unlockedCount,
      totalExp,
    });

    this.filterAchievements();
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
    });
    this.filterAchievements();
  },

  filterAchievements() {
    let filteredAchievements = [...this.data.achievements];

    switch (this.data.currentCategory) {
      case "unlocked":
        filteredAchievements = filteredAchievements.filter((a) => a.unlocked);
        break;
      case "locked":
        filteredAchievements = filteredAchievements.filter((a) => !a.unlocked);
        break;
    }

    this.setData({
      filteredAchievements,
    });
  },
});
