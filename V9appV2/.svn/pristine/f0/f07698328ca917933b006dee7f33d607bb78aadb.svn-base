<template name="mLabel">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled">
		<view class="mLabel formElemets" 
		 :class="[element.labletPositon || 'left',
		 element.readonly?'readonly':'']">
			<label class="text" :class="value || element.readonly?'':'drakcolor'">
				{{ element.label }}
				<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
			</label>
			<view class="content" :class="{hasrelationTab:element.relationTabId}">
				<input class="input" :value="value" :placeholder="element.placeholderText" disabled="true" @tap="showPicker"/>
			</view>
		</view>
	</view>
</template>

<script>	
	export default {
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "form"},//来源 list forme advancedFilter
			value:{type:[Number,String]},//值
		},
		methods:{
			showPicker(){
				//如果为只读
				if(this.element.readonly) return
				this.$emit("select")
			}
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
