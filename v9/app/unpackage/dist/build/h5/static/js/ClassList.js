import { mobileTabShowType } from '@/common/constant/constant.js'
import {formApi} from '@/common/request/api.js'
class Static_ListClass {
	constructor(vm,tabInfo) {}
	/**列表过滤条件
	 * @param {Object} _this
	 * @param {Object} params
	 */
	advancedParams(_this,params){
		const {advancedQuery, advancedSqlQuery, relationMainTab,bundleParams,tabStaticParams} = params

		let queryParams = {
			advancedQuery:{},
			advancedSqlQuery:{}
		}
		const config = {
			otherTabId:relationMainTab,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
			bundleParams,//菜单参数
			tabStaticParams//面板固定参数
		}
		for (let key in advancedQuery) {
			let paramConfig = config
			paramConfig.key = key
			let value = _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this) 
			if(value && typeof value === "object"){
				value = value.id
			}
			queryParams.advancedQuery[key] = value
		}
		
		advancedSqlQuery.map( item => {
			let paramConfig = config
			paramConfig.key = item
			let value = _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this) 
			
			queryParams.advancedSqlQuery[item] = {
				value:value.id,
				type:value.relationColumnType
			}
		})
		
		return queryParams
	}
	/**点击列表节点
	 * @param {Object} node 列表数据
	 */
	clickListNode(_this,params){
		const primaryKey = params.primaryKey, //主键对应的elementid
			  node = params.listItem || {}
		let businessID = node[primaryKey] || ""
		if(params.isMain){//是否为主主面板
			//设置主业务id
			businessID = _this.Static_GlobalFucs.setBusinessID(_this,businessID)
		}else{
			businessID = _this.Static_GlobalFucs.dataFormat(businessID)
		}
		
		//如果没有面板展示类型不进行跳转
		if(!params.mobileTabRelationTabId) return 
		const mobileTabRelation = params.mobileTabs[params.mobileTabRelationTabId]
		let mobileTabRelationTabShowType = mobileTabRelation.mobileTabShowType,
			childMobilTable = mobileTabRelation.childMobilTable||[]
		let tabParams = {//设置下一个面板的参数
			tabId:params.mobileTabRelationTabId,
			params:{
				relationTab:params.mobileTabRelationTabId,
				relationMainTab:params.mobileTabId,
				onkey:params.selfKey,
				id:businessID.id,
				refreshParams:params.refreshParams,
				bundleId:params.bundleId,
				bundleName:params.bundleName,
				tabStaticParams:params.tabStaticParams
			}
		}
		_this.SET_TEMPLATE_PARAMS(tabParams) //设置下一个面板的参数
		let static_mobileTabShowType = mobileTabShowType[mobileTabRelationTabShowType]
		if(mobileTabRelationTabShowType===2 && childMobilTable.length>0) static_mobileTabShowType = 'templates/formListTemplate'
		_this.Static_GlobalFucs.gotoOtherRoute(tabParams,static_mobileTabShowType)
	}
	/** 处理模糊搜索
	 * @param {String} searchText
	 */
	handleSearchText(_this,searchParams){
		let keys = searchParams.quickQueryParams || {},
			params = []
		
		let queryParams = {}
		if(searchParams.searchType===1){//模糊搜索
			for (let key in keys) {
				let field = keys[key].relationColumnName,
					tableName = keys[key].relationTableName
				if(keys[key].mainTableName) {
					field = keys[key].mainColumnName
					tableName = keys[key].mainTableName
				} 
				let param = {
					field:field,
					value:searchParams.searchText,
					tableName:tableName,
					elementId:keys[key].elementId || ''
				}
				params.push(param)
			}
			queryParams = {calendarList:params}
		}else if(searchParams.searchType===2){//高级搜索
			queryParams = {seniorFilterMap:searchParams.searchText}
		}	
		return queryParams
	}
}

export default Static_ListClass