<template>
	<view class="dropdownMenuCom">
		<uni-drawer class="drawer" :visible="true" @close="showComBox" mode="right">
			<view class="comBox" v-for="(item,index) in comboBoxs"  v-if="item.visiabled" :key="index" @tap="handleBtnClick({type:item.type,relationTabId:item.relationTabId})">
				<view class="uni-title">{{item.label}}</view> 
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import { mobileTabShowType } from '@/common/constant/constant.js'
	
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
					normalEvent:["comboBox"],
					delEvent:[],
					saveEvent:[]
				} }
			}
		},
		computed: {
			...mapState("common", {
				tabsElements:'tabsElements',
				tabsFormDatas:'tabsFormDatas'
			}),
			...mapState("form", ["currentComboBoxs"]),
			btnInfo() {
				return function(item){
					return {
						type:item.type,
						relationTabId:item.relationTabId,
						relationTableName:item.relationTableName,
						elementId:item.elementId
					}
				}
			},
			comboBoxs(){
				const tabId = this.tabInfo.mobileTabId
				return [...this.currentComboBoxs[tabId]]
			}
		},
		methods:{
			...mapMutations("common",["SET_TEMPLATE_PARAMS"]),
			handleBtnClick(params){//按钮点击
				this.$Toast.showLoading()
				params = {...this.tabInfo,...this.btnBasicInfo,...params}
				btnsComs.click(params,this)
				this.showComBox()
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
	.dropdownMenuCom{display: flex;}
</style>
