<template>
  <view class="content">
	<view >
		  <uni-data-select
		        v-model="text"
		        :localdata="range"
		        @change="change"
				clear="true"
				placeholder="选择公司名称"
		      ></uni-data-select>
	  
	      <!-- 搜索按钮 -->
	      <button @click="search()">搜索</button>
	</view>
    <!-- <uni-load-more status="more"></uni-load-more> -->
	<scroll-view
	  style="height: 100vh"
	  scroll-y
	  @scrolltolower="getList">
    <view class="content1">
	<view
      class="item-box"
      v-for="item in dataList"
      :key="item.orgId"
	  @click="goto(item.orgId)"
      >
	  <uni-icons
	    color="#0492dc"
	    type="home-filled"
	    size="30"></uni-icons>
      <!-- <view class="head">
        <text>{{ item.orgName }}</text>
      </view> -->
	  <text >{{ item.orgName }}</text>
	  <!-- <text >[共{{ item.deviceNum }}台]</text> -->
    </view>
	</view>
	<uni-load-more
	    :status="status"
	    loading-text="加载中..."
	    loadmore-text="轻轻上拉"
	    nomore-text="" />
	</scroll-view>

   
  </view>
</template>
<script setup>
import { myStorage } from '@/utils/storage.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getDeviceList, getDeviceListNoPaging, getDeviceDetail, getDeviceOrgCategray } from '@/api/index'
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
  // address = query.address
  deviceNameList = []
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  for(let i=0; i<userInfo.orgList.length; i++){
  	  deviceNameList.push({value:userInfo.orgList[i].name,text:userInfo.orgList[i].name})
  }
  range.value = deviceNameList
  // getData()
  getList()
})
const getList = async () => {
  if (status.value == 'nomore') return

  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  
  
  
  let params = {
	pageIndex: queryParams.pageIndex,
	pageSize: queryParams.pageSize,
    sorts: [{ name: 'orgName', order: 'asc' }],
    terms: [
      {
        type: 'and',
        // value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
        // termType: 'eq',
		value: userInfo.orgList?.length ? userInfo.orgList.map(org => org.id): [],
		termType: 'in',
        column: 'orgId'
      }
    ]
  }
  if(text.value !== ''){
 	   params.terms.push({
 	     type: "and",
 	     value: text.value,
 	     termType: "eq",
 	     column: "name"
 	   })
  }
  const res = await getDeviceOrgCategray(params)
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

let selectInfo = {}
const goto = orgId => {
    uni.navigateTo({
      url: `/pages/monitoring-center/device/device-address?orgId=${orgId}`
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


</script>
<style lang="scss" scoped>
@import url('@/static/iconfont.css');
@import url('@/static/iconfont-weapp-icon.css');
		.vue-iconfont{
			font-family: iconfont;
		}
.content {
	
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  // padding: 40rpx;
 //  .item-box {
 //    height: 300rpx;
 //    flex-shrink: 0;
 //    background: #ffffff;
 //    box-shadow: 0px 1px 8px 0px rgba(109, 155, 212, 0.3);
	// margin: 40rpx 40rpx 0rpx 40rpx;
	// padding-bottom: 32rpx;
 //    border-radius: 8px;
 //    display: flex;
 //    flex-flow: column;
 //  }
 .content1 {
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
  // .head {
  //   height: 96rpx;
  //   line-height: 96rpx;
  //   padding: 0 24rpx;
  //   border-bottom: 1px solid rgba(109, 155, 212, 0.3);
  // }
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
// .popup-content {
//   display: flex;
//   padding: 40rpx;
//   background: #ffffff;
// }
</style>
