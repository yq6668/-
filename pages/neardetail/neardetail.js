// pages/neardetail/neardetail.js
var util = require('../../utils/util.js');
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
    local: '',
    detail: '',
    show: true,
    key: 'RDMBZ-EXH63-MXG3Z-Y2OJL-DT27T-3DBJP',
    time: '',
    judge: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map')
    const eventChannel = this.getOpenerEventChannel()
    //使用事件频道的on方法接收数据
    eventChannel.on('acceptDataFromGlobalPage', (data) => {
      this.setData({
        judge: data.judge,
        detail: data
      })
      const m1 = this.data.detail.location.coordinates[0];
      const m2 = this.data.detail.location.coordinates[1] - 0.05;
      this.mapCtx.moveToLocation({
        longitude: m1,
        latitude: m2
      });
    })
    var that = this
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
  },
  async getnearbyData(a, b) {
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

    this.setData({
      nearby: result,
      local: local
    });
  },
  async gethospital(a, b) {
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
    const m2 = data.location.coordinates[1] - 0.05;
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
    const m2 = data.location.coordinates[1] - 0.05;
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

  }
})