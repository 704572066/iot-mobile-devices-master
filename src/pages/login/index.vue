<template>
  <view class="content">
	      <!-- 圆形公司 logo -->
	<image class="logo" src="@/static/botlogo.jpg" alt="Company Logo" />
	<view class="gradient-view"></view>
    <uni-forms
      ref="formRef"
      :modelValue="params"
      label-position="top"
      class="form-content"
      label-width="100%"
      :border="true">
      <view class="login-form">
        <uni-forms-item
          label="账号"
          name="username"
          :required="true"
          :rules="[
            {
              required: true,
              errorMessage: '账号不能为空'
            }
          ]">
          <input
            placeholder="请输入账号"
            v-model="params.username" />
        </uni-forms-item>
        <uni-forms-item
          label="密码"
          name="password"
          :required="true"
          :rules="[
            {
              required: true,
              errorMessage: '密码不能为空'
            }
          ]">
          <input
            placeholder="请输入密码"
            v-model="params.password" />
        </uni-forms-item>

        <!-- <view class="mt40">验证码</view>
    <view class="code-view">
      <input
        class="mt40"
        placeholder="请输入验证码"
        v-model="params.code" />
      <image
        class="imgs"
        :src="code"
        @click="getCodeFun"></image>
    </view> -->

        <view class="submit-btn">
          <button
            form-type="submit"
			class="custom-button"
            @click="loginFun">
            登录
          </button>
        </view>
      </view>
    </uni-forms>
	<view class="treaty">
	    <checkbox-group  @change="boxcheck" >
		   <label>
		   		<checkbox value="cb" activeBorderColor="blue" />已阅读并同意同盛物联<text class="privacy-link" @click="openPrivacy">
          《隐私协议》
        </text>
		   </label>
	    </checkbox-group>
	</view>
	<uni-popup ref="privacyPopup" type="center">
	      <view class="popup-container">
	        <view class="popup-title">隐私协议</view>
	        <scroll-view scroll-y class="popup-content">
	          <text>
	            欢迎使用同盛物联平台。在您使用我们的服务之前，请仔细阅读本隐私协议。
	
	            1. 我们可能收集的个人信息包括但不限于设备信息、日志信息、位置信息等，以便为您提供更好的服务体验。
	
	            2. 我们承诺不会将您的个人信息出售或非法提供给第三方。
	
	            3. 我们采取业界通行的安全技术和管理措施，保护您的数据安全。
	
	            4. 使用本平台即表示您同意我们按照本协议收集、使用和存储您的信息。
	
	            如您对本隐私协议有任何疑问，可联系我们获得进一步说明。
	          </text>
	        </scroll-view>
	        <view class="popup-actions">
	          <button type="primary" @click="onAgree">已阅读</button>
	        </view>
	      </view>
	    </uni-popup>
  </view>
</template>

<script setup>
import { myStorage } from '@/utils/storage.js'
import { handleLogin } from '@/utils/user'
import { getCode, thirdLogin } from '@/api/third'
import { getWxInfo } from '@/api/index'
import { ref } from 'vue'
const params = ref({
  username: '',
  password: '',
  code: ''
})
const privacyPopup = ref()
const thirdLoginParams = {
  phone: '18668399921',
  password: '18668399921'
}
const code = ref()
const treaty = ref([])
const getCodeFun = async () => {
  const data = await getCode()
  thirdLoginParams.uuid = data.uuid
  code.value = data.img
}
// getCodeFun()
const thirdLoginFun = async () => {
  thirdLoginParams.code = params.value.code
  const data = await thirdLogin(thirdLoginParams)
  myStorage.set('Authorization', data.token)
  // myStorage.set('userInfo', JSON.stringify(data.user))
}
let cid = undefined
// uni-app客户端获取push客户端标记
uni.getPushClientId({
  success: res => {
    cid = res.cid
    console.log('客户端推送标识:', cid)
  },
  fail(err) {
    console.log(err)
  }
})
const formRef = ref()
const boxcheck = async(e) => {
	// console.log(e)
	treaty.value = e.detail.value;
}
const onAgree = async() => {
    privacyPopup.value.close()
}
const openPrivacy = async() => {
    privacyPopup.value.open()
}
const loginFun = async () => {
  if (treaty.value.length == 0) {
	        uni.showToast({
	        	title: '请勾选《隐私协议》！',
	        	duration: 2000,
				icon:'none'
	        });
  }
  else{
	  await formRef.value.validate()
	  uni.login({
		provider: 'weixin', //使用微信登录
		onlyAuthorize: true,
		success: async function (loginRes) {
		  // const { unionid } = await getWxInfo({
		  //   appid: 'wxe861fc6383450e16',
		  //   secret: 'd0ff5a111437aa331d3e3f9132fe7fe7',
		  //   js_code: loginRes.code,
		  //   grant_type: 'authorization_code'
		  // })
		  handleLogin({ ...params.value, cid, code: loginRes.code })
		},
		fail() {
		  handleLogin({ ...params.value, cid, code: loginRes.code })
		}
	  })
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100vh;
  padding: 36rpx;
  padding-top: 50%;
  // background: url('/static/login-bg.png');
  // background-size: contain;
  .logo {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150rpx; /* 设置logo的宽度 */
    height: 150rpx; /* 设置logo的高度 */
    border-radius: 50%; /* 圆形效果 */
    border: 4rpx solid white; /* 可选：为logo添加白色边框 */
  }
  .treaty {
	  color: red;
	  padding: 32rpx;
	  .privacy-link {
	    color: green;    
	  }
  }
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
  }
  //   .gradient-view {
		// position: absolute;
		// top: 0;
		// left: 0;
  //        height: 100vh;
  //        width: 100%;
		//   z-index: -1;
  //        background: linear-gradient(to bottom left, #f00, #0f0, #00f);
  //      }
  .gradient-view {
    position: absolute;              /* 绝对定位 */
    top: 0;
    left: 0;
    height: 100vh;                   /* 高度为视口高度 */
    width: 100%;                     /* 宽度为视口宽度 */
    z-index: -1;                     /* 背景放在内容后面 */
    background: 
      linear-gradient(to bottom, #0492dc 0%, transparent 50%),   /* 淡天蓝色到透明的渐变 */
    #f4f7f7;    /* 天蓝色到透明的渐变 */
    background-size: 100% 200%;      /* 背景尺寸调整，控制波浪的频率和高度 */
    background-position: 0 0, 0 0; /* 渐变的位置设置，两个背景交错 */
  }
  .login-form {
    border-radius: 16rpx;
    padding: 36rpx;
	background: #fff;
	margin-top: 220rpx;
  }
  .mt40 {
    margin-top: 40rpx;
  }
  .submit-btn {
    margin-top: 128rpx;
	background-color: #0492dc;
	border-radius: 16rpx;
	.custom-button {
	  background-color: #0492dc; /* 自定义背景色 */
	  color: white; /* 自定义字体色 */
	  border-color: #0492dc; /* 自定义边框色，如果需要的话 */
	  border-radius: 16rpx;
	}
  }
  .popup-container {
    width: 600rpx;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    flex-direction: column;
  }
  
  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    text-align: center;
  }
  
  .popup-content {
    flex: 1;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 28rpx;
    line-height: 44rpx;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .popup-actions {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
  }
}
.code-view {
  display: flex;
  justify-content: space-between;
  .imgs {
    width: 200rpx;
    height: 80rpx;
  }
}
</style>
