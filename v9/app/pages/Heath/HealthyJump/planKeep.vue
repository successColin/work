<!-- 计划/保养工单 -->
<template>
	<view>
		<list-format :data="data" :isBehavior="isBehavior"></list-format>
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
				isBehavior: false,
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
