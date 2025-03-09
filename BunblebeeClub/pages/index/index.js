// index.js
Page({
  data: {
    banners: [{ id: 1 }, { id: 2 }, { id: 3 }],
    news: [
      {
        id: 1,
        title: "大黄蜂足球俱乐部2024春季招生开始啦！",
        date: "2024-03-08",
      },
      {
        id: 2,
        title: "周末青少年足球联赛圆满结束",
        date: "2024-03-07",
      },
      {
        id: 3,
        title: "暑期特训营报名进行中",
        date: "2024-03-06",
      },
    ],
    matches: [
      {
        id: 1,
        title: "U12组联赛第三轮",
        time: "2024-03-10 14:00",
      },
      {
        id: 2,
        title: "U15组选拔赛",
        time: "2024-03-15 15:30",
      },
    ],
    coaches: [
      {
        id: 1,
        name: "张教练",
        title: "青训总监",
      },
      {
        id: 2,
        name: "李教练",
        title: "U12组教练",
      },
      {
        id: 3,
        name: "王教练",
        title: "U15组教练",
      },
      {
        id: 4,
        name: "刘教练",
        title: "体能教练",
      },
    ],
  },

  onLoad() {
    // 页面加载时获取数据
    this.getNewsData();
    this.getMatchesData();
    this.getCoachesData();
  },

  getNewsData() {
    // TODO: 从服务器获取新闻数据
  },

  getMatchesData() {
    // TODO: 从服务器获取比赛数据
  },

  getCoachesData() {
    // TODO: 从服务器获取教练数据
  },

  navigateToBooking() {
    // 检查用户是否登录
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/auth/auth",
      });
      return;
    }
    wx.navigateTo({
      url: "/pages/booking/booking",
    });
  },

  onNewsTap(e) {
    const newsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/news/detail?id=${newsId}`,
    });
  },

  onMatchTap(e) {
    const matchId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/match/detail?id=${matchId}`,
    });
  },

  onCoachTap(e) {
    const coachId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coach/detail?id=${coachId}`,
    });
  },
});
