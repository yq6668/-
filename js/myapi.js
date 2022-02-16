import * as echarts from '../components/ec-canvas/echarts';
import { requestGet } from '../utils/reqeust';



//获取数组数据
var getData = function getData(arr, type) {
    const arr1 = arr.map((item, index) => {
        const a = parseInt(item.total.confirm) - parseInt(item.total.dead) - parseInt(item.total.heal);
        if (a > 0) {
            var extant = a;
        } else {
            var extant = 0;
        }
        // console.log(item, "xxxxxxxxxxxxxx");
        if (type == null) {
            item.name = item.name;
        } else {
            item.name = type[index];
        }
        return {
            name: item.name,
            value: extant,
            confirm: item.total.confirm,
            heal: item.total.heal,
            dead: item.total.dead,
            add: item.today.confirm
        }
    });
    return arr1;
};
var setoption = function(chart, provinces, map) {
    const option = {
        geo: [{
            // 地理坐标系组件
            map: "china",
            roam: false, // 可以缩放和平移
            aspectScale: 0.8, // 比例
            layoutCenter: [map.left, map.top], // position位置
            layoutSize: map.size, // 地图大小，保证了不超过 370x370 的区域
            label: {
                // 图形上的文本标签
                normal: {
                    show: true,
                    textStyle: {
                        color: "rgba(0, 0, 0, 0.9)",
                        fontSize: '8'
                    }
                },
                emphasis: { // 高亮时样式
                    color: "#333"
                }
            },
            itemStyle: {
                // 图形上的地图区域
                normal: {
                    borderColor: "rgba(0,0,0,0.2)",
                }
            }
        }],
        visualMap: {
            type: 'piecewise',
            realtime: false,
            calculable: true,
            pieces: [{
                    min: 1000,
                    label: '10000以上',
                    color: '#7b1000'
                },
                {
                    min: 1000,
                    max: 9999,
                    label: '1000 ~ 9999人',
                    color: 'red'
                },
                {
                    min: 500,
                    max: 999,
                    label: '500 ~ 999人',
                    color: '#e64b45'
                },
                {
                    min: 100,
                    max: 499,
                    label: '100 ~ 499人',
                    color: '#ff8c71'
                },
                {
                    min: 10,
                    max: 99,
                    label: '10 ~ 99人',
                    color: '#fdd2a0'
                },
                {
                    min: 1,
                    max: 9,
                    label: '1 ~ 9人',
                    color: '#fff2cf'
                },
                {
                    value: 0,
                    label: '0',
                    color: 'white'
                }
            ]
        },
        grid: {

        },
        series: [{
            type: 'map',
            mapType: 'china',
            geoIndex: 0,
            roam: false, // 鼠标是否可以缩放
            label: {
                show: false
            },
            data: provinces
        }]
    };
    chart.setOption(option, true);
    chart.on('click', (e) => {
        wx.navigateTo({
            url: `../../pages/province/province?name=${e.data.name}`
        })
    })
}


var setoption2 = function(chart, provinces, map) {
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: "#f3f3f3",
            padding: [
                10, // 上
                15, // 右
                8, // 下
                15, // 左
            ],
            extraCssText: 'box-shadow: 2px 2px 10px rgba(21, 126, 245, 0.35);',
            textStyle: {
                fontFamily: "'Microsoft YaHei', Arial, 'Avenir', Helvetica, sans-serif",
                color: '#005dff',
                fontSize: 12,
            },
            formatter: `{b} :  {c}确诊`
        },
        geo: [{
            // 地理坐标系组件
            map: map.province,
            roam: false, // 可以缩放和平移
            aspectScale: 0.8, // 比例
            layoutCenter: [200, 200], // position位置
            layoutSize: "100%", // 地图大小，保证了不超过 370x370 的区域
            zoom: 0.8, //默认显示级别     
            scaleLimit: { min: 0, max: 3 }, // 缩放级别
            regions: [{
                name: "南海诸岛",
                value: 0,
                itemStyle: {
                    normal: {
                        opacity: 0,
                        label: {
                            show: false
                        }
                    }
                }
            }, {
                label: {
                    show: false
                }
            }],
            label: {
                // 图形上的文本标签
                normal: {
                    show: true,
                    textStyle: {
                        color: "rgba(0, 0, 0, 0.9)",
                        fontSize: '8'
                    }
                },
                emphasis: { // 高亮时样式
                    color: "#333"
                }
            },
            itemStyle: {
                // 图形上的地图区域
                normal: {
                    borderColor: "rgba(0,0,0,0.2)",
                }
            }
        }],

        visualMap: {
            type: 'piecewise',
            realtime: false,
            calculable: true,
            pieces: [{
                    min: 1000,
                    label: '10000以上',
                    color: '#7b1000'
                },
                {
                    min: 1000,
                    max: 9999,
                    label: '1000 ~ 9999人',
                    color: 'red'
                },
                {
                    min: 500,
                    max: 999,
                    label: '500 ~ 999人',
                    color: '#e64b45'
                },
                {
                    min: 100,
                    max: 499,
                    label: '100 ~ 499人',
                    color: '#ff8c71'
                },
                {
                    min: 10,
                    max: 99,
                    label: '10 ~ 99人',
                    color: '#fdd2a0'
                },
                {
                    min: 1,
                    max: 9,
                    label: '1 ~ 9人',
                    color: '#fff2cf'
                },
                {
                    value: 0,
                    label: '0',
                    color: 'white'
                }
            ]
        },
        series: [{
            type: 'map',
            mapType: 'china',
            geoIndex: 0,
            roam: false, // 鼠标是否可以缩放
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            data: provinces
        }]
    };
    chart.setOption(option, true);
}


export {
    getData,
    setoption,
    setoption2
};