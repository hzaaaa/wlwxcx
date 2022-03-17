// index.js
Page({
  goto(pageName){
    console.log(pageName)
    wx.navigateTo({
      url:'/pages/index/childPages/power/power'
    })
  }
})
