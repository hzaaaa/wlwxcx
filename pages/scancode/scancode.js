import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScancode: false, //false 当前不是扫码api页面
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  queryIdByCode(code) {
    request('/weChat/selectDeviceCode', {
      code
    }, 'POST').then(res => {
      console.log(res);
      if (res.code === 0 && res.data) {
        this.gotoControl(res.data.id)
      }
    })
  },
  gotoControl(id) {
    request('/weChat/selectSingle', {
      id
    }).then(res => {
      if (res.code === 0) {
        let path = ''
        if (res.data.hardwareType === '4') {
          wx.navigateTo({
            url: `/pages/index/childPages/water/waterDetail/waterDetail`,
            success: function (res1) {
              // 通过eventChannel向被打开页面传送数据
              res1.eventChannel.emit('acceptDataFromOpenerPage', {
                data: res.data
              })
            }
          })
          return;
        }
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (!this.data.isScancode) {
      this.data.isScancode = true;
      wx.scanCode({
        success: (res) => {
          let result = res.result;
          result = result.replace(/[\r\n]/g, "");
          let tempList = result.split(';');

          if (tempList.length === 2) {
            //imei
            let imei = tempList[0];
            wx.showActionSheet({
              itemList: ['调试', '安装'],
              success:res=> {
                console.log(res.tapIndex)
                if(res.tapIndex===0){
                  wx.navigateTo({
                    url: '/pages/index/childPages/debugging/debugging?imei='+imei,
                  })
                }else if(res.tapIndex===1){
                  wx.navigateTo({
                    url: '/pages/index/childPages/install/install?imei='+imei,
                  })
                }
              },
              fail(res) {
                console.log(res.errMsg)
              }
            })
          } else if (tempList.length === 1) {
            //deviceCode
            let query = result.split('?')[1];
            let deviceCode = query.split('=')[1];
            this.queryIdByCode(deviceCode);

          }
          // let deviceCode = query.split('=')[1];

          // console.log(res)
          // console.log(deviceCode)
          // wx.showActionSheet({
          //   itemList: ['A', 'B', 'C'],
          //   success (res) {
          //     console.log(res.tapIndex)
          //   },
          //   fail (res) {
          //     console.log(res.errMsg)
          //   }
          // })
        },
        complete: () => {
          console.log('complete')

          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    } else {
      this.data.isScancode = false; //扫码关闭后走onShow 将其状态改变
      // wx.switchTab({
      //   url:'/pages/index/index'
      // })
    }

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

  },

  scanCode: function () {
    var that = this;
    wx.scanCode({ //扫描API
      // onlyFromCamera: true,
      success(res) { //扫描成功
        console.log(res) //输出回调信息
        that.setData({
          scanCodeMsg: res.result
        });
        wx.showToast({
          title: '成功',
          duration: 1000
        })
      }
    })
  },
})