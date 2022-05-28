
import mixinTime from '../mixinTimeMySpace'
import mixinUtils from '../../../utils/mixinUtils.js'
import request from '../../../utils/request.js'
mixinUtils({
  mixins: [mixinTime],

  /**
   * 页面的初始数据
   */
  data: {
    
    recordList:null,
  },
  

  queryDataList(categoryId='',time=''){
    request('/weChat/usageRecord',{
      categoryId,time
    }).then(res => {
      console.log(res);

      if (res.code === 0) {
        res.data&&res.data.forEach(item=>{

          item.createDate =item.create_time&&item.create_time.slice(0,10)
        })
        this.setData({
          recordList: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
    this.queryDataList();
    
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