<template name="mBanner">
	<view class="banner" v-if="source.length>0">
		<view class="banner-wrap">
			<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration" @change="currentChange" easing-function="easeOutCubic">
				<swiper-item v-for="(item,index) in source" :key="index">
					<image class="swiper-image" :src="item.linkUrl"></image>
				</swiper-item>
			</swiper>
			<view class="index-wrap">{{current}}/{{source.length}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: true,
				current: 1,
				figureList: []
			}
		},
		props: {
			duration:{	//轮播动画持续时间
				type:String,
				default: '1000'
			},
			interval:{	//轮播间隔时间
				type:String,
				default: '2000'
			},
			source:{
				type: Array,
			}
		},
		methods: {
			currentChange(e){
				this.current = e.detail.current + 1
			}
		},
	}
</script>

<style>

</style>
