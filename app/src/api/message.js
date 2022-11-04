/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-10-08 17:24:42
 */
import FetchData from './axiosConfig';

// 查询我的站内信分页
export function getPageInnerMail(params) {
  return FetchData.request({
    url: 'innerMail/pageInnerMail',
    method: 'get',
    params,
  });
}

// 设置我的站内信已读
export function markMailRead(data) {
  return FetchData.request({
    url: 'innerMail/read',
    method: 'post',
    data,
  });
}

// 设置我的站内信已读
export function markMailAllRead(data) {
  return FetchData.request({
    url: 'innerMail/readMyAll',
    method: 'post',
    data,
  });
}

// 查询当前时间登录用户的站内信数量
export function getMailCount(params) {
  return FetchData.request({
    url: 'innerMail/queryCount',
    method: 'get',
    params,
  });
}

// 根据实例编码获取信息
export function getByCode(params) {
  return FetchData.request({
    url: 'workflowTask/getByCode',
    method: 'get',
    params,
  });
}
