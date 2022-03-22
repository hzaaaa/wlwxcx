// 发送ajax请求

import config from './config'
var urlencode = function(data, isPrefix) {
  isPrefix = isPrefix ? isPrefix : false
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }
  return _result.length ? prefix + _result.join('&') : ''
}
export default (url, data = {}, method = 'GET') => {
  if (method === 'post' || method === 'POST') {
    url+=urlencode(data,true)
  }
  return new Promise((resolve, reject) => {
    // 1. new Promise初始化promise实例的状态为pending

    wx.request({
      url: config.host + url,
      data,
      method,
      // header: {
      //   cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      // },
      success: (res) => {
        // console.log('请求成功: ', res);
        if (data.isLogin) { // 登录请求
          // 将用户的cookie存入至本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data); // resolve修改promise的状态为成功状态resolved
      },
      fail: (err) => {
        console.log('请求失败: ', err);
        wx.showToast({
          title: '网络错误',
          icon: 'error',
          duration: 2000
        })
        // reject(err); // reject修改promise的状态为失败状态 rejected
      }
    })
  })

}
