<template name="mTab">
	<!-- tab-->
	<view class="mTab">
		<view v-for="(item, index) in tabTitle" class="tabTitle" 
		 :key="index" 
		 :style="{color:checkedIndex === index ? themeColorCode : '',borderBottom:checkedIndex === index ? `solid 2px ${themeColorCode}` : ''}" 
		 @tap.stop = "clickTab(item,index)">
			{{ item.title }}
		</view>
	</view>
</template>

<script>	
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mSearchSelect",
		props:{
			tabTitle:{//tab的标签，例如：[{title：'tab1'}]
				type:Array,
				default(){
					return []
				}
			}
		},
		data(){
			return {
				checkedIndex:0
			}
		},
		computed: {
			...mapState(["themeColorCode"])
		},
		methods:{
			clickTab(param,index){//点检
				if(index !== this.checkedIndex){
					this.checkedIndex = index
					this.$emit("clickTab",param)
				}
			}
		}
	}
</script>

<style scoped>
	.mTab{
		display: flex;
		align-items: center;
		font-size: 0.72rem;color: #444;
		background-color: #FFFFFF;
		border-bottom: solid 1px #f5f5f5;
		padding: 0 12upx 0 16upx;
	}
	.tabTitle{
		flex: 1;
		padding: .40rem 0;
		text-align: center;
	}
</style>
