// pages/index/childPages/powercontrol/power.js
import request from '../../../../utils/request.js'
import eventBus from '../../../../utils/eventBus.js'
Page({
  gotoPage(e) {
    if (e.currentTarget.id === 'index') {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      let id=e.currentTarget.id;
      request('/weChat/selectSingle',{id}).then(res=>{
        if(res.code===0){
          wx.navigateTo({
            url: '/pages/index/childPages/power/socket/socket',
            success: function(res1) {
              // 通过eventChannel向被打开页面传送数据
              res1.eventChannel.emit('acceptDataFromOpenerPage', { data:res.data })
            }
          })
        }else{
          console.log('获取设备详情失败',res)
        }
      })
      // let item = this.data.deviceList
      
    }
  },
  selectCategoryTap(e) {
    // console.log(e);
    this.setData({
      categoryId: e.currentTarget.id
    })
    
    this.queryDeviceList(e.currentTarget.id,...this.getIdFromList())
  },
  switchMulChoi() {
    if (this.data.mulChoi.isMul) {
      this.setData({
        mulChoi: {
          isMul: false,
          mulChoiName: '多选设备'
        }
      })
    } else {
      this.setData({
        mulChoi: {
          isMul: true,
          mulChoiName: '退出多选'
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    selectList: {
      campus: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
      build: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
      floor: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
      room: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
    },


    deviceList: null,
    deviceCategoryList: ['全部', '智能插座', '智能空开', '智能门锁', '空调', '灯', '一体机'],
    categoryId: '',
    mulChoi: {
      isMul: false,
      mulChoiName: '多选设备'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取校区楼栋位置信息
    Promise.all([request('/weChat/campus'), request('/weChat/build')]).then(res => {
      console.log(res)
      let [campusList, buildList] = res;
      if (campusList.data.length === 0 && buildList.data.length !== 0) {
        //无校区,有楼栋
        // 
        buildList.data=[{
          spaceName:'全部',
          id:''
        },...buildList.data]
        this.data.selectList.build.array = buildList.data;
        this.setData({
          selectList: this.data.selectList
        })
        this.getNextInfo('build', buildList.data[0].id);
      } else if (campusList.data.length !== 0 && buildList.data.length === 0) {
        //有校区
        // 
        campusList.data=[{
          spaceName:'全部',
          id:''
        },...campusList.data]
        this.data.selectList.campus.array = campusList.data;
        this.setData({
          selectList: this.data.selectList
        })
        this.getNextInfo('campus', campusList.data[0].id);
      } else {

        console.log(res, '获取设备位置列表失败')
      }

    }, err => {
      console.log(err)
    })
    //查询设备类型
    request('/weChat/category').then(res=>{
      if(res.code===0){
        res.data=[{
          id:'',
          deviceType:'全部'
        },...res.data]
        this.setData({
          deviceCategoryList:res.data
        })
      }else{
        console.log('获取设备类型失败',res.msg)
      }
      
    },err=>{
      console.log('获取设备类型失败',err)
    })
    //查询设备列表
    this.queryDeviceList();
    
  },
  queryDeviceList(categoryId='',campusId='',buildId='',floorId='',roomId=''){
    request('/weChat/selectCentralizedControl',{categoryId,campusId,buildId,floorId,roomId}).then(res=>{
      // 
      if(res.code===0){
        this.setData({
          deviceList:res.data
        })
      }else{
        console.log('获取设备列表失败',res)
      }
    },err=>{
      console.log('获取设备列表失败',err)
    })
  },
  getIdFromList(){
    let ids=[];
    ids.push(this.data.selectList.campus.array[this.data.selectList.campus.index].id);
    ids.push(this.data.selectList.build.array[this.data.selectList.build.index].id);
    ids.push(this.data.selectList.floor.array[this.data.selectList.floor.index].id);
    ids.push(this.data.selectList.room.array[this.data.selectList.room.index].id);
    return ids;
  },
  DevicePositionChange(event) {
    
    
    let currentName=event.currentTarget.id;
    let index=event.detail.value;
    let id = this.data.selectList[currentName].array[index].id;
    // 
    //更新index状态
    this.data.selectList[currentName].index = index;
    this.setData({
      selectList: this.data.selectList
    })
    //更新其他位置列表
    this.getNextInfo(currentName,id)

    
    //改变设备列表
    eventBus.on('updateDeviceList',this,_=>{
      // debugger
      let pO = this.getIdFromList();
      this.queryDeviceList(this.data.categoryId,...pO);
      eventBus.remove('updateDeviceList',this)
      
    })
    
  },
  getNextInfo(parentName, id) {
    
    let currentName = '';
    switch (parentName) {
      case 'campus':
        currentName = 'build';
        break;
      case 'build':
        currentName = 'floor';
        break;
      case 'floor':
        currentName = 'room';
        break;
      case 'room':
        currentName = '';
        break;
      default:
        currentName = '';
    }
    if (currentName === ''){
      eventBus.emit('updateDeviceList')
      return;
    }
     
    request('/weChat/spaceName', {
      id
    }).then(res => {
      res.data=[{
        spaceName:'全部',
        id:''
      },...res.data]
      this.data.selectList[currentName].array = res.data;
      this.data.selectList[currentName].index = 0;
      
      this.setData({
        selectList: this.data.selectList
      })

      // debugger
      this.getNextInfo(currentName, res.data[0].id)
    }, err => {
      console.log(err)
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