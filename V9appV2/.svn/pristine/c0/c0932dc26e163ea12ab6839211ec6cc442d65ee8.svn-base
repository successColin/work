<template>
	<div class="consult" @click="handleJump(dataArr.id)" v-if="dataArr.enabled === 1">
		<section v-if="dataArr.style === 1" class="consult__type1">
			<div class="consult__title">{{ dataArr.title }}</div>
			<img class="consult__img" :src="imgarr[0] && imgarr[0].url" alt="">
			<div class="consult__time">{{publishtime}} 浏览{{dataArr.clicktimes}}次</div>
		</section>
		<section v-if="dataArr.style === 2" class="consult__type2">
			<div class="consult__left">
				<div class="consult__title">{{ dataArr.title }}</div>
				<div class="consult__time">{{publishtime}} 浏览{{dataArr.clicktimes}}次</div>
			</div>
			<div class="consult__right">
				<img class="consult__img" :src="imgarr[0] && imgarr[0].url" alt="">
			</div>
		</section>
		<section v-if="dataArr.style === 3" class="consult__type3">
			<div class="consult__title">{{ dataArr.title }}</div>
			<div class="consult__imgs">
				<img class="consult__img" :src="item.url" alt="" v-for="(item,index) in imgarr">
			</div>
			<div class="consult__time">{{publishtime}} 浏览{{dataArr.clicktimes}}次</div>
		</section>
	</div>
</template>

<script>
	import bus from '@/static/js/bus'
	import { mapState } from 'vuex';
	export default {
		props: {
			dataArr: {
				type: Object,
				default: () => {}
			},
			name: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapState([
			  'token',
			]),
			publishtime() {
				return this.dataArr.publishtime && this.dataArr.publishtime.slice(0, -3) || '';
			},
			imgarr() {
				const arr = [];
				const imgList = this.dataArr.coverurljson && JSON.parse(this.dataArr.coverurljson) || [];
				imgList.forEach(item => {
					arr.push({
						url: `${item.url}?token=${this.token}`
					})
				})
				return arr;
			}
		},
		methods: {
			handleJump(v) {
				// 点击
				this.$http.post(`information/clickRecord`, {id: v}).then(res => {
					const data = res.data;
					console.log(data);
					if(data.success){
						uni.navigateTo({
						  url: `/pages/consultDetail/index?id=${v}&name=${this.name}`,
						});
						bus.$emit('ChangeInformation')
					}
				})
			}
		},
		mounted() {
			console.log(this.dataArr)
		}
	}
</script>
<style lang="scss" scoped>
	@charset "utf-8";
	@import "@/static/scss/common/_function.scss";
	@import "@/static/scss/common/_variable.scss";
	@mixin titleClass(){
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #222222;
	}
	.consult {
		margin-top: pxToREM(30);
		font-size: pxToREM(28);
		border-bottom: pxToREM(1) solid #E0E0E0;
		padding-bottom: pxToREM(20);
		&__type1 {
			.consult__title {
				@include titleClass;
			}
			.consult__img {
				width: 100%;
				height: pxToREM(229);
				background: #F1F3F6;
				border-radius: 6px;
				margin: pxToREM(20) 0 pxToREM(10);
			}
			.consult__time {
				margin-top: pxToREM(5);
			}
		}
		&__type2 {
			display: flex;
			.consult__left {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.consult__title {
					@include titleClass;
				}
				.consult__time {
					margin-top: pxToREM(10);
					margin-bottom: pxToREM(15);
				}
			}
			.consult__right {
				width: pxToREM(228);
				height: pxToREM(139);
				background: #F1F3F6;
				.consult__img {
					width: pxToREM(228);
					height: pxToREM(139);
					border-radius: 6px;
				}
			}
		}
		&__type3 {
			.consult__imgs {
				margin: pxToREM(20) 0 pxToREM(10);
				.consult__img {
					width: calc((100% - #{pxToREM(18)})/ 3);
					height: pxToREM(139);
					background: #F1F3F6;
					border-radius: 6px;
					margin-right: pxToREM(9);
				}
				.consult__img:last-child {
					margin-right: 0;
				}
			}
		}
		&__time {
			font-size: pxToREM(24);
			color: #AAAAAA;
		}
	}
</style>

