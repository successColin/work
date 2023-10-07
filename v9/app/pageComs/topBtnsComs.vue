<template>
	<view class="topBtnsComs">
		<m-button btnClass="mainColor" v-if="isShowComboBoxs" 
			:isFontBtn="true" @elementClick="showComBox">
			<block slot="buttonIcon" style="display: inline-block;">
				<m-font-icon icon="iconyewushaixuan" :iconSize="40"></m-font-icon>
			</block>
		</m-button>
		<m-button v-for="(item,index) in buttons" v-if="showByPermissiones(item.baseType,item.visiabled)"
			:isFontBtn="true" 
			:btnClass="item.btnStyle"  
			:key="index"
			:btnInfo="btnInfo(item)"
			@elementClick="handleBtnClick">
			<block slot="buttonIcon" style="display: inline-block;">
				<m-font-icon :icon="item.iconfont" :iconSize="40"></m-font-icon>
			</block>
		</m-button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import BtnsComs from './btnsComs.js'
	const btnsComs = new BtnsComs()
	export default{
		components: {uniDrawer},
		props:{
			tabInfo:{
				type:Object,
				default:function () { return {} }
			},
			btnBasicInfo:{//按钮信息
				type:Object,
				default:function () { return {
					normalEvent:["addBtn","relationAddBtn"],
					delEvent:[],
					saveEvent:[]
				} }
			}
		},
		computed: {
			...mapState("form", ["currentTopRightBtns","currentComboBoxs"]),
			...mapState("common", {
				tabsElements:'tabsElements',
				tabsFormDatas:'tabsFormDatas'
			}),
			btnInfo() {
				return function(item){
					//如果为关联新增按钮
					const base = {
						type:item.type,
						relationTabId:item.relationTabId,
						relationTableName:item.relationTableName,
						elementId:item.elementId
					}
					let param = {}
					if(item.baseType === 18) {
						param.relationColumn = item.relationColumnName
					}
					return {...base,...param}
				}
			},
			buttons(){
				const tabId = this.tabInfo.mobileTabId
				return this.currentTopRightBtns[tabId]
			},
			comboBoxs(){
				const tabId = this.tabInfo.mobileTabId
				return this.currentComboBoxs[tabId] || []
			},
			isShowComboBoxs(){
				return this.comboBoxs.length
			}
		},
		methods:{
			...mapMutations("common",["SET_TEMPLATE_PARAMS"]),
			...mapMutations(["SET_BusinessID"]),
			showByPermissiones(basetype,visiabled){//按钮权限
				if(!visiabled) return false
				
				let bundleId = this.tabInfo.bundleId
				return this.Static_GlobalFucs.Permissiones(bundleId,basetype)
			},
			handleBtnClick(params){//按钮点击
				params = {...this.tabInfo,...this.btnBasicInfo,...params}
				if(params.isFrames && params.type === 'addBtn'){//如果是初始界面，新增按钮需要去除全局变量BusinessID
					this.SET_BusinessID("")
				}
				btnsComs.click(params,this)
			},
			//下拉菜单显示
			showComBox(){ this.$emit("showComBox") },
			loading(){
				this.$emit("loading")
			},
			selfRefresh(){
				this.$emit("selfRefresh")
			},
			btnEvent(elementFormat){}
		}
	}
</script>

<style lang="scss">
	.topBtnsComs{display: flex;}
</style>
