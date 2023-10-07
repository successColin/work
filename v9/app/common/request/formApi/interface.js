/**
 * @description form业务相关接口定义
 * @author shishanshan
 * @update 2019/08/24
 */
const currencyInsertOrUpdate = 'currency/currencyInsertOrUpdate'
const currencyInsertOrUpdateByTriggers = 'currency/currencyInsertOrUpdateByTriggers'
const currencyGetFromData = 'currency/currencyGetPageData'
const currencyDelete = 'currency/currencyDelete' 
const currencyStandardSelectionBoxTrigger = 'currency/currencyStandardSelectionBoxTrigger'
const currencyBatchInsertOrUpdate = 'currency/currencyBatchInsertOrUpdate'
const currencyBatchDelete = 'currency/currencyBatchDelete'
const currencyBatchUpdateByIds = 'currency/currencyBatchUpdateByIds'
const currencyBatchByIdsUpdate = 'currency/currencyBatchByIdsUpdate'
const archiveCycleHandle = 'archive/archiveCycleHandle'
const archiveHandle = 'archive/archiveHandle'
const currencyHttpRequest = 'currencyPc/currencyHttpRequest'
const currencyMultiInsert = 'currencyPcList/currencyMultiInsert'


export {
	currencyGetFromData,//获取form数据
	currencyInsertOrUpdate,//新增编辑
	currencyInsertOrUpdateByTriggers,//普通按钮触发接口
	currencyDelete,//删除
	currencyStandardSelectionBoxTrigger,//通用处理APP标准选择框触发器
	currencyBatchInsertOrUpdate,//批量新增
	currencyBatchDelete,//批量删除
	currencyBatchUpdateByIds,//批量修改
	currencyBatchByIdsUpdate,//批量修改2
	archiveCycleHandle,//归档周期
	archiveHandle,//归档不带周期
	currencyHttpRequest,//http请求
	currencyMultiInsert//多数据新增
}