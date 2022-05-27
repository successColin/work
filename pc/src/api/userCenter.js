/*
 * @Descripttion: 个人中心
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 16:13:19
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-27 14:32:14
 */
import query from './query';
import FetchData from './axiosConfig';

// 获取个人信息
export function getPersonalCenterUser(params) {
  return FetchData.request({
    url: query.GET_PERSONAL_CENTER_USER,
    method: 'get',
    params,
  });
}

// 切换租户
export function switchPersonalCenterTenant(data) {
  return FetchData.request({
    url: query.SWITCH_PERSONAL_CENTER_TENANT,
    method: 'post',
    data,
  });
}

// 查询用户加入的租户列表
export function getPersonalCenterTenantList(params) {
  return FetchData.request({
    url: query.GET_PERSONAL_CENTER_TENANT_LIST,
    method: 'get',
    params,
  });
}

// 查询租户升级续费详情
export function getPersonalCenterTenantInfo(params) {
  return FetchData.request({
    url: query.GET_PERSONAL_CENTER_TENANT_INFO,
    method: 'get',
    params,
  });
}

// 编辑头像
export function editUserAvatar(params) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_AVATAR,
    method: 'put',
    params,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 编辑邮箱
export function editUserEmail(data) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_EMAIL,
    method: 'put',
    data,
  });
}

// 绑定邮箱
export function bindUserEmail(data) {
  return FetchData.request({
    url: query.BIND_PERSONAL_CENTER_EMAIL,
    method: 'put',
    data,
  });
}

// 编辑密码
export function editUserPassword(data) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_PASSWORD,
    method: 'put',
    data,
  });
}

// 编辑签名
export function editUserSignature(data) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_SIGNATURE,
    method: 'put',
    data,
  });
}

// 编辑手机号
export function editUserTelphone(data) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_TELPHONE,
    method: 'put',
    data,
  });
}

// 编辑手机号
export function editUserName(data) {
  return FetchData.request({
    url: query.MODIFY_PERSONAL_CENTER_NAME,
    method: 'put',
    data,
  });
}

// 切换租户
export function logout(params) {
  return FetchData.request({
    url: query.DO_LOGOUT,
    method: 'post',
    params,
    headers: {
      'content-type': 'application/json',
    },
  });
}
