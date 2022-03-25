var dateTimePicker = require('../../../../../utils/dateTimePicker.js');
export default Behavior({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    ids: Array,
    typename: String,
  },
  data: {
    dateTime1: null, //时间所在数组位置
    dateTimeArray1: null, //时间范维数组
    dateTime: null,
    dateTimeArray: null,

    isShow: false,
    deviceType: null,
    userState: 0,
  },
  observers: {
    typename: function (v) {
      this.setData({
        deviceType: v
      })
    },
    show: function (v) {
      // debugger
      this.setData({
        isShow: v
      })
    }
  },
  methods: {
    stateChange(event) {
      // debugger
      let userState = event.detail.value ? 1 : 0;
      this.setData({
        userState
      })
      console.log(userState);
    },
    closePopup() {
      this.setData({
        isShow: false
      })
    },
    changeDateTime(e) {
      this.setData({
        dateTime: e.detail.value
      });
    },
    changeDateTime1(e) {
      this.setData({
        dateTime1: e.detail.value
      });
      // let str = this.getTimeStr(this.data.dateTime1,this.data.dateTimeArray1);
      // this.data.editData.endTime= str;
    },
    changeDateTimeColumn(e) {
      console.log(e)
      var arr = this.data.dateTime,
        dateArr = this.data.dateTimeArray;

      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr
      });
    },
    changeDateTimeColumn1(e) {
      console.log(e)
      var arr = this.data.dateTime1,
        dateArr = this.data.dateTimeArray1;

      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

      this.setData({
        dateTimeArray1: dateArr,
        dateTime1: arr
      });
    },
    getTimeStr(dateTime, dateTimeArray) {
      let str = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${dateTimeArray[2][dateTime[2]]} ${dateTimeArray[3][dateTime[3]]}:${dateTimeArray[4][dateTime[4]]}`;
      return str;
    },

    afterSuccess(){
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 1000,
        complete: () => {
          setTimeout(() => {
            this.closePopup();
          }, 1000)
        }
      })
    },
    afterFail(){
      wx.showToast({
        title: '操作失败',
        icon: 'error',
        duration: 1000,
      })
    }
  },


  lifetimes:{
    attached() {
      // debugger
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      var lastArray = obj.dateTimeArray.pop();
      var lastTime = obj.dateTime.pop();
      lastArray = obj1.dateTimeArray.pop();
      lastTime = obj1.dateTime.pop();
      console.log(obj)
      this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        dateTimeArray1: obj1.dateTimeArray,
        dateTime1: obj1.dateTime
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
  



})