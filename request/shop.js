// 同时发送异步代码的次数
let ajaxTimes = 0;
// 专门处理请求,封装请求
export const request = (params) => {
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  // 定义公共的url
  const baseUrl = "http://localhost:10549/api/"
  let token = wx.getStorageSync('token');

  let header = {
    "Content-Type": "application/json"
  }
  if (token) {
    header['Authorization'] = token.Token
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header: header,
      success: (result) => {
        // resolve(result.data.Data);
        console.log(result.statusCode);
        if (result.statusCode == 200 && result.data.Code == 200) {
          resolve(result.data.Data)
        } else if (result.statusCode == 401 || result.statusCode == 500 || result.data.Code == 500) {
          //获取refreshToken
          const token = wx.getStorageSync('token');
          if (!token.RefreshToken) { //refreshToken过期
            wx.navigateTo({
              url: '/pages/login/index'
            });
            return
          }

          //刷新token
          wx.request({
            url: baseUrl + '/auth/getTokenByRefreshToken',
            data: {
              rToken: token.RefreshToken
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: (result) => {
              // 检测refreshToken是否过期
              if (result.statusCode == 401 || result.statusCode == 500 || result.data.Code == 500) {
                wx.navigateTo({
                  url: '/pages/login/index'
                });
                return
              }

              wx.setStorageSync("token", result.data.Data);
              // wx.setStorageSync("refreshToken", result.data.Data.RefreshToken);
              //携带新的token重新发起请求
              var reqTask = wx.request({
                ...params,
                url: baseUrl + params.url,
                header: {
                  'content-type': 'application/json',
                  'Authorization': result.data.Data.Token
                },
                success: (result) => {
                  resolve(result.data.Data)
                }
              });
            }
          });
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}