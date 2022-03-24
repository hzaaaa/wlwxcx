// index.js
Page({
  goto(event){
    console.log(event.currentTarget.id)
    let pageID = event.currentTarget.id;
    wx.navigateTo({
      url:`/pages/index/childPages/${pageID}/${pageID}`
    })
  }
})
