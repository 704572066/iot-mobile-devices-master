<template>
  <view class="content">
    <!-- <uni-load-more status="more"></uni-load-more> -->
    <view
      class="item-box"
      v-for="item in dataList"
      :key="item.name"
      @click="openPopup(item)">
      <view class="head">
        <text :style="{ color: item.state?.text === '离线' ? 'red' : 'green' }"
          >[{{ item.state?.text }}]</text
        >
        {{ item.name }}
      </view>
      <view class="info">
        <image
          class="imgs"
          :src="item.photoUrl"></image>
        {{ item.id }}
      </view>
    </view>

    <uni-popup
      ref="showPopup"
      type="bottom">
      <view class="popup-content">
        <button
          type="primary"
		  style="backgroundColor:#0492dc" 
          @click="goto(1)">
          运行状态
        </button>
        <button
          type="primary"
		  style="backgroundColor:#0492dc" 
          @click="goto(2)">
          设备功能
        </button>
		<button
		  type="primary"
		  v-if="videoId !==''"
		  style="backgroundColor:#0492dc" 
		  @click.stop="openVideo">
		  关联视频
		</button>
      </view>
    </uni-popup>
  </view>
</template>
<script setup>
import { myStorage } from '@/utils/storage.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getDeviceList, getDeviceDetail, getMonitoringDetail } from '@/api/index'
import { ref, reactive } from 'vue'
import URL from '@/utils/url.js'
let address

const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})
let total = 0
const dataList = ref([])
const videoId = ref('')
onLoad(query => {
  address = query.address
  getList()
})
const getList = async () => {
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let params = {
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
  if(address){
	  params = {
	    sorts: [{ name: 'createTime', order: 'desc' }],
	    terms: [
	      {
	        type: 'and',
	        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
	        termType: 'eq',
	        column: 'orgId'
	      },
		  {
		    type: 'and',
		    value: address,
		    termType: 'eq',
		    column: 'deviceAddress'
		  }
	    ]
	  }
  }
  const res = await getDeviceList({ ...queryParams, ...params })
  dataList.value = res.data
  total = res.total
}
// getList()
let selectInfo = {}
const goto = type => {
  if (type === 1) {
    // uni.navigateTo({
    //   url: `/pages/monitoring-center/device/device-detail?id=${selectInfo.id}`
    // })
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-channel?id=${selectInfo.id}`
	})
  } else {
    uni.navigateTo({
      url: `/pages/monitoring-center/device/device-function?id=${selectInfo.id}`
    })
  }
  showPopup.value.close()
}

const showPopup = ref()
const openVideo = async () => {
	    showPopup.value.close()
	    console.log("open: "+ videoId.value)
		const res = await getMonitoringDetail(videoId.value)
		const channelNo = 1
		const parsedUrl = new URL(res.streamUrl)
		// console.log(res.streamUrl)
		// console.log(parsedUrl)
		const deviceSerial = videoId.value
		// 获取 search 参数中的 accessToken
		const accessToken = parsedUrl.params.accessToken
		// console.log(accessToken)
		uni.openEmbeddedMiniProgram({
			appId: 'wxf2b3a0262975d8c2',
			path: '/pages/live/live?accessToken='+accessToken+'&deviceSerial='+deviceSerial+'&channelNo=1'
		})
}

const openPopup = async (val) => {
  const id = val.id
  console.log("id: "+id)
  const res = await getDeviceDetail(id)
  videoId.value = res.videoId??''
  console.log("res.videoId: "+res.videoId)
  // console.log(videoId.value)
  selectInfo = val
  showPopup.value.open()
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 40rpx;
  .item-box {
    width: calc(50% - 20rpx);
    height: 300rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    margin-bottom: 40rpx;
    border-radius: 8px;
    display: flex;
    flex-flow: column;
  }
  .head {
    height: 96rpx;
    line-height: 96rpx;
    padding: 0 24rpx;
    border-bottom: 1px solid rgba(109, 155, 212, 0.3);
  }
  .info {
    display: flex;
    align-items: center;
    word-break: break-all;
    padding: 0 24rpx;
    flex: 1;
    .imgs {
      width: 100rpx;
      height: 100rpx;
      margin-right: 24rpx;
      flex-shrink: 0;
    }
  }
}
.popup-content {
  display: flex;
  padding: 40rpx;
  background: #ffffff;
}
</style>
