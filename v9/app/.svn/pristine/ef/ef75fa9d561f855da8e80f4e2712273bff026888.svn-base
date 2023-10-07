<template name="m-input">
	<div class="mInput input-label" v-if="visiabled"
		:class="[labletPositon, disabled?'readonly':'', isFocus ? 'inputFocus' : '']">
		<label class="text" :class="{'changeFlex':inputsource == 'change','drakcolor':!isLabel && !element.readonly && !showContent}">
			{{ label }}
			<span v-if="requisite" class="icon iconfont iconmust-fill2 requisite"></span>
		</label>
		<div class="input-content"> 
			<input v-show="false" v-model="elementValue">
			<input class="input" readonly="readonly" v-model.trim="elementValue" 
				:disabled="disabled ? true : false" 
				:type="inputType_" 
				:min = "3"
				auto-blur=true
				@input="changeLabelColor"
				@focus="inputFocus" 
				@blur="inputBlur"/>
			<m-font-icon :icon="iconClass" :iconSize="iconSize" @click="fontIconClick"></m-font-icon>
			<slot name="btns"></slot>
		</div>
		<slot name="right"></slot>
	</div>
	<view v-else>
		<input v-show="false" v-model.trim="elementValue" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mInputLableTop",
		props: {
			bundleId:[Number,String],
			relationMainTab:[Number,String],//弹出面板的主面板
			relationColumnType:Number,//字段类型
			mobileTabId:Number,//面板id
			labletPositon:{//lable排布方式
				type:String,
				default: "left"
			},
			inputType: {//文本框类型
				type:String,
				default: "text"
			},
			label: {//文本框title
				type: String,
				default: "elementLable"
			},
			labelType:{//label类型，form和list
				type: String,
				default: "form"
			},
			icon: String,//文本框图标
			iconSize: {//图标大小
				type:Number,
				default: 16
			},
			elementId:[String, Number],
			visiabled:{
				type:[Number,Boolean],
				default: 1
			},//是否显示
			requisite:{
				type:[Number,Boolean],
				default: 0
			},//是否必填
			disabled: {
				type:[Number,Boolean],
				default: 0
			},//是否便捷
			inputsource:String,
			germValue:{
				type:Object,
				default(){return {}}
			}
		},
		data () {
			return {
				isCreate:false,
				inputType_:this.inputType,//input类型
				isFocus:false,//是否聚焦
				iconNormalClass: 'icon iconfont',
				static_passwordIcon:"iconmimayincang",
				elementValue:"",
				isLabel:false
			}
		},
		computed: {
			...mapState("common", {
				triggerMap:'triggerMap',
				tabsElements:'tabsElements',
				tabsFormDatas:'tabsFormDatas'
			}),
			iconClass (){
				if(this.icon){
					return this.icon
				}else if(this.inputType === "password"){
					return this.static_passwordIcon
				}
			},
			trigger(){
				const triggers = this.triggerMap[this.bundleId] || {}
				return triggers[this.elementId] || []
			},
			elementInfo(){
				return {
					id:this.elementValue,
					name:this.elementValue,
					relationColumnType:this.relationColumnType,
				}
			}
		},
		watch: {
			elementInfo(newVal, oldVal){
				this.SET_TABS_FORMDATAS({//设置表单数据
					tabId:this.mobileTabId,
					elementId:this.elementId,
					params:newVal
				})
				if(this.labelType==="advancedFilter"){
					this.SET_ADV_FORMDATAS({//设置高级表单数据
						tabId:this.mobileTabId,
						elementId:this.elementId,
						params:newVal
					})
				}
			},
		    elementValue(newVal, oldVal){
				if(newVal==oldVal) return 
				//判断是否有js触发器
				const isJsFnc = this.trigger.filter( item => item.basetype === 5 && item.jsFunctionList.length>0) || []
				let flag = true
				const _this = this
				if(isJsFnc.length !== -1 && !this.isCreate && newVal){
					for(let i = 0,len = isJsFnc.length;i<len;i++ ){
						const jsFunctionList = isJsFnc[i].jsFunctionList
						//先判断有没有时间区间
						if(!_this.checkedNumberRange(newVal,jsFunctionList,oldVal)){
							flag = false
							break
						} 
					}
				}
				
				if(!flag) return 
				
				let bastype = "change"
				if(this.isCreate){
					bastype = "create"
				}
				this.isCreate = false
				this.$emit('input', newVal);
		    },
		},
		methods: {
			...mapMutations("verificationRule",["SET_TAB_RULE"]),
			...mapMutations("common",["SET_TABS_FORMDATAS"]),
			...mapMutations("advanceFilter",["SET_ADV_FORMDATAS"]),
			checkedNumberRange(value, jsFunctionList){//验证数字区间
				const min = jsFunctionList.find( item => item.param === "min") || {},
					  max = jsFunctionList.find( item => item.param === "max") || {}
				
				let minNumber = {},maxNumber = {}
				const baseConfig = {
					otherTabId:this.relationMainTab,
					mobileTabId:this.mobileTabId,
					tabsElements:this.tabsElements,
					tabsFormDatas:this.tabsFormDatas,
				}
				if(min.valueType === 2) {
					let minconfig = baseConfig
					minconfig.key = min.paramValue
					minNumber = this.Static_GlobalFucs.Global_ParamFormat(minconfig,this)
				}else {
					minNumber.id = min.paramValue
					minNumber.lable = min.paramValue
				}
					
				if(max.valueType === 2){
					let maxconfig = baseConfig
					maxconfig.key = max.paramValue
					maxNumber = this.Static_GlobalFucs.Global_ParamFormat(maxconfig,this)
				}else{
					maxNumber.id = max.paramValue
					maxNumber.lable = max.paramValue
				}
				
				let param = {},errorMsg=""
				param[this.elementId] = value
				const checkRes = this.Static_GlobalFucs.checkForm({
					rule:[{
						name:this.elementId, 
						checkType : "numberRange", 
						checkRule:`${minNumber.id || ''},${maxNumber.id || ''}`,  
						errorMsg:`${this.label || ''},${minNumber.lable || ''},${maxNumber.lable || ''}`,
					}],
					data:param
				})
				
				if(!checkRes.isCheck){
					this.Static_GlobalFucs.showToast({title:checkRes.errorMsg})
					this.elementValue = minNumber.id || maxNumber.id
				} 
				
				return checkRes.isCheck
			},
			inputFocus() {//设置聚焦
				this.isFocus = true
			},
			handleTrigger(bastype=2){//触发器
				let params = {}
				params["elementId"] = this.elementId
				params["triggerBaseType"] = bastype
				params["value"] = this.elementValue
				params["label"] = this.elementValue
				this.$emit('trigger',params)
			},
			inputBlur() {//失焦
				this.isFocus = false
				this.handleTrigger(2)
			},
			fontIconClick(){//点击icon
				if(this.iconClass === "iconmimayincang"){//password显示
					this.static_passwordIcon = "iconmimaxianshi"
					this.inputType_ = "text"
				}else if(this.iconClass === "iconmimaxianshi"){//隐藏
					this.static_passwordIcon = "iconmimayincang"
					this.inputType_ = "password"
				}
			},
			changeLabelColor(event){
				this.isLabel = event.detail.value?true:false;
			},
		},
		created(){
			this.isCreate = true
			
			this.elementValue = this.germValue.id
		}
	} 
</script>
<style>
	.clearBtn{
		position: relative;
		padding: 0 10px;
	}
</style>
