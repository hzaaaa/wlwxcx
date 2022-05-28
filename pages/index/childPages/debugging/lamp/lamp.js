import request from '../../../../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imei:'',
    openSuccess:false,
    closeSuccess:false,
    lampSateArray:null,
    checkedAll:null
  },
  openPower(){
    
    this.airSwitchRemotePowerOnOff(1);
  },
  closePower(){
    
    this.airSwitchRemotePowerOnOff(0);
  },
  lampStateChange(event) {
    console.log(event.detail);
    console.log(event)

    this.data.lampSateArray = event.detail.value;
    
    if(this.data.lampSateArray.length===3){
      this.setData({
        checkedAll:true
      })
    }else{
      this.setData({
        checkedAll:false
      })
    }
  },
  lampStateChange2(event) {
    console.log(event.detail);
    console.log(event)

     event.detail.value;
    
    if(event.detail.value.length===1){
      this.setData({
        select1:true,
        select2:true,
        select3:true,
        lampSateArray:['1','2','0']
      })
    }else{
      this.setData({
        select1:false,
        select2:false,
        select3:false,
        lampSateArray:[]
      })
    }
  },
  airSwitchRemotePowerOnOff(userState ){
    //初始化灯状态
    let arr = [];
    for (let i = 0; i < 3 ; i++) {
      arr.push(0);
    }
    //修改灯状态
    let lampSateArray = this.data.lampSateArray || [];
    for (let i = 0; i < lampSateArray.length; i++) {
      if (lampSateArray[i] === 'all') {
        arr.forEach((v, i, arr) => {
          arr[i] = 1;
        })
        break;
      }
      arr[lampSateArray[i]] = 1;
    }
    console.log(arr);


    request('/weChat/lampRemotePowerOnOff',{
      imei:this.data.imei,
      userState,
      lampSate:arr.toString()
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
    this.setData({
      imei:options.imei
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