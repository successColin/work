<template>
	<view class="mBackBarNol">
		<view class="navContent">
			<view class="mainBtns">
				<view class="nav-left">
					<m-button :isFontBtn="true" @elementClick="hangdleBackClick">
						<m-font-icon icon="iconfanhui" :iconSize="36" slot="buttonIcon"></m-font-icon>
					</m-button>
				</view>
				<view class="nav-right"></view>
			</view>
			<view class="mainTile"><slot name="barTitle"></slot></view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		methods:{
			...mapMutations(["STATE_INIT", "SET_bundle"]),
			...mapMutations("Toast",["TOAST_REQUESTURLS","SET_TOAST_LOADING"]),
			hangdleBackClick(){
				//返回时清空loading状态
				this.TOAST_REQUESTURLS("clear")
				this.SET_TOAST_LOADING()
				this.STATE_INIT()
				uni.navigateBack()
			},
		}
	}
</script>
