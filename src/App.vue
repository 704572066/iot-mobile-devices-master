<script>
import { myStorage } from '@/utils/storage.js'
import { handleLogin } from '@/utils/user'
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 拿到本地 存进store
    const token = myStorage.get('token')
    if (token) {
      uni.switchTab({
        url: '/pages/monitoring-center/index'
      })
    } else {
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }

    const _handlePush = message => {
      uni.navigateTo({
        url: message.payload.pagePath
      })
    }
    // push消息测试
    uni.onPushMessage(res => {
      console.log('收到推送消息：', res) //监听推送消息
    })
    // 安装点击消息
    // plus.push.addEventListener('click', function (message) {
    //   console.log('点击消息：', message)
    //   plus.runtime.setBadgeNumber(0)
    //   // plus.nativeUI.toast('push click');
    //   // _handlePush(message)
    // })
    // // ios透传
    // plus.push.addEventListener('receive', function (message) {
    //   plus.runtime.setBadgeNumber(0)
    //   // plus.nativeUI.toast('push receive');
    //   // _handlePush(message)
    // })
  },
  onShow: function () {
    const userLoginInfo = JSON.parse(myStorage.get('userLoginInfo') || '{}')
    if (userLoginInfo.username && userLoginInfo.password) {
      handleLogin({ ...userLoginInfo, code: undefined }, false)
    }
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
view {
  box-sizing: border-box;
  /* 其他全局样式 */
}
page {
	background-color: #f1efef;
}
</style>
