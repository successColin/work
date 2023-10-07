/*
 * @Author: ytx
 * @Date:   2019-11-04 09:07:24
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-19 15:31:28
 * @Desc: 公告配置
 */
import query from '../constants/query';
import fetch from '../utils/fetch';

// 公告列表
export function getBulletinList(params) {
  return fetch(query.GET_BULLETIN_LIST, {
    method: 'post',
    params,
  });
}
// 查询一条公告
export function getBulletinOneList(params) {
  return fetch(query.GET_BULLETIN_ONElIST + '/' + params.id, {
    method: 'get',
  });
}
// 新增公告
export function addBulletin(params) {
  return fetch(query.GET_BULLETIN_INSERT, {
    method: 'post',
    params,
  });
}
// 修改公告
export function updateBulletin(params) {
  return fetch(query.GET_BULLETIN_UPDATE, {
    method: 'put',
    params,
  });
}
// 删除公告
export function deleteBulletin(params) {
  return fetch(query.GET_BULLETIN_DELETE, {
    method: 'DELETE',
    params,
  });
}
