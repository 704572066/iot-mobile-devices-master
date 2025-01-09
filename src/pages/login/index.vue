<template>
  <view class="content">
    <image
      class="login-bg"
      src="@/static/login-bg.png"
      alt=""></image>
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
            type="primary"
            @click="loginFun">
            登录
          </button>
        </view>
      </view>
    </uni-forms>
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
const thirdLoginParams = {
  phone: '18668399921',
  password: '18668399921'
}
const code = ref()
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
const loginFun = async () => {
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
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100vh;
  padding: 36rpx;
  padding-top: 20%;
  // background: url('/static/login-bg.png');
  // background-size: contain;
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
  }
  .login-form {
    border-radius: 16rpx;
    padding: 36rpx;
    background: #fff;
  }
  .mt40 {
    margin-top: 40rpx;
  }
  .submit-btn {
    margin-top: 128rpx;
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
