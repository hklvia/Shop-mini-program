// 同时发送异步代码的次数
let ajaxTimes = 0;
// 专门处理请求,封装请求
const baseUrl = "http://localhost:50070/api/"
let token = wx.getStorageSync('token');
let header = {
  "Content-Type": "application/json"
}

export const request = (params) => {
  ajaxTimes = 1;
  console.log("ajaxTimes增加1位，当前" + ajaxTimes);
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  if (params.url.includes("Order") && token && token.TokenExpire > Date.now()) {
    header['Authorization'] = wx.getStorageSync('token').Token
    console.log("访问" + params.url + "页面，token有效，直接访问");
    return CommonPromise(params)
  } else if (params.url.includes("Order") && token && token.RefreshTokenExpire > Date.now()) {
    // let token = wx.getStorageSync('token');
    return refreshTokenPromise(token)
      .then(result => {
        console.log("访问" + params.url + "页面，使用RefreshToken获取的token，返回" + result.data.Code);
        wx.setStorageSync("token", result.data.Data);
        token=result.data.Data
        header['Authorization'] = result.data.Data.Token
        return CommonPromise(params)
      })
  } else if (params.url.includes("Order")) {
    console.log("访问" + params.url + "页面，所有token无效，跳转登陆页面");
    wx.navigateTo({
      url: '/pages/login/index'
    });
    ajaxTimes = 0;
    return
  } else {
    console.log("访问非order页面：" + params.url + "，直接访问");
    return CommonPromise(params)
  }
}

const refreshTokenPromise = token => {
  return new Promise((resolve, reject) => {
    console.log("token无效，使用RefreshToken刷新");
    wx.request({
      url: baseUrl + '/auth/getTokenByRefreshToken',
      data: {
        rToken: token.RefreshToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: result => {
        if (result.statusCode == 401 || result.statusCode == 500 || result.data.Code == 500) {
          console.log("使用RefreshToken刷新token失败，跳转登录页");
          wx.navigateTo({
            url: '/pages/login/index'
          });
          ajaxTimes = 0;
          return
        }
        resolve(result)
      },

      fail: (err) => {
        reject(err);
      },

      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}

const CommonPromise = params => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header: header,
      success: (result) => {
        console.log("访问" + params.url + "页面，返回：" + result.data.Code);
        if (result.statusCode == 200 && result.data.Code == 200) {
          console.log(result.data);
          resolve(result.data.Data)
        } else if (result.statusCode == 401 || result.statusCode == 500 || result.data.Code == 500) {
          wx.navigateTo({
            url: '/pages/login/index'
          });
          ajaxTimes = 0;
        }
      },

      fail: (err) => {
        reject(err);
      },

      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}