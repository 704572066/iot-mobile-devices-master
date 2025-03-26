<template>
  <view class="content">
	  <view class="item-box-top">
	    <image
	      class="bg"
	      src="@/static/bg.png"
	      alt=""></image>
	  	<view class="text-overlay">{{ userInfo.name }}</view>
	  </view> 
  </view>
  <view class="content2">
		<view class="item-box">
			<view class="item-box3">
			<view>{{deviceNum}}</view>
			设备数量
			</view>
			<view class="item-box3">
			<view>{{alarmNum}}</view>
			告警数量
			</view>
		</view>
		<view class="item-box2" @click="goto('/pages/mine/qrcode')">
			<text class="t-icon t-icon-erweima"></text>
			关注服务号
		</view>
		<view class="item-box2" @click="goto('/pages/mine/help')">
			<text class="t-icon t-icon-kefu"></text>
			帮助中心
		</view>
  </view>
			
  <view class="content3">
    	  <view class="item-box" @click="goto('/pages/monitoring-center/warning/index?type=normal')">
			  <uni-icons
			    color="#0492dc"
			    type="notification-filled"
			    size="30"></uni-icons>
			  历史告警
    	  </view>
		  <view class="item-box" @click="goto('/pages/mine/private')">
			  <text class="t-icon t-icon-show_yinsizhengce_fill"></text>
			  隐私条款
		  </view>
		  <view class="item-box" @click="goto('/pages/mine/setting')">
			  <uni-icons
			    color="#0492dc"
			    type="gear-filled"
			    size="30"></uni-icons>
			  账号操作
		  </view> 
  </view>
 <!-- <view class="btn">
      <button
        type="primary"
        class="mb-40"
        @click="handleEditPassword">
        修改密码
      </button>
      <button
        type="warn"
        @click="logout">
        退出登录
      </button>
  </view> -->
  <uni-popup
      ref="dialogRef"
      type="dialog">
      <uni-popup-dialog
        title="修改密码"
        before-close
        @close="handleClose"
        @confirm="confirm">
        <uni-forms
          ref="formRef"
          :modelValue="params"
          label-position="top"
          class="form-content"
          label-width="100%"
          :border="true">
          <uni-forms-item
            label="旧密码"
            name="oldPassword"
            :required="true"
            :rules="[
              {
                required: true,
                errorMessage: '旧密码不能为空'
              }
            ]">
            <input
              type="password"
              v-model="params.oldPassword"
              :placeholder="`请输入旧密码`" />
          </uni-forms-item>
          <uni-forms-item
            label="新密码"
            name="newPassword"
            :required="true"
            :rules="[
              {
                required: true,
                errorMessage: '新密码不能为空'
              }
            ]">
            <input
              type="password"
              v-model="params.newPassword"
              :placeholder="`请输入新密码`" />
          </uni-forms-item>
          <uni-forms-item
            label="确认新密码"
            name="verifyPassword"
            :required="true"
            :rules="[
              {
                required: true,
                errorMessage: '确认新密码不能为空'
              }
            ]">
            <input
              type="password"
              v-model="params.verifyPassword"
              :placeholder="`请输入确认新密码`" />
          </uni-forms-item>
        </uni-forms>
      </uni-popup-dialog>
  </uni-popup>
</template>

<script setup>
import { myStorage } from '@/utils/storage.js'
import { editPassword } from '@/api/index'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
// import { getWarningList, getWarningListByOrgId } from '@/api/index'
import { getAlarmLevelConfig, getWarningList, getWarningListByOrgId, getDeviceAddressCategory } from '@/api/index'

import { ref } from 'vue'
const params = ref({})
const deviceNum = ref(0)
const alarmNum = ref(0)
const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
onLoad(query => {
  getDeviceNum()
  getAlarmNum()
})
const logout = () => {
  uni.clearStorageSync()
  uni.reLaunch({ url: '/pages/login/index' })
}
const goto = url => {
  uni.navigateTo({
    url
  })
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
const getAlarmNum = async () => {
  let params = {
    pageIndex: 1,
    pageSize: 10,
    sorts: [{ name: 'alarmTime', order: 'desc' }],
    terms: [
      {
        terms: [
          {
            type: 'or',
            value: 'warning',
            termType: 'eq',
            column: 'state'
          }
        ]
      }
    ]
  }
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let res
  // const res = await getWarningList(params)
  if(userInfo.isAdmin) {
  	  res = await getWarningList(params)
  }
  else {
  	  params.terms.push({
        type: 'and',
        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
        termType: 'eq',
        column: 'orgId'
      })
  	  res = await getWarningListByOrgId(params)
  }
  alarmNum.value = res.total
}
const getDeviceNum = async () => {
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  const params = {
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
      {
        type: 'and',
        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
        termType: 'eq',
        column: 'orgId'
      }
    ]
  }
  const res = await getDeviceAddressCategory(userInfo.orgList[0].id)
  let total = 0
  for(let i=0; i<res.length; i++){
	  total = total + res[i].value
  }
  // console.log(total)
  deviceNum.value = total
  // if(res.length==1&&res[0].key==='其他'){
	 //  uni.navigateTo({
	 //    url: `/pages/monitoring-center/device/index`
	 //  })
  // }
  // else{
	 //  dataList.value = res
	 //  if(res.length==0){
		//   noData.value = true
	 //  }
  // }
  // total = res.total
}

</script>
<style lang="scss" scoped>
@import url('@/static/iconfont-weapp-icon.css');
		// .vue-iconfont{
		// 	font-family: iconfont;
		// }
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
