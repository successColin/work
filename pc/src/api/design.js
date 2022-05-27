/**
 * @name: design
 * @author: DELL
 * @date: 2022/4/15 15:16
 * @description：design
 * @update: 2022/4/15 15:16
 */
import query from './query';
import fetch from './axiosConfig';

// 流程重新发起
// eslint-disable-next-line import/prefer-default-export
export function dynamicGetData(data) {
  return fetch.request({
    url: query.ASYNC_HOME_DATA,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 控件新增
 * @param data
 * @returns {*}
 */
export function insertElement(data) {
  return fetch.request({
    url: query.INSERT_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 删除
 * @param data
 * @returns {*}
 */
export function delComponent(data) {
  return fetch.request({
    url: query.DEL_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 获取控件列表
 * @param params
 * @returns {*}
 */
export function fetchElementList(params) {
  return fetch.request({
    url: query.GET_ELEMENT_ELEMENT_LIST,
    method: 'get',
    params
  });
}

/**
 * 保存配置
 * @param data
 * @returns {*}
 */
export function saveElementList(data) {
  return fetch.request({
    url: query.BATCH_UPDATE_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 实时获取数据
 * @returns {*}
 */
export function getInfoById(data) {
  return fetch.request({
    url: query.GET_ELEMENTT_DATA_BY_REALLY,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 获取主页路由
 * @returns {*}
 */
export function fetchHomeRoute() {
  return fetch.request({
    url: query.GET_HOME_ROUTE
  });
}
