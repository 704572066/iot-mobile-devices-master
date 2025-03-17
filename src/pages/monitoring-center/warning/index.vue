<template>
  <view class="content">
	  <!-- 时间选择器 -->
	<view v-if="type==='normal'">
	  		
	      <uni-datetime-picker
	        start-placeholder="请选择开始时间"
			end-placeholder="请选择结束时间"
			type="datetimerange"
			v-model="dateRange"
	      ></uni-datetime-picker>
	  
	      <!-- 搜索按钮 -->
	      <button @click="search()">搜索</button>
	</view>
    <scroll-view
      style="height: 100vh"
      scroll-y
      @scrolltolower="getData">
      <view
        class="item-box"
        v-for="item in dataList"
        :key="item.name">
        <view class="head">
          {{ item.targetName || item.alarmName }}
          <!-- <text
            v-if="type === 'warning'"
            :style="{
              color: item.state?.text === '告警中' ? 'red' : 'green'
            }"
            >[{{ item.state?.text }}]</text
          > -->
          <button
           v-if="
			 item?.state?.text === '告警中' &&
			 type === 'warning' &&
			 item.fireInvoke
		   "
            @click.stop="toFun(item)"
            type="primary"
            class="action-btn"
            size="mini">
            操作
          </button>
        </view>
        <view class="info">
          <view class="values">{{ item.alarmName || '--' }}</view>
          <!-- <view class="times">告警描述:  </view>
          <view class="times2">{{ item.description }}</view> -->
          <!-- <view class="times">最近告警时间:  {{
            dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')
          }} </view> -->
		  <view class="times">{{
		    dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')
		  }} </view>
          <!-- <view class="times2">{{
            dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')
          }}</view> -->
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
import { myStorage } from '@/utils/storage.js'
import { getWarningList, getWarningListByOrgId } from '@/api/index'
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import dayjs from 'dayjs'

const queryParams = reactive({
  pageIndex: 0,
  pageSize: 10
})
const dataList = ref([])
const status = ref('more')
// const datePickerRefs = ref<any>(null);

const dateRange = ref([])
const getData = async () => {
  if (status.value == 'nomore') return
  const userInfo = JSON.parse(myStorage.get('userInfo') || '{}')
  let params = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    sorts: [{ name: 'alarmTime', order: 'desc' }],
    terms:
      type.value === 'normal'
        ? [
            {
              terms: [
                {
                  type: 'or',
                  value: level.value,
                  termType: 'eq',
                  column: 'level'
                }
              ]
            }
          ]
        : [
            {
              terms: [
                {
                  type: 'or',
                  value: level.value,
                  termType: 'eq',
                  column: 'level'
                },
                {
                  type: 'and',
                  value: type.value,
                  termType: 'eq',
                  column: 'state'
                }
              ]
            }
          ]
  }
  if(dateRange.value.length>1){
	  params.terms[0].terms.push({
        type: "or",
        value: dateRange.value[0],
        termType: "gt",
        column: "alarmTime"
      })
	  params.terms[0].terms.push({
	    type: "and",
	    value: dateRange.value[1],
	    termType: "lt",
	    column: "alarmTime"
	  })
  }
  status.value = 'loading'
  let res
  if(userInfo.isAdmin) {
	  res = await getWarningList(params).finally(() => {
		status.value = 'more'
	  })
  }
  else {
	  params.terms.push({
        type: 'and',
        value: userInfo.orgList?.length ? userInfo.orgList[0].id : undefined,
        termType: 'eq',
        column: 'orgId'
      })
	  res = await getWarningListByOrgId(params).finally(() => {
	  		status.value = 'more'
	  })
  }
  dataList.value = dataList.value.concat(res.data)
  if (dataList.value.length >= res.total) {
    status.value = 'nomore'
  }
  else{
	queryParams.pageIndex++
	status.value = 'more'
  }
}
const goto = val => {
  uni.navigateTo({
    url: `/pages/monitoring-center/warning/warning-records?id=${val.id}&alarmConfigId=${val.alarmConfigId}`
  })
}

const toFun = val => {
  uni.navigateTo({
    url: `/pages/monitoring-center/device/device-function?id=${val.targetId}`
  })
}
const type = ref('normal')
const level = ref(0)
onLoad(query => {
  type.value = query.type
  level.value = query.level
  getData()
})
const search = async () => {
	dataList.value=[]
	queryParams.pageIndex=0
	status.value = 'loading'
	getData()
	
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
    display: flex;
    align-items: center;
    .action-btn {
      margin-left: auto;
      margin-right: 0;
    }
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
