<template>
  <view class="content">
    <view
      class="item-box-top"
      >
	  <image
	    class="bg"
	    src="@/static/bg.png"
	    alt=""></image>
		<view class="text-overlay">同盛物联</view>
		<view class="text-overlay-small">实时监测灭火装置</view>
    </view>
	<view
	  class="item-box"
	  v-for="item in dataList"
	  :key="item.name"
	  @click="goto(item.url)">
	  <view
	    class="total-num"
	    v-if="item.name === '当前告警'">
	    {{ total }}
	  </view>
	  <uni-icons
	    color="#0492dc"
	    :type="item.icon"
	    size="30"></uni-icons>
	  {{ item.name }}
	</view>
  </view>
</template>
<script setup>
import { getWarningList, getWarningListByOrgId } from '@/api/index'
import { myStorage } from '@/utils/storage.js'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
const dataList = [
  {
    name: '硬件列表',
    // url: '/pages/monitoring-center/device/index',
	url: '/pages/monitoring-center/device/device-address',
    icon: 'list'
  },
  // {
  //   name: '当前告警',
  //   url: '/pages/monitoring-center/warning/warning-level?type=warning',
  //   icon: 'notification-filled'
  // },
  {
    name: '当前告警',
    url: '/pages/monitoring-center/warning/index?type=warning',
    icon: 'notification-filled'
  },
  // {
  //   name: '历史告警',
  //   url: '/pages/monitoring-center/warning/warning-level?type=normal',
  //   icon: 'notification-filled'
  // },
  {
    name: '历史告警',
    url: '/pages/monitoring-center/warning/index?type=normal',
    icon: 'notification-filled'
  },
  {
    name: '硬件地图',
    url: '/pages/monitoring-center/maps/index',
    icon: 'map-filled'
  },
  {
    name: '监控视频',
    url: '/pages/monitoring-center/monitoring/index',
    icon: 'videocam-filled'
  }
]
const total = ref(0)
const getData = async () => {
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
  total.value = res.total
}
const goto = url => {
  uni.navigateTo({
    url
  })
}
onShow(() => {
  getData()
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
  .item-box-top {
    margin-top: 40rpx;
    width: 100%;
    height: 300rpx;
    flex-shrink: 0;
    // background: #ffffff;
	// background: url('/static/freepik__retouch__72762.png');
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    border-radius: 8px;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    position: relative;
	.bg {
	  // position: absolute;
	  // top: 0;
	  // left: 0;
	  height: 100vh;
	  width: 100%;
	  z-index: -1;
	  border-radius: 8px;
	}
	.text-overlay {
	  position: absolute;
	  top: 25px;
	  left: 20px;
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
</style>
