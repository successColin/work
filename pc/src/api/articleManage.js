/*
 * @Description: 文章管理
 * @Author: sss
 * @Date: 2021-07-28 11:13:03
 * @Last Modified by: cmk
 * @Last Modified time: 2021-08-05 11:14:07
 */

import FetchData from './axiosConfig';

// 获取文章分组列表接口
export function listGroup(params) {
  return FetchData.request({
    url: '/system/article/listGroup',
    params,
  });
}

// 文章分组修改
export function modifyGroup(data) {
  return FetchData.request({
    url: 'system/article/modifyGroup',
    method: 'post',
    data,
  });
}

// 文章分组删除
export function deleteGroup(data) {
  return FetchData.request({
    url: '/system/article/deleteGroup',
    method: 'post',
    data,
  });
}

// 文章分组新增
export function insertGroup(data) {
  return FetchData.request({
    url: '/system/article/insertGroup',
    method: 'post',
    data,
  });
}

// 文章分组移动位置
export function switchLocation(data) {
  return FetchData.request({
    url: '/system/article/switchLocation',
    method: 'post',
    data,
  });
}

// 文件上传
export function batchUpload(data, callback, source) {
  return FetchData.request({
    url: '/system/article/batchUpload',
    method: 'post',
    data,
    cancelToken: source && source.token,
    headers: {
      'content-type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      // 原生获取上传进度的事件
      if (progressEvent.lengthComputable && callback) {
        const progressPercent =
          (progressEvent.loaded / progressEvent.total) * 100;

        // console.log(progressPercent);
        callback(progressPercent);
      }
    },
  });
}

// 文章新增
export function insertArticle(data) {
  return FetchData.request({
    url: 'system/article/insertArticle',
    method: 'post',
    data,
  });
}

// 获取文章列表接口
export function pageArticle(params) {
  return FetchData.request({
    url: '/system/article/pageArticle',
    params,
  });
}

// 文章修改
export function modifyArticle(data) {
  return FetchData.request({
    url: 'system/article/modifyArticle',
    method: 'post',
    data,
  });
}

// 删除文章实体
export function batchDeleteArticle(params) {
  return FetchData.request({
    url: 'system/article/batchDeleteArticle',
    method: 'delete',
    params,
  });
}
