/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-10-08 17:24:42
 */
import FetchData from './axiosConfig';

// 查询日历业务信息
export function getBusinessInfo(params) {
  return FetchData.request({
    url: '/system/calendar/listBusinessInfo',
    method: 'get',
    params,
  });
}

// 查询日历公告信息
export function getAnnounceInfo(params) {
  return FetchData.request({
    url: '/system/calendar/listAnnounceInfo',
    method: 'get',
    params,
  });
}
