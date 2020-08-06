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
  let token=wx.getStorageSync('token');
  let header={
    "Content-Type":"application/json"
  }
  if (token) {
    header['Authorization']=token
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header:header,
      success: (result) => {
        resolve(result.data.Data);
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