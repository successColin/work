<!-- 高级筛选框控件 -->
<template name="mAdvancedFilter">
	<!-- 高级选择框架-->
	<view>
		<input class="input" :value="advancedFilterLable" disabled="true" @tap="showPicker"/>
	</view>
</template>

<script>
import { advancedFilterCondition } from '@/common/constant/constant.js'
	export default {
		props:{
			element:{type:Object,default(){return {}}},
			value:{type:[Number,String],default:3},//值
		},
		computed: {
			advancedFilterValue() {
				return this.value ? this.value : 3
			},
			advancedFilterLable() {
				return advancedFilterCondition.find(item => item.value === this.advancedFilterValue).label
			}
		},
		methods:{
			showPicker(){this.$emit("select")},
		}
	}
</script>
<style scoped>
	.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
