/**
 * @description 设置表单的全局变量
 * @autor shishanshan
 * @update 2019/08/24
 */
import vue from 'vue'

const state = {
	filterSQLParams:{},//存放SQL变量
	currentTopRightBtns:{},
	currentBottomBtns:{},
	currentComboBoxs:{},
	oldTopRightBtns:{},
	oldBottomBtns:{},
	oldComboBoxs:{},
	selectOptions:{},//下拉框的值
	filePassList:{},
	fileParams:{},
}

const mutations = {
	SET_FORM_OPTIONS(state, params){//设置下拉框的值
		if(state.selectOptions[params.elementId]) state.selectOptions[params.elementId] = [...params.options]
		else vue.set(state.selectOptions, params.elementId, params.options)
	},
	SET_FILTER_SQLPARAMS(state, params){//根据面板id设置过滤器SQL变量
		vue.set(state.filterSQLParams, params.tabId, params.params)
	},
	SET_OLDBTNS(state, params){
		if(params.type==="bottom") vue.set(state.oldBottomBtns, params.tabId, params.btns)
		else vue.set(state.oldTopRightBtns, params.tabId, params.btns)
	},
	SET_CURRENTBTNS(state, params){
		if(params.type==="bottom") vue.set(state.currentBottomBtns, params.tabId, params.btns)
		else if(params.type==="comboBox") vue.set(state.currentComboBoxs, params.tabId, params.btns)
		else vue.set(state.currentTopRightBtns, params.tabId, params.btns)
	},
	SET_ALLBTNS(state, params){
		const comboBoxs = params.comboBoxs || [],
			  bottomBtns = params.bottomBtns || [],
			  topRightBtns = params.topRightBtns || []
		if(state.currentComboBoxs[params.tabId]) state.currentComboBoxs[params.tabId] = [...comboBoxs]
		else vue.set(state.currentComboBoxs, params.tabId, comboBoxs)
		
		if(state.currentBottomBtns[params.tabId]) state.currentBottomBtns[params.tabId] = [...bottomBtns]
		else vue.set(state.currentBottomBtns, params.tabId, bottomBtns)
		
		if(state.currentTopRightBtns[params.tabId]) state.currentTopRightBtns[params.tabId] = [...topRightBtns] 
		else vue.set(state.currentTopRightBtns, params.tabId, topRightBtns)
	},
	SET_FILEPASSLIST(state, params){
		vue.set(state.filePassList, params)
	},
	SET_FILEPARAMS(state, params){
		vue.set(state.fileParams, params)
	}
}

export default {
	namespaced:true,
	state,
	mutations
}

