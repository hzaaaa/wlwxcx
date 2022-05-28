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
    showPopup:false,

    deviceData:null,
    editData:null,
    zhiwen:{
      isFirst:true,
      firstText:'未录入指纹',
      firstEidt:'录入',
      text:'已录入指纹',
      eidt:'修改',
    },
    password:{
      isFirst:true,
      firstText:'未设置密码',
      firstEidt:'设置',
      text:'已设置密码',
      eidt:'修改',
    }
  },
  
  editPassword(){
    let _this =this;
    if(this.data.password.isFirst){
      this.setPassword();
    }else{
      wx.showModal({
        title: '修改密码',
        content: '修改后旧密码将无法使用，是否修改？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            _this.setPassword();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  setPassword(){
    // debugger
    this.setData({
      showPopup:true
    })
  },
  editZhiwen(){
    let _this=this;
    if(this.data.zhiwen.isFirst){
      _this.setZhiwen();
      
    }else{
      wx.showModal({
        title: '修改指纹',
        content: '修改后旧指纹将无法使用，是否修改？',
        success (res) {
          if (res.confirm) {
            _this.setZhiwen();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  setZhiwen(){
    request('/weChat/importGdDevices',{id:this.data.editData.id}).then(res=>{
      // debugger
      if(res.code===0){
        wx.showModal({
          title: '录入指纹',
          content: '请到门锁录入新指纹信息。',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 2000
        })
      }
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
  showByRes(res){
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
  },
  confirmUpdate(){
    let str = this.getTimeStr(this.data.dateTime,this.data.dateTimeArray);
    this.data.editData.startTime= str;
    str = this.getTimeStr(this.data.dateTime1,this.data.dateTimeArray1);
    this.data.editData.endTime= str;

    if(this.data.editData.powerOnMode==='1'&&this.data.editData.startTime>=this.data.editData.endTime){
      wx.$errorTip2('结束时间必须大于开始时间')
      return;
    }

    console.log(this.data.editData);

    if(this.data.editData.powerOnMode==='0'){
      //实时
      request('/weChat/selectOpenLock',{
        id:this.data.editData.id
      }).then(res=>{
        this.showByRes(res);
      })
    }else if(this.data.editData.powerOnMode==='1'){
      //预约
      request('/weChat/appointOpenLock',{
        id:this.data.editData.id,
        startTime:this.data.editData.startTime,
        endTime:this.data.editData.endTime,
      },'GET').then(res=>{
        this.showByRes(res);
      })
    }else{
      wx.showToast({
        title: '请选择开锁方式',
        icon: 'error',
        duration: 1000,
      })
    }

    
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
  updateState(){
    // debugger
    this.initZhiwenAndPassword();
  },
  initZhiwenAndPassword(){
    let p1 = request('/weChat/selectPassword',{id:this.data.editData.id});
    let p2 = request('/weChat/selectFingerprint',{id:this.data.editData.id});
    Promise.all([p1,p2]).then(([res1,res2])=>{
      console.log(res1,res2)
      // res1.data.length=1;
      // res2.data.length=1;
      if(res1.code===0){
        if(res1.data.length===0){
          this.data.password.isFirst=true;
        }else{
          this.data.password.isFirst=false;
        }
      }
      if(res2.code===0){
        if(res2.data.length===0){
          this.data.zhiwen.isFirst=true;
        }else{
          this.data.zhiwen.isFirst=false;
        }
      }
      this.setData({
        password:this.data.password,
        zhiwen:this.data.zhiwen,
      })
    })
    
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
      this.initZhiwenAndPassword()
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
