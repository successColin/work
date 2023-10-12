/*
 * @Descripttion: 租户接口
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 17:19:58
 */
import FetchData from './axiosConfig';

// 租户信息分页查询
export function getTenant(params) {
  return FetchData.request({
    url: '/system/plfTenant/page',
    method: 'get',
    params,
  });
}

// 租户成员信息分页查询
export function getTenantUser(params) {
  return FetchData.request({
    url: '/system/plfUser/page',
    method: 'get',
    params,
  });
}

// 数据源信息列表查询
export function getDatasourceList(params) {
  return FetchData.request({
    url: '/system/datasource/list',
    method: 'get',
    params,
  });
}

// 按钮__升级
export function updateUpgrade(data) {
  return FetchData.request({
    url: '/system/plfTenant/upgrade',
    method: 'post',
    data,
  });
}

// 按钮__冻结
export function updateFreeze(data) {
  return FetchData.request({
    url: '/system/plfTenant/freeze',
    method: 'post',
    data,
  });
}

// 按钮__恢复
export function updateRecover(data) {
  return FetchData.request({
    url: '/system/plfTenant/recover',
    method: 'post',
    data,
  });
}

// 按钮__释放
export function updateRelease(data) {
  return FetchData.request({
    url: '/system/plfTenant/release',
    method: 'post',
    data,
  });
}
