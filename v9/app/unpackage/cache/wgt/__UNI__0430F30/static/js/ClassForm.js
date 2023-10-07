class Static_FormClass {
	constructor() {}
	/**列表过滤条件
	 * @param {Object} _this
	 * @param {Object} params
	 */
	advancedParams(_this,params){
		const advancedQuery = params.advancedQuery//变量
		let systemParam = params.systemParam
		const config = {
			otherTabId:systemParam.relationMainTab,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
			tabStaticParams:params.tabStaticParams
		}
		let queryParams = ""
		for (let key in advancedQuery) {
			let paramConfig = config
			paramConfig.key = key
			let value = _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this) 
			if (value && typeof value === "object") {
				value = value.id
			}
			const ids = typeof value === 'string' ? value.split(",") : [value.id]
			//如果选中多条数据时，不显示详情
			if(ids.length === 1) queryParams = value
		}
		
		return queryParams
	}
	/**
	 * 获取下拉框数据
	 * @param {Object} params
	 * 	{String type} 请求类型 cascade-级联新增
	 */
	getSelectData(params={},_this){
	
		
	}
}

export default Static_FormClass