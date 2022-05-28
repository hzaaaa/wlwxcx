// pages/index/childPages/power/components/socketPopup/socketPopup.js

import request from '../../../../../../utils/request.js'
import mixinCommon from '../commonComponent.js'

Component({
  behaviors: [mixinCommon],

  /**
   * 组件的初始数据
   */
  data: {

    electric: null,
    powerOnMode: null,

    manualdirection: null,
    fengxiangList: [{
        name: '扫风',
        value: '0'
      },
      {
        name: '向上',
        value: '1'
      },
      {
        name: '中',
        value: '2'
      },
      {
        name: '向下',
        value: '3'
      },
    ],
    volume: null,
    qiangduList: [{
        name: '自动',
        value: '1'
      },
      {
        name: '低',
        value: '2'
      },
      {
        name: '中',
        value: '3'
      },
      {
        name: '高',
        value: '4'
      },
    ],
    temperature: 28,
    pattern:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addOne(){
      if(this.data.temperature===30)return;
      this.setData({
        temperature:this.data.temperature+1
      })
    },
    reduceOne(){
      if(this.data.temperature===19)return;
      this.setData({
        temperature:this.data.temperature-1
      })
    },
    temperatureChange(event){
      this.setData({
        temperature:event.detail.value
      })
    },
    fengxiangChange(event){
      console.log(event.currentTarget.id)
      this.setData({
        manualdirection:event.currentTarget.id
      })
    },
    qiangduChange(event){
      console.log(event.currentTarget.id)
      this.setData({
        volume:event.currentTarget.id
      })
    },
    modeChange(event) {
      console.log(event.detail);
      let powerOnMode = event.detail.value;
      this.setData({
        powerOnMode
      })
    },
    //空调模式
    modeChange2(event){
      console.log(event.detail);
      this.data.pattern= event.detail.value;
    },
    

    confirmUpdate() {
      console.log(this.properties.ids)
      let startTime = this.getTimeStr(this.data.dateTime, this.data.dateTimeArray);

      let endTime = this.getTimeStr(this.data.dateTime1, this.data.dateTimeArray1);
      if(this.data.powerOnMode==='1'&&startTime>=endTime){
        wx.$errorTip2('结束时间必须大于开始时间')
        return;
      }

      let {temperature,pattern,manualdirection,volume}=this.data;
      request('/weChat/batchEditing', {
        id: this.properties.ids.toString(),
        userState: this.data.userState,
        temperature,pattern,manualdirection,volume,
        powerOnMode: this.data.powerOnMode,
        startTime,
        endTime
      }, 'POST').then(res => {
        console.log(res)
        // debugger
        if (res.code === 0) {
          this.afterSuccess()
        } else {
          this.afterFail();
        }

      })
    },
  }
})