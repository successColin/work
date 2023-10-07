<!-- 没有读消息推送 -->
<template>
	<view class="announcement">
		<!-- 导航栏 -->
		<m-back-bar>
			<block slot="barTitle">通知公告</block>
		</m-back-bar>
		<view class="announcement__time">
			<span>
				{{$dateFormat.formatDate(detailsDate.createDate , "yyyy-MM-dd hh:mm:ss")}}
			</span>
		</view>
		<view class="announcement__content">
			<view class="announcement__content--title">
				<m-font-icon icon="tongzhi" :iconSize="40" class="myIcon" :style="{color:themeColorCode}"></m-font-icon>
				{{detailsDate.name}}
			</view>
			<view class="announcement__content--dec" v-html="detailsDate.content"></view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data(){
			return {
				currentId: '', // 当前的id
				detailsDate: ''
			};
		},
		mounted(){
			this.getList();
		},
		onLoad: function (option) {
			this.currentId = option.id;
		},
		methods:{
			getList() {
				this.$http.get(`bulletin/get/${this.currentId}`).then(res => {
					console.log(res);
					const data = res.data;
					if(data.success){
						this.detailsDate = data.data;
					}
				})
			}
		},
		computed: {
			...mapState(["themeColorCode"]),
		},
	}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import "@/static/scss/common/_function.scss";
@import "@/static/scss/common/_variable.scss";
.announcement {
	width: 100%;
	background: #F5F5F5;
	font-family: PingFangSC-Regular, PingFang SC;
	&__time {
		display: flex;
		span {
			display: inline-block;
			margin: pxToREM(30) auto 0;
			background: rgba(170, 170, 170, 0.5);
			border-radius: 5px;
			text-align: center;
			padding: pxToREM(5) pxToREM(22);
			font-size: pxToREM(20);
			color: #FFFFFF;
		};
	}
	&__content {
		margin: pxToREM(25);
		padding: pxToREM(15) pxToREM(27);
		background: #FFFFFF;
		&--title {
			font-size: pxToREM(32);
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			.myIcon {
				display: inline-block;
				margin-right: pxToREM(12);
			}
		}
		&--dec {
			margin-top: pxToREM(20);
			color: #808080;
			font-size: pxToREM(28);
			white-space: pre-wrap;
		}
	}
}
</style>
