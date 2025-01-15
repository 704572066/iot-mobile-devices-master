<template>
  <view class="content">
    <scroll-view
      style="height: 100vh"
      scroll-y
      @scrolltolower="getData">
      <view
        class="item-box"
        v-for="item in dataList"
        :key="item.name"
        @click="goto(item.id)">
        <view class="head">
          {{ item.alarmConfigName }}
        </view>
        <view class="info">
          <view class="times">告警描述 </view>
          <view class="times2">{{ item.description }}</view>
          <view class="times">告警时间 </view>
          <view class="times2">{{
            dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')
          }}</view>
        </view>
      </view>
      <uni-load-more
        :status="status"
        loading-text="加载中..."
        loadmore-text="轻轻上拉"
        nomore-text="没有更多数据" />
    </scroll-view>
  </view>
</template>
<script setup>
import { getWarningHistory } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import dayjs from 'dayjs'

let id
let alarmConfigId
onLoad(query => {
  id = query.id
  alarmConfigId = query.alarmConfigId
  getData()
})
const queryParams = reactive({
  pageIndex: 0,
  pageSize: 12
})
const dataList = ref([])
const status = ref('more')
const getData = async () => {
  if (status.value == 'nomore') return
  const params = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    // alarmConfigId: alarmConfigId,
    terms: [
      {
        column: 'alarmRecordId',
        termType: 'eq$not',
        value: id,
        type: 'and'
      }
    ],
    sorts: [{ name: 'alarmTime', order: 'desc' }]
  }
  status.value = 'loading'
  const res = await getWarningHistory(alarmConfigId, params).finally(() => {
    status.value = 'more'
  })
  dataList.value = dataList.value.concat(res.data)
  if (dataList.value.length >= res.total) {
    status.value = 'nomore'
  }
}
</script>
<style lang="scss" scoped>
.content {
  // padding: 40rpx;
  .item-box {
    // width: 100%;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 8px;
    display: flex;
    flex-flow: column;
    margin: 40rpx 40rpx 0rpx 40rpx;
    padding-bottom: 32rpx;
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
