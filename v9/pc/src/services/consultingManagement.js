/**
 *@author jwk
 *@2019/8/26 0019
 *@Description
 * 设置编码规则接口
 */
import query from '../constants/query';
import fetch from '../utils/fetch';

/**
 * 获取资讯列表
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function getList(params) {
  return fetch(
    `${query.GET_INFORMATION_LIST}?keywords=${params.keywords}&pageNum=${params.pageNum}&pageSize=${
      params.pageSize
    }`,
    {
      method: 'get',
    },
  );
}

/**
 * 新增
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function addConsulting(params) {
  return fetch(query.GET_INFORMATION_ADD, {
    method: 'post',
    params,
  });
}

/**
 * 编辑
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function editorConsulting(params) {
  return fetch(query.GET_INFORMATION_EDITOR, {
    method: 'post',
    params,
  });
}

/**
 * 删除列表
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function deleteConsulting(params) {
  return fetch(query.GET_INFORMATION_DELETE, {
    method: 'post',
    params,
  });
}

/**
 * 是否启用
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function enabledApi(params) {
  return fetch(query.GET_INFORMATION_ENABLED, {
    method: 'post',
    params,
  });
}

/**
 * 是否置顶
 * @param params
 * @returns {*|Promise|Promise<unknown>}
 */
export function topApi(params) {
  return fetch(`${query.GET_INFORMATION_TOP}`, {
    method: 'post',
    params,
  });
}
