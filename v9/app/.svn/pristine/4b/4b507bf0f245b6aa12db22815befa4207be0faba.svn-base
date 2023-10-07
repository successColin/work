<template>
	<view class="consultDetail">
		<!-- 导航栏 -->
		<m-back-bar>
			<block slot="barTitle">{{name}}</block>
		</m-back-bar>
		<section class="consultDetail__detail">
			<div class="consultDetail__detail--title">{{detailsDate.title}}</div>
			<div class="consultDetail__detail--time">
				<div>{{detailsDate.publishtime}}</div>
				<div>浏览{{detailsDate.clicktimes}}次</div>
			</div>
			<div class="content" v-html="detailsDate.html">
			</div>
		</section>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data(){
			return {
				currentId: '', // 当前的id
				detailsDate: {},
				name: ''
			};
		},
		mounted(){
			this.getList();
		},
		onLoad: function (option) {
			this.currentId = option.id;
			this.name = option.name;
		},
		methods:{
			getList() {
				this.$http.post(`information/getAppDetails`, {id: this.currentId}).then(res => {
					console.log(res);
					const data = res.data;
					if(data.success){
						this.detailsDate = data.data;
					}
				})
			}
		},
		computed: {},
	}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import "@/static/scss/common/_function.scss";
@import "@/static/scss/common/_variable.scss";
.consultDetail {
	width: 100%;
	height: 100vh;
	background: #FFFFFF;
	&__detail {
		padding: pxToREM(25) pxToREM(30);
		&--title {
			font-size: pxToREM(36);
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #222222;
		}
		&--time {
			font-size: pxToREM(24);
			color: #AAAAAA;
			display: flex;
			justify-content: space-between;
			margin-top: pxToREM(20);
		}
		.content {
			margin-top: pxToREM(40);
			::v-deep {
				img {
					width: 100%;
				}
			}
		}
	}
}
</style>
