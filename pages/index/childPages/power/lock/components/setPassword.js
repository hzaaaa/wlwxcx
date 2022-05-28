// pages/index/childPages/power/lock/components/setPassword.js
import request from '../../../../../../utils/request.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:Boolean,
    ids:String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:'',
    password1:'',
    password2:'',
  },
  observers: {
    
    show: function (v) {
      // debugger
      this.setData({
        isShow: v
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePopup() {
      this.setData({
        isShow: false
      })

    },
    confirmUpdate(){
      if(this.data.password1===this.data.password2){
        if(this.data.password1.length===6){
          // debugger
          request('/weChat/addPassword',{
            id:this.properties.ids,
            password:this.data.password1
          }).then(res=>{
            if(res.code===0){
              wx.showToast({
                title: '更新密码成功',
                icon: 'success',
                duration: 2000,
                complete: () => {
                  setTimeout(() => {
                    this.closePopup();
                    this.triggerEvent('myevent')
                  }, 1000)
                }
              })
              
            }else{
              wx.showToast({
                title: '密码更新错误',
                icon: 'error',
                duration: 2000
              })
            }
          })
        }else{
          wx.showToast({
            title: '请输入6位数字',
            icon: 'error',
            duration: 2000
          })
        }
      }else{
        wx.showToast({
          title: '两次密码不一致',
          icon: 'error',
          duration: 2000
        })
        
      }
    },
    saveFirstPassword(event){
      this.data.password1=event.detail.value;
    },
    saveSecondPassword(event){
      this.data.password2=event.detail.value;
    },

  }
})
