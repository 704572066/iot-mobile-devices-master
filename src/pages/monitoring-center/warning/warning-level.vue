<template>
  <view class="content">
    <template v-for="(item, index) in dataList">
      <view
        v-if="item.show"
        class="item-box"
        :key="item.name"
        @click="goto(item)">
       <!-- <view class="head"> -->
          <image
            class="img-40"
            :src="imgList[index]"></image>
          {{ item.title }}
        <!-- </view> -->
      </view>
    </template>
    <no-data v-if="noData"></no-data>
  </view>
</template>
<script setup>
import { myStorage } from '@/utils/storage.js'
import { getAlarmLevelConfig, getWarningList, getWarningListByOrgId } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import NoData from '@/components/noData.vue'
import dayjs from 'dayjs'

const dataList = ref([])
const imgList = [
  'https://iot.jxts119.com/images/alarm/alarm1.png',
  'https://iot.jxts119.com/images/alarm/alarm2.png',
  'https://iot.jxts119.com/images/alarm/alarm3.png',
  'https://iot.jxts119.com/images/alarm/alarm4.png',
  'https://iot.jxts119.com/images/alarm/alarm5.png'
]
const goto = val => {
  uni.navigateTo({
    url: `/pages/monitoring-center/warning/index?level=${val.level}&type=${type.value}`
  })
}
const type = ref('normal')
const noData = ref(true)
onLoad(query => {
  type.value = query.type
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let params = {
    pageIndex: 1,
    pageSize: 9999,
    sorts: [{ name: 'alarmTime', order: 'desc' }],
    terms:
      type.value === 'normal'
        ? []
        : [
            {
              terms: [
                {
                  type: 'or',
                  value: type.value,
                  termType: 'eq',
                  column: 'state'
                }
              ]
            }
          ]
  }
  if(!userInfo.isAdmin) {
  	  params.terms.push({
        type: 'and',
        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
        termType: 'eq',
        column: 'orgId'
      })
  }
  Promise.all([getAlarmLevelConfig(), userInfo.isAdmin?getWarningList(params):getWarningListByOrgId(params)]).then(res => {
    const data1 = res[0].levels
    const data2 = res[1].data
    const arr = []
    data2.forEach(item => {
      arr[item.level] = true
    })
    dataList.value = data1.map(item => {
      if (arr[item.level]) {
        item.show = true
        noData.value = false
      }
      return item
    })
  })
})
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 48rpx;
  .item-box {
    margin-top: 40rpx;
    width: 300rpx;
    height: 200rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 8px;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .total-num {
      position: absolute;
      right: -12rpx;
      top: -12rpx;
      background: red;
      color: #ffffff;
      text-align: center;
      border-radius: 50%;
      width: 36rpx;
      height: 38rpx;
      font-size: 24rpx;
      line-height: 36rpx;
    }
  }
  .img-40 {
      height: 70rpx;
      width: 70rpx;
    }
}
</style>
