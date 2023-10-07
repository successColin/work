<template name="m-groupArea">
	<view :class="areaClass" v-show="static_visiabled">
		<view class="groupArea-title" v-if="name"> 
			<view class="groupArea-title-content">
				<view class="tilte">{{name}}</view>
				<slot name="titleslot"></slot>
			</view>
		</view>
		<view class="groupArea-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import {ELEMENT_GROUPAREA_STYPE} from '@/common/constant/element.js'
	export default{
		props: {
			name:String,
			visiabled:{
				type:[Number,Boolean],
				default: 1
			},//是否显示
			//areaStype样式
			areaStype:{type:Number,default:0}
		},
		data() {
			return {
				static_visiabled:this.visiabled,
				areaClass:''
			}
		},
		created() {
			this.areaClass = ELEMENT_GROUPAREA_STYPE[this.areaStype]
		}
	}
</script>

<style>
</style>
