/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-10-08 17:24:42
 */
import FetchData from './axiosConfig';

// 获取用户信息
export function editUserAvatar(params) {
  return FetchData.request({
    url: '/system/personalCenter/modifyAvatar',
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
    url: '/system/personalCenter/modifyEmail',
    method: 'put',
    data,
  });
}

// 编辑密码
export function editUserPassword(data) {
  return FetchData.request({
    url: '/system/personalCenter/modifyPassword',
    method: 'put',
    data,
  });
}

// 编辑签名
export function editUserSignature(data) {
  return FetchData.request({
    url: '/system/personalCenter/modifySignature',
    method: 'put',
    data,
  });
}

// 编辑手机号
export function editUserTelphone(data) {
  return FetchData.request({
    url: '/system/personalCenter/modifyTelephone',
    method: 'put',
    data,
  });
}

// 编辑用户名
export function editUserName(data) {
  return FetchData.request({
    url: '/system/personalCenter/modifyUsername',
    method: 'put',
    data,
  });
}

// 文件上传
export function modifyAvatar(file, data = {}) {
  return FetchData.uploadFile({
    url: 'system/personalCenter/modifyAvatar',
    filePath: file,
    name: 'file',
    formData: data,
  });
}

// 编辑用户名
export function logout(data) {
  return FetchData.request({
    url: '/logout',
    method: 'post',
    data,
  });
}
