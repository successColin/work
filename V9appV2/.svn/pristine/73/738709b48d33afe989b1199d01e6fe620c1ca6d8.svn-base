<!-- 故障工单 -->
<template>
	<view class="healtyJump">
		<!-- 导航栏 -->
		<m-back-bar>
			<block slot="barTitle">{{barTitle}}</block>
		</m-back-bar>
		<view class="content" v-if="JSON.stringify(listData) !== '[]'">
			<Trouble :data="listData" v-if="pageIndex === 0"></Trouble>
			<plan-keep :data="listData" v-if="pageIndex === 1"></plan-keep>
			<point :data="listData" v-if="pageIndex === 2"></point>
			<enforce :data="listData" v-if="pageIndex === 3"></enforce>
			<equ-health :data="listData" v-if="pageIndex === 4"></equ-health>
			<down-time :data="listData" v-if="pageIndex === 5"></down-time>
			<frequency :data="listData" v-if="pageIndex === 6"></frequency>
		</view>
		<no-data v-else></no-data>
	</view>
</template>

<script>
	import ListFormat from './components/ListFormat.vue'
	import Trouble from './trouble.vue' // 故障工单
	import PlanKeep from './planKeep.vue' // 计划/保养
	import Point from './point.vue' // 点巡检
	import Enforce from './enforce.vue' // 信息不完整工单
	import EquHealth from './equHealth.vue' // 设备异常
	import DownTime from './downtime.vue' // 设备停机时长
	import Frequency from './frequency.vue' // 设备故障列表
	import NoData from './components/NoData.vue' // 没有数据组件
	import { downtimeDate, enforceDate, equHealthDate, frequencyDate, planKeepDate, pointDate, troubleDate } from '../json/checkData.js'
	export default {
		components: {
			ListFormat,
			NoData,
			Trouble, // 故障工单
			PlanKeep, // 计划保养
			Point, // 点巡检
			Enforce, // 信息不完整工单
			EquHealth, // 设备异常
			DownTime, // 设备停机时长
			Frequency, // 设备故障列表
		},
		data(){
			return {
				barTitle: '', // 标题
				keywords: '', // input
				pageIndex: '', // 下标为第几页
				listData: [], // 当前数据
			};
		},
		computed:{

		},
		onLoad(options) {
			this.barTitle = options.name;
			let urlArry = [ troubleDate, planKeepDate, pointDate, enforceDate, equHealthDate, downtimeDate, frequencyDate]; //每个统计对应的路径
			let index = Number(options.index);
			this.pageIndex = index;
			this.listData = index < 4 ? urlArry[index].slice(0, options.num) : urlArry[index];
		},
		methods:{ 
			
		},
		mounted(){

		}
	}
</script>
<style lang="scss" scoped>

</style>
