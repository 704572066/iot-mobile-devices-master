<template>
  <view class="content">
    <view class="choose-box">
      <view
        @click="changeSelect(item)"
        class="item-box"
        :class="item === selectType ? 'item-box-active' : ''"
        v-for="item in typeList"
        :key="item">
        {{ item }}
      </view>
    </view>
    <MyChart
      v-if="showChart"
      :option="options"
      canvasId="mlEcharts"></MyChart>
  </view>
</template>
<script setup>
import { getDeviceDashboardHistoryChart } from '@/api/index'
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import MyChart from '@/components/echart'

const option = ref({
  title: { text: '', left: 'center' },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 10
    },
    {
      start: 0,
      end: 10
    }
  ],
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    name: ''
  },
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
})
const showChart = ref(false)
let id
let type

const typeList = ['一小时', '一天', '上月', '本月']
const selectType = ref('一小时')
const queryParams = {
  startTime: null,
  endTime: null
}
const changeSelect = name => {
  selectType.value = name
  if (name === '一小时') {
    queryParams.startTime = dayjs().subtract(1, 'hour').valueOf()
    queryParams.endTime = dayjs().valueOf()
  }
  if (name === '一天') {
    queryParams.startTime = dayjs().subtract(1, 'day').valueOf()
    queryParams.endTime = dayjs().valueOf()
  }
  if (name === '上月') {
    queryParams.startTime = dayjs().subtract(1, 'month').valueOf()
    queryParams.endTime = dayjs().valueOf()
  }
  if (name === '本月') {
    queryParams.startTime = dayjs().startOf('month').valueOf()
    queryParams.endTime = dayjs().valueOf()
  }
  getDetail()
}
const getDetail = async () => {
  const params = {
    paging: false,
    id,
    type,
    terms: [
      {
        column: 'timestamp$BTW',
        value: [queryParams.startTime, queryParams.endTime],
        type: 'and'
      }
    ],
    sorts: [{ name: 'timestamp', order: 'asc' }]
  }
  showChart.value = false
  const res = await getDeviceDashboardHistoryChart(params)
  // dataList.value = res
  const data = {
    categories: [],
    seriesData: []
  }
  res.forEach(item => {
    data.categories.push(dayjs(item.timestamp).format('HH:mm:ss'))
    data.seriesData.push(item.value)
  })
  option.value.title.text = res[0]?.propertyName
  option.value.xAxis.data = data.categories
  option.value.series[0].data = data.seriesData
  option.value.series[0].name = res[0]?.propertyName
  showChart.value = true
}
const options = computed(() => option.value)
onLoad(query => {
  id = query.id
  type = query.type
  changeSelect('一小时')
})

//这里的 750 对应 css .charts 的 width
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  .choose-box {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    margin-bottom: 40rpx;
    text-align: center;
    border-bottom: 1px solid rgb(235, 235, 235);
    .item-box {
      width: 50%;
    }
    .item-box-active {
      background: fixed rgba(0, 0, 0, 0.1);
      color: #fff;
    }
  }
  .charts {
    width: 100%;
    height: 800rpx;
  }
}
</style>
