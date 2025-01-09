import { myStorage } from '@/utils/storage.js'
export const myHttps = (method, url, data, callback) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url, //仅为示例，并非真实接口地址。
      data,
      method,
      header: {
        'x-access-token': myStorage.get('token') //自定义请求头信息
      },
      success: res => {
        if (callback) {
          resolve(res.data)
          return
        }
        if (res.data.status === 200) {
          resolve(res.data.result)
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 2000
          })
          if (res.data.status === 401) {
            uni.reLaunch({
              url: '/pages/login/index'
            })
          }
        }
      },
      fail: err => {
        console.log('err', err)
        reject(err)
      }
    })
  })
}

export const myHttpThird = (method, url, data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url, //仅为示例，并非真实接口地址。
      data,
      method,
      header: {
        Authorization: myStorage.get('Authorization') //自定义请求头信息
      },
      success: res => {
        if (res.data.code === 200) {
          resolve(res.data.data)
        } else {
          uni.showToast({
            icon: 'error',
            title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  })
}
