/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-10-20 16:20:52
 * @desc：用户登录
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
