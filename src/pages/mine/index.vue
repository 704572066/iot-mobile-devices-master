<template>
  <view class="content">
    <view>{{ userInfo.name }}</view>
    <view class="btn">
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
    </view>
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
  width: 100%;
  top: 50%;
  padding: 36rpx;
  .mt40 {
    margin-top: 40rpx;
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
