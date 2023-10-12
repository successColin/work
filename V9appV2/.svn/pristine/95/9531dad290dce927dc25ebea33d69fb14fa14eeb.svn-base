<template name="echartFramework">
	<view class="content">
		<!-- #ifdef APP-PLUS || H5 -->
		<view :change:prop="echarts.updateEcharts" :prop="datas" :id="datas.canvasId" class="echarts"></view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS || H5 -->
		<view>非 APP、H5 环境不支持</view>
		<!-- #endif -->
	</view>
</template>

<script>
	let myChart;
	export default {
		name: 'echart',
		data() {
			return {
				datas: {
					canvasId: this.canvasId,
					echartData: this.echartData,
				},
				myChart:{}
			}
		},
		props: {
			canvasId: {
				type: String,
				default: '1234'
			},
			echartData: {
				type: Object,
				default() {
				    return {}
			    }
			},
		},
	}
</script>

<script module="echarts" lang="renderjs">
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/js/echarts.js'
				
				document.head.appendChild(script)
				script.onload = this.initEcharts.bind(this)
			}
		},
		methods: {
			initEcharts() {
				this.myChart = echarts.init(document.getElementById(this.datas.canvasId))
				// 观测更新的数据在 view 层可以直接访问到
				this.myChart.setOption(this.datas.echartData)
			},
			updateEcharts() {
				this.myChart.setOption(this.datas.echartData)
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.echarts {
		width: 100%;
		height: 100%;
	}
</style>
