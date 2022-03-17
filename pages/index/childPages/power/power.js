// pages/index/childPages/powercontrol/power.js
Page({
  gotoPage(e){
    if(e.currentTarget.id==='index'){
      wx.reLaunch( {
        url:'/pages/index/index'
      })
    }else{
      wx.navigateTo({
        url:'/pages/index/childPages/power/socket/socket'
      })
    }
  },
  selectItemTap(e){
    // console.log(e);
    this.setData({
      selectIndex:parseInt(e.currentTarget.id)
    })
  },
  switchMulChoi(){
    if(this.data.mulChoi.isMul){
      this.setData({
        mulChoi:{
          isMul:false,
          mulChoiName:'多选设备'
        }
      })
    }else{
      this.setData({
        mulChoi:{
          isMul:true,
          mulChoiName:'退出多选'
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    array: [['校园']],
    index:0,
    
    itemArray:[''],
    selectArray:['全部','智能插座','智能空开','智能门锁','空调','灯','一体机'],
    selectIndex:1,
    mulChoi:{
      isMul:false,
      mulChoiName:'多选设备'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})