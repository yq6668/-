export function requestGet(url, data) {
  return new Promise((reslove, reject) => {
    wx.request({
      //请求地址
      url: url,
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
      success: ({
        statusCode,
        data
      }) => {
        if (statusCode === 200) {
          reslove(data,"aa");
        } else {
          reject("服务器响应出错");
        }
      },
      // 请求失败执行的回调函数
      fail: function (err) {
        reject(err)
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (res) { },
    });
  });
}
export function requestPost(url, data) {
  return new Promise((reslove, reject) => {
    wx.request({
      //请求地址
      url: url,
      //请求方式
      method: "post",
      //请求参数
      data: data,
      //设置请求头  如果发送的是post请求，一定要添加请求的content-type
      header: {
        "content-type": "application/json",
      },
      //请求返回结果的数据类型
      dataType: "json",
      //请求回调
      success: ({
        statusCode,
        data
      }) => {
        if (statusCode === 200) {
          reslove(data);
        } else {
          reject("服务器响应出错");
        }
      },
      // 请求失败执行的回调函数
      fail: function (err) {
        reject(err)
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (res) { },
    });
  });
}

export var indexURL = "https://interface.sina.cn/news/wap/fymap2020_data.d.json" //GET请求
export var newsURL = "https://api.tianapi.com/ncov/index?key=71f4dffee71eb99d4b8b1e2e6f9295ef" //GET请求
export var globaldetailURL="https://gwpre.sina.cn/interface/news/wap/ncp_foreign.d.json?"//GET请求 citycode=SCBR0055
export var imgURL1="https://static.ws.126.net/163/f2e/news/virus_nation/static/images/banner_korea.75c96c7.jpg"  //get请求
export var imgURL2="https://static.ws.126.net/163/f2e/news/virus_nation/static/images/banner_italy.70e329c.jpg"  //get请求
export var imgURL3="https://static.ws.126.net/163/f2e/news/virus_nation/static/images/banner.fced17d.jpg"  //get请求
export var imgURL4="https://static.ws.126.net/163/f2e/news/virus_report/static/images/banner.53e59fc.png"  //get请求
export var imgURL5="https://static.ws.126.net/163/f2e/news/virus_nation/static/images/banner_iran.6d65501.jpg"  //get请求

export var nearbyURL = "https://api.webhunt.cn/api/v1/pages/home?";//GET请求 lon=120.36434&lat=31.49055
export var nearDetailURl = "https://api.webhunt.cn/api/v1/shops/";//GET请求 11305?lon=120.36434&lat=31.49055
export var hospitaldetailURL = "https://api.webhunt.cn/api/v1/hospitals/";//GET请求 1941?lon=120.36434&lat=31.49055
export var nearhospitalUrl = "https://api.webhunt.cn/api/v1/pages/homeHospital?"//GET请求 lon=120.36434&lat=31.49055
export var moredate = "https://api.webhunt.cn/api/v2/pages/home/mapData"//POST请求
export var morehospital="https://api.webhunt.cn/api/v2/pages/home/mapDataHospital"//POST请求
