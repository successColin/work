import query from './query';
import fetch from './axiosConfig';

// 获取角色分组列表
export function doFetchGroup(params) {
  return fetch.request({
    url: query.GET_ROLE_GROUP,
    method: 'get',
    noToken: true,
    params,
  });
}

// 修改角色分组名称
export function doUpdateGroup(params) {
  return fetch.request({
    method: 'put',
    url: query.DO_UPDATE_ROLE_GROUP,
    params,
    noToken: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 删除角色分组名称
export function doDeleteGroup(params) {
  return fetch.request({
    method: 'delete',
    noToken: true,
    url: `${query.DELETE_ROLE_GROUP}`,
    params,
  });
}

// 移动角色分组名称
export function doSwitchGroup(params) {
  return fetch.request({
    method: 'post',
    url: query.DO_SWITCH_ROLE_LOCATION,
    data: params,
    noToken: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 新增角色分组
export function doAddGroup(params) {
  return fetch.request({
    method: 'post',
    url: query.ADD_ROLE_GROUP,
    data: params,
    noToken: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 根据分组id获取角色
export function getRoleLiistById(params) {
  return fetch.request({
    url: query.DO_GET_ROLE_LIIST,
    params,
    method: 'get',
    noToken: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 新增角色
export function doAddRole(params) {
  return fetch.request({
    url: query.DO_ADD_ROLE,
    data: params,
    method: 'post',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 批量删除
export function delByBatch(params) {
  return fetch.request({
    url: query.DO_BATCH_DELETE_ROLE,
    params,
    method: 'delete',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 修改角色
export function doUpdateRole(params) {
  return fetch.request({
    url: query.DO_UPDATE_ROLE,
    data: params,
    method: 'put',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 切换角色位置
export function doSwitchRole(params) {
  return fetch.request({
    url: query.DO_SWITCH_ROLE,
    data: params,
    method: 'post',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 获取组织
export function doFetchOrgTree(params) {
  return fetch.request({
    url: query.DO_GET_ORG_TREE,
    params,
    method: 'get',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 获取组织
export function doFetchDesignOrg(params) {
  return fetch.request({
    url: query.GET_ORG_TREE,
    params,
    method: 'get',
    noToken: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 根据角色id查询默认权限页面信息
export function fetchRoleAuth(params) {
  return fetch.request({
    url: query.DO_FETCH_AUTH_LIST,
    params,
    method: 'get',
    noToken: true,
  });
}

// 修改角色权限g
export function doEditRoleAuth(data) {
  return fetch.request({
    url: query.DO_EDIT_ROLE_AUTH,
    data,
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  });
}

// 获取数据权限
export function doGetRoleData(params) {
  return fetch.request({
    url: query.DO_GET_ROLE_DATA_LIST,
    params,
    method: 'get',
  });
}

// 修改角色数据权限
export function doEditRoleDataAuth(data) {
  return fetch.request({
    url: query.D0_EDIT_ROLE_DATA_AUTH,
    data,
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  });
}

// 复制角色
export function doCopyRole(data) {
  return fetch.request({
    url: query.DO_COPY_ROLE,
    data,
    method: 'post',
  });
}

// 获取批量操作权限项
export function doGetBatchAuth() {
  return fetch.request({
    url: query.DO_GET_BATCH_AUTH,
    method: 'get',
  });
}

// 获取模块下的所有菜单权限
export function getModulesFunction(params) {
  return fetch.request({
    url: query.GET_FUNCTION_BY_MODULES,
    method: 'get',
    params
  });
}

// 获取角色树
export function getRoleTree() {
  return fetch.request({
    url: query.GET_ROLE_TREE,
    method: 'get',
  });
}

// 获取职位树
export function getPostionTree(params) {
  return fetch.request({
    url: query.GET_POSITION_TREE,
    method: 'get',
    params,
  });
}
