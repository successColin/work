<template>
	<view class="echartFramework ">
		<!-- <m-back-bar class="wx_button">
			<block slot="barTitle">{{barTitle}}223</block>
		</m-back-bar> -->
		<!-- <image :src="echartsBg" mode="widthFix" class="wxcharts_bg"></image> -->
			
		<view class="echart-content wchart-content">
			<view class="statistics-list ">
				<view class="statistics-item" v-for="(item,index) in totalData" :key="index" @click="handleNav(item)">
					<view >
						<m-font-icon :icon="item.iconName" :iconSize="iconSize"></m-font-icon>
						<span>{{item.displayName}}</span>
					</view>
					<view class="num">{{item.totalData}}</view>
				</view>
			</view>
			
				<view class="echart-list wxcharts-list" >
				
					<view v-for="(item,index) in chartData1" :key="index" v-if="chartData1.length>0">
						<!-- <wxcharts-template :chartData="item" :canvasId="item.elementId" ref="templateChart" ></wxcharts-template> -->
						<view class="container">
							<view class="ectart-title" v-if="item.lineChartData.length>0 || item.columnChartData.length>0 || item.pieChartData.length>0">{{item.label}}</view>
							
								<view class="canvasView" v-if="item.lineChartData.length>0">
									<canvas :canvas-id="item.sameIdLine" :id="item.sameIdLine"  class="canvasStyle" @touchstart="touchLineA"></canvas>
								</view>
								<view id="canvasWidth" class="canvasView" v-if="item.columnChartData.length>0">
									<canvas :canvas-id="item.sameIdColumn" :id="item.sameIdColumn"  class="canvasStyle" @touchstart="touchColumn"></canvas>
								</view>
								<view class="canvasView" v-if="item.pieChartData.length>0" v-for="it in item.pieChartData" :key="it.cav_id" >
									<canvas :canvas-id="it.cav_id" :id="it.cav_id" class="canvasStyle" @touchstart="touchPie" ></canvas>
								</view>
							
						</view>
				
					</view>
				</view>
			
			

		</view>
	</view>
	</view>
</template>

