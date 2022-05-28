import request from '../../../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    hardwareType:'',
    imei: '',
    remotePowerOnSuccess: false,
    remotePowerOffSuccess: false,
    bluetoothPowerOnSuccess: false,
    bluetoothPowerOffSuccess: false,

    redPopupShow: false,
    brandList: [],
    brandIndex: 0,
    modelList: [],
    modelIndex: 0,

    modelPopupShow:false

  },
  sendCommand(){
    request('/weChat/sendInstructions',{
      imei:this.data.imei,
      vrvId:this.data.modelList[this.data.modelIndex].id
    }).then(res=>{
      console.log(res);
      if(res.code===0){
        //成功
        this.setData({
          redPopupShow:false,
          modelPopupShow:true
        })
      }else{
        wx.$errorTip2('请求错误')
      }
    })
    
  },

  brandChange(event) {
    console.log(event);
    this.setData({
      brandIndex: event.detail.value >>> 0
    })
    let brand_cn = this.data.brandList[this.data.brandIndex].brand_cn;
    this.queryBrandModel(brand_cn)
  },
  modelChange(event) {
    this.setData({
      modelIndex: event.detail.value >>> 0
    })
  },
  //不正确回退
  noRight(){
    this.setData({
      redPopupShow:true,
      modelPopupShow:false
    })
  },
  //正确关闭
  right(){
    this.closeModelPopup();
  },
  closeModelPopup(){
    this.setData({
      modelPopupShow: false
    })
  },
  openRedPopup() {
    this.setData({
      redPopupShow: true
    })
  },
  closeRedPopup() {
    this.setData({
      redPopupShow: false
    })
  },
  remotePowerOnOff(userState) {
    request('/weChat/remotePowerOnOff', {
      imei: this.data.imei,
      userState
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        if (userState === 1) {
          this.setData({
            remotePowerOnSuccess: true
          })
        } else {
          this.setData({
            remotePowerOffSuccess: true
          })
        }
      } else {
        wx.$errorTip();
      }
    })
  },
  yitijiOn(){
    this.queryintegratedMachine(1)
  },
  yitijiOff(){
    this.queryintegratedMachine(0)
  },
  queryintegratedMachine(userState){
    request('/weChat/integratedMachine', {
      imei: this.data.imei,
      userState
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        if (userState === 1) {
          wx.$successTip('开启成功')
        } else {
          wx.$successTip('关闭成功')
        }
      } else {
        wx.$errorTip();
      }
    })
  },
  remotePowerOn() {

    this.remotePowerOnOff(1);

  },
  remotePowerOff() {

    this.remotePowerOnOff(0);
  },
  //请求蓝牙命令码
  queryBluetoothCode(userState) {
    request('/weChat/bluetoothPowerOnOff', {
      imei: this.data.imei,
      userState
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        //蓝牙命令码
        console.log(res.data)
        this.operateBluetooth(res.data,userState);
      } else {
        wx.$errorTip();
      }
    })
  },
  operateBluetooth(code,userState) {
    console.log(code);
    //在此将code写入到蓝牙


    //写入成功后改变按钮颜色
    if(userState===0){
      this.setData({
        bluetoothPowerOffSuccess: true
      })
    }else{
      this.setData({
        bluetoothPowerOnSuccess: true
      })
    }



  },
  bluetoothPowerOn() {
    //蓝牙通电
    this.queryBluetoothCode(1);
  },
  bluetoothPowerOff() {
    //蓝牙断电
    this.queryBluetoothCode(0);
  },
  //查询空调品牌
  queryBrand() {
    request('/weChat/selectAirConditioningBrand', {
      brandCn: '',
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setData({
          brandList: res.data
        })
        if (res.data[0]) {
          this.queryBrandModel(res.data[0].brand_cn)
        }

      }
    })
  },
  //查询品牌型号
  queryBrandModel(brandCn) {
    request('/weChat/selectAirConditioningModel', {
      brandCn,
      model: ''
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        this.setData({
          modelList: res.data,
          modelIndex: 0
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let hardwareType=options.hardwareType;
    this.setData({
      imei: options.imei,
      hardwareType,
      name:(hardwareType==='7'?'空调':
            hardwareType==='1'?'插座':'一体机')
    })
    this.queryBrand();
  },
  debuggingOver() {
    wx.reLaunch({
      url: '/pages/index/index'
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