/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-07 08:46:54
 * @desc：个人中心
 */
import FetchData from './axiosConfig';

// 获取个人信息
export function getPersonalCenterUser(params) {
  return FetchData.request({
    url: 'system/personalCenter/getSysUser',
    method: 'get',
    params,
  });
}

// 编辑头像
export function editUserAvatar(params) {
  return FetchData.request({
    url: 'system/personalCenter/modifyAvatar',
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
    url: 'system/personalCenter/modifyEmail',
    method: 'put',
    data,
  });
}
