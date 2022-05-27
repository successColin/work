import query from './query';
import fetch from './axiosConfig';

// 获取用户列表
export function getUsersList(params) {
  return fetch.request({
    url: query.GET_USER_LIST,
    method: 'get',
    params,
  });
}

// 获取用户列表
export function getUsersState(params) {
  return fetch.request({
    url: query.DO_GET_ROLE_DATA_LIST,
    method: 'get',
    params,
  });
}

// 新增用户
export function addUser(data) {
  return fetch.request({
    url: query.DO_ADD_USER,
    method: 'post',
    data,
  });
}

// 修改用户
export function updateUser(data) {
  return fetch.request({
    url: query.DO_UPDATE_USER,
    method: 'put',
    data,
  });
}

// 批量删除
export function batchDel(params) {
  return fetch.request({
    url: query.DO_DELETE_USER,
    method: 'delete',
    params,
  });
}

// 转离职
export function updateUserState(params) {
  return fetch.request({
    url: query.DO_UPDATE_USER_STATE,
    method: 'put',
    params,
  });
}

//  重置密码
export function resetPassword(params) {
  return fetch.request({
    url: query.DO_RESET_PASSWORD,
    method: 'put',
    params
  });
}

// 修改用户数据权限
export function doUpdateUserDataAuth(data) {
  return fetch.request({
    url: query.DO_UPDATE_USER_DATA_AUTH,
    method: 'post',
    data,
  });
}

// 修改用户菜单权限
export function doUpdateUserFunctionAuth(data) {
  return fetch.request({
    url: query.DO_UPDATE_USER_FUNCTION_AUTH,
    method: 'post',
    data,
  });
}

// 根据用户id查询默认权限页面信息
export function getDefaultFunctionAuth(params) {
  return fetch.request({
    url: query.FETCH_USER_DEFAULT_FUNCTION_AUTH,
    method: 'get',
    params
  });
}

// 根据用户id,一级菜单id查询权限信息
export function getFunctionAuthById(params) {
  return fetch.request({
    url: query.FETCH_USER_FUNCTION_AUTH_BY_ID,
    method: 'get',
    params
  });
}

// 查询用户数据权限
export function getUserOrgAuth(params) {
  return fetch.request({
    url: query.GET_USER_DATA_ORG,
    method: 'get',
    params,
  });
}

// 勾选继承角色权限
export function updateInhertAuth(data) {
  return fetch.request({
    url: query.UPDATE_INHERIT_AUTH,
    method: 'post',
    data,
  });
}

// 通用导入导出
export function getTemplateInfo(params) {
  return fetch.request({
    url: query.GET_TEMPLATE_DESCRIPTION,
    method: 'get',
    params
  });
}

// 上传
export function doUploadFiles(data) {
  return fetch.request({
    url: query.UPLOAD_IMPORT_FILE,
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 导入预校验
export function doProcessChek(params) {
  return fetch.request({
    url: query.DO_PROCESSING_CHECK,
    method: 'get',
    params
  });
}

// 导入进度
export function doImportProcess(params) {
  return fetch.request({
    url: query.DO_PROCESSING_IMPORT,
    method: 'get',
    params
  });
}

// 开启导入
export function doImportStart(data) {
  return fetch.request({
    url: query.DO_PROCESSING_IMPORT_START,
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}
// 校验导入模板是否正确
export function doCheckTemplateIsRight(data) {
  return fetch.request({
    url: query.DO_CHECK_TEMPLATE,
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}
