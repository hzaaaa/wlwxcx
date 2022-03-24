// pages/index/childPages/power/socket/socket.js
import request from '../../../../../utils/request.js'
import mixinUtils from '../../../../../utils/mixinUtils.js'
import mixinCommon from '../common.js'


mixinUtils({
  mixins:[mixinCommon],
  /**
   * 页面的初始数据
   */
  data: {
    deviceData:null,
    editData:null,
    fengxiangValue:null,
    fengxiangList:[
      {
        name:'扫风',
        value:'0'
      },
      {
        name:'向上',
        value:'1'
      },
      {
        name:'中',
        value:'2'
      },
      {
        name:'向下',
        value:'3'
      },
    ],
    qiangduValue:null,
    qiangduList:[
      {
        name:'自动',
        value:'1'
      },
      {
        name:'低',
        value:'2'
      },
      {
        name:'中',
        value:'3'
      },
      {
        name:'高',
        value:'4'
      },
    ],
    temperature:28,
  },
  addOne(){
    this.setData({
      temperature:this.data.temperature+1
    })
  },
  reduceOne(){
    this.setData({
      temperature:this.data.temperature-1
    })
  },
  temperatureChange(event){
    this.setData({
      temperature:event.detail.value
    })
  },
  fengxiangChange(event){
    this.setData({
      fengxiangValue:event.currentTarget.id
    })
  },
  qiangduChange(event){
    this.setData({
      qiangduValue:event.currentTarget.id
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
  modeChange2(event){
    console.log(event.detail);
    this.data.editData.pattern= event.detail.value;
    
  },
  confirmUpdate(){
    let str = this.getTimeStr(this.data.dateTime,this.data.dateTimeArray);
    this.data.editData.startTime= str;
    str = this.getTimeStr(this.data.dateTime1,this.data.dateTimeArray1);
    this.data.editData.endTime= str;

    this.data.editData.temperature=this.data.temperature+'';
    this.data.editData.manualdirection=this.data.fengxiangValue;
    this.data.editData.volume=this.data.qiangduValue;


    this.data.editData.userState=this.data.editData.userState.toString();


    console.log(this.data.editData);
    debugger
    request('/weChat/editAirConditioner',this.data.editData,'POST').then(res=>{
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
// Page({
//   gotoPage() {
//     wx.navigateTo({
//       url: '/pages/index/childPages/power/power',
//     })
//   },
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     dateTime1: null,//时间所在数组位置
//     dateTimeArray1: null,//时间范维数组
//     dateTime: null,
//     dateTimeArray: null,
//     deviceData:null,
//     editData:null
//   },
//   stateChange(event){
//     // debugger
//     this.data.editData.userState= event.detail.value?1:0;
//     this.setData({
//       editData:this.data.editData
//     })
//     console.log(this.data.editData.userState);
//   },
//   dianliuChange(event){
//     console.log(event.detail);
//     this.data.editData.electric= event.detail.value;
//   },
//   modeChange(event){
//     console.log(event.detail);
//     this.data.editData.powerOnMode= event.detail.value;
//     this.setData({
//       editData:this.data.editData
//     })
//   },
//   changeDateTime(e) {
//     this.setData({
//       dateTime: e.detail.value
//     });
//     let str = this.getTimeStr(this.data.dateTime,this.data.dateTimeArray);
//     this.data.editData.startTime= str;
    
//   },
//   getTimeStr(dateTime,dateTimeArray){
//     let str = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${dateTimeArray[2][dateTime[2]]} ${dateTimeArray[3][dateTime[3]]}:${dateTimeArray[4][dateTime[4]]}`;
//     return str;
//   },
//   changeDateTime1(e) {
//     this.setData({
//       dateTime1: e.detail.value
//     });
//     let str = this.getTimeStr(this.data.dateTime1,this.data.dateTimeArray1);
//     this.data.editData.endTime= str;
    
    
//   },
//   changeDateTimeColumn(e) {
//     console.log(e)
//     var arr = this.data.dateTime,
//       dateArr = this.data.dateTimeArray;

//     arr[e.detail.column] = e.detail.value;
//     dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

//     this.setData({
//       dateTimeArray: dateArr,
//       dateTime: arr
//     });
//   },
//   changeDateTimeColumn1(e) {
//     console.log(e)
//     var arr = this.data.dateTime1,
//       dateArr = this.data.dateTimeArray1;

//     arr[e.detail.column] = e.detail.value;
//     dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

//     this.setData({
//       dateTimeArray1: dateArr,
//       dateTime1: arr
//     });
//   },
//   confirmUpdate(){
//     request('/weChat/editSocket',this.data.editData,'POST').then(res=>{
//       debugger
//     })
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad() {
//     // 获取完整的年月日 时分秒，以及默认显示的数组
//     var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
//     var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
//     // 精确到分的处理，将数组的秒去掉
//     var lastArray = obj.dateTimeArray.pop();
//     var lastTime = obj.dateTime.pop();
//     lastArray = obj1.dateTimeArray.pop();
//     lastTime = obj1.dateTime.pop();
//     console.log(obj)
//     this.setData({
//       dateTime: obj.dateTime,
//       dateTimeArray: obj.dateTimeArray,
//       dateTimeArray1: obj1.dateTimeArray,
//       dateTime1: obj1.dateTime
//     });
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
//     const eventChannel = this.getOpenerEventChannel()
//     eventChannel.on('acceptDataFromOpenerPage', data=> {
//       console.log(data);
//       this.setData({
//         deviceData:data.data,
//         editData:JSON.parse(JSON.stringify(data.data)) 
//       })
//     })
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })