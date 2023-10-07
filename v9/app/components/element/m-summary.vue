<template name="mLabel">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled"
	 :class="[element.labletPositon || 'left',
	  sourceType!=='list'?'formElemets':'',
	  isFocus ? inputFocusClass: '',
	  element.readonly?'readonly':'',
	  isEllipsis?'ellipsis':'']">
		<block v-if="sourceType === 'list'">{{ element.canDisplayName ? `${element.label}:${value}`:value}}</block>
		<block v-else>
			<!-- 如果label没有值，显示一行 -->
			<view v-if="!element.label" style="display: flex;"  :class="[element.readonly === 1 ? 'readOnly' : '']">
				<label class="text1">
					<m-font-icon :icon="element.labelIcon" :iconSize="40" :style="{color: element.labelIconColour}"></m-font-icon>
				</label>
				<div class="contentValue" :style="{fontSize: pxToREM(element.labelFont || 24)}" @tap="clickInput" :class="{hasrelationTab:element.relationTabId}">
					{{ showContent }}
				</div>
			</view>
			<!-- 原逻辑 -->
			<view style="display: flex;" v-else>
				<view class="text mLabel__label">
					<m-font-icon :icon="element.labelIcon" :iconSize="40" :style="{color: element.labelIconColour}" class="labelIconClass"></m-font-icon>
					<view class="mLabel__labelName" :class="[element.readonly === 1 ? 'readOnly' : 'normal']" :style="{fontSize: pxToREM(element.labelFont || 24)}">{{ element.label }}</view>
					<!-- <span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span> -->
				</view>
				<view class="contentValue" :style="{fontSize: pxToREM(element.labelFont || 24)}" :class="[element.readonly === 1 ? 'readOnly' : 'normal', element.relationTabId ? 'hasrelationTab' : '']" @tap="clickInput">
					{{ showContent }}
					<!-- <input class="input"
						:style="{fontSize: pxToREM(element.labelFont || 24)}"
						:class="{hasrelationTab:element.relationTabId}"
						:value="showContent"
						:disabled="element.readonly ? true : false"
						:placeholder="element.placeholderText"
						@input="changeLabelColor"
						@focus="inputFocus"
						@blur="inputBlur"
						@tap="clickInput"/> -->
				</view>
			</view>
		</block>
	</view>
</template>

<script>	
import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mSearchSelect",
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String]},//值
			inputFocusClass:{type:String,default: "inputFocus-red"}
		},
		data() {
			return {
				showContent: "",
				isFocus:false,
				isInit:true,
				isLabel:false
			}
		},
		watch:{
			value(newVal,oldVal){
				if(this.sourceType !== 'list'){
					this.showContent = newVal
				} 
			},
			showContent(newVal){
				if(this.sourceType !== 'list' && !this.isInit){
					this.$emit("changeValue",{
						triggerBaseType:2,
						element:this.element,
						value:this.showContent
					})
				}
				this.isInit = false 
			},
		},
		methods:{
			...mapMutations(["STATE_formElementFocus"]),
			clickInput(){
				if(this.element.relationTabId) this.$emit("showRelationTab") //关联弹出面板
			},
			inputFocus() {//设置聚焦
				this.isFocus = true
				this.STATE_formElementFocus(true)
			},
			inputBlur(e) {//失焦
				this.isInit = false
				this.$nextTick(() => {
					this.isFocus = false
					this.showContent = e.target.value
				})
			},
			changeLabelColor(event){
				this.isLabel = event.detail.value?true:false;
			},
		},
		created() {
			if(this.sourceType !== 'list') this.showContent = this.value
		}
	}
</script>
<style lang="scss" scoped>
	@charset "utf-8";
	@import "@/static/scss/common/_function.scss";
	@import "@/static/scss/common/_variable.scss";
	.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.labelIconClass {
		padding-right: pxToREM(15);
	}
	.mLabel__labelName {
		display: inline-block;
	}
	.mLabel__label {
		display: flex;
		align-items: center;
	}
	
	.contentValue {
		// color: #9b9b9b;
		flex: 1;
		display: flex;
		align-items: center;
		padding: pxToREM(19) 0 pxToREM(19) pxToREM(15);
	}
	.text1 {
		
		flex-shrink: 0;
		padding: pxToREM(19) 0;
		display: flex;
		align-items: center;
	}
	.readOnly {
		color: #9b9b9b !important;
	}
	.normal {
		color: #000 !important;
	}
	.hasrelationTab {
		color: #1890ff !important;;
	}
</style>
