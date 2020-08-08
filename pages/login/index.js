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
    console.log(code);

    // 获取token
    const token = await request({
      url: "auth/getToken",
      data: {
        userInfo,
        code
      },
      method: "post"
    })

    wx.setStorageSync("token", token.token);
    wx.setStorageSync("refreshToken", token.refreshToken);
    // wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})