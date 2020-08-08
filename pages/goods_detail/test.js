let ajaxTime = 0
export const request = (params) => {
  ajaxTime++
  wx.showLoading({
    title: "加载中...",
    mask: true
  });
  const baseUrl = "http://localhost:53689/api" //net api 接口
  //const baseUrl = "http://127.0.0.1:8002/api" //python api接口
  let token = wx.getStorageSync('token');
  let header = {
    'content-type': 'application/json'
  }
  if (token) {
    header['Authorization'] = token
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header: header,
      success: (result) => {
        console.log(result.statusCode);
        if (result.statusCode == 200) {
          resolve(result.data.data)
        } else if (result.statusCode == 401) {
          //获取refreshToken
          const refreshToken = wx.getStorageSync('refreshToken');
          if (!refreshToken) { //refreshToken过期
            wx.navigateTo({
              url: '/pages/login/login'
            });
            return
          }

          //刷新token
          wx.request({
            url: baseUrl + '/auth/getTokenByRefreshToken',
            data: {
              rToken: refreshToken
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: (result) => {
              wx.setStorageSync("token", result.data.data.token);
              wx.setStorageSync("refreshToken", result.data.data.refreshToken);
              //携带新的token重新发起请求
              var reqTask = wx.request({
                ...params,
                url: baseUrl + params.url,
                header: {
                  'content-type': 'application/json',
                  'Authorization': result.data.data.token
                },
                success: (result) => {
                  resolve(result.data.data)
                }
              });
            }
          });
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTime--
        if (ajaxTime == 0) {
          wx.hideLoading();
        }
      }
    });
  })
}

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}