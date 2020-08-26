import {
  request
} from "../../request/shop.js";
import {
  login
} from "../../utils/asyncWx.js";
Page({
  async handleGetUserInfo(e) {
    const {
      userInfo
    } = e.detail;
    const {
      code
    } = await login()
    wx.setStorageSync("userinfo", userInfo);
    // 获取token
    const token = await request({
      url: "auth/getToken",
      data: {
        userInfo,
        code
      },
      method: "post",
    })
    console.log(token);
    wx.setStorageSync("token", token);
    wx.navigateBack({
      delta: 1
    });
  }
})