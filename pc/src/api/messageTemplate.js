/*
 * @Description: 消息模板
 * @Author: sss
 * @Date: 2021-07-28 11:13:03
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-05 11:14:07
 */

import FetchData from './axiosConfig';

// 获取消息模板列表
export function getList(params) {
  return FetchData.request({
    url: 'messageTemplate/page',
    params,
  });
}

// 获取消息模板详情
export function getDetail(params) {
  return FetchData.request({
    url: 'messageTemplate/single',
    params,
  });
}

// 根据Sql获取变量
export function extractVariableFromSql(data) {
  return FetchData.request({
    url: 'messageTemplate/extractVariableFromSql',
    method: 'post',
    data,
  });
}

// 更具服务类型获取服务列表
export function getServeList(params) {
  return FetchData.request({
    url: 'messageServer/list',
    params,
  });
}

// 新增消息服务
export function serveAdd(data) {
  if (data.logData) data.logData.operateType = 1; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'messageServer/add',
    method: 'post',
    data,
  });
}

// 编辑消息服务
export function serveEdit(data) {
  if (data.logData) data.logData.operateType = 2; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'messageServer/edit',
    method: 'put',
    data,
  });
}

// 删除消息服务
export function serveDel(params) {
  return FetchData.request({
    url: 'messageServer/logicDel',
    method: 'DELETE',
    params,
  });
}

// 新增消息模板
export function tempAdd(data) {
  if (data.logData) data.logData.operateType = 1; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'messageTemplate/add',
    method: 'post',
    data,
  });
}

// 编辑消息模板
export function tempEdit(data) {
  if (data.logData) data.logData.operateType = 2; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'messageTemplate/edit',
    method: 'put',
    data,
  });
}

// 禁用消息模板
export function disableTemplate(data) {
  return FetchData.request({
    url: 'messageTemplate/disableTemplate',
    method: 'post',
    data,
  });
}

// 启用消息模板
export function enableTemplate(data) {
  return FetchData.request({
    url: 'messageTemplate/enableTemplate',
    method: 'post',
    data,
  });
}

// 删除消息模板
export function delTemp(params) {
  return FetchData.request({
    url: 'messageTemplate/logicDel',
    method: 'DELETE',
    params,
  });
}
