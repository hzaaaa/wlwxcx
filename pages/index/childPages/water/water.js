// pages/index/childPages/powercontrol/power.js
import request from '../../../../utils/request.js'
import eventBus from '../../../../utils/eventBus.js'

import mixinUtils from '../../../../utils/mixinUtils.js'
import mixinCommon from '../mixinSelect.js'
mixinUtils({
  mixins:[mixinCommon],
  gotoPage(e) {
    if (e.currentTarget.id === 'index') {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      let id = e.currentTarget.id;
      request('/weChat/selectSingleWaterEquipment', {
        id
      }).then(res => {
        if (res.code === 0) {
          
          
          // debugger
          wx.navigateTo({
            url: `/pages/index/childPages/water/waterDetail/waterDetail`,
            success: function (res1) {
              // 通过eventChannel向被打开页面传送数据
              res1.eventChannel.emit('acceptDataFromOpenerPage', {
                data: res.data
              })
            }
          })
        } else {
          console.log('获取设备详情失败', res)
        }
      })
      // let item = this.data.deviceList

    }
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
    batchShow: false,

    allSelect: false,
    singleSelect: false,
    selectIdList: [],

    


    deviceList: null,
    categoryId: '',
    hardwareType: null,
    deviceType:null,
    
    mulChoi: {
      isMul: false,
      mulChoiName: '多选设备'
    }
  },
  singleSelect(event) {

    this.data.selectIdList = event.detail.value;
    if (event.detail.value.length === this.data.deviceList.length) {
      this.setData({
        allSelect: true
      })
    } else {
      this.setData({
        allSelect: false
      })
    }
    console.log(this.data.selectIdList);
  },
  allSelectChange(event) {
    console.log(event.detail)
    this.data.selectIdList = [];
    if (event.detail.value.length === 1) {
      //全选
      this.data.deviceList.forEach((v) => {
        this.data.selectIdList.push(v.id);
      })
      this.setData({
        singleSelect: true
      })
    } else {
      //全不选
      this.setData({
        singleSelect: false
      })
    }
    console.log(this.data.selectIdList)
  },
  cancelMulSelect(){
    this.setData({
      mulChoi: {
        isMul: false,
        mulChoiName: '多选设备'
      }
    })
  },
  batchOpen() {
    // debugger
    if(this.data.selectIdList.length===0){
      wx.showToast({
        title: '请选择操作设备',
        icon: 'error',
        duration: 1000,
      })
      return
    }
    
    // debugger
    // console.log(this.data.hardwareType);
    this.setData({
      hardwareType:this.data.hardwareType,
      batchShow: true,
      selectIdList: this.data.selectIdList,
      deviceType:this.data.deviceType
    })
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
        buildList.data = [{
          spaceName: '全部',
          id: ''
        }, ...buildList.data]
        this.data.selectList.build.array = buildList.data;
        this.setData({
          selectList: this.data.selectList
        })
        this.getNextInfo('build', buildList.data[0].id);
      } else if (campusList.data.length !== 0 && buildList.data.length === 0) {
        //有校区
        // 
        campusList.data = [{
          spaceName: '全校',
          id: ''
        }, ...campusList.data]
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
    
    //查询设备列表
    this.queryDeviceList();

  },
  queryDeviceList(categoryId = '', campusId = '', buildId = '', floorId = '', roomId = '') {
    request('/weChat/queryWaterMeterRecords', {
      campusId,
      buildId,
      floorId,
      roomId
    }).then(res => {
      // 
      if (res.code === 0) {
        this.setData({
          deviceList: res.data
        })
      } else {
        console.log('获取设备列表失败', res)
      }
    }, err => {
      console.log('获取设备列表失败', err)
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
    this.queryDeviceList(this.data.categoryId, ...this.getIdFromList())
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