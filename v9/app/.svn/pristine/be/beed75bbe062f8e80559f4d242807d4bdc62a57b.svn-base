<template name="echartFramework">
	<!-- 带选择按钮 -->
	<view class="page-contenet"> 
		<m-back-bar>  
			<block slot="barTitle">名称</block>
		</m-back-bar>
		<!-- <image :src="echartsBg" mode="widthFix" class="echarts_bg"></image> -->
		<view class="charts-content">
			<m-group-area name="设备" :areaStype="1">
				<view class="huizong">
					<view class="item" v-for="(item, index) in reslut" :key="index">
						<view class="item-count" :style="{color:color_(index)}">{{item.count}}</view>
						<view class="item-name">{{item.name}}</view>
					</view>
				</view>
			</m-group-area>
			<m-group-area name="工单" :areaStype="1">
				<view class="huizong">
					<view class="item" v-for="(item, index) in reslut1" :key="index">
						<view class="item-count" :style="{color:color_(index)}">{{item.count}}</view>
						<view class="item-name">{{item.name}}</view>
					</view>
				</view>
			</m-group-area>
			
			<m-group-area name="数据统计图" :areaStype="2">
				<view style="position: relative;">
					<view id="myChart" ref="myEchart" style="height: 300px;"></view>
					<view class="chart-tip">
						<view class="tip-name" style="margin: 8upx 0;">{{chartTip.name}}</view>
						<view class="tip-name">{{chartTip.content}}</view>
					</view>
				</view>
			</m-group-area>
			<m-group-area name="区域统计" :areaStype="2">
				<list-pc></list-pc>
			</m-group-area>
		</view>
	</view>
</template>

<script>
	import {CHART_COLOR} from '@/common/constant/chart.js'
	import mGroupArea from '@/components/element/m-groupArea.vue'
	import ListPc from '@/components/makeup/listPC/ListPc.vue'
	export default{
		components:{mGroupArea,ListPc},
		data() {
			return {
				reslut: [{
					count:120,
					name:'设备数量'
				},{
					count:250,
					name:'计划工单数'
				},{
					count:150,
					name:'PM工单数'
				},{
					count:330,
					name:'维修人员数'
				},{
					count:449,
					name:'人员数'
				}],
				reslut1: [{
					count:360,
					name:'缺陷总数'
				},{
					count:89,
					name:'计划工单数'
				},{
					count:150,
					name:'PM工单数'
				}],
				chartTip:''
			}
		},
		methods:{
			color_(index) {
				console.log(CHART_COLOR[index%4])
				return CHART_COLOR[index%4]
			}
		}
	}
</script>
<script module="echarts" lang="renderjs">
	import yqMap from './yq.json'
	let myChart
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/echarts2.js'
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			initEcharts() {
				console.log("====================================")
				this.myChart = echarts.init(document.getElementById('myChart'));
				// 观测更新的数据在 view 层可以直接访问到
				echarts.registerMap('义乌', yqMap);
				let option
				this.myChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}<br/>{c} (p / km2)'
					},
					series: [
						{
							name: '香港18区人口密度',
							type: 'map',
							mapType: '义乌', // 自定义扩展图表类型
							layoutCenter: ['50%', '50%'],
							layoutSize: 300,
							label: {
								show: true,
								color: "rgba(68,68,68,1)" ,
								fontWeight: 400 ,
								fontFamily: 'PingFangSC-Regular,PingFang SC' ,
								fontSize: 10,
							},
							itemStyle:{
								borderColor:'#fff',
							},
							emphasis:{
								label:{
									color:'#fff',
									backgroundColor:'#C62127'
								},
								itemStyle:{
									areaColor:'#C62127',
								}
							},
							data: [
								{name:'建设', value: 31686.1},
								{name:'迎宾', value: 6992.6},
								{name:'幸福', value: 44045.49},
								{name:'崇德', value: 40689.64},
								{name:'四季', value: 40689.64},
								{name:'丹溪', value: 45180.97},
								{name:'春晗', value: 55204.26},
								{name:'稠山', value: 21900.9},
								{name:'爱民', value: 4918.26},
								{name:'望道', value: 5881.84},
								{name:'拥军', value: 4178.01},
								{name:'柳青', value: 2227.92},
								{name:'经发', value: 2180.98},
								{name:'前洪', value: 9172.94},
								{name:'凌云', value: 3368},
								{name:'复兴', value: 15477.48},
							],
							// 自定义名称映射
							nameMap: {
								'北苑街道': '',
								'建设社区': '建设',
								'迎宾社区': '迎宾',
								'幸福社区': '幸福',
								'崇德社区': '崇德',
								'四季社区': '四季',
								'丹溪社区': '丹溪',
								'春晗社区': '春晗',
								'稠山社区': '稠山',
								'爱民社区': '爱民',
								'望道社区': '望道',
								'拥军社区': '拥军',
								'柳青社区': '柳青',
								'经发社区': '经发',
								'前洪区域共建委': '前洪',
								'凌云小区': '凌云',
								'复兴社区': '复兴',
							}
						}
					]
				});
				const _this = this
				this.myChart.on('click', function (params) {
					console.log(params);
					//点击高亮
					_this.chartTip={
						name:params.name,
						content:params.value
					}
					// myChart.dispatchAction({
					//     type: 'showTip',
					//     dataIndex: params.dataIndex,
					// })
				})
			}
		}
	}
</script>
<style scoped>
	.chart-tip{
		position: absolute;
		bottom: 0;
		padding: 10upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#fff;
		line-height:22upx;
		background:rgba(0,0,0,0.3);
		border-radius:12upx;
	}
	.huizong{
		padding-left: 44upx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.item{
		padding: 44upx 0 28upx 0;
		flex: 0 0 33%;
		text-align: left;
	}
	.item-count{
		font-size:40upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:600;
		line-height:48upx;
	}
	.item-name{
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(128,128,128,1);
		line-height:28upx;
	}
	.charts-content{
		padding: 0 30upx;
		background: #fff;
	}
	.page-contenet{
		width: 100%;
	}
	.haveStatusBar{
		height: var(--status-bar-height);
	}
</style>