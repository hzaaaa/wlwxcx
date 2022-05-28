// app.js
import request from '/utils/request'
wx.$errorTip=function(){
  wx.showToast({
    title: '请求错误',
    icon: 'error',
    duration: 2000
  })
}
wx.$errorTip2=function(message){
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}
wx.$successTip=function(message){
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 2000
  })
}
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
                // res2.code=-9017;
                if(res2.code===-9016){
                  //没有此账户信息，请联系管理员！
                  wx.showToast({
                    title: res2.msg,
                    icon: 'error',
                    duration: 2000
                  })
                }else if(res2.code===-9017){
                  //"没有授权，请授权！"
                  wx.redirectTo({
                    url:'/pages/login/login'
                  })
                }else if(res2.code===0){
                  //登录成功
                  // debugger
                  wx.setStorageSync('userInfo',JSON.stringify(res2.data))
                  wx.reLaunch( {
                    url:'/pages/index/index'
                  })
                  //test
                  // wx.navigateTo({
                  //   // url:'/pages/index/childPages/power/socket/socket'
                  //   // url:'/pages/index/childPages/power/power'
                  //   // url:'/pages/index/childPages/power/lock/lock'
                  //   // url:'/pages/index/childPages/water/water'
                  //   // url:'/pages/index/childPages/dataOverview/dataOverview'
                  //   // url:'/pages/index/childPages/repair/repair' 
                  //   // url:'/pages/index/childPages/debugging/debugging'
                  //   // url:'/pages/index/childPages/install/install'
                  //   // url:'/pages/myspace/useRecord/useRecord'
                  //   // url:'/pages/myspace/myAppointment/myAppointment'
                  //   // url:'/pages/myspace/myRepair/myRepair'
                  // })
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
