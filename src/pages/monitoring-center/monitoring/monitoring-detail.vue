<template>
  <view>
    <web-view
      :webview-styles="{
        height: '250'
      }"
      :fullscreen="false"
      :src="src"></web-view>
  </view>
</template>
<script setup>
import { getMonitoringDetail } from '@/api/index'
// import { getCameraToken } from '@/api/third'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
let id
onLoad(query => {
  id = query.id
  getDetail()
})

const src = ref()
const getDetail = async () => {
  const res = await getMonitoringDetail(id)
  // const streamUrl = JSON.parse(res.result)?.streamUrl
  // src.value = res.streamUrl
  src.value = `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/482097123/1.live&autoplay=1&accessToken=at.1pidzmqwdh07j2c54ysm6qm699xbcx1n-8z6m4rcc1m-0taaoad-53izavro2`
}
// const src = ref()
// const getToken = async () => {
//   const data = await getCameraToken()
//   src.value = `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/E65831951/1.live&autoplay=1&accessToken=${data}`
// }
// getToken()
</script>
