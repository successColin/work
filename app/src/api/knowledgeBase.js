/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-04 16:45:05
 * 知识库管理
 */
import FetchData from './axiosConfig';

// 查询__全部列表
export function listFiles(params) {
  return FetchData.request({
    url: '/system/knowledge/pageAllFiles',
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

// 访问文件记录
export function visitRecord(data) {
  return FetchData.request({
    url: '/system/knowledge/visitRecord',
    method: 'post',
    data,
  });
}

// 收藏文件
export function collectFile(data) {
  return FetchData.request({
    url: '/system/knowledge/collect',
    method: 'post',
    data,
  });
}

// 取消收藏文件
export function cancelCollect(data) {
  return FetchData.request({
    url: '/system/knowledge/cancelCollect',
    method: 'post',
    data,
  });
}

// 修改文件夹名称
export function updateFolder(data) {
  return FetchData.request({
    url: '/system/knowledge/updateFolder',
    method: 'post',
    data,
  });
}

// 删除文件
export function deleteFile(data) {
  return FetchData.request({
    url: '/system/knowledge/deleteFile',
    method: 'post',
    data,
  });
}

// 获取全部用户
export function pageSysUser(params) {
  return FetchData.request({
    url: '/system/user/pageSysUser',
    method: 'get',
    params,
  });
}

// 获取收藏用户
export function listCollectionUser(params) {
  return FetchData.request({
    url: '/system/org/listCollectionUser',
    method: 'get',
    params,
  });
}

// 分享知识库
export function fileShare(data) {
  return FetchData.request({
    url: '/system/knowledge/fileShare',
    method: 'post',
    data,
  });
}

// 移动文件
export function moveFolder(data) {
  return FetchData.request({
    url: '/system/knowledge/moveFolder',
    method: 'post',
    data,
  });
}

// 关联资料列表
export function materialsListFiles(params) {
  return FetchData.request({
    url: '/system/materials/listFiles',
    method: 'get',
    params,
  });
}

// 搜索关联资料
export function materialsSearchFiles(params) {
  return FetchData.request({
    url: '/system/materials/searchFiles',
    method: 'get',
    params,
  });
}

// 下载
export function downloadSingle(params) {
  return FetchData.request({
    method: 'get',
    params,
    responseType: 'blob',
    url: '/system/waterMark/addWaterMark',
  });
}
