/**
 * @name: flow
 * @author: DELL
 * @date: 2021/9/14 18:46
 * @description：flow
 * @update: 2021/9/14 18:46
 */

import query from './query';
import fetch from './axiosConfig';

/**
 * 专家列表
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
// eslint-disable-next-line import/prefer-default-export
export function getList(params) {
  return fetch.request({
    url: query.DO_GET_EXPERT_LIST,
    params,
  });
}
/**
 * 眼镜列表
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function getGlassesList(params) {
  return fetch.request({
    url: query.DO_GET_GLASSES_LIST,
    params,
  });
}

/**
 * 获取远程终端
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function getMeetingList(params) {
  return fetch.request({
    url: query.DO_GET_GLASSES_MEETING,
    params
  });
}

/**
 * 获取sdk用户签名
 * @param {*} params
 * @returns
 */
export function getUserSig(params) {
  return fetch.request({
    url: query.DO_GET_USER_SIG,
    params
  });
}
/**
 * 根据id获取用户详情
 * @param {*} params
 * @returns
 */
export function getUserInfoById(params) {
  return fetch.request({
    url: query.DO_GET_USER_BY_ID,
    params
  });
}
/**
 * 获取历史
 * @param {*} params
 * @returns
 */
export function getHistory(params) {
  return fetch.request({
    url: query.DO_GET_HISTORY,
    params
  });
}

/**
 * 新增专家
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function addUser(data) {
  return fetch.request({
    url: query.DO_ADD_EXPERT,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 新增眼镜
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function addGlasses(data) {
  return fetch.request({
    url: query.DO_ADD_GLASSES,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 生成会议
 * @param {*} data
 * @returns
 */
export function setConference(data) {
  return fetch.request({
    url: query.DO_SET_CONFERENCE,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 更新会议
 * @param {*}data
 * @returns
 */
export function updateConference(params) {
  return fetch.request({
    url: `${query.DO_UPDATE_CONFERENCE}${params.roomId}`,
    params,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}
/**
 * pc发起会议会议
 * @param {*}data
 * @returns
 */
export function pcConference(params) {
  return fetch.request({
    url: query.DO_PC_MEETING,
    params,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 新增专家
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function editUser(data) {
  return fetch.request({
    url: query.DO_EDIT_EXPERT,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 新增专家
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function editGlasses(data) {
  return fetch.request({
    url: query.DO_EDIT_GLASSES,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 删除专家
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function delUser(params) {
  return fetch.request({
    url: query.DO_DEL_EXPERT,
    params,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}
/**
 * 删除会议历史
 * @param {*} params
 * @returns
 */
export function delHistory(params) {
  return fetch.request({
    url: query.DO_DEL_HISTORY,
    params,
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}
/**
 * 专家登出
 * @param {*} data
 * @returns
 */
export function offExpertLine(data) {
  return fetch.request({
    url: query.SET_EXPERT_OFFLINE,
    data,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 删除眼鏡
 * @param params
 * @returns {Promise<unknown>|Promise<unknown>|*}
 */
export function delGlasses(params) {
  return fetch.request({
    url: query.DO_DEL_GLASSES,
    params,
    method: 'post',
    hasArray: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}
