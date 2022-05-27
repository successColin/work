/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-14 16:16:08
 * @desc：菜单配置
 */
import FetchData from './axiosConfig';

// 获取app菜单配置
export function getMenuConfig() {
  return FetchData.request({
    url: '/application/select/getAppPage',
    method: 'get',
  });
}

// 根据菜单id获取配置信息
export function getDesignMenu(params) {
  return FetchData.request({
    url: '/application/select/getDesignMenu',
    method: 'get',
    params,
  });
}

// 获取列表信息-不分页
export function getListData(params) {
  return FetchData.request({
    url: '/application/select/list',
    method: 'get',
    params,
  });
}

// 获取列表信息-分页
export function getListPage(params) {
  return FetchData.request({
    url: '/application/select/page',
    method: 'get',
    params,
  });
}

// 获取列表单条
export function getSidebarSingle(params) {
  return FetchData.request({
    url: 'application/select/single',
    params,
  });
}

// 文件批量上传
export function batchUpload(files, data = {}) {
  const uploadFiles = [];
  files.forEach((filePath) => {
    uploadFiles.push({
      name: 'files',
      uri: filePath,
    });
  });
  return FetchData.uploadFile({
    url: 'application/file/batchUpload',
    files: uploadFiles,
    name: 'files',
    formData: data,
  });
}
// 文件上传
export function fileUpload(file, data = {}) {
  return FetchData.uploadFile({
    url: 'application/file/batchUpload',
    filePath: file,
    name: 'files',
    formData: data,
  });
}

// 文件删除
export function deleteFile(params) {
  return FetchData.request({
    url: 'application/file/deleteFile',
    method: 'delete',
    params,
  });
}

// 文件查询
export function getFileList(params) {
  return FetchData.request({
    url: 'application/file/list',
    params,
  });
}

// 按钮保存
export function singleSave(data) {
  return FetchData.request({
    url: 'application/save/singleSave',
    method: 'post',
    data,
  });
}
// 按钮批量保存
export function batchSave(data) {
  return FetchData.request({
    url: 'application/save/batchSave',
    method: 'post',
    data,
  });
}

// 按钮删除
export function batchDelete(params) {
  return FetchData.request({
    url: 'application/save/batchDelete',
    method: 'delete',
    params,
  });
}

// 按钮新增
export function singleInsert(data) {
  return FetchData.request({
    url: 'application/save/singleInsert',
    method: 'post',
    data,
  });
}

// 按钮编辑
export function singleUpdate(data) {
  return FetchData.request({
    url: 'application/save/singleUpdate',
    method: 'put',
    data,
  });
}

export function operationTriggers(data) {
  return FetchData.request({
    url: 'application/save/operationTriggers',
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    data,
  });
}

// 根据条件获取DB数据列表
export function selectList(params) {
  return FetchData.request({
    url: 'application/select/selectList',
    params,
  });
}

// 获取设备位置树
export function listDeviceTree(params) {
  return FetchData.request({
    url: 'system/device/listDevicePositionTree',
    params,
  });
}

// 设备位置树搜索
export function pageDeviceTree(params) {
  return FetchData.request({
    url: 'system/device/pageDevicePositionTree',
    params,
  });
}
