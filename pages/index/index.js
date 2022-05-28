// index.js
Page({
  goto(event) {
    console.log(event.currentTarget.id)
    let pageID = event.currentTarget.id;
    wx.navigateTo({
      url: `/pages/index/childPages/${pageID}/${pageID}`
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '云物联',
      desc: '',
      path: '/pages/index/index' // 路径，传递参数到指定页面。
    }
  }
})