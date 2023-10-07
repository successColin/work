/*
 * @Author: ytx
 * @Date:   2020-02-07 10:32:15
 * @Desc: 版本管理
 */
import query from '../constants/query';
import fetch from '../utils/fetch';

// 获取列表
export function getSystemTreeIconList(params) {
  return fetch(query.GET_SYSTEM_TREEiCON_LIST, {
    method: 'post',
    params,
  });
}

// 获取详情
export function getSystemTreeIconDetail({ id }) {
  return fetch(`${query.GET_SYSTEM_TREEiCON_DETAIL}${id}`, {
    method: 'get',
  });
}

// 保存版本数据
export function saveSystemTreeIcon(params) {
  return fetch(query.SAVE_SYSTEM_TREEiCON, {
    method: 'post',
    params,
  });
}

// 删除版本数据
export function deleteSystemTreeIcon(params) {
  return fetch(query.DELETE_SYSTEM_TREEiCON, {
    method: 'delete',
    params,
  });
}

// 获取多个详情
export function getSystemTreeIconDetails(params) {
  return fetch(query.GET_SYSTEM_TREEiCONCONFIG, {
    method: 'post',
    params,
  });
}
