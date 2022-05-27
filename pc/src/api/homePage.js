import query from './query';
import fetch from './axiosConfig';

// 获取菜单列表
export function getFunctionList(params) {
  return fetch.request({
    url: query.GET_HOME_PAGE_LIST,
    method: 'get',
    noToken: true,
    params,
  });
}

/**
 * 编辑主页
 * @param data
 * @returns {*}
 */
export function editHomePage(data) {
  return fetch.request({
    url: query.EDIT_HOME_PAGE,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 保存主页菜单
 * @param data
 * @returns {*}
 */
export function saveFunction(data) {
  return fetch.request({
    url: query.SAVE_HOME_PAGE,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 主页菜单删除接口
 * @param data
 * @returns {*}
 */
export function delFunction(data) {
  return fetch.request({
    url: query.DEL_HOME_PAGE,
    method: 'post',
    data,
    // headers: {
    //   'content-type': 'application/json',
    // },
  });
}
// insertDataFilter, updateDataFilter, getDataFilterList
export function insertDataFilter(data) {
  return fetch.request({
    url: query.INSERT_HOME_FILTER,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 编辑过滤器
 * @param data
 * @returns {*}
 */
export function updateDataFilter(data) {
  return fetch.request({
    url: query.UPDATE_HOME_FILTER,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 获取过滤器列表
 * @param params
 * @returns {*}
 */
export function getDataFilterList(params) {
  return fetch.request({
    url: query.GET_HOME_FILTER,
    method: 'get',
    params
  });
}

/**
 * 删除过滤器
 * @param data
 * @returns {*}
 */
export function delDataFilter(data) {
  return fetch.request({
    url: query.DEL_HOME_FILTER,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 页面配置批量保存
 * @param data
 * @returns {*}
 */
export function batchUpdateList(data) {
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
 * 复制菜单
 * @param data
 * @returns {*}
 */
export function copyMenu(data) {
  return fetch.request({
    url: query.COPY_HOME_PAGE,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 复制菜单
 * @param data
 * @returns {*}
 */
export function switchMenu(data) {
  return fetch.request({
    url: query.SWITCH_HOME_PAGE_SNO,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function getInfoById() {
  console.log(3332222222222);
  return fetch.request({});
}
