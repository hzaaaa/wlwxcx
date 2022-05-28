import request from '../../../../utils/request.js'
import mixinUtils from '../../../../utils/mixinUtils.js'
import mixinCommon from '../mixinSelect.js'
mixinUtils({
  mixins: [mixinCommon],

  /**
   * 页面的初始数据
   */
  data: {
    imei: '',
    device_name: '',

    personList: [{
      userIndex: 0,
    }],
    userList: [],

    categoryList: null,
    categoryIndex: 0,

    typeList: [],
    typeIndex: 0,

    redPopupShow: false,
    brandList: [],
    brandIndex: 0,
    modelList: [],
    modelIndex: 0,

    modelPopupShow: false,

    deviceId:'',
  },
  input(event) {
    // this.setData({
    this.data[event.currentTarget.id] = event.detail.value;
    // })
    // console.log(event.currentTarget.id)
    // console.log(event.detail.value)
  },
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        let result = res.result;
        let codeList = result.split(';');
        let imei = codeList[0];

        //test
        // let imei = '868753057077674';
        this.setData({
          imei
        })
      },
      error:res=>{
        console.log(res)
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
  
  installSuccess(){
    wx.$successTip('安装成功');
    setTimeout(_ => {
      this.gotoIndex();
    }, 2000)
  },
  //发送指令
  sendCommand() {
    request('/weChat/sendInstructions', {
      id: this.data.deviceId,
      vrvId: this.data.modelList[this.data.modelIndex].id
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        //成功
        this.setData({
          redPopupShow: false,
          modelPopupShow: true
        })
      } else {
        this.$errorTip2(res.msg)
      }
    })

  },
  //空调状态正确绑定红外码
  right() {
    request('/weChat/airConditioningBindInfrared',{
      id: this.data.deviceId,
      vrvId: this.data.modelList[this.data.modelIndex].id,
      correct:1 //传入1代表空调有反应
    },'POST').then(res=>{
      console.log(res)
      if(res.code===0){
        this.installSuccess();
      }else{
        wx.$errorTip2('绑定红外码失败')
      }
    })

    
  },
  //空调状态不正确回退类型选择
  noRight() {
    this.setData({
      redPopupShow: true,
      modelPopupShow: false
    })
  },

  closeModelPopup() {
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
  gotoIndex() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  categoryChange(event) {
    this.setData({
      categoryIndex: event.detail.value >>> 0
    })
    this.queryType(this.data.categoryList[this.data.categoryIndex].id)
  },
  typeChange(event) {
    this.setData({
      typeIndex: event.detail.value >>> 0
    })
  },
  personChange(event) {
    console.log(event)
    this.data.personList[event.currentTarget.id].userIndex = event.detail.value >>> 0
    this.setData({
      personList: this.data.personList
    })
  },
  addPerson() {
    this.data.personList.push({
      userIndex: 0,
    })
    this.setData({
      personList: this.data.personList
    })
  },
  reducePerson(event) {
    console.log(event)
    this.data.personList.splice(event.currentTarget.id, 1)
    this.setData({
      personList: this.data.personList
    })
  },

  queryUserlist() {
    request('/weChat/userlist').then(res => {
      console.log(res);
      if (res.code === 0) {
        this.setData({
          userList: res.data
        })
      }
    })
  },
  //请求硬件品类
  queryCategory() {
    request('/weChat/selectCategory').then(res => {
      console.log(res);
      if (res.code === 0) {
        if (!this.data.categoryList) {
          //首次请求设备类型
          res.data && res.data[0] && this.queryType(res.data[0].id)
        }
        this.setData({
          categoryList: res.data
        })
      }
    })
  },
  //请求设备类型
  queryType(parentId) {
    request('/weChat/selectType', {
      parentId
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        this.setData({
          typeList: res.data
        })
      }
    })
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
  confirmTap() {
    let {
      imei,
      device_name,
      categoryList,
      categoryIndex,
      typeList,
      typeIndex,
      personList,
      userList,
      selectList //位置列表
    } = this.data;
    if(imei===''){
      wx.$errorTip2('请输入IMEI')
      return;
    }

    let {
      campus,
      build,
      floor,
      room
    } = selectList;
    let ancestors = personList.map(item => {
      return userList[item.userIndex].id
    }).toString();
    console.log(ancestors);
    // return
    request('/weChat/equipmentInsert', {
      imei,
      deviceName: device_name,
      productInfoId: categoryList[categoryIndex].id, //硬件品类id
      deviceCategoryId: typeList[typeIndex].id, //设备类型id
      ancestors,
      campusId: campus.array[campus.index].id,
      buildId: build.array[build.index].id,
      floorId: floor.array[floor.index].id,
      roomId: room.array[room.index].id,

    }, 'POST').then(res => {
      console.log(res)
      //test
      // let deviceId = '189b55162ee1433a826d32f35182d233';
      // this.data.deviceId = deviceId;
      if (res.code === 0) {
        this.data.deviceId = res.data;
        wx.showModal({
          title: '提示',
          content: '是否关联红外？',
          success: res => {
            if (res.confirm) {
              // console.log('用户点击确定');
              this.openRedPopup();
            } else if (res.cancel) {
              // console.log('用户点击取消')
              this.installSuccess();
            }
          }
        })
      } else {
        wx.$errorTip2(res.msg)
      }


      

    })


  },

  queryDeviceList() {
    //设备位置防报错 勿删
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.imei){
      this.setData({
        imei:options.imei
      });
    }
    this.queryUserlist();
    this.queryCategory();

    this.queryBrand();
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