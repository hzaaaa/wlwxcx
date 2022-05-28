import request from '../../../../utils/request.js'

var serviceId = "0000FFF0-0000-1000-8000-00805F9B34FB"
var characteristicIdread = "0000FFF1-0000-1000-8000-00805F9B34FB" //蓝牙特征值---读
var characteristicIdwrite = "0000FFF2-0000-1000-8000-00805F9B34FB" //蓝牙特征值---写
var temp = [];
Page({
  data: {
    searchingstatus: false,
    isbluetoothready: false,
    connected: false, //监听蓝牙连接状态
    temp: null,
    deviceId: null,
    opencode: null, //指令
    textinfo: null, // ios/androidd
    blueteath: "NJYY_40D63C44C89C" //蓝牙名称
  },
  openBluetoothAdapter() {
    var that = this;
    request('/weChat/bluetoothPowerOnOff', {
      imei: "",
      userState: 1
    }).then(res2 => {
      console.log(res2)
      that.setData({
        opencode: res2.data
      })
    })
    //初始化蓝牙
    wx.openBluetoothAdapter({
      success: res => {
        console.log(res)
        console.log("初始化蓝牙")
        setTimeout(function () {
          //   初始化蓝牙后，监听手机蓝牙状态的改变
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log("蓝牙适配器状态变化", res);
            console.log("蓝牙适配器是否可用==" + res.available);
            console.log("蓝牙适配器是否处于搜索状态==" + res.discovering);
            if (!res.available) {
              that.setData({
                searchingstatus: false
              })
            }
          });
          if (!that.data.searchingstatus) {
            // 开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，请在搜索并连接到设备后调用 
            wx.startBluetoothDevicesDiscovery({
              success: res => {
                console.log(res)
                wx.showLoading({
                  title: '搜索中...',
                })
                that.setData({
                  searchingstatus: !that.data.searchingstatus
                })

                // 搜索到新的蓝牙设备时触发此事件
                wx.onBluetoothDeviceFound(res => {
                  console.log("搜索到新的蓝牙设备时触发此事件======")
                  console.log(res.devices)
                  res.devices.map(function (it) {
                    // if(it.name.search("NJYY") != -1  )
                    // {
                    console.log('蓝牙名称----' + it.name)
                    if (it.name.indexOf(that.data.blueteath) == 0) {
                      wx.showLoading({
                        title: '连接蓝牙设备中...',
                      })
                      //监听蓝牙连接状态
                      // wx.onBLEConnectionStateChange(res => {
                      //   console.log("=============监听蓝牙连接状态============");
                      //   if (!res.connected) {
                      //     console.log("*******************蓝牙连接已断开*****************")
                      //   }
                      // })

                      //   }
                      // })
                      var d = it['deviceId'];
                      //  连接低功耗蓝牙设备
                      wx.createBLEConnection({
                        deviceId: d,
                        success: res1 => {
                          console.log(res1)
                          debugger;
                          console.log("连接低功耗蓝牙设备=============");
                          wx.showToast({
                            title: '连接成功',
                            icon: 'success',
                            duration: 1000
                          })
                          that.setData({
                            deviceId: d,
                            connected: true
                          })
                          console.log(that.data.deviceId);
                          //  获取蓝牙设备所有服务
                          wx.getBLEDeviceServices({
                            deviceId: d,
                            success: res2 => {
                              // debugger
                              console.log(res2);
                              console.log("获取蓝牙设备所有（服务）=============")
                              wx.getBLEDeviceCharacteristics({
                                //   这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                                deviceId: d,
                                serviceId: serviceId,
                                success: res3 => {
                                  // console.log(res3)
                                  //获取手机版本
                                  wx.getSystemInfo({
                                    success: function (result) {
                                      console.log("获取手机版本==========" + result.platform)
                                      that.setData({
                                        textinfo: result.platform // 这里会显示手机系统信息
                                      });
                                    },
                                    fail: res => {
                                      console.log("获取手机版本失败")
                                    }
                                  })
                                  if (that.data.textinfo == 'ios') {
                                  //ios平台
                                  var str = that.data.opencode;
                                  let buf = new ArrayBuffer(str.length)
                                  let dataView = new DataView(buf)
                                  for (var i = 0; i < str.length; i++) {
                                    dataView.setUint8(i, str.charAt(i).charCodeAt())
                                  }
                                  setTimeout(function () {
                                    // debugger
                                    wx.writeBLECharacteristicValue({
                                      deviceId: that.data.deviceId,
                                      serviceId: serviceId,
                                      characteristicId: characteristicIdwrite,
                                      value: buf,
                                      success: res => {
                                        console.log(res)
                                        if (res.data != '') {
                                          //   发送成功 更新插座状态 
                                          console.log("====================通电成功==================")
                                        } else {
                                          wx.showToast({
                                            title: '通电失败',
                                            icon: 'error',
                                            duration: 1000
                                          });
                                        }
                                        // that.closeBluetoothAdapter();
                                      },
                                      fail: res => {
                                        console.log('蓝牙写入失败')
                                        console.log(res)
                                      }
                                    })
                                  }, 500);
                                  } else if (that.data.textinfo == 'android') {
                                    setTimeout(res => {
                                      that.writeTest(senddata);
                                    }, 500);
                                  }
                                },
                                fail: res => {
                                  console.log('获取特征值失败');
                                  console.log(res);
                                }
                              })
                            },
                            fail: res => {
                              console.log(res);
                              console.log("获取蓝牙设备所有服务失败");
                            }
                          })
                        },
                        fail: res => {
                          console.log(res);
                          switch (res.errCode) {
                            case 10003: {
                              wx.showModal({
                                title: '连接失败',
                                content: '是否重新连接？',
                                success: function (res) {
                                  if (res.confirm) {
                                    console.log("连接失败")
                                  }
                                }
                              })
                              break;
                            }
                            case 10012: {
                              wx.showModal({
                                title: '连接失败',
                                content: '蓝牙连接超时',
                                connected: false
                              })
                              break;
                            }
                            case 10002: {
                              wx.showModal({
                                title: '连接失败',
                                content: '没有找到指定设备',
                                showCancel: false
                              })
                              break
                            }
                          }
                        }
                      })
                    }
                    // }
                  })
                })
              }
            })
          } else {
            //   停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
            wx.stopBluetoothDevicesDiscovery({
              success: res => {
                wx.hideLoading();
                console.log("停止蓝牙搜索")
                wx.startBluetoothDevicesDiscovery({
                  allowDuplicatesKey: false,
                  interval: 3,
                  success: function (res) {
                    console.log('startScan', res)
                  },
                })
              }
            })
          }
          wx.onBLECharacteristicValueChange(function (characteristic) {
            let buffer = characteristic.value
            let dataView = new DataView(buffer)
            console.log("接收字节长度:" + dataView.byteLength)
            var str = ""
            for (var i = 0; i < dataView.byteLength; i++) {
              str += String.fromCharCode(dataView.getUint8(i))
            }
            str = "收到数据:" + str;
            that.setData({
              receivedata: that.data.receivedata + "\n" + str,
              onreceiving: true
            })
          })
        }, 500)
      },
      fail: function () {
        console.log("初始化蓝牙适配器失败")
        // 调用远程通电
        // that.common();
      }
    })
  },

  closeBluetoothAdapter() {
    var that = this;
    console.log(that.data.deviceId)
    wx.closeBLEConnection({
      deviceId: that.data.deviceId,
      success: res => {
        console.log("== 关闭蓝牙 ==")
        wx.closeBluetoothAdapter({
          success: res => {
            console.log("== 关闭 WebSocket 连接==")
          },
          fail: res => {
            console.log('关闭蓝牙模块失败');
            console.log(res);
          }
        });
      },
      fail: res => {
        console.log('关闭蓝牙失败');
        console.log(res);
      }
    })
  },

  writeTest: function (msg) {
    var that = this;
    let buffer = that.hexStringToArrayBuffer(msg);
    let pos = 0;
    let bytes = buffer.byteLength;
    let tmpBuffer;
    tmpBuffer = buffer.slice(pos, pos + 20);
    pos += 20;
    bytes -= 20;
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: serviceId,
      characteristicId: characteristicIdwrite,
      value: tmpBuffer,
      success(res) {
        console.log('第一次发送', res)
        tmpBuffer = buffer.slice(pos, pos + bytes);
        pos += bytes;
        bytes -= bytes;
        wx.writeBLECharacteristicValue({
          deviceId: that.data.deviceId,
          serviceId: serviceId,
          characteristicId: characteristicIdwrite,
          value: tmpBuffer,
          success(res) {
            console.log('第二次发送', res)
            if (res.data != '') {
              //   发送成功 更新插座状态 
              console.log("====================通电成功==================")
            } else {
              wx.showToast({
                title: '通电失败',
                icon: 'error',
                duration: 1000
              })
            }
            wx.closeBLEConnection({
              deviceId: that.data.deviceId,
              success: function (res) {
                wx.closeBluetoothAdapter({
                  success: function (res) {
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  hexStringToArrayBuffer: function (str) {
    var that = this;
    console.log("hexStringToArrayBuffer====" + str);
    var buffer = new ArrayBuffer(str.length / 2)
    let buffer1 = new ArrayBuffer(1);
    let dataView1 = new DataView(buffer1);
    dataView1.setUint8(0, 1);
    var str = that.data.opencode;
    let buf = new ArrayBuffer(str.length)
    let dataView = new DataView(buf)
    for (var i = 0; i < str.length; i++) {
      dataView.setUint8(i, str.charAt(i).charCodeAt())
    }
    console.log(buf);
    return buf;
  }

})