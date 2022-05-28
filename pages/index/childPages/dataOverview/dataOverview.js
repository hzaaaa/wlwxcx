// pages/index/childPages/dataOverview/dataOverview.js
import * as echarts from '../../../../ec-canvas/echarts'
import request from '../../../../utils/request.js'
import eventBus from '../../../../utils/eventBus.js'

import mixinUtils from '../../../../utils/mixinUtils.js'
import mixinCommon from '../mixinSelect.js'


let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  // debugger
  canvas.setChart(chart);
  let datas = [];


  let option = {
    title: {

      left: 'center',
      textStyle: {
        color: '#999',
        fontWeight: 'normal',
        fontSize: 14
      }
    },
    series: datas.map(function (data, idx) {
      var top = idx * 33.3;
      // debugger
      return {
        type: 'pie',
        radius: [50, 60],
        top: top + '%',
        height: '100%',
        left: 'center',
        width: '100%',
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          alignTo: 'edge',

          formatter: '{name|{b}}\n{value|{c} %}',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: '#999'
            }
          }
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },

        data: data
      };
    })
  };
  chart.setOption(option);
  eventBus.emit('chartReady',null)
  return chart;
}

mixinUtils({
  mixins: [mixinCommon],

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart

    },
    mychart: null,

    deviceList: [{
      totalEquipment: 1
    }, {
      totalEquipment: 1
    }, {
      totalEquipment: 1
    }, {
      totalEquipment: 1
    }, {
      totalEquipment: 1
    }]
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    // debugger
    this.queryDeviceList();
    //
  },

  queryDeviceList(c = '', campusId = '', buildId = '', floorId = '', roomId = '') {

    // debugger
    request('/weChat/viewTable', {
      campusId,
      buildId,
      floorId,
      roomId
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          deviceList: res.data
        })
      } else {
        // this
        wx.$errorTip();
      }
    })
    
    request('/weChat/sectorDiagram', {
      campusId,
      buildId,
      floorId,
      roomId
    }).then(res => {
      if (res.code === 0) {
        let data1 = [];
        data1 = JSON.parse(JSON.stringify(res.data))
        data1.forEach(v => {
          v.name = v.device_type;
          v.value = v.totalEquipment;
        })
        let datas = [data1];


        let option = {
          title: {

            left: 'center',
            textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 14
            }
          },
          series: datas.map(function (data, idx) {
            var top = idx * 33.3;
            // debugger
            return {
              type: 'pie',
              radius: [50, 60],
              top: top + '%',
              height: '100%',
              left: 'center',
              width: '100%',
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
              },
              label: {
                alignTo: 'edge',

                formatter: '{name|{b}}\n{value|{c} %}',
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
                rich: {
                  time: {
                    fontSize: 10,
                    color: '#999'
                  }
                }
              },
              labelLine: {
                length: 15,
                length2: 0,
                maxSurfaceAngle: 80
              },

              data: data
            };
          })
        };
        if(chart){
          chart.setOption(option);
        }else{
          eventBus.on('chartReady',this,_=>{
            chart.setOption(option);
            // debugger
            eventBus.remove('chartReady',this)
          })
        }
        

      } else {
        // this
        wx.$errorTip();
      }
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