// pages/login/login.js
import request from '../../utils/request'
import config from '../../utils/config'
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasphoneNumber: false,
    hasName:false,
    

  },
  getPhoneNumber(e) {
    var pc = new WXBizDataCrypt(config.appId, wx.getStorageSync('session_key'));
    var data = pc.decryptData(e.detail.encryptedData , e.detail.iv)
    console.log(data)
    wx.setStorageSync('phoneNumber', data.phoneNumber)
    this.setData({
      hasphoneNumber:true
    })
    this.loginOrAuthorization();
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('nickName', res.userInfo.nickName)
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        this.setData({
          hasName:true
        })
        this.loginOrAuthorization();
      }
    })
  },
  loginOrAuthorization(){
    
    if(this.data.hasName&&this.data.hasphoneNumber){
      //
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.login();
    // this.getUserToLogin();
  },

  //授权登录
  getUserToLogin(){
    
    request('/weChat/authorization',)
    wx.getUserInfo({
      success: function(res) {
        // debugger
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        
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