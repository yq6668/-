// index.js
// 获取应用实例
// const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    show:false
  },
  onLoad() {
    var value = this.get("user");
    if (value) {
      this.setData({
        userInfo: value,
        hasUserInfo: true
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  outlogin() {
    wx.removeStorageSync("user")
    wx.removeStorageSync('userdtime')
    this.setData({
      userInfo: {},
      hasUserInfo: false
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.put("user", res.userInfo, 3600                                                                                                                                                                                                                                                                                                                                          )
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  put(key, val, time) {
    wx.setStorageSync(key, val)
    var seconds = parseInt(time);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(key + 'dtime', timestamp + "")
    } else {
      wx.removeStorageSync(key + 'dtime')
    }
  },
  get(key, def) {
    var deadtime = parseInt(wx.getStorageSync(key + 'dtime'))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        if (def) { return def; } else { return; }
        wx.removeStorageSync(key + 'dtime')
      }
    }
    var res = wx.getStorageSync(key);
    if (res) {
      return res;
    } else {
      return def;
    }
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
})
