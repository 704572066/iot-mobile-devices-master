<template>
  <view>
  </view>
</template>

<script setup>
import { myStorage } from '@/utils/storage.js'
import { editPassword } from '@/api/index'
import { ref } from 'vue'
const params = ref({})
const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
const logout = () => {
  uni.clearStorageSync()
  uni.reLaunch({ url: '/pages/login/index' })
}

const dialogRef = ref()
const handleEditPassword = () => {
  params.value = {}
  dialogRef.value.open()
}
const formRef = ref()
const confirm = async () => {
  console.log('params.value', params.value)
  formRef.value.validate().then(async () => {
    if (params.value.newPassword !== params.value.verifyPassword) {
      uni.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }
    uni.showLoading({ title: '提交中...', mask: true })
    await editPassword(params.value)
    uni.hideLoading()
    handleClose()
    logout()
  })
}
const handleClose = () => {
  dialogRef.value.close()
}
</script>
<style lang="scss" scoped>

.content {
  // display: flex;
  justify-content: space-between;
  // flex-wrap: wrap;
  align-items: center; /* 垂直居中 */
  padding: 0 0rpx;
  // margin-top: 40rpx;
  // background: #e6e6e6;
  
  .item-box-top {
    // margin-top: 20rpx;
    width: 100%;
    height: 340rpx;
    flex-shrink: 0;
    // background: #ffffff;
	// background: url('/static/freepik__retouch__72762.png');
    // box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    // border-radius: 20px;
    display: flex;
    // flex-flow: column;
    align-items: center;
    justify-content: center;
    // position: relative;
	image {
		width: 100%;
		clip-path: ellipse(90% 100% at 50% -4%);
	}
	.bg {
	  // position: absolute;
	  // top: 0;
	  // left: 0;
	  // height: 100vh;
	  width: 100%;
	  z-index: -1;
	  // border-radius: 0px;
	  // border-top-left-radius: 0px; /* 设置左下角的圆角 */
	  // border-top-right-radius: 0px; /* 设置左下角的圆角 */
	  // border-bottom-left-radius: 60px; /* 设置左下角的圆角 */
	  // border-bottom-right-radius: 60px; /* 设置右下角的圆角 */
	}
	.text-overlay {
	  position: absolute;
	  top: 25px;
	  left: 48rpx;
	  color: #caf6f3;
	  font-size: 24px;
	  font-weight: bold;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
	.text-overlay-small {
	  position: absolute;
	  top: 55px;
	  left: 20px;
	  color: white;
	  font-size: 14px;
	  font-weight: normal;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
  }
}
.content3 {
  // display: flex;
  justify-content: space-between;
  // flex-wrap: wrap;
  align-items: center; /* 垂直居中 */
  padding: 0 0rpx;
  margin-top: 40rpx;
  // background: #e6e6e6;
  .item-box {
    margin-top: 0rpx;
	padding-left: 48rpx;
    width: 100%;
    height: 100rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    // border-radius: 8px;
    display: flex;
    // flex-flow: column;
    align-items: center;
    // justify-content: center;
    position: relative;
  }
  .item-box-top {
    // margin-top: 20rpx;
    width: 100%;
    height: 340rpx;
    flex-shrink: 0;
    // background: #ffffff;
	// background: url('/static/freepik__retouch__72762.png');
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 20px;
    display: flex;
    // flex-flow: column;
    align-items: center;
    justify-content: center;
    // position: relative;
	
	.text-overlay {
	  position: absolute;
	  top: 25px;
	  left: 48rpx;
	  color: #caf6f3;
	  font-size: 24px;
	  font-weight: bold;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
	.text-overlay-small {
	  position: absolute;
	  top: 55px;
	  left: 20px;
	  color: white;
	  font-size: 14px;
	  font-weight: normal;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
  }
}
.btn {
  position: absolute;
  width: calc(100% - 72rpx);
  bottom: 40rpx;
}
.mb-40 {
  margin-bottom: 40rpx;
}
.form-content {
  width: 100%;
}

.content2 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  // background: #f1efef;
  // align-items: center; /* 垂直居中 */
  padding: 0 48rpx;
  .item-box2 {
    margin-top: 40rpx;
    width: 300rpx;
    height: 120rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 8px;
    display: flex;
    // flex-flow: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .item-box {
  	padding: 0 20rpx;
      margin-top: -40rpx;
  	// margin-left: 20rpx;
  	// margin-right: 20rpx;
      width: 100%;
      height: 140rpx;
      flex-shrink: 0;
      background: #ffffff;
      box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
      border-radius: 8px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      position: relative;
	  flex-wrap: wrap;
	  .item-box3 {
	  	// padding: 0 20rpx;
	      // margin-top: -40rpx;
	  	// margin-left: 20rpx;
	  	// margin-right: 20rpx;
	      width: 300rpx;
	      height: 90rpx;
	      flex-shrink: 0;
	      background: #ffffff;
	      // box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
	      border-radius: 8px;
	      display: flex;
	      flex-flow: column;
	      align-items: center;
	      justify-content: center;
	      position: relative;
	      
	    }
      
    }
	
  .item-box-top {
    margin-top: 20rpx;
    width: 100%;
    height: 340rpx;
    flex-shrink: 0;
    // background: #ffffff;
	// background: url('/static/freepik__retouch__72762.png');
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 0px;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    position: relative;
	
	.text-overlay {
	  position: absolute;
	  top: 25px;
	  left: 48px;
	  color: #caf6f3;
	  font-size: 24px;
	  font-weight: bold;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
	.text-overlay-small {
	  position: absolute;
	  top: 55px;
	  left: 48rpx;
	  color: white;
	  font-size: 14px;
	  font-weight: normal;
	  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 文字阴影 */
	}
  }
}
.btn {
  position: absolute;
  width: calc(100% - 72rpx);
  bottom: 40rpx;
}
.mb-40 {
  margin-bottom: 40rpx;
}
.form-content {
  width: 100%;
}
</style>
