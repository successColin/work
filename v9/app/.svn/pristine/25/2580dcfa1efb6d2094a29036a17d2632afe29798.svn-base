<template>
	<view>
		<view :class="isPoint?'list pointHeight':'list otherHeight'" v-for="(item, index) in data" :key="index" @click="handleTip">
			<view class="firstLine">
				<view class="icon iconfont icongongdanzhihang"></view>
				<!-- 点巡检和其他差异 -->
				<view class="text1" v-if="!isPoint">
					<view v-show="isBehavior" :class="item.behavior === '手动创建' ? 'taskState1' : 'taskState2'">{{item.behavior}}</view>
					<view class="taskDetail">{{item.workname}}</view>
				</view>
				<view class="text2" v-else>
					{{item.name}}
				</view>
				<!-- 负责人和状态差异 -->
				<view class="state" v-if="!isDownTime" v-show="!isPoint">
					<view :class="isEquHealth?'yellowCircle':'redCircle'"></view>
					{{item.state}}
				</view>
				<view v-else class="userName" v-show="!isPoint">
					{{item.userName}}
				</view>
			</view>
			<!-- 点巡检和其他差异 -->
			<view v-if="!isPoint">
				<view class="key">工单编码：{{item.workKey}}</view>
				<view v-if="!isDownTime">
					<view class="name">设备编码：{{item.devKey}}</view>
					<view class="nameAndTime">
						<view class="devName">设备名称：{{item.devName}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>	
				</view>
				<view v-else>
					<view class="name">位置名称：{{item.devKey}}</view>
					<view class="nameAndTime">
						<view class="devName">停机时长：{{item.devName}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>	
				</view>
			</view>
			<view v-else>
				<view class="timeAndVal">
					<view class="time">
						{{item.checkTime}}
					</view>
					<view :class="item.proportion && item.proportion.split('/')[0]==='0'?'val1':
						(item.proportion && item.proportion.split('/')[0]===(item.proportion && item.proportion.split('/')[1])?'val3':'val2')">
						{{item.proportion}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		props: {
			data: {//是否为文字按钮
				type: Array,
				default(){
					return []
				}
			},
			isBehavior: {
				type: Boolean,
				default: true
			},
			isEquHealth: {
				type: Boolean,
				default: false
			},
			isDownTime: {
				type: Boolean,
				default: false
			},
			isPoint: {
				type: Boolean,
				default: false
			}
		},
		methods:{
			handleTip(){
				uni.showToast({
					title:"请到具体菜单进行操作！",
					icon:"none"
				})
			}
		},
		onLoad() {
			console.log()
		}
	}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import "@/static/scss/common/_function.scss";
@import "@/static/scss/common/_variable.scss";
$devNameWidth: pxToREM(150);
.list {
	height: pxToREM(240);
	margin-top: pxToREM(20);
	padding: 0 pxToREM(20);
	padding-top: pxToREM(6);
	background: #FFFFFF;
	box-shadow: 0px 2px 10px 0px rgba(46, 92, 167, 0.1);
	border-radius: 8px;
	.firstLine {
		height: pxToREM(88);
		width: 100%;
		display:flex;
		align-items:center;/*垂直居中*/
		position: relative;
		.icongongdanzhihang {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: pxToREM(45);
			width: pxToREM(60);
			height: pxToREM(60);
			font-size: pxToREM(45);
			background: #F1F7FF;
			border-radius: 12px;
			color: #4689F5;
		}
		.text1 {
			width: 63%;
			margin-left: pxToREM(20);
			height: pxToREM(60);
			display:flex;
			align-items:center;/*垂直居中*/
			.taskState1, .taskState2 {
				border-radius: 8px;
				height: pxToREM(36);
				line-height: pxToREM(36);
				padding: 0 pxToREM(13);
				font-size: pxToREM(22);
				white-space: nowrap;
			}
			.taskState1 {
				background: #FFEAEB;
				color: #E02020;
			}
			.taskState2 {
				background: #FFECD3;
				color: #FAA431;
			}
			.taskDetail {
				font-size: pxToREM(32);
				color: #333333;
				margin-left: pxToREM(6);
			}
		}
		.text2 {
			margin-left: pxToREM(20);
			font-size: pxToREM(34);
			color: #333333;
			width: 75%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.state {
			position: absolute;
			right: 0;
			font-size: pxToREM(28);
			color: #111111;
			.redCircle, .yellowCircle {
				width: pxToREM(16);
				height: pxToREM(16);
				border-radius: 50%;
				display: inline-block;
				margin-right: pxToREM(8);
			}
			.redCircle {
				background: #FAB71C;
			}
			.yellowCircle {
				background: #EF5F5E;
			}
		}
		.userName {
			position: absolute;
			right: 0;
			font-size: pxToREM(24);
			color: #111111;
		}
	}
	.key, .name, .nameAndTime {
		font-size: pxToREM(24);
		margin-left: pxToREM(80);
	}
	.key {
		color: #444444;
	}
	.name, .nameAndTime {
		color: #AAAAAA;
	}
	.name {
		margin-top: pxToREM(9);
	}
	.nameAndTime {
		margin-top: pxToREM(8);
		& > view {
			display: inline-block
		}
		.devName {
			width: calc(100% - #{$devNameWidth})
		}
		.time {
			float: right;
		}
	}
	.key, .name, .devName, .taskDetail {
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.timeAndVal {
		margin-left: pxToREM(80);
		&>view {
			display: inline-block;
			height: pxToREM(48);
			line-height: pxToREM(48);
		}
		.time {
			font-size: pxToREM(24);
			color: #444444;
		}
		.val1, .val2, .val3 {
			width: pxToREM(114);
			float: right;
			border-radius: 14px;
			// padding: 0 pxToREM(20);
			text-align: center;
			font-size: pxToREM(28);
		}
		.val1 {
			background: #F1F3F6;
			color: #BBC3CD;
		}
		.val2 {
			background: #FFEAEB;
			color: #E02020;
		}
		.val3 {
			background: #F1F7FF;
			color: #4689F5;
		}
	}
}
.list:last-child {
	margin-bottom: pxToREM(20);
}
.pointHeight {
	height: pxToREM(167);
}
.otherHeight {
	height: pxToREM(240);
}
</style>
