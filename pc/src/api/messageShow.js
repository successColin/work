/*
 * @Descripttion:
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 16:13:19
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-27 11:18:03
 */
// import qs from 'qs';
import query from './query';
import FetchData from './axiosConfig';

// 查询我的站内信分页
export function getPageInnerMail(params) {
  return FetchData.request({
    url: query.GET_PAGE_INNER_MAIL,
    method: 'get',
    params,
  });
}

// 设置我的站内信已读
export function markMailRead(data) {
  return FetchData.request({
    url: query.MARK_MAIL_READ,
    method: 'post',
    data,
  });
}

// 设置我的站内信已读
export function markMailAllRead(data) {
  return FetchData.request({
    url: query.MARK_MAIL_ALL_READ,
    method: 'post',
    data,
  });
}

// 查询当前时间登录用户的站内信数量
export function getMailCount(params) {
  return FetchData.request({
    url: query.GET_MAIL_COUNT,
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
