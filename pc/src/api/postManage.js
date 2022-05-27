/*
 * @Descripttion: 职位管理
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 16:13:19
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-27 10:14:35
 */
// import qs from 'qs';
import query from './query';
import FetchData from './axiosConfig';

// 获取职位列表
export function getUserPostList(params) {
  return FetchData.request({
    url: query.GET_USER_POST_LIST,
    method: 'get',
    params,
  });
}

// 根据id查询职位
export function getUserPost(params) {
  return FetchData.request({
    url: query.GET_USER_POST,
    method: 'post',
    params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 根据id查询职位
export function addUserPost(data) {
  return FetchData.request({
    url: query.ADD_USER_POST,
    method: 'post',
    data,
  });
}

// 编辑职位
export function editUserPost(data) {
  return FetchData.request({
    url: query.MODIFY_USER_POST,
    method: 'put',
    data,
  });
}

// 删除职位
export function deleteUserPost(params) {
  return FetchData.request({
    url: query.BATCH_DELETE_USER_POST,
    method: 'delete',
    params,
  });
}
