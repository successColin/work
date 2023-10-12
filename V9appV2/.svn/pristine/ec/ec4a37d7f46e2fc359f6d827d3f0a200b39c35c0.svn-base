<template name="mButton">
	<view class="mButton" :class="[btnClass_]" v-if="static_visiabled">
		<div v-if="isFontBtn" :style="{fontSize: pxToREM(fontSize) }" @tap="handleClick" style="z-index: 1000;" class="fontTextBtn"> 
			<slot name="buttonIcon" class="icon"></slot>
		</div>
		<button class="btn" v-else 
			:loading = "isLoading_"
			:disabled="disabled" 
			:plain="plain_" 
			@tap="handleClick"
			:style="{background: btnColor}"
		>
			<slot name="buttonIcon1" class="icon"></slot>
			{{ btnTilte_ || '' }}
		</button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mButton",
		data(){
			return {
				static_visiabled:this.visiabled,
				btnTilte_: this.btnTilte,
				disabled_: this.disabled,
				waiting:false
			}
		},
		props: {
			btnColor: {
				type: String,
				default: ''
			},
			btnInfo:{//按钮基本信息
				type:Object,
				default:function () { return {} }
			},
			checkForm:{//是否需要校验表单是否失去焦点
				type:Boolean,
				default: false
			},
			isFontBtn:{//是否为文字按钮
				type:Boolean,
				default: false
			},
			btnTilte:{//按钮显示值
				type:[String, Number]
			},
			btnClass:[String, Number],
			disabled:{//按钮是否不可编辑
				type:Boolean,
				default: false
			},
			isLoading:{//按钮是否不可编辑
				type:Boolean,
				default: false
			},
			fontSize: {//按钮字体大小
				type:Number,
				default: 32
			},
			visiabled:{
				type:[Number,Boolean,Object],
				default: true
			},//是否显示
		},
		computed:{
			...mapState(["themeColor","formElementFocus"]),
			isLoading_() {
				return this.isLoading || this.waiting
			},
			plain_() {
				if(this.disabled_){
					return true
				}else{
					return false
				}
			},
			btnClass_(){//与主题she检修关联
				const mainColor = ["mainColor","whiteColor"]
				return mainColor.indexOf(this.btnClass)!==-1 && this.themeColor !=='red' ? (this.btnClass + "-" + this.themeColor) : this.btnClass
			}
		},
		watch:{
			formElementFocus(newVal,oldVal){
				if(this.waiting) this.handleClick()
			}
		},
		methods: {
			handleClick() {
				//如果控件正处于聚焦状态,点击事件需要等待
				if(this.formElementFocus && this.checkForm) {
					this.waiting = true
					return
				} else{
					this.waiting = false
				}
				const baseParams = {
					label:this.btnTilte_
				}
				const params = {...this.btnInfo,...baseParams},
					  _this = this
				_this.$emit('elementClick',params)
			}
		},
	}
</script>
