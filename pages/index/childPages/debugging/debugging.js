import request from '../../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imei: '',
  },
  gotoIndex() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  input(event) {
    this.data.imei = event.detail.value;
  },
  confirmTap() {
    if (this.data.imei === '') {
      wx.$errorTip2('请输入IMEI');
      return
    }
    this.queryselectImei(this.data.imei, true);
  },
  queryselectImei(imei, flag) { //flag===true 为手动输入
    //test
    // imei = 861428043250050;

    request('/weChat/selectImei', {
      imei
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        let data = res.data[0];
        if (flag) {
          this.showActionSheet({
            itemList: res.data.map(item => {
              return item.imei
            }),
            success: res1 => {
              console.log(res1.tapIndex)
              this.gotodebugger(res.data[res1.tapIndex])

            },
            fail(res1) {
              console.log(res1.errMsg)
            }
          })
        } else {
          this.gotodebugger(data);
        }
        

      } else {
        wx.$errorTip();
      }

    })
    //test
    // wx.navigateTo({
    //   url: '/pages/index/childPages/debugging/lamp/lamp?imei='+123+'&hardwareType='+3
    //   // url: '/pages/index/childPages/debugging/kongkai/kongkai?imei='+123+'&hardwareType='+4
    //   // url: '/pages/index/childPages/debugging/kongtiao/kongtiao?imei='+123+'&hardwareType='+8
    // })
  },
  /***
   * 扩展系统自带的showActionSheet，解决选项超过6个时无法使用问题
   */
  showActionSheet(config) {
    if (config.itemList.length > 6) {
      var myConfig = {};
      for (var i in config) { //for in 会遍历对象的属性，包括实例中和原型中的属性。（需要可访问，可枚举属性）
        myConfig[i] = config[i];
      }
      myConfig.page = 1;
      myConfig.itemListBak = config.itemList;
      myConfig.itemList = [];
      var successFun = config.success;
      myConfig.success = res=> {
        if (res.tapIndex == 5) { //下一页
          myConfig.page++;
          this.showActionSheet(myConfig);
        } else {
          res.tapIndex = res.tapIndex + 5 * (myConfig.page - 1);
          successFun(res);
        }
      }
      this.showActionSheet(myConfig);
      return;
    }
    if (!config.page) {
      wx.showActionSheet(config);
    } else {
      var page = config.page;
      var itemListBak = config.itemListBak;
      var itemList = [];
      for (var i = 5 * (page - 1); i < 5 * page && i < itemListBak.length; i++) {
        itemList.push(itemListBak[i]);
      }
      if (5 * page < itemListBak.length) {
        itemList.push('下一页');
      }
      config.itemList = itemList;
      wx.showActionSheet(config);
    }
  },
  gotodebugger(data) {
    if (data === null || data === undefined) {
      wx.$errorTip2('IMEI错误')
    } else if (data.hardwareType == '2' || data.hardwareType == '4') {
      //空开 //水表
      wx.navigateTo({
        url: '/pages/index/childPages/debugging/kongkai/kongkai?imei=' + data.imei + '&hardwareType=' + data.hardwareType
      })
    } else if (data.hardwareType == '7' || data.hardwareType == '1' || data.hardwareType == '8') {
      //空调 //插座 //一体机
      wx.navigateTo({
        url: '/pages/index/childPages/debugging/kongtiao/kongtiao?imei=' + data.imei + '&hardwareType=' + data.hardwareType
      })
    } else if (data.hardwareType == '3') {
      //灯
      wx.navigateTo({
        url: '/pages/index/childPages/debugging/lamp/lamp?imei=' + data.imei + '&hardwareType=' + data.hardwareType
      })
    } else {

      console.log('imei', data.imei)
      console.log('非空开or空调');
      wx.$errorTip2('IMEI错误')
    }
  },
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        let result = res.result;
        let codeList = result.split(';');
        let imei = codeList[0];
        this.setData({
          imei
        })
        //test
        // imei = '868753057077674';

        this.queryselectImei(imei);
        // wx.navigateTo({
        //   url: '/pages/index/childPages/debugging/kongtiao/kongtiao?imei='+imei
        //   // url: '/pages/index/childPages/debugging/kongkai/kongkai?imei='+imei
        // })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.imei) {
      this.queryselectImei(options.imei);
    }
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