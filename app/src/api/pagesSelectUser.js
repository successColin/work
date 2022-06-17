/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-13 11:47:16
 * @desc：人员选择框
 */
import FetchData from './axiosConfig';
// 获取用户列表
export function getUserList(params) {
  return FetchData.request({
    url: '/system/user/pageSysUser',
    method: 'GET',
    params,
  });
}

// 获取收藏的用户列表
export function getUserCollection() {
  return FetchData.request({
    url: '/system/org/listCollectionUser',
    method: 'GET',
  });
}

// 新增收藏用户
export function addUserCollection(data) {
  return FetchData.request({
    url: '/system/org/addCollectionUser',
    method: 'POST',
    data,
  });
}

// 取消收藏用户
export function cancelUserCollection(params) {
  return FetchData.request({
    url: '/system/org/deleteCollectionUser',
    method: 'DELETE',
    params,
  });
}

// 获取角色分组列表
export function getRoleGroup() {
  return FetchData.request({
    url: '/system/roleGroup/listSysRoleGroup',
    method: 'GET',
  });
}

// 按照分组获取角色列表
export function getRoles(params) {
  return FetchData.request({
    url: '/system/role/listSysRole',
    method: 'GET',
    params,
  });
}

// 获取组织
export function getOrg(params) {
  return FetchData.request({
    url: '/system/org/listSysOrg',
    method: 'GET',
    params,
  });
}

// 获取职位
export function getPost(params) {
  return FetchData.request({
    url: '/system/userPost/listSysUserPost',
    method: 'GET',
    params,
  });
}
