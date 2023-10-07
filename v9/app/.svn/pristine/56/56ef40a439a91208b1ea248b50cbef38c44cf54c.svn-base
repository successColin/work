/**
 * @description 设置全局变量
 * @autor shishanshan
 * @update 2019/08/24
 */
import vue from 'vue'

const state = {
	parameters:{},
	commonSelects:{},//普通下拉框
	dropDownData:{},//下拉框数据
	templateParams:{},//存放面板参数
	doRefreshParent:{},//父页面是否刷新
	panelTemplateParams:{},//存放数据选择框弹出面板的参数
	triggerMap:{},//bundle上的触发器
	tabsOldElements:{},//面板的原始控件包括按钮,下拉菜单
	tabsElements:{},//各个面板的控件,除去按钮、下拉控件
	tabsFormDatas:{},//各个面板数据
	tabsChilds:{},//各个面板子面板
	submitTabsDatas:{},//各个面板需要提交的数据
	tabsOldDatas:{},//面板原始数据
	frameUId:'',//框架对应_uid
	webViewUrl:{},//webview的url
	pageRealod:{
		pages:{},
		total:0
	},//记录从工作台点击进入后所以面板，用于判断是否需要重新加载
	previewFilePaths:{}//预览文件的虚拟列表
}

const mutations = {
	SET_COM_PREVIEWFILEPATHS(state, file){
		state.previewFilePaths = {...state.previewFilePaths, ...file}
	},
	SET_COM_PAGERELOAD(state, param){
		const {type, pageUid} = param //type: true-刷新，false；pageUid
		if(pageUid === 'ALL'){//包括当前面板
			let pageRealod = state.pageRealod.pages
			for(let key in pageRealod){
				state.pageRealod.pages[key].type = type
			}
		}else if(pageUid === "first"){//初始化
			state.pageRealod.pages = {}
			state.pageRealod.total = 0
		}else if(pageUid === 'parent'){//不包括本身
			let index = state.pageRealod.total -1
			let pageRealod = state.pageRealod.pages
			for(let key in pageRealod){
				let param = pageRealod[key]
				if(param.index > index) continue
				state.pageRealod.pages[key].type = type
			}
		}else{//对
			if(state.pageRealod.pages[pageUid]) state.pageRealod.pages[pageUid].type = type
			else {
				let index = state.pageRealod.total+1
				vue.set(state.pageRealod.pages, pageUid, {type,index})
				state.pageRealod.total = index
			}
		}
	},
	SET_COM_TABCHILD(state, params){//设置面板子面板属性
		if(state.tabsChilds[params.tabId]) state.tabsChilds[params.tabId] = [...params.tabsChilds]
		else vue.set(state.tabsChilds, params.tabId, params.tabsChilds)
	},
	SET_COMMON_WEBVIEW(state,params){//webview的url
		vue.set(state.webViewUrl, params.key, params.url)
	},
	SET_COMMON_MAINFRAME(state,params){//设置框架的uid
		state.frameUId=params._uid
	},
	SET_COMMON_TABSELEMENTS(state,params){//根据不同面板设置原始控件
		vue.set(state.tabsOldElements, params.tabId, params.elements)
	},
	SET_COMMON_TABSOLDDATAS(state, params){//根据不同面板设置原始数据
		vue.set(state.tabsOldDatas, params.tabId, params.value)
		// vue.set(state.tabsFormDatas, params.tabId, params.value)
	},
	SET_FORMREFRESH_PARENT(state, params){//根据不同面板设置是否刷新页面
		vue.set(state.doRefreshParent, params.tabId, params.value)
	},
	SET_TAB_PARAMETERS(state, params){//根据tab设置面板变量,一个一个参数进行设置
		let parameters = state.parameters[params.tabId] || {}
		parameters[params.key] = params.value
		vue.set(state.parameters, params.tabId, parameters)
	},
	SET_TAB_PARAMETERSALL(state, params){//根据tab设置面板变量
		vue.set(state.parameters, params.tabId, params.queryParams)
	},
	SET_TEMPLATE_PARAMS(state, params){//根据面板id设置面板起始参数
		vue.set(state.templateParams, params.tabId, params.params)
	},
	SET_PANEL_PARAMS(state, params){//根据控件id设置固定弹出面板起始参数
		vue.set(state.panelTemplateParams, params.elementId, params.params)
	},
	SET_DROPDOWNDATA(state, params){//设置下拉框数据
		vue.set(state.dropDownData, params.elementId, params.dropDown)
	},
	SET_COMMONSLT(state, params){//设置普通下拉框
		vue.set(state.commonSelects, params.tabId, params.params)
	},
	SET_TRIGGERMAP(state, params){//设置下拉框数据
		vue.set(state.triggerMap, params.bundleId, params.trigger)
	},
	SET_TABS_ELEMENT(state, params){//设置面板控件
		if(state.tabsElements[params.tabId]) state.tabsElements[params.tabId] = [...params.elements]
		else vue.set(state.tabsElements, params.tabId, params.elements)
	},
	SET_TABS_FORMDATAS(state, params){//根据面板id记录下所有数据，如果是列表默认记录的是最后一条数据
		if(state.tabsFormDatas[params.tabId]) state.tabsFormDatas[params.tabId] = {...params.formData}
		else vue.set(state.tabsFormDatas, params.tabId, params.formData)
	},
	SET_COMMON_FORMDATAS(state, params){//根据面板id记录下所有数据
		vue.set(state.tabsFormDatas, params.tabId, params.value)
	},
	SET_TABS_SUBFORMDATAS(state, params){//根据面板id记录需要提交的数据
		vue.set(state.submitTabsDatas, params.tabId, params.submitDatas)
	},
	CLEAR_FORMDATAS(state, tabId){//清空面板值
		vue.set(state.submitTabsDatas, tabId, {})
	},
	CLEAR_PANEL(state){//清空固定弹出面板起始参数
		state.panelTemplateParams = {}
	},
	CLEAR_PARAMETERS(state){//清空
		state.doRefreshParent = {}
		state.parameters = {}
		state.dropDownData = {}
		state.templateParams = {}
		state.panelTemplateParams = {}
		state.triggerMap = {}
		state.tabsElements = {}
		state.tabsFormDatas = {}
		state.submitTabsDatas = {}
		state.tabsOldDatas = {}
		state.tabsOldElements = {}
		state.tabsChilds = {}
	}
}

export default {
	namespaced:true,
	state,
	mutations
}

