import {
    getData,
    setoption2
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
        lastupdatatime: "",
        chinainfo: '',
        ec1: {
            lazyLoad: true
        }
    },
    //数组大到小排序
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
    onLoad: async function(options) {
        // console.log(options.name, "xxxxxxxxxxxxxxxxxxxx")
        wx.showLoading({
            title: '加载中',
        });
        const url = "https://wen992.github.io/chinamap/chinamap/";
        const a = await requestGet("https://c.m.163.com/ug/api/wuhan/app/data/list-total");
        var cityJson = await requestGet(`${url}${options.name}.json`);
        const proarr = a.data.areaTree[2].children;
        for (var i = 0; i <= proarr.length - 1; i++) {
            if (proarr[i].name == options.name) {
                var arr2 = proarr[i];
                break;
            }
        };
        var cname = [];
        for (var j = 0; j < cityJson.features.length; j++) {
            cname[j] = cityJson.features[j].properties.name;
        }
        // console.log(cname, 'ssssssssssssssssss')
        //arr2 拿到的城市的数据
        const city = getData(arr2.children, cname);

        const cityinfo = getData(arr2.children, null);
        const extant = parseInt(arr2.total.confirm) - parseInt(arr2.total.dead) - parseInt(arr2.total.heal)
        cityinfo.sort(this.compare('value'));
        this.setData({
            lastupdatatime: arr2.lastUpdateTime,
            provinces: {
                name: arr2.name,
                extant: extant,
                confirm: arr2.total.confirm,
                heal: arr2.total.heal,
                dead: arr2.total.dead,
                add: arr2.today.confirm,
                confirmadd: arr2.today.confirm,
                healadd: arr2.today.heal,
                deadadd: arr2.today.dead
            },
            city: cityinfo
        });
        const echartComponents = this.selectComponent("#area");
        echartComponents.init((canvas, width, height) => {
            const myMap = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            canvas.setChart(myMap);
            echarts.registerMap(options.name, cityJson); // 绘制中国地图
            const map = {
                // size: '300%',
                // left:'30%',
                // top:'30%'
                province: options.name
            }
            setoption2(myMap, city, map);
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return myMap;
        });
        wx.hideLoading();
    },

    /*生命周期函数--监听页面初次渲染完成*/
    onReady: function() {

    },
})