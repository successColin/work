<template name="mRate">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled"
	 :class="[element.labletPositon || 'left',
	  sourceType!=='list'?'formElemets':'listElemets',
	  element.readonly?'readonly':'']">
		<block v-if="sourceType === 'list'">
		    {{ element.canDisplayName ? `${element.label}`:""}}
			<view class="star-content">
				<m-normal-icon v-for="(star, index) in starsNumber" :key="index" 
				 icon="common_icon_star" :iconSize="size" 
				 :color="(index + 1) <= value ? checkColor:color"></m-normal-icon>
			</view>
		</block>
		<block v-else>
			<label class="text" :class="element.readonly?'':'drakcolor'">
				{{ element.label }}
				<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
			</label>
			<view class="content">
				<view class="star-content">
					<m-normal-icon v-for="(star, index) in starsNumber" :key="index"
					 icon="common_icon_star" :iconSize="size" 
					 :color="(index + 1) <= valueSync ? checkColor:color"
					 @click="_onClick(index)"></m-normal-icon>
				</view>
			</view>
		</block>
	</view>
</template>

<script>	
	export default {
		name:"mRate",
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String],default: 0},//值
			size:{type:String},
			starsNumber:{type:Number,default: 5},
			color:{type:String,default: "#ececec"},
			checkColor:{type:String,default: "#ffca3e"} 
		},
		data() {
			return {
				showContent: "",
				valueSync: 0
			};
		},
		methods:{
			_onClick(index) {
				if (this.element.readonly) return
				this.valueSync = index + 1;
				this.$emit("changeValue",{
					triggerBaseType:2,
					element:this.element,
					value:this.valueSync
				})
			}
		},
		created() {
			if(this.sourceType !== 'list') this.valueSync = this.value
		}
	}
</script>
<style scoped>
	.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.listElemets{
		height: 46upx;
		display: flex;
		align-items: center;
	}
	.star-content{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
