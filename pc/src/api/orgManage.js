/*
 * @Descripttion:
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 16:13:19
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-27 11:18:03
 */
// import qs from 'qs';
import query from './query';
import FetchData from './axiosConfig';

// 获取组织列表
export function getOrgList(params) {
  return FetchData.request({
    url: query.GET_ORG_LIST,
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
export function addSysOrg(data) {
  return FetchData.request({
    url: query.ADD_ORG,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 编辑组织
export function editSysOrg(data) {
  return FetchData.request({
    url: query.DO_UPDATE_ORG,
    method: 'put',
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 删除组织
export function deleteSysOrg(params) {
  return FetchData.request({
    url: query.DELETE_ORG,
    method: 'delete',
    params,
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

// 收藏用户
export function addCollectionUser(data) {
  return FetchData.request({
    url: query.ADD_COLLECTION_USER,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 删除收藏用户
export function deleteCollectionUser(params) {
  return FetchData.request({
    url: query.DELETE_COLLECTION_USER,
    method: 'delete',
    params,
  });
}

// 收藏用户列表
export function getCollectionUserList(data) {
  return FetchData.request({
    url: query.GET_LIST_COLLECTION_USER,
    method: 'get',
    data,
  });
}
