/*
 * @Descripttion:
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 16:13:19
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-29 15:52:01
 */
import qs from 'qs';
import query from './query';
import FetchData from './axiosConfig';

// 获取组织列表
export function getUserPostList(params) {
  return FetchData.request({
    url: query.GET_USER_POST_LIST,
    method: 'get',
    params,
  });
}

// get 请求
export function getUserList(data) {
  return FetchData.request({
    url: query.GET_USER_LIST,
    method: 'get',
    data,
  });
}

// 新增组织
export function addSysOrg(params) {
  return FetchData.request({
    url: query.ADD_ORG,
    method: 'post',
    params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 编辑组织
export function editSysOrg(params) {
  return FetchData.request({
    url: query.DO_UPDATE_ORG,
    method: 'put',
    params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 删除组织
export function deleteSysOrg(params) {
  return FetchData.request({
    url: `${query.DELETE_ORG}?${qs.stringify(params)}`,
    method: 'delete',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 查询人员列表
export function getUserPage(params) {
  return FetchData.request({
    url: query.GET_USER_PAGE,
    method: 'get',
    params,
  });
}
