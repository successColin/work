/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-30 15:22:09
 * 知识库管理
 */
import FetchData from './axiosConfig';

// 查询__全部列表
export function listFiles(params) {
  return FetchData.request({
    url: '/system/knowledge/listFiles',
    method: 'get',
    params,
  });
}

// 查询__筛选类型分页
export function pageFiles(params) {
  return FetchData.request({
    url: '/system/knowledge/pageFiles',
    method: 'get',
    params,
  });
}

// 查询__他人分享
export function listOtherShare(params) {
  return FetchData.request({
    url: '/system/knowledge/listOtherShare',
    method: 'get',
    params,
  });
}

// 查询__我的分享
export function listShare(params) {
  return FetchData.request({
    url: '/system/knowledge/listShare',
    method: 'get',
    params,
  });
}

// 查询__我的收藏
export function listCollection(params) {
  return FetchData.request({
    url: '/system/knowledge/listCollection',
    method: 'get',
    params,
  });
}
// 访问文件
export function visitRecord(data) {
  return FetchData.request({
    url: '/system/knowledge/visitRecord',
    method: 'post',
    data,
  });
}
