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
      let id = e.currentTarget.id;
      request('/weChat/selectSingle', {
        id
      }).then(res => {
        if (res.code === 0) {
          let path = ''
          switch (res.data.hardwareType) {
            case '1': //插座
              path = 'socket';
              break;
            case '2': //空开
              path = 'kongkai';
              break;
            case '3': //灯
              path = 'lamp';
              break;
            case '4': //水表
              // path = 'socket';
              break;
            case '5': //环境监测
              // path = 'socket';
              break;
            case '6': //锁
              path = 'lock';
              break;
            case '7': //空调
              path = 'kongtiao';
              break;
            case '8': //一体机
              path = 'yitiji';
              break;
            default:

          }
          // debugger
          wx.navigateTo({
            url: `/pages/index/childPages/power/${path}/${path}`,
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
  
  selectCategoryTap(e) {
    // console.log(e);
    this.setData({
      categoryId: e.currentTarget.id,
      hardwareType:e.currentTarget.dataset.hardwaretype
    })
    // debugger
    this.data.hardwareType = e.currentTarget.dataset.hardwaretype;
    this.data.deviceType = e.currentTarget.dataset.devicetype;
    // debugger
    this.queryDeviceList(e.currentTarget.id, ...this.getIdFromList())
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
  cancelMulSelect(){
    this.setData({
      mulChoi: {
        isMul: false,
        mulChoiName: '多选设备'
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    batchShow: false,
    

    allSelect: false,
    singleSelect: false,
    selectIdList: [],

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
          spaceName: '全部',
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
    //查询设备类型
    request('/weChat/category').then(res => {
      if (res.code === 0) {
        res.data = [{
          id: '',
          deviceType: '全部'
        }, ...res.data]
        this.setData({
          deviceCategoryList: res.data
        })
      } else {
        console.log('获取设备类型失败', res.msg)
      }

    }, err => {
      console.log('获取设备类型失败', err)
    })
    //查询设备列表
    this.queryDeviceList();

  },
  queryDeviceList(categoryId = '', campusId = '', buildId = '', floorId = '', roomId = '') {
    request('/weChat/selectCentralizedControl', {
      categoryId,
      campusId,
      buildId,
      floorId,
      roomId
    }).then(res => {
      // 
      if (res.code === 0) {
        res.data.forEach((v,i,arr)=>{
          let src='socket';
          switch(v.hardwareType){
            case '1':
              src='socket';
              break;
            case '2':
              src='kongkai';
              break;
            case '3':
              src='lamp';
              break;
            case '6':
              src='lock';
              break;
            case '7':
              src='kongtiao';
              break;
            case '8':
              src='yitiji';
              break;
            default:
          
          }
          v.src=`/static/images/device/${src}.png`
        })
        this.setData({
          deviceList: res.data,
          allSelect: false,
          singleSelect: false,
          selectIdList: []
        })
      } else {
        console.log('获取设备列表失败', res)
      }
    }, err => {
      console.log('获取设备列表失败', err)
    })
  },
  getIdFromList() {
    let ids = [];
    ids.push(this.data.selectList.campus.array[this.data.selectList.campus.index].id);
    ids.push(this.data.selectList.build.array[this.data.selectList.build.index].id);
    ids.push(this.data.selectList.floor.array[this.data.selectList.floor.index].id);
    ids.push(this.data.selectList.room.array[this.data.selectList.room.index].id);
    return ids;
  },
  DevicePositionChange(event) {


    let currentName = event.currentTarget.id;
    let index = event.detail.value;
    let id = this.data.selectList[currentName].array[index].id;
    // 
    //更新index状态
    this.data.selectList[currentName].index = index;
    this.setData({
      selectList: this.data.selectList
    })
    //更新其他位置列表
    this.getNextInfo(currentName, id)


    //改变设备列表
    eventBus.on('updateDeviceList', this, _ => {
      // debugger
      let pO = this.getIdFromList();
      this.queryDeviceList(this.data.categoryId, ...pO);
      eventBus.remove('updateDeviceList', this)

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
    if (currentName === '') {
      eventBus.emit('updateDeviceList')
      return;
    }

    request('/weChat/spaceName', {
      id
    }).then(res => {
      res.data = [{
        spaceName: '全部',
        id: ''
      }, ...res.data]
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