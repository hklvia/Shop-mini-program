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
    // wx.setStorageSync("refreshToken", token.refreshToken);
    // wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})