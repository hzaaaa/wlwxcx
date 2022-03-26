// pages/index/childPages/power/components/socketPopup/socketPopup.js

import request from '../../../../../../utils/request.js'
import mixinCommon from '../commonComponent.js'

Component({
  behaviors: [mixinCommon],
  
  /**
   * 组件的初始数据
   */
  data: {
    
    lampSate: null,
    powerOnMode: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    modeChange(event) {
      console.log(event.detail);
      let powerOnMode = event.detail.value;
      this.setData({
        powerOnMode
      })
    },
    liangdengChange(event) {
      console.log(event.detail);
      this.data.lampSate = event.detail.value;
    },
    
    confirmUpdate() {
      console.log(this.properties.ids)
      let startTime = this.getTimeStr(this.data.dateTime, this.data.dateTimeArray);

      let endTime = this.getTimeStr(this.data.dateTime1, this.data.dateTimeArray1);

      request('/weChat/batchEditing', {
        id: this.properties.ids.toString(),
        userState: this.data.userState,
        lampSate: this.data.lampSate,
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