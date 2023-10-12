/*
 * @Author: cmk
 * @Date: 2021-04-19 09:23:10
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-19 16:53:55
 * @Des: 实体管理接口
 */
import FetchData from './axiosConfig';

// 获取实体管理分组
export function getEntityList() {
  return FetchData.request({
    url: 'system/tableGroup/listSysEntityTableGroup',
  });
}

// 新增实体管理分组
export function addEntityGroup(data) {
  return FetchData.request({
    url: 'system/tableGroup/add',
    method: 'post',
    data,
  });
}

// 删除实体管理分组
export function deleteEntityGroup(params) {
  return FetchData.request({
    url: 'system/tableGroup/deleteSysEntityTableGroup',
    method: 'delete',
    params,
  });
}

// 编辑实体管理分组
export function editEntityGroup(data) {
  return FetchData.request({
    url: 'system/tableGroup/edit',
    method: 'put',
    data,
  });
}

// 实体分组切换位置
export function changeGroupPos(data) {
  return FetchData.request({
    url: 'system/tableGroup/switchLocation',
    method: 'post',
    data,
  });
}
// 测试接口
export function statisticsData(data) {
  return FetchData.request({
    url: 'system/device/statisticsData',
    method: 'post',
    data,
  });
}
// 获取实体列表
export function getListSysEntityTables(params) {
  return FetchData.request({
    url: 'system/table/listSysEntityTables',
    params,
  });
}

// 新增实体
export function addSysEntityTables(data) {
  return FetchData.request({
    url: 'system/table/addSysEntityTables',
    method: 'post',
    data,
  });
}

// 删除实体
export function delSysEntityTables(params) {
  return FetchData.request({
    url: 'system/table/batchDeleteTables',
    method: 'delete',
    params,
  });
}

// 修改实体
export function editSysEntityTables(data) {
  return FetchData.request({
    url: 'system/table/modifySysEntityTables',
    method: 'put',
    data,
  });
}

// 同步数据库实体
export function synchronizeEntities(data) {
  return FetchData.request({
    url: 'system/table/synchronizeEntities',
    method: 'post',
    data,
  });
}

// 查询字段
export function listSysEntityColumns(params) {
  return FetchData.request({
    url: 'system/column/listSysEntityColumns',
    params,
    canRepeat: true,
  });
}

// 新增字段
export function addColumns(data) {
  return FetchData.request({
    url: 'system/column/addColumns',
    method: 'post',
    data,
  });
}

// 编辑字段
export function modifyColumns(data) {
  return FetchData.request({
    url: 'system/column/modifyColumns',
    method: 'put',
    data,
  });
}

// 删除字段
export function batchDeleteColumns(params) {
  return FetchData.request({
    url: 'system/column/batchDeleteColumns',
    method: 'delete',
    params,
  });
}

// 查询字段类型长度
export function listColumnsLength(params) {
  return FetchData.request({
    url: 'system/column/listColumnsLength',
    params,
  });
}

// 查询索引
export function listSysEntityTablesIndexes(params) {
  return FetchData.request({
    url: 'system/indexes/listSysEntityTablesIndexes',
    params,
  });
}

// 新增索引
export function addSysIndexes(data) {
  return FetchData.request({
    url: 'system/indexes/addSysIndexes',
    method: 'post',
    data,
  });
}

// 编辑索引
export function modifyIndexes(data) {
  return FetchData.request({
    url: 'system/indexes/modifyIndexes',
    method: 'put',
    data,
  });
}

// 删除索引
export function batchDeleteIndexes(params) {
  return FetchData.request({
    url: 'system/indexes/batchDeleteIndexes',
    method: 'delete',
    params,
  });
}
