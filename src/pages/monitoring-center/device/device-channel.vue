<template>
  <view class="content">
	  <template v-for="(item, index) in dataList">
	    <view
	      v-if="item.ids.length>0"
	      class="item-box"
	      @click="goto(item)">
	      <view class="head">
	        <text class="t-icon t-icon-channel"></text>
	        {{ item.groupName }}
	      </view>
	    </view>
	  </template>
	  <no-data v-if="noData"></no-data>
<!--    <view
      class="item-box"
      v-for="item in dataList"
      :key="item.groupName"
      @click="goto(item.id)">
      <view class="head">
        {{ item.groupName }}
      </view>
      <view class="info">
        <view class="values">{{ item.formatValue || '--' }}</view>
        <view class="times">更新时间</view>
        <view class="times2">{{ item.updateTime || '--' }}</view>
      </view>
    </view> -->
  </view>
</template>
<script setup>
import { getDeviceDetail, getDeviceDashboard } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import NoData from '@/components/noData.vue'
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
const noData = ref(false)
const getDetail = async () => {
  const res = await getDeviceDetail(id)
  // dataList.value = JSON.parse(res.metadata)?.properties.filter(item => item.expands.isDisplay===true)
  // const params = {
  //   dashboard: 'device',
  //   dimension: 'history',
  //   measurement: 'properties',
  //   object: res.productId,
  //   params: {
  //     deviceId: res.id,
  //     history: 1,
  //     properties: dataList.value.map(item => item.id)
  //   }
  // }
  
  dataList.value = JSON.parse(res.metadata)?.properties.reduce((acc, property) => {
          const groupName = property.expands.groupName || '未分组';
          
          // 如果组名不存在，则初始化该组
          if (!acc[groupName]) {
            acc[groupName] = { groupName, ids: [] , deviceId: res.id, productId: res.productId};
          }
          
          // 将 id 添加到对应的组中
		  if (property.expands.isDisplay === true) {
			acc[groupName].ids.push(property.id);
		  }
		  // acc[groupName].deviceId = res.id;
		  // acc[groupName].productId = res.productId;
  
          return acc;
        }, {});
  if(dataList.value.length==0){
	    noData.value = true
  }
  console.log(dataList.value);
  
        // 返回一个数组，只包含 groupName 和 ids
        // return Object.values(groups);
		// }
  // getDashboard(params)
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
const goto = val => {
  uni.navigateTo({
    url: `/pages/monitoring-center/device/device-detail?id=${val.deviceId}&groupName=${val.groupName}`
  })
}
</script>
<style lang="scss" scoped>
@import url('@/static/iconfont.css');
@import url('@/static/iconfont-weapp-icon.css');
		.vue-iconfont{
			font-family: iconfont;
		}
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
  }
  .head {
    height: 96rpx;
    line-height: 96rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    .action-btn {
      margin-left: auto;
      margin-right: 0;
    }
  }
  .img-40 {
    height: 80rpx;
    width: 80rpx;
  }
}
</style>
