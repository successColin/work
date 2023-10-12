// * @Descripttion: 全局搜索的接口
//  * @Author: ytx
//  * @Date: 2023-03-02 08:49:45
//  * @Last Modified by: ytx
//  * @Last Modified time: 2023-03-02 08:49:45

import FetchData from './axiosConfig';

// 获取用户全局搜索配置列表接口
export function globalSearchUser(params) {
  return FetchData.request({
    url: 'system/search/globalSearchUser',
    method: 'get',
    params,
  });
}

// 获取新增全局搜索实体类
export function pageGlobalSearch(params) {
  return FetchData.request({
    url: 'system/search/pageGlobalSearch',
    method: 'get',
    params,
  });
}

// 查询数据
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
