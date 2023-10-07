/**
 * @description 列表业务相关接口定义
 * @author shishanshan
 * @update 2019/08/12
 */
const stateSelectData = 'state/select'
const currencyGetDropDown = 'currencyPc/currencyGetDropDown'
const currencyGetDataById = 'currencyPc/currencyGetDataById'
const currencyGetByIds = 'currencyCommon/currencyGetByIds'


export {
	currencyGetByIds,//数据选择框，通过ids获取列表
	currencyGetDataById,//数据选择框，通过id获取整条数据
	currencyGetDropDown,//通用下拉列表
	stateSelectData,//查询状态列表
}