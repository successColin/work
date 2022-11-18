/*
 * @Descripttion: 全局配置
 * @Author: ytx
 * @Date: 2021-05-13 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-05-13 12:53:46
 */
import FetchData from './axiosConfig';

// 根据参数key查询信息
export function getListByKey(params) {
  return FetchData.request({
    url: '/system/global/listSysGlobalParameters',
    method: 'get',
    params,
  });
}
// 根据参数key查询信息
export function getListByKeys(params) {
  return FetchData.request({
    url: '/system/global/listByKeys',
    method: 'get',
    params,
  });
}

// 根据参数key查询信息
export function gettPlfByKey(params) {
  return FetchData.request({
    url: '/system/global/listPlfGlobalParameters',
    method: 'get',
    params,
  });
}

// 查询历史密码
export function getListHistoricalPassword(params) {
  return FetchData.request({
    url: '/system/global/listHistoricalPassword',
    method: 'get',
    params,
  });
}

// 修改初始密码-修改有效期-修改在线时长
export function updateSysGlobalParameters(data) {
  return FetchData.request({
    url: '/system/global/modifyGlobalPassword',
    method: 'put',
    data,
  });
}

// 通用修改
export function commonUpdate(data) {
  return FetchData.request({
    url: '/system/global/modifyGlobal',
    data,
    method: 'put',
  });
}

// 通用增改 单个
export function saveGlobal(data) {
  return FetchData.request({
    url: '/system/global/saveGlobal',
    data,
    method: 'put',
  });
}

// 通用删除 单个
export function batchDelete(params) {
  return FetchData.request({
    url: '/system/global/batchDelete',
    params,
    method: 'delete',
  });
}

// 提交图片
export function updateImages(data) {
  return FetchData.request({
    url: '/system/global/modifyGlobalPic',
    data,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 删除云存储服务验证
export function deleteFileStorageVerify(data) {
  return FetchData.request({
    url: 'system/global/delFileStorageVerify',
    data,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 删除云存储服务验证
export function updateFileStorageServers(data) {
  return FetchData.request({
    url: 'system/global/updateFileStorageServers',
    data,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}
