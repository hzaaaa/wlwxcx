var dateTimePicker = require('../../utils/dateTimePicker.js');
import request from '../../utils/request.js'
export default{
  data:{
    categoryList:null,
    categoryIndex:0,

    dateTime: null,
    dateTimeArray: null,
  },
  
  
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
    let{categoryList, categoryIndex,dateTime,dateTimeArray}=this.data
    this.queryDataList(categoryList[categoryIndex].id,this.getTimeStr(dateTime,dateTimeArray))
  },
  
  changeDateTimeColumn(e) {
    // console.log(e)
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  
  getTimeStr(dateTime,dateTimeArray){
    let str = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${dateTimeArray[2][dateTime[2]]}`;
    return str;
  },
  queryDeviceCategory() {
    request('/weChat/allcategory').then(res => {
      console.log(res);
      if (res.code === 0) {
        res.data=[{
          id:'',
          deviceType:'全部'
        },...res.data]
        this.setData({
          categoryList: res.data
        })
      }
    })
  },
  categoryChange(event) {
    this.setData({
      categoryIndex: event.detail.value >>> 0
    })
    let{categoryList, categoryIndex,dateTime,dateTimeArray}=this.data
    this.queryDataList(categoryList[categoryIndex].id,this.getTimeStr(dateTime,dateTimeArray))
  },
  onLoad() {
    this.queryDeviceCategory();
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    // 精确到分的处理，将数组的时分秒去掉
    var lastArray = obj.dateTimeArray.pop();
    lastArray = obj.dateTimeArray.pop();
    lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    lastTime = obj.dateTime.pop();
    lastTime = obj.dateTime.pop();

    // console.log()

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
  },
}