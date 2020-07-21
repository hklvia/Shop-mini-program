// 1.引入用来发送请求的代码,需要补全后缀
import {
  request
} from "../../request/index.js";

Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList();    
    this.getcatesList();
    this.getFloorList()
  },
  //获取轮播图数据
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      });
  },
  //获取导航图数据
  getcatesList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      });
  },
  // 获取楼层导航数据
  getFloorList() {
    request({
        url: "/home/floordata"
      })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});