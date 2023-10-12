/*
 * @Description: 系统日志
 * @Author: sss
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-29 15:31:11
 */

import FetchData from './axiosConfig';

// 获取操作日志
export function listOprateLog(params) {
  return FetchData.request({
    url: 'system/log/pageOperationLog',
    params,
  });
}

// 迁移操作日志
export function transferOprateLog(data) {
  return FetchData.request({
    url: 'system/log/migrateOperationLog',
    method: 'post',
    data,
  });
}

// 获取操作日志迁移列表
export function listTransfer(params) {
  return FetchData.request({
    url: 'system/log/listMigrationRecord',
    params,
  });
}

// 获取登录日志
export function listLoginLog(params) {
  return FetchData.request({
    url: 'system/log/pageLoginLog',
    params,
  });
}

// 获取异常日志
export function listExceptionLog(params) {
  return FetchData.request({
    url: 'system/log/pageExceptionLog',
    params,
  });
}

// 删除异常日志
export function delExceptionLog(params) {
  return FetchData.request({
    url: 'system/log/deleteExceptionLog',
    params,
    method: 'delete',
  });
}
