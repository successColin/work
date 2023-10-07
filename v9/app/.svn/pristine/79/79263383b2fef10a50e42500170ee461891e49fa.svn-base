/**
 * @description 设置表单的全局变量
 * @autor shishanshan
 * @update 2019/08/24
 */
import vue from 'vue'

const state = {
	advanceFilters:{},
	connectors:{},
	advancedFilterFormDatas:{}
}

const mutations = {
	SET_ADVAN_FILTERS(state, params){//根据tab设置面板过滤条件
		vue.set(state.advanceFilters, params.tabId, params.params)
	},
	SET_CONNECTORS(state, params){//根据tab设置面板过滤规则
		if(state.connectors[params.tabId]) state.connectors[params.tabId] = {...params.values}
		else vue.set(state.connectors, params.tabId, params.values)
	},
	SET_ADV_FORMDATAS(state, params){//根据面板id记录下高级数据
		if(state.advancedFilterFormDatas[params.tabId]) state.advancedFilterFormDatas[params.tabId] = {...params.values}
		else vue.set(state.advancedFilterFormDatas, params.tabId, params.values)
	},
	CLEAR_ADV_FILTER(state, params){//清空高级筛选条件包括数据和规则
		vue.set(state.connectors, params.tabId, {})
		vue.set(state.advancedFilterFormDatas, params.tabId, {})
	},
}

export default {
	namespaced:true,
	state,
	mutations
}

