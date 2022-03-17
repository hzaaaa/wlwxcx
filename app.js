// app.js
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          // debugger
          console.log(res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
