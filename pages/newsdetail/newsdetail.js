// import { requestGet, news2URL } from "../../utils/reqeust";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  onLoad: function (options) {
    //获取事件频道
    const eventChannel = this.getOpenerEventChannel();
    //使用事件频道的on方法接收数据
    eventChannel.on("acceptDataFromGlobalPage", (data) => {
      this.setData({
        msg: data,
      });
    });
  },
  // async getListData() {
  
  //   const {
  //     code,
  //     msg,
  //     newslist: [{ news, desc, riskarea }],
  //   } = await requestGet(news2URL);
  //   Toast.clear();
  //   for (let i = 0; i < news.length; i++) {
  //     var now = new Date(news[i].pubDate);
  //     var a = this.formatDate(now);
  //     news[i].date = a;
  //   }
  //   this.setData({
  //     list0: news,
  //     list1: desc,
  //     list2: riskarea,
  //   });
  // },
  // formatDate: function (d) {
  //   //如果date不是日期对象，返回
  //   if (!date instanceof Date) {
  //     return;
  //   }
  //   var year = d.getFullYear(),
  //     month = d.getMonth() + 1,
  //     date = d.getDate(),
  //     hour = d.getHours(),
  //     minute = d.getMinutes(),
  //     second = d.getSeconds();
  //   month = month < 10 ? "0" + month : month;
  //   date = date < 10 ? "0" + date : date;
  //   hour = hour < 10 ? "0" + hour : hour;
  //   minute = minute < 10 ? "0" + minute : minute;
  //   second = second < 10 ? "0" + second : second;
  //   return (
  //     year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  //   );
  // },

  // onReady: function () {},


});


