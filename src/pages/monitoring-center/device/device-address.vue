<template>
  <view class="content">
    <template v-for="(item, index) in dataList">
      <view
        v-if="item.key"
        class="item-box"
        :key="item.key"
        @click="goto(item)">
        <!-- <view class="head"> -->
          <!-- <text class="t-icon t-icon-channel"></text> -->
		  <uni-icons
		    color="#0492dc"
		    type="home-filled"
		    size="30"></uni-icons>
          {{ item.key }}
		  {{ ' ['+item.value+'台]' }}
        <!-- </view> -->
      </view>
    </template>
    <no-data v-if="noData"></no-data>
  </view>
</template>
<script setup>
// import { myStorage } from '@/utils/storage.js'
import { getAlarmLevelConfig, getWarningList, getDeviceAddressCategory } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import NoData from '@/components/noData.vue'
import dayjs from 'dayjs'
import { myStorage } from '@/utils/storage.js'
// import { getDeviceAddressCategory } from '@/api/index'
// import { ref, reactive } from 'vue'
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})
let total = 0
const dataList = ref([])
const noData = ref(false)
const getList = async () => {
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
  
  if(res.length==1&&res[0].key==='其他'){
	  uni.navigateTo({
	    url: `/pages/monitoring-center/device/index`
	  })
  }
  else{
	  dataList.value = res
	  if(res.length==0){
		  noData.value = true
	  }
  }
  // total = res.total
}
getList()
// const dataList = ref([])
const imgList = [
  'https://iot.jxts119.com/images/fire/fire1.png',
  'https://iot.jxts119.com/images/fire/fire2.png',
  'https://iot.jxts119.com/images/fire/fire3.png',
  'https://iot.jxts119.com/images/fire/fire4.png',
  'https://iot.jxts119.com/images/fire/fire5.png'
]
const goto = val => {
  uni.navigateTo({
    url: `/pages/monitoring-center/device/index?address=${val.key}`
  })
}
const type = ref('normal')
// const noData = ref(true)
// onLoad(query => {
//   type.value = query.type
//   const params = {
//     pageIndex: 1,
//     pageSize: 9999,
//     sorts: [{ name: 'alarmTime', order: 'desc' }],
//     terms:
//       type.value === 'normal'
//         ? []
//         : [
//             {
//               terms: [
//                 {
//                   type: 'or',
//                   value: type.value,
//                   termType: 'eq',
//                   column: 'state'
//                 }
//               ]
//             }
//           ]
//   }
//   Promise.all([getAlarmLevelConfig(), getWarningList(params)]).then(res => {
//     const data1 = res[0].levels
//     const data2 = res[1].data
//     const arr = []
//     data2.forEach(item => {
//       arr[item.level] = true
//     })
//     dataList.value = data1.map(item => {
//       if (arr[item.level]) {
//         item.show = true
//         noData.value = false
//       }
//       return item
//     })
//   })
// })
</script>
<style lang="scss" scoped>
@import url('@/static/iconfont.css');
@import url('@/static/iconfont-weapp-icon.css');
		.vue-iconfont{
			font-family: iconfont;
		}
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
}
</style>
