import fetch from '../utils/fetch';
import query from '../constants/query';


/**
 * 获取消息历史
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function fetAllMessages(params) {
  return fetch(query.GET_ALL_MESSAGE_LIST, {
    method: 'post',
    params,
  });
}

/**
 * 消息批量重发
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function resendMessages(params) {
  return fetch(query.DO_RESEND_MESSAGE, {
    method: 'post',
    params,
  });
}

/**
 * 消息批量删除
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function deleteMessages(params) {
  return fetch(query.DO_DELETE_MESSAGE, {
    method: 'post',
    params,
  });
}

/**
 * 高级筛选获取数据
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function getMessagesByFilter(params) {
  return fetch(query.DO_GET_FILTER_MESSAGE, {
    method: 'post',
    params,
  });
}
