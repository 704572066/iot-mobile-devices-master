<template>
  <view class="content">
	<view >
		  <uni-data-select
		        v-model="text"
		        :localdata="range"
		        @change="change"
				clear="true"
				placeholder="选择设备名称"
		      ></uni-data-select>
	  
	      <!-- 搜索按钮 -->
	      <button @click="search()">搜索</button>
	</view>
    <!-- <uni-load-more status="more"></uni-load-more> -->
	<scroll-view
	  style="height: 100vh"
	  scroll-y
	  @scrolltolower="getList">
    <view
      class="item-box"
      v-for="item in dataList"
      :key="item.name"
      >
      <view class="head">
        <text :style="{ color: item.state?.text === '离线' ? 'red' : 'green' }"
          >[{{ item.state?.text }}]</text
        >
        {{ item.name }}
      </view>
      <view class="info">
        <!-- <image
          class="imgs"
          :src="item.photoUrl"></image> -->
        <!--{{ item.id }}-->
		
		  <button
		    type="primary"
			size="mini"
				  style="backgroundColor:#0492dc" 
		    @click="deviceStatus(item.id)">
		    运行状态
		  </button>
		  <button
		    type="primary"
			size="mini"
			style="backgroundColor:#0492dc" 
		    @click="selfCheck(item.id)">
		    设备自检
		  </button>
		  <button
			  v-if="item.videoId??''!==''"
			  type="primary"
			  size="mini"
			  style="backgroundColor:#0492dc" 
			  @click="openVideo(item.videoId)">
			  关联视频
		  </button>
      </view>
	  <view class="info">
	    <!-- <image
	      class="imgs"
	      :src="item.photoUrl"></image> -->
	    <!--{{ item.id }}-->
	  		
	  		  <button
	  		    type="primary"
	  			size="mini"
	  				  style="backgroundColor:#0492dc" 
	  		    @click="setParams(item.id)">
	  		    修改参数
	  		  </button>
	  		  <button
	  		    type="primary"
	  			size="mini"
	  			style="backgroundColor:#0492dc" 
	  		    @click="historyAlarm(item.id)">
	  		    历史告警
	  		  </button>
	  		  <button
	  			  type="primary"
	  			  size="mini"
	  			  style="backgroundColor:#0492dc" 
	  			  @click="deviceLocation(item.id)">
	  			  设备定位
	  		  </button>
	  </view>
    </view>
	<uni-load-more
	    :status="status"
	    loading-text="加载中..."
	    loadmore-text="轻轻上拉"
	    nomore-text="没有更多数据" />
	</scroll-view>

    <uni-popup
      ref="showPopup"
      type="bottom">
      <view class="popup-content">
        <button
          type="primary"
		  style="backgroundColor:#0492dc" 
          @click="status(item.id)">
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
import { getDeviceList, getDeviceListNoPaging, getDeviceDetail, getMonitoringDetail } from '@/api/index'
import { ref, reactive } from 'vue'
import URL from '@/utils/url.js'
// import { textStride } from 'XrFrame/components/text/Text'
let address
const range = ref([])
const selectDeviceName = ref('')
const text = ref('')
const queryParams = reactive({
  pageIndex: 0,
  pageSize: 10
})
let total = 0
const dataList = ref([])
const status = ref('more')
let resData = []
const videoId = ref('')
let deviceNameList = []
onLoad(query => {
  address = query.address
  getData()
  getList()
})
const getList = async () => {
  if (status.value == 'nomore') return

  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let params = {
	pageIndex: queryParams.pageIndex,
	pageSize: queryParams.pageSize,
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
		pageIndex: queryParams.pageIndex,
		pageSize: queryParams.pageSize,
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
  if(text.value !== ''){
  	  params.terms.push({
  	    type: "and",
  	    value: text.value,
  	    termType: "eq",
  	    column: "name"
  	  })
  }
  const res = await getDeviceList({ ...queryParams, ...params })
  dataList.value = dataList.value.concat(res.data)
  // resData = dataList.value
  // for(let i=0; i<res.data.length; i++){
  // 	  deviceNameList.push({value:res.data[i].name,text:res.data[i].name})
  // }
  // range.value = deviceNameList
  if (dataList.value.length >= res.total) {
    status.value = 'nomore'
  }
  else{
  	queryParams.pageIndex++
  	status.value = 'more'
  }
  total = res.total
}
// getList()
const getData = async () => {
  let deviceNameList = []
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let params = {
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
  // if(address){
	 //  params = {
	 //    sorts: [{ name: 'createTime', order: 'desc' }],
	 //    terms: [
	 //      {
	 //        type: 'and',
	 //        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
	 //        termType: 'eq',
	 //        column: 'orgId'
	 //      },
		//   {
		//     type: 'and',
		//     value: address,
		//     termType: 'eq',
		//     column: 'deviceAddress'
		//   }
	 //    ]
	 //  }
  // }
  const res = await getDeviceListNoPaging({...params })
  for(let i=0; i<res.length; i++){
  	  deviceNameList.push({value:res[i].name,text:res[i].name})
  }
  range.value = deviceNameList
}
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
const deviceStatus = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-channel?id=${id}`
	})
}
const deviceFunction = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-function?id=${id}`
	})
}
const selfCheck = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-function-selfcheck?id=${id}`
	})
}
const setParams = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-function-setparams?&id=${id}`
	})
}
const deviceLocation = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-location?id=${id}`
	})
}
const historyAlarm = id => {
	uni.navigateTo({
	  url: `/pages/monitoring-center/device/device-history-alarm?type=normal&id=${id}`
	})
}
const search = async () => {
	// if(text.value!=''){
	// 	dataList.value= resData.filter(dev => dev.name==text.value)
	// }
	// else{
	// 	dataList.value= resData
	// }
	dataList.value=[]
	queryParams.pageIndex=0
	status.value = 'loading'
	getList()
	// queryParams.pageIndex=0
	// status.value = 'loading'
	// getData()
	
}
const change = async(e) => {
	// console.log("e:", e);
	// selectDeviceName.value = e
	e?(text.value = e):(text.value = '')
	// e?(this.text = e):(this.text = '')
}
const showPopup = ref()
const openVideo = async (videoId) => {
	    // showPopup.value.close()
	    console.log("open: "+ videoId)
		const res = await getMonitoringDetail(videoId)
		const channelNo = 1
		const parsedUrl = new URL(res.streamUrl)
		// console.log(res.streamUrl)
		// console.log(parsedUrl)
		const deviceSerial = videoId
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
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  // padding: 40rpx;
  .item-box {
    // width: calc(100% - 20rpx);
    height: 300rpx;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
    // margin-bottom: 40rpx;
	margin: 40rpx 40rpx 0rpx 40rpx;
	padding-bottom: 32rpx;
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
    padding: 16rpx 24rpx;
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
