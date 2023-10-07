/**
 * @description 设置列表的全局变量
 * @autor shishanshan
 * @update 2019/08/12
 */
import vue from 'vue'

const state = {
	forceRefresh:{},//是否需要强制刷新
}

const mutations = {
	SET_PAGE(state, params){//根据不同面板设置设置分页数
		if(!state[params.tabId]) vue.set(state, params.tabId,{})
		state[params.tabId].currentPage = 1
		state[params.tabId].page = params.page
	},
	SET_CURRENT_PAGE(state, params){//设置当前页
		let currentPage =  params.currentPage
		if(!state[params.tabId]) vue.set(state, params.tabId,{})
		if(currentPage===-1) currentPage = state[params.tabId].currentPage -1
		state[params.tabId].currentPage = currentPage
	},
	SET_LIST_REFRESH(state, params){//设置强制刷新
		let key = "mobileTabId_"+params.tabId
		vue.set(state.forceRefresh, key,params.forceRefresh)
	},
	Clear_List(state){//清除list上的属性
	}
}

export default {
	namespaced:true,
	state,
	mutations
}

