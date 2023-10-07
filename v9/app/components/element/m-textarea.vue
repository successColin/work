<template name="mLabel">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view class="formElemets top" v-if="element.visiabled"
	 :class="[isFocus ? inputFocusClass: '',
	  element.readonly?'readonly':'']">
		<label class="text" v-if="element.label" :class="isLabel || element.readonly || showContent?'':'drakcolor'">
			{{ element.label }}
			<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
		</label>
		<view class="content" :class="{hasrelationTab:element.relationTabId}">
			<textarea v-if="!isWXShowText" class="textarea" placeholder-style="color:#9F9F9F"
				:disabled="element.readonly ? true : false"
				:auto-height="true"
				:focus = "isFocus"
				:placeholder="element.placeholderText"
				:maxlength='-1'
				v-model.trim="showContent" 
				auto-blur=true
				@input="changeLabelColor"
				@focus="inputFocus"
				@blur="inputBlur"
				@confirm = "inputConfirm"/>
			<!-- #ifdef MP -->
			<view v-else class="textarea" @click="wxTextClick">
				{{showContent}}
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>	
import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mSearchSelect",
		props:{
			element:{type:Object,default(){return {}}},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String]},//值
		},
		data() {
			return {
				isWXShowText:false,
				showContent: "",
				isFocus:false,
				isLabel:false
			}
		},
		computed: {
			...mapState(["themeColor"]),
			inputFocusClass(){//与主题she检修关联
				return "inputFocus-" + this.themeColor
			}
		},
		watch:{
			value(newVal,oldVal){
				if(this.sourceType !== 'list'){
					this.showContent = newVal
					this.$emit("changeValue",{
						triggerBaseType:2,
						element:this.element,
						value:this.showContent
					})
				} 
			}
		},
		methods: {
			...mapMutations(["STATE_formElementFocus"]),
			inputConfirm(){this.isFocus = false;this.isFocus = false},
			inputFocus() {//设置聚焦
				this.isFocus = true
				this.STATE_formElementFocus(true)
			},
			inputBlur() {//失焦
				//#ifdef MP
				this.isWXShowText = true
				//#endif
				this.isFocus = false
				this.$emit("changeValue",{
					triggerBaseType:2,
					element:this.element,
					value:this.showContent
				})
			},
			showPicker(){this.$emit("select")},
			changeLabelColor(event){
				this.isLabel = event.detail.value?true:false;
			},
			wxTextClick(){
				//#ifdef MP
				//如果是不可编辑，不聚焦
				if(!this.element.readonly){
					this.isWXShowText = false
					this.isFocus = true
				}
				//#endif
			}
		},
		created() {
			//#ifdef MP
			//为了解决小程序textare穿透问题
			this.isWXShowText = true
			//#endif
			if(this.sourceType !== 'list') this.showContent = this.value
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
