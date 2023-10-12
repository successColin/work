/*
 * @Descripttion: 全局搜索
 * @Author: cmk
 * @Date: 2021-05-13 12:53:46
 * @LastEditors: cmk
 * @LastEditTime: 2021-05-13 12:53:46
 */
import FetchData from './axiosConfig';

// 新增全局搜索实体类
export function saveSearch(data) {
  return FetchData.request({
    url: 'system/search/save',
    method: 'post',
    data,
  });
}

// 获取新增全局搜索实体类
export function pageGlobalSearch(params) {
  return FetchData.request({
    url: 'system/search/pageGlobalSearch',
    params,
  });
}

// 删除新增全局搜索实体类
export function batchDelete(params) {
  return FetchData.request({
    url: 'system/search/batchDelete',
    method: 'post',
    params,
  });
}

// 获取全局搜索配置配置
export function globalSearchUser(params) {
  return FetchData.request({
    url: 'system/search/globalSearchUser',
    params,
  });
}

// 新增全局搜索实体类
export function selectData(data, params) {
  return FetchData.request({
    url: 'system/search/selectData',
    method: 'post',
    data,
    params,
    headers: {
      'content-type': 'application/json',
    },
  });
}
