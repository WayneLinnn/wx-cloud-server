Page({
  data: {
    userInfo: null,
    achievements: [
      {
        id: 1,
        icon: "⚽",
        name: "初出茅庐",
        description: "完成第一节课程",
        currentValue: 0,
        targetValue: 1,
        unlocked: false,
      },
      {
        id: 2,
        icon: "🏃",
        name: "勤学苦练",
        description: "累计完成10节课程",
        currentValue: 0,
        targetValue: 10,
        unlocked: false,
      },
      {
        id: 3,
        icon: "🌟",
        name: "足球达人",
        description: "累计完成50节课程",
        currentValue: 0,
        targetValue: 50,
        unlocked: false,
      },
      {
        id: 4,
        icon: "🏆",
        name: "场地常客",
        description: "累计预订场地10次",
        currentValue: 0,
        targetValue: 10,
        unlocked: false,
      },
      {
        id: 5,
        icon: "📈",
        name: "技能成长",
        description: "达到10级",
        currentValue: 1,
        targetValue: 10,
        unlocked: false,
      },
    ],
  },

  onLoad() {
    this.checkLogin();
    if (this.data.userInfo) {
      this.getUserData();
      this.getAchievements();
    }
  },

  onShow() {
    if (this.data.userInfo) {
      this.getUserData();
      this.getAchievements();
    }
  },

  checkLogin() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: {
          ...userInfo,
          level: 1,
          exp: 50,
          nextLevelExp: 100,
          totalCourses: 2,
          completedCourses: 1,
          totalAchievements: 1,
          unlockedAchievements: 1,
        },
      });
    }
  },

  login() {
    wx.navigateTo({
      url: "/pages/auth/auth",
    });
  },

  getUserData() {
    // TODO: 从服务器获取用户数据
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

    this.setData({
      achievements,
    });
  },

  navigateToCourses() {
    if (!this.data.userInfo) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: "/pages/my-courses/my-courses",
    });
  },

  navigateToBookings() {
    if (!this.data.userInfo) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: "/pages/my-bookings/my-bookings",
    });
  },

  navigateToSettings() {
    if (!this.data.userInfo) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: "/pages/settings/settings",
    });
  },

  navigateToTest() {
    wx.navigateTo({
      url: "/pages/test/test",
    });
  },

  // 检查并更新成就
  checkAchievements(stats) {
    const achievements = this.data.achievements.map((achievement) => {
      switch (achievement.id) {
        case 1: // 初出茅庐
          achievement.currentValue = stats.completedCourses > 0 ? 1 : 0;
          break;
        case 2: // 勤学苦练
          achievement.currentValue = stats.completedCourses;
          break;
        case 3: // 足球达人
          achievement.currentValue = stats.completedCourses;
          break;
        case 4: // 场地常客
          achievement.currentValue = stats.totalBookings;
          break;
        case 5: // 技能成长
          achievement.currentValue = stats.level;
          break;
      }
      achievement.unlocked =
        achievement.currentValue >= achievement.targetValue;
      return achievement;
    });

    this.setData({
      achievements,
      "userInfo.unlockedAchievements": achievements.filter((a) => a.unlocked)
        .length,
    });
  },
});
