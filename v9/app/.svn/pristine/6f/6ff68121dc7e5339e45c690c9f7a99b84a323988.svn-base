<template>
	<view class="content">

		<web-view :src="url">

		</web-view>
	</view>
</template>
<script>
	import { mapState, mapMutations } from 'vuex'
	import {formApi,homeApi} from '@/common/request/api.js'
	import * as Path from 'common/request/homeApi/interface.js'
	
	export default{
		data (){
			return {
				url: 'http://47.111.24.52/h5/#/pages/login/login',
			}
		},
		onLoad(option) {
			this.url = '/hybrid/html/web/viewer.html?file='+option.url
		}
	}
</script>
<style scoped>
	.content{
		padding-top: 40upx;
	}
	.haveStatusBar{
		height: var(--status-bar-height);
	}
</style>