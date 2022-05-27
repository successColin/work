/*
 * @Description: 字典查询
 * @Author: cmk
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: cmk
 * @Last Modified time: 2021-07-12 14:27:59
 */

import FetchData from './axiosConfig';

// 获取字典
export function listDict(params) {
  return FetchData.request({
    url: 'system/dict/listDict',
    params,
  });
}

// 获取字典
export function getDictList(params) {
  return FetchData.request({
    url: 'system/dict/list',
    params,
  });
}

// 根据类型获取字典项列表
export function listDictByType(params) {
  return FetchData.request({
    url: 'system/dict/page',
    params,
  });
}

// 新增字典项
export function insertDict(data) {
  if (data.logData) data.logData.operateType = 1; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'system/dict/add',
    method: 'post',
    data,
  });
}

// 编辑字典项
export function editDict(data) {
  if (data.logData) data.logData.operateType = 2; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'system/dict/edit',
    method: 'put',
    data,
  });
}

// 逐条删除字典项
export function deleteDictById(params) {
  if (params.logData) params.logData.operateType = 3; // 操作日志行为为新增，1-新增；2-编辑；3-删除
  return FetchData.request({
    url: 'system/dict/logicDel',
    method: 'delete',
    params,
  });
}
