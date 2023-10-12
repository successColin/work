/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2023-05-23 16:36:54
 * 知识库管理
 */
import { baseUrl, PREFIX, VERSION } from '../config';
import { Decrypt } from '../utils';
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

// 新增文件夹名称
export function addSaveFolder(data) {
  return FetchData.request({
    url: '/system/knowledge/saveFolder',
    method: 'post',
    data,
  });
}

// 新增文件
export function addUpload(file, data = {}, cb, cbe) {
  console.log('=======================1');
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? `${baseUrl}${PREFIX}/${VERSION}/`
      : `${baseUrl}${PREFIX}/${VERSION}/`; // 请求路径

  console.log(file);
  return uni.uploadFile({
    header: { token: Decrypt(uni.getStorageSync('token') || '') },
    url: `${baseURL}system/knowledge/saveFile`, // 仅为示例，非真实的接口地址
    filePath: file,
    name: 'file',
    formData: data,
    success: (uploadFileRes) => {
      console.log(uploadFileRes.data);
      if (cb) cb(uploadFileRes.data);
    },
    fail: () => {
      if (cbe) cbe();
    },
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
