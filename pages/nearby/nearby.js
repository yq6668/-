// pages/nearby/nearby.js
var util = require('../../utils/util.js');
import Toast from '../../components/vant/toast/toast';
import {
  requestGet,
  requestPost,
  nearbyURL,
  nearDetailURl,
  nearhospitalUrl,
  hospitaldetailURL,
  moredate,
  morehospital
} from "../../utils/reqeust";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    nearby: '',
    act1: 'active',
    act2: '',
    local: '',
    detail: '',
    show: false,
    key: 'RDMBZ-EXH63-MXG3Z-Y2OJL-DT27T-3DBJP',
    time: '',
    judge: true,
    zz: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.mapCtx = wx.createMapContext('map');
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            zz: true
          })
        }
      }
    })
    wx.getLocation({
      type: 'gcj02',//wgs84
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        if (that.data.judge) {
          that.getnearbyData(res.longitude, res.latitude);
        } else {
          that.gethospital(res.longitude, res.latitude);
        }

      }
    })
    var time = util.formatTime(new Date()).slice(0, 10);
    this.setData({
      time: time
    });
  },
  async getnearbyData(a, b) {
    Toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true,
      loadingType: "spinner",
      selector: '#van-toast',
    });
    const local = {
      markers: []
    }
    const result = await requestGet(`${nearbyURL}lon=${a}&lat=${b}`);
    const shops = result.data.shops;
    for (var i = 0; i < shops.length; i++) {
      const mark = {
        width: 30,
        height: 30
      }
      mark.id = shops[i].id;
      mark.latitude = shops[i].location.coordinates[1];
      mark.longitude = shops[i].location.coordinates[0];
      mark.iconPath = shops[i].iconPath;
      mark.title = shops[i].shop_name;
      local.markers.push(mark);
    }
    Toast.clear();
    this.setData({
      nearby: result,
      local: local
    });
  },

  bindmarkertap: function (e) {
    if (this.data.judge) {
      const a1 = this.data.longitude;
      const a2 = this.data.latitude;
      const a3 = e.markerId;
      this.nearDetailData(a1, a2, a3)
      this.showPopup()
    } else {
      const a1 = this.data.longitude;
      const a2 = this.data.latitude;
      const a3 = e.markerId;
      this.hospitaldetailData(a1, a2, a3)
      this.showPopup()
    }
  },
  async nearDetailData(a, b, c) {
    const {
      code,
      data,
      msg
    } = await requestGet(`${nearDetailURl}${c}?lon=${a}&lat=${b}`);
    const m1 = data.location.coordinates[0];
    const m2 = data.location.coordinates[1]
    this.mapCtx.moveToLocation({
      longitude: m1,
      latitude: m2
    });
    data.created = data.created_at.slice(0, 10)
    this.setData({
      detail: data
    })
  },
  async hospitaldetailData(a, b, c) {
    const {
      code,
      data,
      msg
    } = await requestGet(`${hospitaldetailURL}${c}?lon=${a}&lat=${b}`);
    const m1 = data.location.coordinates[0];
    const m2 = data.location.coordinates[1]
    this.mapCtx.moveToLocation({
      longitude: m1,
      latitude: m2
    });
    this.setData({
      detail: data
    })
  },
  clickcontrol(e) {
    this.mapCtx.moveToLocation();
  },
  click1: function () {
    this.getnearbyData(this.data.longitude, this.data.latitude).then(() => {
      this.setData({
        act1: 'active',
        act2: '',
        judge: true
      })
    })

  },
  click2: function () {
    this.gethospital(this.data.longitude, this.data.latitude).then(() => {
      this.setData({
        act1: '',
        act2: 'active',
        judge: false
      })
    })

  },
  async gethospital(a, b) {
    Toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true,
      loadingType: "spinner",
      selector: '#van-toast',
    });
    const local = {
      markers: []
    }
    const result = await requestGet(`${nearhospitalUrl}lon=${a}&lat=${b}`);
    const shops = result.data.shops;
    for (var i = 0; i < shops.length; i++) {
      const mark = {
        width: 30,
        height: 30
      }
      mark.id = shops[i].id;
      mark.latitude = shops[i].location.coordinates[1];
      mark.longitude = shops[i].location.coordinates[0];
      mark.iconPath = shops[i].iconPath;
      mark.title = shops[i].name;
      local.markers.push(mark);
    }
    Toast.clear();
    this.setData({
      nearby: result,
      local: local
    });
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  bindregionchange: function (e) {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      var mpCtx = wx.createMapContext("map")
      mpCtx.getCenterLocation({
        success: function (cen) {
          mpCtx.getScale({
            success: function (res) {
              if (res.scale > 12) {
                var a1 = 0.1421018934343;
                var a2 = 0.0368398981769;
              }
              else if (res.scale > 8) {
                let b1 = 0.1421018934343;
                let b2 = 0.0368398981769;
                var a1 = (13 - res.scale) * b1;
                var a2 = (13 - res.scale) * b2;
              }
              else {
                var a1 = 2.73564255453914;
                var a2 = 1.37291143285449;
              }
              var d = {
                "southwest": {
                  "latitude": cen.latitude - a2,
                  "longitude": cen.longitude - a1
                },
                "northeast": {
                  "latitude": cen.latitude + a2,
                  "longitude": cen.longitude + a1
                },
                "centerLongitude": cen.longitude,
                "centerLatitude": cen.latitude
              }
              if (that.data.judge) {
                that.getmoredate(d);
              } else {
                that.getmorehospital(d);
              }
            }
          })

        }
      })
    }
  },
  async getmoredate(d) {
    let { code, data: { markers }, msg } = await requestPost(moredate, d)
    this.pushdata(markers);
  },
  async getmorehospital(data) {
    let { code, data: { markers }, msg } = await requestPost(morehospital, data)
    this.pushdata(markers);
  },
  pushdata(markers) {
    const local = {
      markers: []
    }
    for (var i = 0; i < markers.length; i++) {
      const mark = {
        width: 30,
        height: 30
      }
      mark.id = markers[i].id;
      mark.latitude = markers[i].latitude;
      mark.longitude = markers[i].longitude;
      mark.iconPath = markers[i].iconPath;
      mark.title = markers[i].title;
      local.markers.push(mark);
    }
    this.setData({
      local: local
    });
  },
  async navigator(e) {
    if (this.data.judge) {
      const a1 = this.data.longitude;
      const a2 = this.data.latitude;
      const a3 = e.currentTarget.dataset.did;
      await this.nearDetailData(a1, a2, a3)
    } else {
      const a1 = this.data.longitude;
      const a2 = this.data.latitude;
      const a3 = e.currentTarget.dataset.did;
      await this.hospitaldetailData(a1, a2, a3)
    }
    var detailData = this.data.detail;
    detailData.judge = this.data.judge;

    wx.navigateTo({
      url: '/pages/neardetail/neardetail',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromGlobalPage', detailData)
      },
    })

  },
  getLocation() {
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置,确认授权?',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      _this.onLoad();
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  refresh() {
    this.getLocation()
    this.onLoad();
  }
})