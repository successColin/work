/*
 * @Description: 用户登录管理
 * @Author: ytx
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-10-27 11:47:03
 */

import FetchData from './axiosConfig';

// 获取列表
export function getListPage(params) {
  return FetchData.request({
    url: '/system/user/listOnlineUsers',
    params,
  });
}

// 下线用户
export function offlineUsers(params) {
  return FetchData.request({
    url: '/system/user/removeOnlineUser',
    method: 'delete',
    params,
  });
}
