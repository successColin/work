/*
 * @Descripttion: app配置
 * @Author: cmk
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-22 17:19:58
 */
import FetchData from './axiosConfig';

// app 登录模块
// 文件上传
export function upload(data) {
  return FetchData.request({
    url: 'system/interface/upload',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data',
    },
    data,
  });
}

// 保存app 登录页信息
export function saveSysAppLoginConfig(data) {
  return FetchData.request({
    url: 'system/page/saveSysAppLoginConfig',
    method: 'post',
    data,
  });
}

// 获取app 登录页信息
export function getAppLoginPage(params) {
  return FetchData.request({
    url: 'system/page/getAppLoginPage',
    params,
  });
}

// 保存功能界面信息
export function saveFunctionInterface(data) {
  return FetchData.request({
    url: 'system/interface/saveFunctionInterface',
    method: 'post',
    data,
  });
}

// 获取功能界面信息
export function getFunctionInterface(params) {
  return FetchData.request({
    url: 'system/interface/getFunctionInterface',
    params,
  });
}
// 保存我的界面信息
export function saveMyInterface(data) {
  return FetchData.request({
    url: 'system/interface/saveMyInterface',
    method: 'post',
    data,
  });
}

// 获取我的界面信息
export function getMyInterface(params) {
  return FetchData.request({
    url: 'system/interface/getMyInterface',
    params,
  });
}

// 新增编辑菜单
export function saveAppMenu(data) {
  return FetchData.request({
    url: 'system/interface/saveAppMenu',
    method: 'post',
    data,
  });
}
// 删除菜单 deleteAppMenu
export function deleteAppMenu(data) {
  return FetchData.request({
    url: 'system/interface/deleteAppMenu',
    method: 'post',
    data,
  });
}
