/*
 * @Description: 定时任务
 * @Author: ytx
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-12 17:19:22
 */

import FetchData from './axiosConfig';

// 获取定时任务列表
export function getListPage(params) {
  return FetchData.request({
    url: '/jobConfig/page',
    params,
  });
}

// 新增定时任务
export function addList(data) {
  return FetchData.request({
    url: '/jobConfig/add',
    method: 'post',
    data,
  });
}

// 修改定时任务
export function updateEdit(data) {
  return FetchData.request({
    url: '/jobConfig/edit',
    method: 'put',
    data,
  });
}

// 查询消息模板列表
export function getTemplateList(params) {
  return FetchData.request({
    url: '/messageTemplate/list',
    params,
  });
}

// 停用/启用 定时任务
export function updateDisableJobConfig(data) {
  return FetchData.request({
    url: '/jobConfig/disableJobConfig',
    method: 'post',
    data,
  });
}

export function updateEnableJobConfig(data) {
  return FetchData.request({
    url: '/jobConfig/enableJobConfig',
    method: 'post',
    data,
  });
}

// 立即执行定时任务
export function postDoJobConfig(data) {
  return FetchData.request({
    url: '/jobConfig/doJobConfig',
    method: 'post',
    data,
  });
}

// 删除定时任务
export function deleteLogicDel(params) {
  return FetchData.request({
    url: '/jobConfig/logicDel',
    method: 'delete',
    params,
  });
}

// 查看历史
export function getPageHistory(params) {
  return FetchData.request({
    url: '/jobConfig/pageHistory',
    params,
  });
}
