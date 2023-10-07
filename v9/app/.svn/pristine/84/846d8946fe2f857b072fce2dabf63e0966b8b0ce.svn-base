<template name="mComposite">
	<!-- 组合组件，只做显示用-->
	<view class="mComposite">
		<view v-for="(item, index) in values" class="composite-value"
		 :key="index" 
		 :style="{color:item.colorCode}">
			<span class="circle" :style="{background:item.colorCode}"></span>{{ item.value }}
		</view>
	</view>
</template>

<script>	
import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mComposite",
		props:{
			element:{type:Object,default(){return {}}},
			elementValue :{type:Object,default(){return {}}}
		},
		computed: {
			values(){
				let compositeElements = this.element.combinationInfoList
				let compositeValue = []
				for(let i = 0,len = compositeElements.length;i<len;i++){
					const {elementId, colorCode, displayName,mainColumnName} = compositeElements[i]
					let value = this.elementValue[elementId] || {}
					compositeValue.push({
						colorCode,
						value:`${displayName}${ mainColumnName ? value.name || '' : value.id || ''}`
					})
				}
				return compositeValue
			}
		}
	}
</script>
<style scoped lang="scss">
	@function pxToREM($p:1,$base:0.03){
	    @return $base*$p + rem; 
	}
	.mComposite{
		display: flex;
		align-items: center;
		height: pxToREM(60);
		font-size: pxToREM(24);
		color: #444;
		margin:pxToREM(12) 0;
		background: #FAFAFA;
		border-radius: pxToREM(8);
		font-family: PingFangSC-Regular, PingFang SC;
	}
	.composite-value{
		flex: 1;
		text-align: center;
	}
	.circle{
		display: inline-block;
		width: pxToREM(16);
		height: pxToREM(16);
		border-radius: 50%;
		margin-right: pxToREM(7);
	}
</style>
