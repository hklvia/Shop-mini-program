import {
  request
} from "../../request/shop.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口要的参数
  QueryParams: {
    keyWord: "",
    pageIndex: 1,
    pageSize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.keyWord = options.keyWord || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "product",
      method: 'post',
      data: this.QueryParams
    });
    // console.log(res.data)
    const porductList = res.data
    porductList.forEach(v => {
      v.ProductMainImg = JSON.parse(v.ProductMainImg)
    })
    this.setData({
      porductList
    })

    // 获取 总条数
    const total = res.Total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...porductList]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击item的索引
    const {
      index
    } = e.detail;
    // 2 修改原数据
    let {
      tabs
    } = this.data;
    // 修改被点击item的isActive
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据',
        icon: 'none'
      });

    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})