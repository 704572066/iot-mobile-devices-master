<template>
  <view class="content">
    <view class="choose-box">
      <view
        @click="changeSelect(index)"
        class="item-box"
        :class="index === selectIndex ? 'item-box-active' : ''"
        v-for="(item, index) in dataList"
        :key="item.id">
        {{ item.name }}
      </view>
    </view>
    <view class="form-content">
      <uni-forms
        ref="formRef"
        :modelValue="formData[selectIndex]"
        label-position="top"
        label-width="100%"
        :border="true">
        <uni-forms-item
          :label="item.name"
          :name="item.id"
          :required="item.expands.required"
          :rules="[
            {
              required: item.expands.required,
              errorMessage: `${item.name}不能为空`
            }
          ]"
          v-for="item in dataList[selectIndex]?.inputs"
          :key="item.name">
          <uni-data-select
            v-if="item.valueType.type === 'enum'"
            v-model="formData[selectIndex][item.id]"
            :localdata="item.valueType.elements"></uni-data-select>
          <input
            v-else
            type="text"
            v-model="formData[selectIndex][item.id]"
            :placeholder="`请输入,类型为${item.valueType.type}`" />
        </uni-forms-item>
      </uni-forms>
      <button
        class="submit-btn"
        form-type="submit"
        type="primary"
        @click="handleSubmit">
        执行
      </button>
    </view>
  </view>
</template>
<script setup>
import { getDeviceDetail, setDeviceFunction } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
let id
onLoad(query => {
  id = query.id
  getDetail()
})
const formData = ref([{}])
const dataList = ref([])
const selectIndex = ref(0)
const getDetail = async () => {
  const res = await getDeviceDetail(id)
  dataList.value = JSON.parse(res.metadata)?.functions
}
const changeSelect = index => {
  selectIndex.value = index
  formRef.value.clearValidate()
  if (!formData.value[index]) formData.value[index] = {}
}
const formRef = ref()
const handleSubmit = async () => {
  const params = {
    id: id,
    metaId: dataList.value[selectIndex.value].id
  }

  formRef.value.validate().then(async () => {
    uni.showLoading({ title: '执行中...', mask: true })
    const res = await setDeviceFunction(
      params,
      formData.value[selectIndex.value]
    )
    uni.hideLoading()
    if (res?.[0]?.code == 300) {
      uni.showToast({
        title: '执行灭火成功',
        icon: 'none'
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  .choose-box {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    margin-bottom: 40rpx;
    text-align: center;
    border-bottom: 1px solid rgb(235, 235, 235);
    .item-box {
      width: 50%;
    }
    .item-box-active {
      background: fixed rgba(0, 0, 0, 0.1);
      color: #fff;
    }
  }
  .form-content {
    padding: 0 32rpx;
  }
  .submit-btn {
    margin-top: 40rpx;
  }
}
</style>
