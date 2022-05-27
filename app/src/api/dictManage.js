/*
 * @Description: 字典查询
 * @Author: sss
 * @Date: 2021-12-20 09:45:21
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-20 09:45:21
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
