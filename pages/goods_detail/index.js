import {
  request
} from "../../request/shop.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false,
    showSku: false,
    // skuList:{},
    skuDisInfo: "",
    skus: [],
    proSkus: [],
    isAddCart: true
  },

  // 商品对象
  GoodsInfo: {},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      id
    } = options;
    this.getGoodsDetail(id);
  },

  // 获取商品详情数据
  async getGoodsDetail(id) {
    const goodsObj = await request({
      url: "product/getfull/",
      data: {
        id
      }
    });

    this.GoodsInfo = goodsObj.Product;

    // console.log(this.GoodsInfo);

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    // console.log(goodsObj);

    let isCollect = collect.some(v => v.ID === this.GoodsInfo.ID);
    goodsObj.Product.ProductSkuValues = JSON.parse(goodsObj.Product.ProductSkuValues)
    goodsObj.Product.ProductSlideImgs = JSON.parse(goodsObj.Product.ProductSlideImgs)
    goodsObj.Product.ProductDetail = JSON.parse(goodsObj.Product.ProductDetail)
    goodsObj.Product.ProductMainImg = JSON.parse(goodsObj.Product.ProductMainImg)

    let skuDisInfo = "请选择 "
    goodsObj.Product.ProductSkuValues.forEach(v => {
      v.selectedValue = null
      skuDisInfo += v.name + " "
    })

    this.setData({
      goodsObj: goodsObj.Product,
      // 收藏
      isCollect,
      skuDisInfo: skuDisInfo,
      // skus:resData.skus,
      proSkus: goodsObj.ProductSkus,
      // skuList:{
      //   skuImg:JSON.parse(goodsObj.Product.ProductMainImg),
      //   Stock:goodsObj.Skus.Stock,
      //   sku:goodsObj.Skus.map(v => v.ProductSku1)
      //   // Price:
      //   // skuName:new Set(goodsObj.Skus)
      // }
    })
  },

  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组 
    var ProductSlideImgs = this.GoodsInfo.ProductSlideImgs
    const urls = []
    ProductSlideImgs.forEach(v => {
      urls.push(v.CloudUrl)
    })
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击 加入购物车
  handleCartAdd(e) {
    var that = this
    // 点击skuInfo弹出两个按钮
    if (e.currentTarget.dataset.name == 'skuInfo') {
      this.setData({
        isAddCart: false,
        showSku: true
      });
      return;
      // 点击加入购物车弹出一个按钮
    } else if (e.currentTarget.dataset.name == 'catBtn') {
      this.setData({
        isAddCart: true,
        showSku: true
      });
      return;
      // 点击确认按钮加入购物车
    } else if (e.currentTarget.dataset.name == 'ConfirmAddCart') {
      // 1 获取缓存中的购物车， || []转换成数组格式
      let cart = wx.getStorageSync("cart") || [];

      // 2 判断 商品对象是否存在于购物车数组中
      let index = cart.findIndex(v => v.ID === this.GoodsInfo.ID);
      if (index === -1) {
        //3  不存在 第一次添加
        that.GoodsInfo.num = 1;
        that.GoodsInfo.checked = true;
        that.GoodsInfo.skuSelected = this.data.skuDisInfo;
        that.GoodsInfo.skuIfo = this.data.skuList;
        cart.push(that.GoodsInfo);
      } else {
        // 4 已经存在购物车数据 执行 num++
        cart[index].num++;
      }
      // 5 把购物车重新添加回缓存中
      wx.setStorageSync("cart", cart);
      // 6 弹窗提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        // true 防止用户 手抖 疯狂点击按钮 
        mask: true
      });
    }

    // this.setData({});
  },

  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过 
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }

    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);

    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
  },

  onClose() {
    this.setData({
      showSku: false
    });
    let skuDisInfo = ""
    let {
      goodsObj
    } = this.data
    // console.log(goodsObj);

    goodsObj.ProductSkuValues.forEach(v => {
      if (v.selectedValue != null) {
        skuDisInfo += v.selectedValue + " "
      }
    })
    if (skuDisInfo != "") {
      this.setData({
        skuDisInfo: "已选择 " + skuDisInfo
      })
    }
  },

  // 点击sku按钮
  handleSkuChange(event) {
    const {
      attrname,
      attrvalue
    } = event.currentTarget.dataset
    let {
      goodsObj
    } = this.data
    let {
      proSkus
    } = this.data
    // console.log(this.data);

    goodsObj.ProductSkuValues.forEach(v => {
      if (v.name == attrname) {
        v.selectedValue = attrvalue
      }
    })
    this.setData({
      goodsObj
    })
    let skuDisInfo = ""
    let skuList = []
    goodsObj.ProductSkuValues.forEach(v => {
      if (v.selectedValue != null) {
        skuDisInfo += v.selectedValue + ""
        skuList.push(v.selectedValue)
        if (v.IsImg == 1) {
          v.values.forEach(element => {
            if (v.selectedValue == element.value) {
              this.setData({
                "goodsObj.Img": element.SkuImg.CloudUrl
              })
            }
          });
        }
      }
    })

    proSkus.forEach(v => {
      v.ProductSkuValues = []
      JSON.parse(v.ProductSku1).forEach(v_sku => {
        v.ProductSkuValues.push(v_sku.value)
      })
      if (skuList.toString() == v.ProductSkuValues.toString()) {
        console.log(v);
        this.setData({
          'goodsObj.Price': v.Price,
          'goodsObj.Stock': v.Stock
        })
      }
    })

    if (skuDisInfo != "") {
      this.setData({
        skuDisInfo: "已选择 " + skuDisInfo
      })
    }
  }
})