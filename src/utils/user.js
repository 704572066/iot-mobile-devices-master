import { myStorage } from './storage.js'
import { login } from '@/api/index'
export const handleLogin = async (queryParams, showLoading = true) => {
  // if (!params.value.code) {
  //   uni.showToast({
  //     title: '请输入验证码',
  //     icon: 'none'
  //   })
  //   return
  // }
  if (showLoading) {
    uni.showLoading({ title: '登录中...', mask: true })
  }
  try {
    // thirdLoginFun()
    const data = await login(queryParams)
    myStorage.set('userLoginInfo', JSON.stringify(queryParams))
    myStorage.set('token', data.token)
    myStorage.set('userInfo', JSON.stringify(data.user))
    uni.switchTab({
      url: '/pages/monitoring-center/index'
    })
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
  }
}
