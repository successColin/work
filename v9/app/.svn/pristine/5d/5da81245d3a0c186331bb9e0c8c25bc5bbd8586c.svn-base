<!-- 故障工单 -->
<template>
	<view>
		<!-- input 搜索 -->
		<!-- <view class="search-wrap">
			<view class="search-view">
				<input v-model="keywords" name="keywords" placeholder="搜索" placeholder-class="icon iconfont iconsousuo keywords"/>
			</view>   class="takeUpInput"
		</view> -->
		<!-- 内部 -->
		<list-format :data="data"></list-format>
	</view>
</template>

<script>
	import ListFormat from './components/ListFormat.vue'
	export default {
		props: {
			data: {//是否为文字按钮
				type: Array,
				default(){
					return []
				}
			},
		},
		components: {
			ListFormat,
		},
		data(){
			return {
				keywords: '',
			};
		},
		computed:{

		},
		methods:{ 
			
		},
		mounted(){

		}
	}
</script>
