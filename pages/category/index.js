import {
  request
} from "../../request/shop.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 是否被点击
    currentIndex: 0
  },

  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 首先判断本地是否有存储数据
    const Cates = wx.getStorageSync("cates");

    if (!Cates) {
      // 如果没有数据就发送请求获取数据
      // 获取分类数据
      this.getCates();
    } else {
      // 有旧数据但是已经过期，就重新发送请求
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        // 有旧数据并且没有过期，就直接渲染列表
        this.Cates = Cates.data;
        // 获取左侧菜单列表
        let leftMenuList = this.Cates.map(v => v.Name);
        // 获取右侧商品数据
        let rightContent = this.Cates[0].children;
        rightContent.forEach(v => {
          v.children.forEach(v2 => {
            v2.Img = JSON.parse(v2.Img)
          })
        })

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  async getCates() {
    const res = await request({
      url: "ProductCategory/"
    });

    // this.setData是设置data中的数据
    this.Cates = res;

    // 把接口的数据存储到本地,添加一个当前时间，用于判断是否过期 
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    // 获取左侧菜单列表
    let leftMenuList = this.Cates.map(v => v.Name);
    // 获取右侧商品数据
    let rightContent = this.Cates[0].children;
    rightContent.forEach(v => {
      v.children.forEach(v2 => {
        v2.Img = JSON.parse(v2.Img)
      })
    })

    this.setData({
      leftMenuList,
      rightContent
    })
  },
  
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 获取点击的索引，根据索引获得右侧商品数据
    let {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    rightContent.forEach(v => {
      v.children.forEach(v2 => {
        if (typeof (v2.Img) == 'string') {
          v2.Img = JSON.parse(v2.Img)
        }
      })
    })
    this.setData({
      // 每次点击 设置滚动条初始位置
      scroolTop: 0,
      currentIndex: index,
      rightContent
    })
  }
})