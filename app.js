// app.js
import request from '/utils/request'
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.login();
    
  },
  
  login(){
    //获取code
    wx.login({
      success (res) {
        if (res.code) {
          request('/system/wxlogin',{code:res.code},'post').then(res1=>{
          // request('/system/wxlogin?code='+res.code,{code:res.code},'post').then(res1=>{
            console.log(res1)
            if(res1.openid){  
              wx.setStorageSync('openid', res1.openid);
              wx.setStorageSync('session_key', res1['session_key']);
              request('/weChat/login',{openid:res1.openid}).then(res2=>{
                console.log(res2)
                
                if(res2.code===-9016){
                  //没有此账户信息，请联系管理员！
                  wx.showToast({
                    title: res2.msg,
                    icon: 'error',
                    duration: 2000
                  })
                }else if(res2.code===-9017){
                  //"没有授权，请授权！"
                  wx.navigateTo({
                    url:'/pages/login/login'
                  })
                }else if(res2.code===0){
                  //登录成功
                  // debugger
                  wx.setStorageSync('userInfo',JSON.stringify(res2.data))
                  // wx.reLaunch( {
                  //   url:'/pages/index/index'
                  // })
                  //test
                  wx.navigateTo({
                    // url:'/pages/index/childPages/power/socket/socket'
                    url:'/pages/index/childPages/power/power'
                  })
                }else{
                  wx.showToast({
                    title: res2.msg,
                    icon: 'error',
                    duration: 2000
                  })
                }
                
              })
            }else{
              //code错误
              wx.showModal({
                title: '登陆失败',
                content: '无效的登录凭证',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                  wx.exitMiniProgram();
                }
              })
              
            }
            
          }).catch(err=>{
            console.log(err)
          })
        } else {
          console.log('登录失败！', res.errMsg)
        }
      }
    })
  },
  
})