<script>
	import uCharts from "@/static/js/u-charts.min.js";
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		formApi,
		homeApi
	} from '@/common/request/api.js'
	import * as Path from 'common/request/homeApi/interface.js'
	import store from '@/store/index'
	var canvaColumn=null
	var canvaPie=null
	var canvaLineA=null
	var _self
	var pieArr=[]
	var columnArr=[]
	var lineArr=[]
	var templateType = [
		'frames/UBPFramework',//1-通用业务处理框架对应主页为列表
		'frames/inspection/download/download',//2-数据下载框架 点巡检下载
		'frames/inspection/inspection/route',// 3-离线点巡检框架
		'frames/FormFramework',//4-表单框架
		'frames/wxchartFramework',//5-首页报表框架
	]
	export default {
		data() {
			return {
				barTitle: '报表中心',
				iconSize: 30,
				height: 340,
				showDefault: true,
				colorCode: '#ffffff',
				pixelRatio:1,
				gatherData: [],
				chartData: [],
				gatherelements: [],
				totalData: [],
				chartDataNew: {},
				seriesData: [],
				canvasData: {},
				chartData1: [],
				showCount:0,
				color: ["#5EAFFD", "#73D484", "#ba55d3", "#398FE3", "#FF9797", "#FFC785"],
			}
		},
		computed: {
			...mapState(["screenHeight"]),
			...mapState(["bundleName", "bundleId", "isOriginHei", "userDesigner","themeColorCode"]),
			...mapState("home", {
				newBundle: 'newBundle'
			}),
			
		},
		methods: {
			...mapMutations(["SET_ORIGIN", "SET_bundle"]),
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("form", ["SET_FILTER_SQLPARAMS", "SET_ALLBTNS"]),
			...mapMutations("home", ["SET_NEW_BUNDLE"]),
			delSameData(oldArr){
				var newArr=[]
				for(var i=0;i<oldArr.length;i++){
				　　var flag = true;
				　　for(var j=0;j<newArr.length;j++){
				　　　　if(oldArr[i].opts.canvasId == newArr[j].opts.canvasId){
				　　　　　　flag = false;
				　　　　};
				　　}; 
				　　if(flag){
				　　　　newArr.push(oldArr[i]);
				　　};
				}
				return newArr
			},
			touchColumn(e){
				var chartsId=e.target.id
				var columnArrNew=[]
				columnArrNew=this.delSameData(columnArr) 
				for(let k=0;k<columnArrNew.length;k++){
					if(chartsId == columnArrNew[k].opts.canvasId){
						columnArrNew[k].showToolTip(e, {
								format: function (item, category) {
									if(typeof item.data === 'object'){
										return category + ' ' + item.name + ':' + item.data.value 
									}else{
										return category + ' ' + item.name + ':' + item.data 
									}
								}
							})
							columnArrNew[k].touchLegend(e)
					}
				}
				
			},
			touchPie(e){ 
				var pieChartsId=e.target.id
				var pieArrNew=[]
				pieArrNew=this.delSameData(pieArr) 
				for(let k=0;k<pieArrNew.length;k++){
					if(pieChartsId == pieArrNew[k].opts.canvasId){
						 pieArrNew[k].showToolTip(e, {
						format: function (item) {
							return item.name + ':' + item.data 
						}
					})
					pieArrNew[k].touchLegend(e)
					}
				}
			},
			touchLineA(e) {
				var chartsId=e.target.id
				console.log(lineArr)
				var lineArrNew=[]
				lineArrNew=this.delSameData(lineArr) 
				console.log(lineArrNew)
				for(let k=0;k<lineArrNew.length;k++){
					if(chartsId == lineArrNew[k].opts.canvasId){
						console.log(lineArrNew[k])
						 lineArrNew[k].showToolTip(e, {
								format: function (item, category) {
									return category + ' ' + item.name + ':' + item.data 
								}
							})
							lineArrNew[k].touchLegend(e)
					}
				}
			},
			handleNav(item){
				var bundletemplate=templateType[item.bundleMap.mobileFrameTypeId-1]
				var bundleName=item.bundleMap.name
				var bundleId=item.bundleMap.id
				
				var url="/pages/"+bundletemplate+"?title="+bundleName+"&bundleId="+bundleId+"&mainTab=1"
				uni.navigateTo({
					url:url
				})
			},
			drawCharts(){
				var me=this
				var dataShow=me.chartData1
				console.log(dataShow)
				for(let i=0;i<dataShow.length;i++){
					console.log(dataShow[i])
					if(dataShow[i].lineChartData.length>0){
						let transData={
							cavansId:dataShow[i].sameIdLine,
							dataDraw:dataShow[i].lineChartData
						}
						me.chartsLine(transData)
						console.log(transData)
					}
					if(dataShow[i].columnChartData.length>0){
						let transData={
							cavansId:dataShow[i].sameIdColumn,
							dataDraw:dataShow[i].columnChartData
						}
						me.chartsColum(transData)
						console.log(transData)
					}
					if(dataShow[i].pieChartData.length>0){
						console.log(dataShow[i].pieChartData)
						var pieDrawData=[]
						var perArr=[]
						var cavansId=[]
						var pieName=[]
						for(let j=0;j<dataShow[i].pieChartData.length;j++){
							perArr=[]
							for(let k=0;k<dataShow[i].pieChartData[j].xData.length;k++){
								var obj={
									name:dataShow[i].pieChartData[j].xData[k],
									data:dataShow[i].pieChartData[j].data[k]
								}
								perArr.push(obj)
								console.log(perArr)
								
							}
							cavansId.push(dataShow[i].pieChartData[j].cav_id)
							pieDrawData.push(perArr)
							pieName.push(dataShow[i].pieChartData[j].name)
							var transData={
								pieName:pieName,
								cavansId:cavansId,
								dataDraw:pieDrawData
							}
							
						}
						console.log(transData)
						me.chartsPie(transData)
					}
					
					
				}
			},
			chartsColum(data) {
				//获取屏幕宽度
				var widthGet
				wx.getSystemInfo({
				      success: function(res) {
				        console.log(res.windowWidth);
						widthGet=res.windowWidth-30
				      },
				    })
				console.log(data)
				if(data.cavansId != "" ){
					for(let i=0;i<data.dataDraw.length;i++){
						canvaColumn=new uCharts({
							$this:_self,
							canvasId: data.cavansId,
							type: 'column',
							legend:{
								show:true,
								position:"top"
							},
							fontSize:11,
							background:'#FFFFFF',
							padding:[15,15,15,15],
							pixelRatio:1,
							animation: true,
							categories: data.dataDraw[i].xData,
							series: data.dataDraw,
							xAxis: {
								disableGrid:true,
								
							},
							yAxis: {
								gridColor:'#e8e8e8',
							},
							dataLabel: true,
							width: widthGet,
							height: 288,
							extra: {
								column: {
									type:'group',
									//width: 20
								},
							  }
						});
						columnArr.push(canvaColumn)
					}
				
				}
				
			},
			chartsLine(data) {
				//获取屏幕宽度
				var widthGet
				wx.getSystemInfo({
				      success: function(res) {
				        console.log(res.windowWidth);
						widthGet=res.windowWidth-30
				      },
				    })
				console.log(data)
				 if(data.cavansId != ""){
					 for(let i=0;i<data.dataDraw.length;i++){
						 console.log(data.dataDraw)
						 
						 canvaLineA=new uCharts({
						 	$this:_self,
						 	canvasId: data.cavansId,
						 	type: 'line',
						 	fontSize:11,
						 	legend:{
						 		show:true,
						 		position:"top"
						 	},
						 	dataLabel:false,
						 	dataPointShape:true,
						 	background:'#FFFFFF',
						 	pixelRatio:_self.pixelRatio,
							padding:[15,15,15,15],
						 	categories: data.dataDraw[i].xData,
						 	series: data.dataDraw,
						 	animation: true,
						 	xAxis: {
								disableGrid:true
						 	},
						 	yAxis: {
						 		gridColor:'#e8e8e8',
						 	},
							width: widthGet,
							height: 288,
						 	extra: {
						 		line:{
						 			type: 'straight'
						 		}
						 	}
						 });
						 lineArr.push(canvaLineA)
					 }
					
				}
					

			},
			chartsPie(data) {
				//获取屏幕宽度
				var widthGet
				wx.getSystemInfo({
				      success: function(res) {
				        console.log(res.windowWidth);
						widthGet=res.windowWidth-30
				      },
				    })
				console.log(data)
					for(let i=0;i<data.dataDraw.length;i++){
						canvaPie=new uCharts({
							$this:_self,
							canvasId: data.cavansId[i],
							type: 'ring',
							fontSize:11,
							legend:{
								show:true,
								position:"top"
							},
							title: {
									name: data.pieName[i],
									color: '#7cb5ec',
									fontSize: 20*_self.pixelRatio,
									
								},
							pixelRatio:_self.pixelRatio,
							extra: {
								pie: {
								  offsetAngle: -45,
								  ringWidth: 40,
								  labelWidth:15
								}
							},
							background:'#FFFFFF',
							pixelRatio:_self.pixelRatio,
							series: data.dataDraw[i],
							animation: true,
							width: widthGet,
							height: 288,
							disablePieStroke: true,
							dataLabel: true,
						});
						pieArr.push(canvaPie)
					}
					console.log(pieArr)
				
			},
			getRandomArray(arr, num) {
				let out = []
				let n = arr.length > num ? num : arr.length
				while (out.length < n) {
					let temp = parseInt(Math.random() * arr.length)
					out = [...out, ...arr.splice(temp, 1)]
				}
				return out
			},
			showEcharts(elements) {
				console.log(elements)
				var me=this
				for (let i = 0; i < elements.length; i++) {
					if (elements[i].baseType == 37) {
						this.gatherData.push(elements[i])
						this.gatherelements.push(elements[i].elementId);
					} else if (elements[i].baseType == 38) {
						this.chartData.push(elements[i])
						this.$http.post('currencyPcList/currencyGetDataByElementId', {
								elementId: elements[i].elementId
							})
							.then(res => {
								var canvasid, chartType, xData, chartName, label, cav_id, sameIdColumn, sameIdLine, colorCode
								var lineChartData = []
								var columnChartData = []
								var pieChartData = []
								var chartObj = {}
								var objDataLine = {}
								var objData = {}
								let data = res.data.data.yAxis
								xData = res.data.data.xAxis
								for (var n in data) {
									for (let k = 0; k < me.chartData.length; k++) {
										for (let j = 0; j < me.chartData[k].chartList.length; j++) {
											if (me.chartData[k].chartList[j].id == n) {
												console.log(me.chartData[k])
												chartType = me.chartData[k].chartList[j].chartType
												chartName = me.chartData[k].chartList[j].name
												label = me.chartData[k].label
												cav_id = me.chartData[k].chartList[j].id
												sameIdColumn = 'column' + me.chartData[k].chartList[j].elementId
												sameIdLine = 'line' + me.chartData[k].chartList[j].elementId
												console.log(data[n])
												me.seriesData = data[n]
												if (me.chartData[k].chartList[j].colorCode != null) {
													colorCode = me.chartData[k].chartList[j].colorCode
												} else {
													colorCode = me.getRandomArray(me.color, 1)[0]
												}
						
												if (chartType == 1) {
													objData = {
														color: colorCode,
														name: chartName,
														data: data[n],
														xData:xData
													}
													lineChartData.push(objData)
												}
												if (chartType == 2) {
													objData = {
														color: colorCode,
														name: chartName,
														data: data[n],
														xData:xData
													}
													columnChartData.push(objData)
						
												}
												if (chartType == 3) {
													objData = {
														name: chartName,
														data: data[n],
														xData:xData,
														cav_id: cav_id
													}
													pieChartData.push(objData)
						
												}
											}
											
											//me.showDa(me.lineDatas)
										}
						
						
									}
						
								}
								chartObj = {
									label,
									sameIdLine,
									sameIdColumn,
									lineChartData,
									columnChartData,
									pieChartData,
								}
								me.chartData1.push(chartObj)
								console.log(me.chartData1)
								me.drawCharts();
						
							})
					}
				}
				console.log(this.chartData);
				this.getTotalData();
			},
			getTotalData() {
				const elementIds = this.gatherelements.toString();
				this.$http.post('currencyPcList/currencyGetTotalByElementId', {
						elementIds: elementIds
					}, {
						header: {
							'content-type': 'application/json;charset=UTF-8'
						}
					}, )
					.then(res => {
						console.log(res)
						this.showTotalData(res.data.data)
					})
					.catch(err => {
						console.log(err)
					})
			},
			showTotalData(TotalData) {
				let obj = {};
				for (var n in TotalData) {
					for (let i = 0; i < this.gatherData.length; i++) {
						if (n == this.gatherData[i].elementId) {
							this.gatherData[i].defaultValue = TotalData[n];
							obj = {
								'iconName': this.gatherData[i].iconName,
								'colorCode': this.gatherData[i].colorCode,
								'displayName': this.gatherData[i].label,
								'totalData': TotalData[n],
								'bundleMap':this.gatherData[i].bundleMap,
							}
							this.totalData.push(obj);
							console.log("====================================================");
							console.log(this.totalData)
						}
					}
				}
			},
		},
		
		onLoad(options) {
			_self = this;
			canvaColumn=null
			canvaPie=null
			canvaLineA=null
			pieArr=[]
			columnArr=[]
			lineArr=[]
			_self.showCount++
			console.log(_self.showCount)
			uni.setNavigationBarTitle({
			    title: _self.barTitle,
			});
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: _self.themeColorCode,
			})
			this.TOAST_REQUESTURLS({
				type: "clear"
			}) //清空请求地址
			if (!options.bundleId) return

			const _t = this
			//如果有bundleId传递过来默认显示
			this.SET_bundle({
				bundleId: options.bundleId,
				bundleName: options.title
			})

			//判断是否需要重新获取界面元素
			const bundleInfo = uni.getStorageSync(this.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
				mobileTabId = bundleInfo.mainTabID
			let mobileTabsBYRelation = {}
			if (mobileTabId) mobileTabsBYRelation = mobileTabs[mobileTabId] || {}

			const isNew = this.newBundle[this.bundleId], //是不是为newbundle
				bundleV = options.V || "0"
			//定义面板信息
			let tabInfo = {
				_uid: this._uid,
				bundleId: this.bundleId,
				bundleName: this.bundleName,
				mobileTabId: mobileTabId,
				relationMainTab: '',
				mobileTabs: mobileTabs,
				trigger: bundleInfo.triggerMap || {},
				parentKey: "",
				refreshParams: {},
				formType: 'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
			}
			this.tabInfo = tabInfo

			homeApi.getPage(this)
				.then(value => {
					console.log(value)
					const mainTabID = value.mainTabID
					this.tabInfo.mobileTabId = mainTabID
					this.tabInfo.mobileTabs = value.mobileTabs
					this.$nextTick(() => {
						this.showEcharts(value.mobileTabs[mainTabID].elements);
					})
					
					//将bundle版本存入bundleVersion缓存种，版本号以用户设计组和bundleId作为key
					if (isNew) {
						//加载过后设置isNew为false
						this.SET_NEW_BUNDLE({
							bundle: this.bundleId,
							isNew: false
						})
						let bundleVersions = uni.getStorageSync("bundleVersion") || {},
							key = this.userDesigner + "_" + this.bundleId
						bundleVersions[key] = bundleV
						uni.setStorageSync("bundleVersion", bundleVersions)
					}
				})
			//解决底部按钮在软键盘打开时被顶起问题
			const res = uni.getSystemInfoSync(),
				_this = this
			this.originHeight = res.windowHeight
			uni.onWindowResize((res) => {
				let isOriginHei = true
				if (res.size.windowHeight < _this.originHeight) {
					isOriginHei = false
				} else {
					isOriginHei = true
				}
				_this.SET_ORIGIN(isOriginHei)
			})
			
			
		}
	}
</script>
<style scoped>
	.haveStatusBar {
		height: var(--status-bar-height);
	}

	.canvasStyle{
		width: 100%;
		height:720upx;
	}
</style>
