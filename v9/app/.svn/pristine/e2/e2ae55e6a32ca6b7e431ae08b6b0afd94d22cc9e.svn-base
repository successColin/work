/**
 * @description 设置首页的全局变量
 * @autor shishanshan
 * @update 2019/08/12
 */
import vue from 'vue'
const homeTemplate = uni.getStorageSync("homeTemplate") || {}//从缓存中获取主页信息
const state = {
	calendarBundle:{},//bundle日历
	newBundle:{},//记录新的bundle
	figureList: [],//轮播图
	leftList:[{
		"iconName":"iconsaoma"
	}],//顶部左侧功能列表
	rightList: [{
		"iconName":"iconxiaoxi"
	}],//顶部右侧功能列表
	topCoreList: homeTemplate.topCoreList || [],//主要功能块
	workSpaceList: homeTemplate.workSpaceList || [],//工作区
	bottomList: homeTemplate.bottomList || [],
	myWorkSpace: homeTemplate.bottomList || [],//我的工作台
	countsql: {},
	enabledData: {}
}
const mutations = {
	CLEAR_STATE(state){//清空
		state.calendarBundle={}//bundle日历
		state.newBundle={}//记录新的bundle
	},
	SET_HOME_TEMPLATE(state, params){//设置主页信息
		const {topCoreList, workSpace, figureList, bottomList, myWorkSpace} = params
		state.topCoreList = topCoreList
		state.workSpaceList = workSpace
		state.figureList =  figureList
		state.myWorkSpace = myWorkSpace
		state.bottomList = bottomList.map(item => {item.barKey = item.id; return item})
	},
	SET_NEW_BUNDLE(state, params){//记录新的bundle
		vue.set(state.newBundle, params.bundle,params.isNew)
	},
	SET_CALENDAR_BUNDLE(state, params) {//设置bundle日历
		if(state.calendarBundle[params.bundle]) state.calendarBundle[params.bundle] = {...params.calendarBundle}
		else vue.set(state.calendarBundle, params.bundle, params.calendarBundle)
	},
	SET_SELECT_INFO(state, params){
		state.enabledData=params//我的页面配置
	},
	SET_COUNT_SQL(state, params){
		state.countsql=params//我的页面配置
	},
}

export default {
	namespaced:true,
	state,
	mutations
}

