<template>
  <view class="content">
    <view
      class="item-box"
      v-for="item in dataList"
      :key="item.name"
      @click="goto(item.id)">
      <view class="head">
        {{ item.name }}
      </view>
      <view class="info">
        <view class="values">{{ item.formatValue || '--' }}</view>
        <view class="times">更新时间</view>
        <view class="times2">{{ item.updateTime || '--' }}</view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { getDeviceDetail, getDeviceDashboard } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
let id
onLoad(query => {
  id = query.id
  getDetail()
})
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})
const dataList = ref([])
const getDetail = async () => {
  const res = await getDeviceDetail(id)
  dataList.value = JSON.parse(res.metadata)?.properties.filter(item => item.expands.isDisplay===true)
  const params = {
    dashboard: 'device',
    dimension: 'history',
    measurement: 'properties',
    object: res.productId,
    params: {
      deviceId: res.id,
      history: 1,
      properties: dataList.value.map(item => item.id)
    }
  }
  getDashboard(params)
}
const getDashboard = async params => {
  const res = await getDeviceDashboard(params)
  dataList.value.forEach(item => {
    res.forEach(r => {
      if (r.data.value.property == item.id) {
        item.formatValue = r.data.value.formatValue
        item.updateTime = r.data.timeString
        return
      }
    })
  })
}
const goto = type => {
  uni.navigateTo({
    url: `/pages/monitoring-center/device/device-history?id=${id}&type=${type}`
  })
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  padding: 40rpx;
  .item-box {
    width: 100%;
    height: 300rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 8px;
    display: flex;
    flex-flow: column;
    margin-bottom: 32rpx;
  }
  .head {
    height: 96rpx;
    line-height: 96rpx;
    padding: 0 24rpx;
    border-bottom: 1px solid rgba(109, 155, 212, 0.3);
  }
  .info {
    word-break: break-all;
    padding: 0 24rpx;
    flex: 1;
    .values {
      margin-top: 24rpx;
      font-size: 32rpx;
    }
    .times {
      color: #999999;
      margin-top: 24rpx;
      font-size: 24rpx;
    }
    .times2 {
      margin-top: 24rpx;
      font-size: 28rpx;
    }
  }
}
</style>
