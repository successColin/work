/**
 * @name: proxy
 * @author: DELL
 * @date: 2021/9/14 18:46
 * @description：flow
 * @update: 2021/9/14 18:46
 */

import query from './query';
import fetch from './axiosConfig';

// eslint-disable-next-line import/prefer-default-export
export function getInitTree(params) {
  return fetch.request({
    url: query.DO_GET_INIT_TREE,
    params,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 新增分组
 * @param data
 * @returns {*}
 */
export function addTreeGroup(data) {
  return fetch.request({
    url: query.DO_ADD_TREE_GROUP,
    data,
    method: 'post',
  });
}
/**
 * 删除分组
 * @param data
 * @returns {*}
 */
export function delTreeGroup(data) {
  return fetch.request({
    url: query.DO_DEL_TREE_GROUP,
    data,
    method: 'post',
  });
}

/**
 * 获取接口详情配置
 * @param params
 * @returns {*}
 */
export function getApiInfo(params) {
  return fetch.request({
    url: query.GET_API_DETAILS,
    params
  });
}
// 接口配置信息保存
export function doSaveApi(data) {
  return fetch.request({
    url: query.DO_SAVE_API,
    data,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 模拟请求
export function sendRequest(params) {
  return fetch.request({
    url: query.DO_SEND_BY_TEMPLATE,
    data: params,
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  });
}
// 生成请求报文
export function sendMessage(params) {
  return fetch.request({
    url: query.DO_CREATE_MESSAGE,
    data: params,
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  });
}
// 获取调用记录
export function getApiLog(params) {
  return fetch.request({
    url: query.DO_GET_API_LOG,
    params
  });
}
// 删除接口配置
export function delApi(params) {
  return fetch.request({
    url: query.DO_DEL_API_CONFIG,
    method: 'post',
    params
  });
}
