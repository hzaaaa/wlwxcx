import request from '../../../../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    hardwareType:'',
    imei:'',
    openSuccess:false,
    closeSuccess:false,
  },
  openPower(){
    
    this.airSwitchRemotePowerOnOff(1);
  },
  closePower(){
    
    this.airSwitchRemotePowerOnOff(0);
  },
  airSwitchRemotePowerOnOff(userState ){
    request('/weChat/airSwitchRemotePowerOnOff',{
      imei:this.data.imei,
      userState
    }).then(res=>{
      console.log(res)
      if(res.code===0){
        if(userState===1){
          this.setData({
            openSuccess:true
          })
          wx.$successTip('开启成功')
        }else{
          this.setData({
            closeSuccess:true
          })
          wx.$successTip('关闭成功')
        }
        
      }else{
        wx.$errorTip();
      }
      
    })
  },
  debuggingOver(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let hardwareType=options.hardwareType;
    this.setData({
      imei:options.imei,
      hardwareType,
      name:(hardwareType==='2'?'空开':'水表')
    })
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