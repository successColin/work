/*
 * @Description: 消息模板
 * @Author: sss
 * @Date: 2021-07-28 11:13:03
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-05 11:14:07
 */

import FetchData from './axiosConfig';

// 获取公告列表接口
export function getAnnounceList(params) {
  return FetchData.request({
    url: '/system/announce/pageAnnounce',
    params,
  });
}

// 获取公告详情
export function searchAnnounceDetail(params) {
  return FetchData.request({
    url: 'system/announce/searchAnnounceDetail',
    params,
  });
}

// 公告修改
export function modifyAnnounce(data) {
  return FetchData.request({
    url: 'system/announce/modifyAnnounce',
    method: 'post',
    data,
  });
}

// 公告新增
export function insertAnnounce(data) {
  return FetchData.request({
    url: 'system/announce/insertAnnounce',
    method: 'post',
    data,
  });
}

// 公告删除
export function deleteAnnounce(data) {
  return FetchData.request({
    url: 'system/announce/deleteAnnounce',
    method: 'post',
    data,
  });
}

// 公告启用查询接口
export function listAnnounce(params) {
  return FetchData.request({
    url: 'system/announce/listAnnounce',
    params,
  });
}

// 公告分组新增接口
export function insertAnnounceGroup(data) {
  return FetchData.request({
    url: 'system/announce/insertGroup',
    data,
    method: 'post',
  });
}

// 公告分组删除接口
export function deleteAnnounceGroup(data) {
  return FetchData.request({
    url: 'system/announce/deleteGroup',
    data,
    method: 'post',
  });
}

// 公告分组编辑接口
export function modifyAnnounceGroup(data) {
  return FetchData.request({
    url: 'system/announce/modifyGroup',
    data,
    method: 'post',
  });
}

// 公告分组查询接口
export function listAnnounceGroup(params) {
  return FetchData.request({
    url: 'system/announce/listGroup',
    params,
  });
}

// 分组切换位置
export function switchAnnounceLocation(data) {
  return FetchData.request({
    url: 'system/announce/switchLocation',
    data,
    method: 'post',
  });
}

// 查询公告下查看人的阅读情况
export function getAnnounceUser(params) {
  return FetchData.request({
    url: 'system/announce/pageAnnounceUser',
    params,
  });
}
