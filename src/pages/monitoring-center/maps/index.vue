<template>
  <view>
    <map
      style="width: 100%; height: 100vh"
      ref="map"
      id="map"
	  :latitude="latitude" :longitude="longitude" :scale="scale" :markers="markers"
	  @regionchange="onViewChange">
	  <!-- 这里增加上 regionchange 事件处理中心坐标的变更 -->
    </map>
	<!-- 按钮-返回原位 -->
	<view class="tool-btn" @click="getUserLocation">
		<text class="vue-iconfont icon-dingwei"></text>
	</view>
	<!-- 按钮-放大 -->
	<view class="tool-btn scale-up-btn" @click="mapScaleUp">
		<text class="vue-iconfont icon-fangda"></text>
	</view>
	<!-- 按钮-缩小 -->
	<view class="tool-btn scale-down-btn" @click="mapScaleDown">
		<text class="vue-iconfont icon-suoxiao"></text>
	</view>
  </view>
</template>
<script>
import { myStorage } from '@/utils/storage.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getDeviceList } from '@/api/index'
import { ref, reactive } from 'vue'

export default {
  data() {
    return {
	  // 计算高度属性
	  windowHeight: 800,
	  statusBarHeight: 30,
	  navTop: 30,
	  // 地图
	  _mapContext: null,
      latitude: 30,
      longitude: 120,
      scale: 14, // 设置地图的缩放级别
	  minScale: 4.5,
    //   markers: [ // 设置标记点
    //     {
		  // id: 1,
    //       latitude: 30,
    //       longitude: 120,
    //       title: 'ts',
    //       iconPath: 'https://iot.jxts119.com/images/fire/fire2.png',
    //     },
    //   ],
    };
  },
  created() {
  	let that = this;
  	uni.getSystemInfo({
  		success(res) {
  			// #ifdef H5
  			that.windowHeight = res.windowHeight;
  			// #endif
  			// #ifndef H5
  			that.windowHeight = res.windowHeight + res.statusBarHeight;
  			// #endif
  			that.statusBarHeight = res.statusBarHeight;
  			that.navTop = res.statusBarHeight + 10;
  		}
  	})
  	this.getUserLocation();
  	this.getList();
  },
  onReady() {
      this._mapContext = uni.createMapContext("map", this);
  },
  methods: {
	  async getList(){
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
	    const res = await getDeviceList({ ...params })
		// console.log(res.data)
		const result = res.data.filter(item => item.geoPoint).map(item1 => {
		  const [longitude, latitude] = item1.geoPoint.split(',');
		  const longitudeNum = parseFloat(longitude);
		  const latitudeNum = parseFloat(latitude);
		  return {
				id: 0,
				latitude: latitudeNum,
				longitude: longitudeNum,
				iconPath: '/static/zhengchangdianwei.png',   
				width: 18,
				height: 23, 
				alpha: 1,   //透明度
				callout: {  //自定义标记点上方的气泡窗口 点击有效
					content: item1.name,//文本
					color: '#ffffff',//文字颜色
					fontSize: 12,//文本大小
					borderRadius: 5,//边框圆角
					padding: 5,
					bgColor: '#3f94fd',//背景颜色
					display: 'ALWAYS',//常显
				}
			};
		});
		this.markers = result;
		this._mapContext.addMarkers({
			markers: this.markers,
			clear: true
		});
	    // dataList.value = res.data
	    // total = res.total
	  },
      getUserLocation() {
		  let that = this;
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            that.longitude = res.longitude
            that.latitude = res.latitude
          },
		  fail:function(e){
		  				console.log("获取位置信息失败", e.errMsg);
		  }
        })
      },
	  
	  	// 点击地图marker点
	  	markertap(e){
	  		// this.deviceId = e.detail.markerId;
	  		// 此处根据拿到的id向后端发送请求，获取详情数据
	  		// this.shopPopupShow = true;
	  	},
		// 回到原位，恢复默认缩放
	  toLocation(){
		  let that = this;
		  uni.getLocation({
		    type: 'gcj02',
		    success: (res) => {
		      // that.longitude = res.longitude
		      // that.latitude = res.latitude
			  this.updateMapScale(0, 12);
			  this._mapContext.moveToLocation({
			  			  longitude: res.longitude,
			  			  latitude: res.latitude
			  });
			  
		    },
		    fail:function(e){
		    				console.log("获取位置信息失败", e.errMsg);
		    }
		  })
		  
	  },
      // 放大地图
	  mapScaleUp(){
		this.updateMapScale(1);
	  },
	  // 缩小地图
	  mapScaleDown(){
		this.updateMapScale(2);
	  },
	   // 地图视野变化
	  onViewChange(e) {
		if (e.type == 'end') { // 仅获取结束坐标
			this._mapContext.getCenterLocation({
				success: res => {
					this.longitude = res.longitude; // 中心经度
					this.latitude = res.latitude; // 中心纬度
				}
			});
		}
	  },
	  //设置地图缩放等级
	  	updateMapScale(type, level){
			let that = this;
	  		this._mapContext.getScale({
	  			success: res=>{
	  				this.scale = res.scale;
	  				this.$nextTick(()=>{
	  					// 指定缩放级别
	  					if(type == 0){
	  						this.scale = level
	  					}
	  					// 放大
	  					else if(type == 1 && this.scale<20){
	  						this.scale = this.scale+1>20 ? 20 : this.scale+1
	  					}
	  					// 缩小
	  					else if(type == 2 && this.scale>this.minScale){
	  						this.scale = this.scale-1<this.minScale ? this.minScale : this.scale-1
	  					}
	  				})
	  			}
	  		})
	  	},
  }
};
</script>
<style lang="scss" scoped>
@import url('@/static/iconfont.css');
		.vue-iconfont{
			font-family: iconfont;
		}
$boxShadow: 0 0 8px #ccc;
.nav-back {
    position: fixed;
    z-index: 9;
    left: 10px;
    padding: 6px;
    background-color: #fff;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
	box-shadow: $boxShadow;
	.vue-iconfont{
		font-size: 20px;
		font-weight: bold;
	}
}
.map{
	width: 750rpx;
	position: relative;
	z-index: 0;
}
.tool-btn{
	position: fixed;
    right: 15px;
    bottom: 350px;
    background-color: #ffffff;
    border-radius: 8px;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
	box-shadow: $boxShadow;
	.vue-iconfont{
		color: #222;
		font-size: 32px;
	}
	&.scale-up-btn{
		bottom: 300px;
		.vue-iconfont{
			font-size: 32px;
		}
	}
	&.scale-down-btn{
		bottom: 250px;
		.vue-iconfont{
			font-size: 32px;
		}
	}
}
</style>