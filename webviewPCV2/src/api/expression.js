/*
 * @Description: 表达式
 * @Author: sss
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: ytx
 * @Last Modified time: 2023-06-02 16:29:28
 */

import FetchData from './axiosConfig';

// 获取表达式
export function getList(params) {
  return FetchData.request({
    url: 'system/sysExpression/page',
    params,
  });
}

// 新增表达式
export function addEx(data) {
  if (data.logData) data.logData.operateType = 1; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'system/sysExpression/add',
    method: 'post',
    data,
  });
}

// 编辑字典项
export function editEx(data) {
  if (data.logData) data.logData.operateType = 2; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'system/sysExpression/edit',
    method: 'put',
    data,
  });
}

// 删除表达式
export function delEx(params) {
  return FetchData.request({
    url: 'system/sysExpression/logicDel',
    params,
    method: 'delete',
  });
}

// 批量删除表达式
export function delExMulti(params) {
  return FetchData.request({
    url: 'system/sysExpression/batchDel',
    params,
    method: 'delete',
  });
}
