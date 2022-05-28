// pages/index/childPages/repair/repair.js
import request from '../../../../utils/request.js'
import mixinUtils from '../../../../utils/mixinUtils.js'
import mixinCommon from '../mixinSelect.js'
import mixinTime from '../power/common'


mixinUtils({
  mixins: [mixinCommon, mixinTime],

  /**
   * 页面的初始数据
   */
  data: {
    deviceCategoryList: null,
    typeIndex: 0,
    categoryId: '',

    deviceList: null,
    deviceIndex: 0,

    content: '',

    options: null,

    deviceData: null
  },
  scanCode() {
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        result = result.replace(/[\r\n]/g, "");
        let query = result.split('?')[1];
        let deviceCode = query.split('=')[1];

        console.log(res)
        console.log(deviceCode)
        this.queryIdByCode(deviceCode);
      }
    })
  },
  queryIdByCode(code) {
    request('/weChat/selectDeviceCode', {
      code
    }, 'POST').then(res => {
      console.log(res);
      if (res.code === 0 && res.data) {
        let {
          deviceList
        } = this.data;
        for (let i = 0; i < deviceList.length; i++) {
          if (deviceList[i].id === res.data.id) {
            this.setData({
              deviceIndex: i
            })
            break;
          }
        }
      }
    })
  },
  bindTextAreaBlur(event) {
    // debugger
    this.data.content = event.detail.value
  },
  submitTap() {
    let installId = this.data.deviceList[this.data.deviceIndex].id;
    let problemTime = this.getTimeStr(this.data.dateTime, this.data.dateTimeArray);
    let content = this.data.content;
    // debugger
    request('/weChat/repairRequestUpload', {
      installId,
      problemTime,
      content
    }, 'POST').then(res => {
      // debugger
      if (res.code === 0) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          complete: () => {
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, 1000)
          }
        })
      } else {
        wx.$errorTip();
      }
    })
  },
  typeChange(event) {
    // debugger
    this.setData({
      typeIndex: event.detail.value >>> 0
    })
    this.data.categoryId = this.data.deviceCategoryList[this.data.typeIndex].id;
    this.queryDeviceList(this.data.categoryId, ...this.getIdFromList())
  },
  deviceChange(event) {
    // debugger
    this.setData({
      deviceIndex: event.detail.value >>> 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async haveId(id){
    let {data:deviceData} = await request('/weChat/selectSingle', {id});
    console.log(deviceData)
    let [
      {data:campusList},
      {data:buildList},
      {data:floorList},
      {data:roomList},
      {data:categoryList},
    ]= await Promise.all([
      request('/weChat/campus'),
      request('/weChat/spaceName',{id:deviceData.campusId}),
      request('/weChat/spaceName',{id:deviceData.buildId}),
      request('/weChat/spaceName',{id:deviceData.floorId}),
      request('/weChat/category'),
    ])
    this.setData({
      selectList: {
        campus: {
          index: this.findIndexByid(campusList,deviceData.campusId)+1,
          array: [{
            "id": "", // 位置id
            "spaceName": "全校" //位置的名字
          },...campusList]
        },
        build: {
          index:  this.findIndexByid(buildList,deviceData.buildId)+1,
          array: [{
            "id": "", // 位置id
            "spaceName": "全部" //位置的名字
          },...buildList]
        },
        floor: {
          index:  this.findIndexByid(floorList,deviceData.floorId)+1,
          array: [{
            "id": "", // 位置id
            "spaceName": "全部" //位置的名字
          },...floorList]
        },
        room: {
          index:  this.findIndexByid(roomList,deviceData.roomId)+1,
          array: [{
            "id": "", // 位置id
            "spaceName": "全部" //位置的名字
          },...roomList]
        },
      },
      deviceCategoryList:[{
        id: '',
        deviceType: '全部类型'
      },...categoryList] ,
      typeIndex: this.findIndexByid(categoryList,deviceData.typeId)+1,
    })
    this.queryDeviceList(deviceData.typeId, ...this.getIdFromList())
    

  },
  findIndexByid(list,id){
    let index=-1;
    for(let i=0;i<list.length;i++){
      if(list[i].id===id){
        index=i;
        break;
      }
    }
    return index;
  },
  onLoad: function (options) {
    // debugger
    this.data.options = options
    // console.log(options);
    if (options.id) {
      //跳转
      this.haveId(options.id)
    } else {
      //非跳转
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
      //查询设备类型
      request('/weChat/category').then(res => {
        if (res.code === 0) {
          res.data = [{
            id: '',
            deviceType: '全部类型'
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
      this.queryDeviceList();
    }


  },
  queryDeviceList(categoryId = '', campusId = '', buildId = '', floorId = '', roomId = '') {
    request('/weChat/equipmentRepair', {
      categoryId,
      campusId,
      buildId,
      floorId,
      roomId
    }).then(res => {
      // 
      if (res.code === 0) {

        let data = res.data;
        let index = 0;
        if (this.data.options.id) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.data.options.id) {
              index = i;
              break;
            }
          }
        }


        this.setData({
          deviceList: res.data,
          deviceIndex: index
        })
        if (this.data.options.deviceCode) {
          this.queryIdByCode(this.data.options.deviceCode)
        }
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