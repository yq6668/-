import {
  requestGet,
  indexURL
} from "../../utils/reqeust";
import Toast from '../../components/vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cachetime: "",
    othertotal: {},
    otherlist: [],
    show: false,
    show2: false,
    f1: "block",
    f2: "block",
    num: true,
    f3: "block",
    f4: "block",
    num2: true,
    f5: "block",
    f6: "block",
    num3: true,
    f7: "block",
    f8: "block",
    num4: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '努力加载中',
      selector: '#van-toast',
      loadingType: 'spinner',
    });
    this.getGLObalData().then(() => {
      Toast.clear();
    });
  },
  async getGLObalData() {
    const result = await requestGet(indexURL);
    const arr = result.data.otherlist;
    // 对全球国家按照累计确诊排序
    await arr.sort(this.compare('conNum'));
    await this.setData({
      cachetime: result.data.cachetime,
      othertotal: result.data.othertotal,
      otherlist: arr,
      f1: "block",
      f2: "block",
      f3: "block",
      f4: "block",
      f5: "block",
      f6: "block",
      f7: "block",
      f8: "block",
      num: true,
      num2: true,
      num3: true,
      num4: true
    })
  },
  //数组大到小排序
  compare: function (conNum) {
    return function (a, b) {
      var value1 = a[conNum];
      var value2 = b[conNum];
      return value2 - value1;
    }
  },
  //数组小到大排序
  compare2: function (conNum) {
    return function (a, b) {
      var value1 = a[conNum];
      var value2 = b[conNum];
      return value1 - value2;
    }
  },
  //页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop > 198) {
      this.setData({
        posi: "fixed",
        pad: "0",
        ind: "10",
        left: "3rpx"
      })
    } else {
      this.setData({
        posi: "static",
        pad: "20rpx",
        ind: "0",
        left: "0"
      })
    }

  },
  // ?点击事件
  showMessage: function () {
    this.setData({
      show: true,
    })
  },
  //数据说明tap事件
  showData2: function () {
    this.setData({
      show2: true
    })
  },
  //关闭弹出层时触发
  onClose: function () {
    this.setData({
      show: false,
    })
  },
  //关闭弹出层时触发
  onClose2: function () {
    this.setData({
      show2: false,
    })
  },
  //icon关闭事件
  ClosePopup: function () {
    this.onClose2();
  },
  navigateTo: function (e) {
    var countryData = e.currentTarget.dataset.did;
    countryData.time = e.currentTarget.dataset.time;
    wx.navigateTo({
      url: '/pages/globaldetail/globaldetail',
      success: function (res) {
        //向目标页面发送数据
        res.eventChannel.emit('acceptDataFromGlobalPage', countryData)
      },
    })
  },
  // 现有确诊排序tap事件
  click: async function () {
    //显示轻提示
    const toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '努力加载中',
      selector: '#van-toast',
      loadingType: 'spinner',
    });
    //如果num为true从高到低排序
    if (this.data.num) {
      await this.setData({
        f1: "none",
        f2: "block",
        f3: "block",
        f4: "block",
        f5: "block",
        f6: "block",
        f7: "block",
        f8: "block",
        num: false,
        num2: true,
        num3: true,
        num4: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare('econNum'));
      await this.setData({
        otherlist: arr
      })
    } else {
      await this.setData({
        f1: "block",
        f2: "none",
        f3: "block",
        f4: "block",
        f5: "block",
        f6: "block",
        f7: "block",
        f8: "block",
        num: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare2('econNum'));
      await this.setData({
        otherlist: arr
      })
    }
    // 关闭提示
    Toast.clear();
  },
  //累计确诊排序tap事件
  click2: async function () {
    //显示轻提示
    const toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '努力加载中',
      selector: '#van-toast',
      loadingType: 'spinner',
    });
    if (this.data.num2) {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "none",
        f4: "block",
        f5: "block",
        f6: "block",
        f7: "block",
        f8: "block",
        num2: false,
        num: true,
        num3: true,
        num4: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare('conNum'));
      await this.setData({
        otherlist: arr
      })
    } else {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "block",
        f4: "none",
        f5: "block",
        f6: "block",
        f7: "block",
        f8: "block",
        num2: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare2('conNum'));
      await this.setData({
        otherlist: arr
      })
    }
    // 关闭提示
    Toast.clear();
  },
  //死亡排序tap事件
  click3: async function () {
    //显示轻提示
    const toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '努力加载中',
      selector: '#van-toast',
      loadingType: 'spinner',
    });
    if (this.data.num3) {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "block",
        f4: "block",
        f5: "none",
        f6: "block",
        f7: "block",
        f8: "block",
        num3: false,
        num: true,
        num2: true,
        num4: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare('deathNum'));
      await this.setData({
        otherlist: arr
      })
    } else {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "block",
        f4: "block",
        f5: "block",
        f6: "none",
        f7: "block",
        f8: "block",
        num3: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare2('deathNum'));
      await this.setData({
        otherlist: arr
      })
    }
    // 关闭提示
    Toast.clear();
  },
  //治愈排序tap事件
  click4: async function () {
    //显示轻提示
    const toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '努力加载中',
      selector: '#van-toast',
      loadingType: 'spinner',
    });
    if (this.data.num4) {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "block",
        f4: "block",
        f5: "block",
        f6: "block",
        f7: "none",
        f8: "block",
        num4: false,
        num: true,
        num2: true,
        num3: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare('cureNum'));
      await this.setData({
        otherlist: arr
      })
    } else {
      await this.setData({
        f1: "block",
        f2: "block",
        f3: "block",
        f4: "block",
        f5: "block",
        f6: "block",
        f7: "block",
        f8: "none",
        num4: true
      })
      const arr = this.data.otherlist;
      await arr.sort(this.compare2('cureNum'));
      await this.setData({
        otherlist: arr
      })
    }
    // 关闭提示
    Toast.clear();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this.onLoad();
    //异步任务有了结果，停止下拉刷新
    wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})