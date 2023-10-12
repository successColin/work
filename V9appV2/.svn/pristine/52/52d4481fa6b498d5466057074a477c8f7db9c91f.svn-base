<!-- 外部链接面板 -->
<template>
	<view>
		<m-back-bar id="webViewBackBar">
			<block slot="barTitle">{{barTitle}}</block>
		</m-back-bar>
		<web-view :src="webViewURL" :webview-styles="webviewStyles" v-webviewTop="marginTop"></web-view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import qsStringify from 'qs-stringify'
	import {APP_GetStandardUid} from '@/common/request/uniqueApi/index.js'
	export default {
		data(){
			return{
				webViewURL:"",
				isShow:false,
				marginTop:0,
				barTitle:'',
				webviewStyles: {
					top:'44px',
					progress: {
							color: '#FF3333'
					}
				}
			}
		},
		directives:{
			webviewTop:{
				update:function(el, binding, vnode){
					console.log("update:"+binding.value)
					const {value, oldValue} = binding
					if(value !== oldValue) el.style.top = binding.value + 'px'
					
				}
			}
		},
		computed: {
			...mapState(["bundleName","bundleId","BusinessID","account"]),
			...mapState("common", ["templateParams","tabsElements","tabsFormDatas"]), //面板参数
		},
		methods: {
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("common", ["SET_TABS_ELEMENT","SET_TABS_FORMDATAS"]),
			getUid(jumpUrl,urlParams){//2个系统之间获取uid
				let submitUrl = urlParams.static_uid
				APP_GetStandardUid(this.account,submitUrl,this).then(value => {
					delete urlParams.static_uid
					urlParams.uid = value
					urlParams = qsStringify(urlParams)
					this.webViewURL = `${jumpUrl}?${urlParams}`
				})
			},
			setPageInfo(tabInfo) {
				const {mobileTabsBYRelation,relationMainTab,mobileTabId} = tabInfo,
							{jumpUrl,elements}=mobileTabsBYRelation
				//设置返回栏标题
				this.barTitle = mobileTabsBYRelation.mobileTabName || tabInfo.bundleName
				const dataBasic = {
					eventType:4,triggerList:[],
					relationMainTab,mobileTabId,
					formData:{},oldFormData:{},
					currentElements:elements,
					currentBottomBtns:[],
					currentTopRightBtns:[],
					currentComboBoxs:[],
					triggerElements:elements,
					oldElements:elements,
					searchSelectInfo:{},
					loadsearchSelects:[],
					rules:[],
				}
				this.SET_TABS_ELEMENT({//设置面板控件
					tabId:tabInfo.mobileTabId,
					elements:elements
				}) 
				this.Static_GlobalFucs.formElementsTrigger(dataBasic,this).then(tabParams => { //获取第三方地址的编码
					const {formData} = tabParams
					let urlParams = {}
					for(let key in formData){
						const {parameter,id} = formData[key]
						if(parameter) urlParams[parameter] = id
					}
					if("static_uid" in urlParams){
						this.getUid(jumpUrl,urlParams)
					}else{
						urlParams = qsStringify(urlParams)
						this.webViewURL = `${jumpUrl}?${urlParams}`
					}
				})
			},
		},
		onLoad: function (options) {
			if(options.isPreview){ //如果是预览文件
				this.webViewURL = options.url
				this.barTitle = options.fileName
				return
			}
			this.TOAST_REQUESTURLS({type:"clear"})//清空请求地址
			const currentTabId = options.relationTab //当前面板的id
			
			//当前面板id不存在，不进行面板布局 todo 进入报错界面
			if(!currentTabId) return 
			const currentTemParams = this.templateParams[currentTabId] || {} //获取当前面板参数
			//判断是否有mobileTabs
			const bundleInfo = uni.getStorageSync(currentTemParams.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
						mobileTabsBYRelation = mobileTabs[currentTabId] || {}
			
			let onKey = `webView${this._uid}`
			const {bundleId,bundleName, relationMainTab, onkey,
						 refreshParams} = currentTemParams
			const {triggerMap} = bundleInfo
			//定义面板信息
			let tabInfo = {
				_uid:this._uid,
				bundleId, bundleName, mobileTabId:Number(currentTabId),
				relationMainTab:relationMainTab || '',mobileTabs:mobileTabs,
				trigger:triggerMap || {}, parentKey:onkey || "", selfKey:onKey,
				refreshParams:refreshParams || {},
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
				mobileTabsBYRelation:mobileTabsBYRelation
			}
			this.setPageInfo(tabInfo)
		},
		mounted() {
			//获取导航栏的高，并用于webview设置上边距，可以使webview可以留出导航栏高度
			const query = uni.createSelectorQuery().in(this);
			let currentWebview = "";//获取当前web-view
			// #ifdef APP-PLUS
			currentWebview = this.$scope.$getAppWebview()
			// #endif
			uni.getSystemInfo({
				success: (sysinfo) => {
					const sysHeight = sysinfo.windowHeight,//系统高度
								statusBarHeight = sysinfo.statusBarHeight;//状态栏高度
								
					query.select('#webViewBackBar').boundingClientRect(data => {
						const barHeight = data.height
						const topHeight = statusBarHeight + barHeight //top高度
						this.marginTop = topHeight
						// #ifdef APP-PLUS
						const wv = currentWebview.children()[0]
						wv.setStyle({//设置web-view距离顶部的距离以及自己的高度，单位为px
							top: topHeight,
							height:sysHeight - topHeight 
						})
						// #endif
					}).exec();
				}
			});
			
						
			// query.select('#webViewBackBar').boundingClientRect(data => {
			// 		this.isShow = true
			// 		this.marginTop = data.height
			// 		console.log(data.height)
			// 		var currentWebview = this.$scope.$getAppWebview();//获取当前web-view
			// 			var wv = currentWebview.children()[0];
			// 			wv.setStyle({//设置web-view距离顶部的距离以及自己的高度，单位为px
			// 				top: data.height + 20,
			// 				height:100
			// 			})
			// }).exec();
			
		}
	}
</script>

<style>
</style>
