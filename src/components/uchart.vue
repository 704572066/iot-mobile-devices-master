<template>
    <view class="charts">
        <view class="content content-base-bg">
          <qiun-data-charts type="line" id="productionLimitAlarm"  :canvas2d="true" background="#242424" :opts="opts" :chartData="chartData" :ontouch="true" :onzoom="true" />
        </view>
    </view>
</template>

<script>


    export default {
        props: ["type", 'reports'],
        watch: {
            reports() {
                this.init();
            }
        },
		data() {
		    return {
		        chartData: {},
		        opts: {
		            color: ["#1890FF", "#91CB74"],
		            padding: [-10, 15, 15, 0],
		            enableScroll: true,
		            //不显示数字
		            dataLabel: false,
		            //不显示圆点
		            dataPointShape: false,
		            legend: {
		                // 图例位置和颜色
						show: false,  // 隐藏图例
		                position: 'top',
		                float: 'right',
		                padding: 20,
		                fontColor:'#fff'
		            },
		            xAxis: {
		                // 允许滚动
		                disableGrid: true,
		                scrollShow: true,
						labelCount: 5,
						rotateLabel: true,
						rotateAngle: -10,
		                // 单屏展示7条
		                itemCount: 20,
		                axisLine: false,
		                fontSize: 10,
						interval: 'auto',
		                // 滚动条颜色
		                scrollColor: '#666',
		                scrollBackgroundColor: '#333'
		            },
		            yAxis: {
		                axisLine: false,
		                dashLength: 2,
		                gridType: "solid",
						tofix: 0,
						splitNumber: 10,
		                // 横向网格颜色
		                gridColor: '#2f2f2f',
		                data: [{
		                    fontSize: 10,
		                    axisLine: false ,//坐标轴轴线是否显示
							max: 150,
							min: 0,
							// tofix: 1,
		                }]
		            },
		            extra: {
		                line: {
		                    type: "curve",
		                    width: 2,
		                    activeType: "hollow",
		                    linearType: "custom",
		                    onShadow: true,
		                    animation: "horizontal"
		                }
		            }
		        }
		    };
		},
		methods:{
		    init() {
		        if (0 === this.reports.length) {
					// this.chartData = {}
					return	
				}
		        // 数据处理
		        let categories = []
		        let aData = [];
				let max = 0;
				let min = 0;
		        const format = 3 === this.type ? 'minute' : 'hour'
		        this.reports.forEach(item => {
					if (item.value > max) max = item.value;
					if (item.value < min) min = item.value;
					// const absV = Math.abs(item.value); // 取绝对值
					//   if (absV > maxAbsV) maxAbsV = absV;
					  // if (absV < minAbsV) minAbsV = absV;
		            categories.push(this.timeFormat(item.timestamp, format)) 
		            aData.push(item.value)
		        })
				// 向上取整到最接近的 10 的倍数
				max = Math.ceil(max / 10) * 10;
				min = Math.floor( min/ 10) * 10;

				this.opts.yAxis.data[0].max = max+10
				// console.log(Math.floor(max)+20)
				this.opts.yAxis.data[0].min = min
				// console.log( Math.floor(min)-20)
		        let res = {
		            categories: categories,
		            series: [{
		                    name: "值",
		                    setShadow: [
		                        3,
		                        15,
		                        30,
		                        "#1890FF"
		                    ],
		                    data: aData
		                },
		                
		            ]
		        };
				// console.log("res: "+res.categories[0])
		        this.chartData = res
				
		    },
		    timeFormat(timeStamp, type = "") {
		        var date = new Date();
		        date.setTime(timeStamp);
		        var y = date.getFullYear();
		        var m = date.getMonth() + 1;
		        m = m < 10 ? ('0' + m) : m;
		        var d = date.getDate();
		        d = d < 10 ? ('0' + d) : d;
		        var h = date.getHours();
		        h = h < 10 ? ('0' + h) : h;
		        var minute = date.getMinutes();
		        var second = date.getSeconds();
		        minute = minute < 10 ? ('0' + minute) : minute;
		        second = second < 10 ? ('0' + second) : second;
		        if (type == 'day') {
		            return m + '-' + d;
		        }
		        if (type == 'hour') {
		            return h + ':00' ;
		        }
				if (type == 'minute') {
				    return   m+'-'+d+' '+h + ':'+ minute+":"+second;
				}
		        return ''
		    },
		},
        mounted() {
            this.init();
        },
    };
</script>

<style scoped lang="scss">
    ::v-deep uni-canvas {
        height: 380rpx !important;
    }

    .charts {
        width: 100%;
        position: relative;
        touch-action: none;

        .tag {
            margin-bottom: 20rpx;

            view {
                color: #fff;
            }

            .box {
                width: 22rpx;
                height: 22rpx;
                border-radius: 4rpx;
                margin-right: 10rpx;
            }

            .earn {
                background-color: #35BA61;
            }

            .exchange {
                background-color: #F33D42;
            }
        }

        .content {
            padding: 30rpx;
            border-radius: 30rpx;
        }
    }
</style>