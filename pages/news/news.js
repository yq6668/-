import { requestGet, newsURL } from "../../utils/reqeust";
import Toast from "../../components/vant/toast/toast";
Page({
  data: {
    // id: null,
    list: [],
    show: true,
  },

  onLoad: function (options) {
    var value = this.get("data");
    if (value) {
      this.setData({
        list0: value[0],
        list1: value[1],
        list2: value[2],
      });
    } else {
      this.getListData();
    }
  },
  async getListData() {
    console.log("aa");
    Toast.loading({
      duration: 0, // 持续展示 toast
      message: "加载中...",
      forbidClick: true, // 禁用背景点击
      loadingType: "spinner",
      selector: "#van-toast",
    });
    const {
      code,
      msg,
      newslist: [{ news, desc, riskarea }],
    } = await requestGet(newsURL);
    Toast.clear();
    for (let i = 0; i < news.length; i++) {
      var now = new Date(news[i].pubDate);
      var a = this.formatDate(now);
      news[i].date = a;
    }
    this.setData({
      list0: news,
      list1: desc,
      list2: riskarea,
    });
    this.put("data", [news, desc, riskarea], 120)
  },
  formatDate: function (d) {
    //如果date不是日期对象，返回
    if (!date instanceof Date) {
      return;
    }
    var year = d.getFullYear(),
      month = d.getMonth() + 1,
      date = d.getDate(),
      hour = d.getHours(),
      minute = d.getMinutes(),
      second = d.getSeconds();
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return (
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    );
  },
  onReachBottom: function () {
    var value = this.get("data");
    if (value) {
      this.setData({
        list0: value[0],
        list1: value[1],
        list2: value[2],
      });
      wx.stopPullDownRefresh();
    } else {
      this.getListData().then(() => {
        wx.stopPullDownRefresh();
      });
    }
  },
  onPullDownRefresh: function () {
    var value = this.get("data");
    if (value) {
      this.setData({
        list0: value[0],
        list1: value[1],
        list2: value[2],
      });
      wx.stopPullDownRefresh();
    } else {
      this.getListData().then(() => {
        wx.stopPullDownRefresh();
      });
    }
  },
  click1: function () {
    this.setData({
      show: false,
    });
  },
  click2: function () {
    this.setData({
      show: true,
    });
  },
  navigator: function (e) {
    let countryData = e.currentTarget.dataset.did;
    wx.navigateTo({
      url: "/pages/newsdetail/newsdetail",
      success: function (res) {
        //向目标页面发送数据
        res.eventChannel.emit("acceptDataFromGlobalPage", countryData);
      },
    });
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
  }
});
