import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import {
  request
} from "../../request/shop.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    skuSelected: "",
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({
      address
    });


    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.Price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击 支付 
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token 
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }

      // 3 创建订单
      // 3.1 准备 请求头参数
      // const header = { Authorization: token };
      // 3.2 准备 请求体参数
      const cart = this.data.cart;
      let MainOrder = {};
      let SubOrders = [];
      MainOrder.TotalPrice = this.data.totalPrice;
      MainOrder.Address = this.data.address.all;
      // console.log(cart);
      cart.forEach(v => SubOrders.push({
        ProductID: v.ID,
        Count: v.num,
        SkuID: v.SkuID,
        SkuInfo: v.skuSelected,
        ProductPrice: v.Price
      }))

      const orderParams = {
        MainOrder,
        SubOrders
      };
      // console.log(orderParams);

      // 4 准备发送请求 创建订单 获取订单编号
      const Data = await request({
        url: "Order",
        method: "POST",
        data: orderParams
      })
      console.log(Data);


      // 5 发起 预支付接口
      // const {
      //   pay
      // } = await request({
      //   url: "/my/orders/req_unifiedorder",
      //   method: "POST",
      //   data: {
      //     OrderNum
      //   }
      // });

      // // 6 发起微信支付 
      // await requestPayment(pay);

      // // 7 查询后台 订单状态
      // const res = await request({
      //   url: "/my/orders/chkOrder",
      //   method: "POST",
      //   data: {
      //     OrderNum
      //   }
      // });
      // await showToast({
      //   title: "支付成功"
      // });
      // // 8 手动删除缓存中 已经支付了的商品
      // let newCart = wx.getStorageSync("cart");
      // newCart = newCart.filter(v => !v.checked);
      // wx.setStorageSync("cart", newCart);

      // // 8 支付成功了 跳转到订单页面
      // wx.navigateTo({
      //   url: '/pages/order/index'
      // });

    } catch (error) {
      await showToast({
        title: "支付失败"
      })
      console.log(error);
    }
  }
})