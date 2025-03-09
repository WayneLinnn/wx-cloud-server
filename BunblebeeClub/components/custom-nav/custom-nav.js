Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
    showBack: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    statusBarHeight: 20,
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight,
      });
    },
  },

  methods: {
    handleBack() {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.switchTab({
            url: "/pages/index/index",
          });
        },
      });
    },
  },
});
