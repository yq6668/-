// 获取应用实例
import {
    getData,
    setoption
} from '../../js/myapi';

import {
    requestGet
} from '../../utils/reqeust';

import * as echarts from '../../components/ec-canvas/echarts';

Page({
    data: {
        yqname: {
            "confirm": "累计确诊",
            "noSymptom": "无症状",
            "heal": "治愈病例",
            "dead": "死亡病例",
            "extant": "现有确诊",
            "input": "境外输入"
        },
        yqinfo: "",
        lastupdatatime: "",
        extant: "",
        chinainfo: "",
        ec: {
            lazyLoad: true
                // onInit: initChart
        }
    },
    myevent: function() {
        wx.request({
            //请求地址
            url: "https://wen992.github.io/chinamap/img/banner.jpg",
            //请求方式
            method: "get",
            //请求参数
            data: data,
            //设置请求头  如果发送的是post请求，一定要添加请求的content-type
            header: {
                "content-type": "application/json",
            },
            //请求返回结果的数据类型
            dataType: "json",
            //请求回调
            success: () => {
                console.log('success');
            }
        })
    },
    /**生命周期函数--监听页面加载*/
    onLoad: async function() {
        wx.showLoading({
            title: '加载中',
        });
        const a = await requestGet("https://c.m.163.com/ug/api/wuhan/app/data/list-total");
        const url = "https://wen992.github.io/chinamap/chinamap/";
        const provincename = a.data.areaTree[2].name;
        var geoJson = await requestGet(`${url}${provincename}${".json"}`);
        // console.log(a.data.areaTree[2].name);
        const data = a.data;
        const extant = parseInt(data.chinaTotal.total.confirm) - parseInt(data.chinaTotal.total.dead) - parseInt(data.chinaTotal.total.heal);
        const arr = data.areaTree[2].children; //中国各省份的数据
        const provinces = getData(arr, null);
        provinces.sort(this.compare('value'));
        this.setData({
            yqinfo: data.chinaTotal,
            lastupdatatime: data.lastUpdateTime,
            extant: extant,
            chinainfo: provinces
        });
        const echartComponents = this.selectComponent("#mychart-dom-area");
        echartComponents.init((canvas, width, height) => {
            const myMap = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            canvas.setChart(myMap);
            echarts.registerMap('china', geoJson); // 绘制中国地图
            const map = {
                left: "50%",
                top: "48%",
                size: 370
            }
            setoption(myMap, provinces, map);
            myMap.resize();
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return myMap;
        });
        wx.hideLoading();
    },
    compare: function(conNum) {
        return function(a, b) {
            var value1 = a[conNum];
            var value2 = b[conNum];
            return value2 - value1;
        }
    },
    //数组小到大排序
    compare2: function(conNum) {
        return function(a, b) {
            var value1 = a[conNum];
            var value2 = b[conNum];
            return value1 - value2;
        }
    },
});