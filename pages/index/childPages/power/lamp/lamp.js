// pages/index/childPages/power/socket/socket.js
import request from '../../../../../utils/request.js'
import mixinUtils from '../../../../../utils/mixinUtils.js'
import mixinCommon from '../common.js'


mixinUtils({
  mixins: [mixinCommon],
  /**
   * 页面的初始数据
   */
  data: {
    deviceData: null,
    editData: null
  },
  stateChange(event) {
    // debugger
    this.data.editData.userState = event.detail.value ? 1 : 0;
    this.setData({
      editData: this.data.editData
    })
    console.log(this.data.editData.userState);
  },
  lampStateChange(event) {
    console.log(event.detail);
    console.log(event)
    
    this.data.lampSateArray = event.detail.value;
    
    if(this.data.lampSateArray.length===this.data.deviceData.lampType){
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

     
  
  if(event.detail.value.length===1){
    let arr=[];
    for(let i=0;i<this.data.deviceData.lampType;i++){
      arr.push(i);
    }
    this.setData({
      select1:true,
      select2:true,
      select3:this.data.deviceData.lampType===3,
      lampSateArray:arr
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
  modeChange(event) {
    console.log(event.detail);
    this.data.editData.powerOnMode = event.detail.value;
    this.setData({
      editData: this.data.editData
    })
  },
  confirmUpdate() {
    let str = this.getTimeStr(this.data.dateTime, this.data.dateTimeArray);
    this.data.editData.startTime = str;
    str = this.getTimeStr(this.data.dateTime1, this.data.dateTimeArray1);
    this.data.editData.endTime = str;

    if(this.data.editData.powerOnMode==='1'&&this.data.editData.startTime>=this.data.editData.endTime){
      wx.$errorTip2('结束时间必须大于开始时间')
      return;
    }

    //初始化灯状态
    let arr = [];
    for (let i = 0; i < this.data.editData.lampType >>> 0; i++) {
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
    this.data.editData.lampSate = arr.toString();
    console.log(this.data.editData);
    // return
    request('/weChat/editLamp', this.data.editData, 'POST').then(res => {
      // debugger
      if (res.code === 0) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          complete: () => {
            setTimeout(() => {
              this.gotoPage();
            }, 1000)
          }
        })

      } else {
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
    console.log('onload');

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
    eventChannel.on('acceptDataFromOpenerPage', data => {
      console.log(data);
      // data.data.lampType=1;
      this.setData({
        deviceData: data.data,
        editData: JSON.parse(JSON.stringify(data.data))
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