import { imgURL1, imgURL2, imgURL3, imgURL4, imgURL5, globaldetailURL, requestGet } from "../../utils/reqeust";
import * as echarts from '../../components/ec-canvas/echarts';

var aa, bb, cc, dd, ee;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    time: "",
    show2: false,
    imgURL: [imgURL1, imgURL2, imgURL3, imgURL4, imgURL5],
    img: "",
    city: [],
    ec: {
      lazyLoad: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取随机背景图
    const random = Math.floor(Math.random() * 5);
    const arr = this.data.imgURL[random];
    this.setData({
      img: arr
    })
    //获取到组件
    this.lazyComponent = this.selectComponent('#mychart-dom-line')
    //获取事件频道
    const eventChannel = this.getOpenerEventChannel()
    //使用事件频道的on方法接收数据
    eventChannel.on('acceptDataFromGlobalPage', async (data) => {
      const Data = data;
      ee = Data.name + "疫情趋势图"
      const time = data.time;
      //获取城市码
      const cityCode = Data.citycode;
      if (cityCode) {
        const result = await requestGet(`${globaldetailURL}citycode=${cityCode}`);
        await this.getdata(result.data.historylist)
        await this.init()
        //对城市里对象排序
        const city = await result.data.city.sort(this.compare('conNum'));
        await this.setData({
          data: Data,
          time: time,
          city: city,
        })
      } else {
        await this.setData({
          data: Data,
          time: time
        })
      }

    })
  },

  getdata(historylist) {
    var a = [];
    var b = [];
    var c = [];
    var d = [];
    if (historylist) {
      for (var i = historylist.length - 1; i > 0; i -= 45) {
        a.push(historylist[i].date)
        b.push(historylist[i].deathNum)
        c.push(historylist[i].cureNum)
        d.push(historylist[i].conNum)
      }
      a.push(historylist[0].date)
      b.push(historylist[0].deathNum)
      c.push(historylist[0].cureNum)
      d.push(historylist[0].conNum)
      aa = a;
      bb = b;
      cc = c;
      dd = d;
    }
  },
  //手动初始化
  init() {
    this.lazyComponent.init((canvas, width, height, dpr) => {
      let chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      })

      let option = getOption();

      chart.setOption(option);

      //将图表实例绑定到this上，方便在其他函数中访问
      this.chart = chart;
      return chart;
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
  //数据说明tap事件
  showData2: function () {
    this.setData({
      show2: true
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

  //页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop > 730) {
      this.setData({
        sty: "position:fixed;padding:0;z-index:100;left:7%;width:86%"
      })
    } else {
      this.setData({
        sty: "position:static;padding:20rpx 4% 0 4%;z-index:100;left:5%;width:100%"
      })
    }

  },






  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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


function getOption() {
  return {
    title: {
      text: ee,
      textStyle: {
        fontSize: 14
      }
    },
    //工具提示
    tooltip: {
      show: true,
      trigger: "item",
    },
    //图例控件
    legend: {
      orient: 'horizontal',
      icon: "rect",
      right: "4%",
      top: "8%"
    },
    grid: {
      // grid区域是否包含坐标轴的刻度标签
      containLabel: true,
      left: "3%",
      right: "3%"
    },
    xAxis: {
      type: 'category',
      data: aa,
      boundaryGap: true,
      axisLabel: {
        textStyle: {
          color: '#000',
          fontSize: '7',
          itemSize: ''
        }
      },
    },
    yAxis: {
      name: "人数",
      type: 'value',
      min: 0,
      max: function (value) {
        return Math.floor(value.max *1.2);
      },
      nameTextStyle: {
        color: "#333",
        fontSize: "20rpx"
      },
      axisLabel: {
        textStyle: {
          color: '#000',
          fontSize: '7',
          itemSize: ''
        }
      },
    },
    series: [
      {
        name: "死亡",
        data: bb,
        color: "black",
        type: 'line',
        smooth: true,
        symbolSize: 5,
        lineStyle: {
          width: 2,
        }
      },
      {
        name: "治愈",
        data: cc,
        color: "#178b50",
        type: 'line',
        smooth: true,
        symbolSize: 5,
        lineStyle: {
          width: 2,
        }
      },
      {
        name: "确诊",
        data: dd,
        color: "#be2121",
        type: 'line',
        smooth: true,
        // 设置折线上圆点大小
        symbolSize: 5,
        lineStyle: {
          width: 2,
        }
      }
    ]
  };
}