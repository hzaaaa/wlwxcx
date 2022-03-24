// pages/index/childPages/power/socket/socket.js
import request from '../../../../../utils/request.js'
import mixinUtils from '../../../../../utils/mixinUtils.js'
import mixinCommon from '../../power/common.js'


mixinUtils({
  mixins:[mixinCommon],
  /**
   * 页面的初始数据
   */
  data: {
    deviceData:null,
    editData:null
  },
  gotoPage() {
    // debugger
    wx.navigateTo({
      url: '/pages/index/childPages/water/water',
    })
  },
  stateChange(event){
    // debugger
    this.data.editData.userState= event.detail.value?1:0;
    this.setData({
      editData:this.data.editData
    })
    console.log(this.data.editData.userState);
  },
  dianliuChange(event){
    console.log(event.detail);
    this.data.editData.electric= event.detail.value;
  },
  modeChange(event){
    console.log(event.detail);
    this.data.editData.powerOnMode= event.detail.value;
    this.setData({
      editData:this.data.editData
    })
  },
  confirmUpdate(){
    let str = this.getTimeStr(this.data.dateTime,this.data.dateTimeArray);
    this.data.editData.startTime= str;
    str = this.getTimeStr(this.data.dateTime1,this.data.dateTimeArray1);
    this.data.editData.endTime= str;

    console.log(this.data.editData);
    request('/weChat/editWaterMeter',this.data.editData,'POST').then(res=>{
      debugger
      if(res.code===0){
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          complete:()=>{
            setTimeout(()=>{
              this.gotoPage();
            },1000)
          }
        })
        
      }else{
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 1000,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // debugger
    console.log('onload')
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
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data=> {
      console.log(data);
      this.setData({
        deviceData:data.data,
        editData:JSON.parse(JSON.stringify(data.data)) 
      })
    })
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