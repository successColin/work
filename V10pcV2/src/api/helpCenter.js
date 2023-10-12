/*
 * @Descripttion: 帮助文档
 * @Author: ytx
 * @Date: 2021-05-13 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-05-13 12:53:46
 */
import FetchData from './axiosConfig';

// 帮助中心配置，获取__侧边栏
export function getListModelMenu(params) {
  return FetchData.request({
    url: '/system/helpCenterEdit/listModel',
    method: 'get',
    params,
  });
}

// 帮助中心配置，点击__侧边栏中的详情
export function getListDetail(params) {
  return FetchData.request({
    url: '/system/helpCenterEdit/listDetailtable',
    method: 'get',
    params,
  });
}

// 帮助中心配置，侧边栏__增
export function postInsertModel(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/insertModel',
    method: 'post',
    data,
  });
}

// 帮助中心配置，侧边栏__删
export function postDeleteModel(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/deleteModel',
    method: 'post',
    data,
  });
}

// 帮助中心配置，侧边栏__改
export function postModifyModel(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/modifyModel',
    method: 'post',
    data,
  });
}

// 帮助中心配置，详情__增
export function postInsertDetail(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/insertDetail',
    method: 'post',
    data,
  });
}

// 帮助中心配置，详情__删
export function postDeleteDetail(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/deleteDetail',
    method: 'post',
    data,
  });
}

// 帮助中心配置，详情__改
export function postModifyDetail(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/modifyDetail',
    method: 'post',
    data,
  });
}

// 帮助中心配置，上传文件接口
export function postUploadHelp(data, callback, source) {
  return FetchData.request({
    url: '/system/helpCenterEdit/uploadHelp',
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
        // progressEvent.loaded:已上传文件大小
        // progressEvent.total:被上传文件的总大小
        callback(progressPercent);
      }
      // console.log(progressEvent);
      // // progressEvent.loaded:已上传文件大小
      // // progressEvent.total:被上传文件的总大小
      // const progressPercent =
      //   (progressEvent.loaded / progressEvent.total) * 100;
      // console.info(progressEvent.loaded);
      // console.info(progressEvent.total);
      // console.log(progressPercent);
    },
  });
}

// 帮助中心配置，上传文件接口
export function postDeleteHelpFile(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/deleteHelp',
    method: 'post',
    data,
  });
}

// 切换优先级的接口
export function changeGroupPos(data) {
  return FetchData.request({
    url: '/system/helpCenterEdit/changeSno',
    method: 'post',
    data,
  });
}

// 获取头部
export function getShowHeaderDetail(data) {
  return FetchData.request({
    url: '/system/helpCenterShow/showSelectOne',
    method: 'post',
    data,
  });
}

// -----------------------------------------------
// 帮助中心展示，获取__侧边栏
export function getlistModelShow(params) {
  return FetchData.request({
    url: '/system/helpCenterShow/listModel',
    method: 'get',
    params,
  });
}

// 帮助中心展示，获取__详情
export function getlistDetailShow(params) {
  return FetchData.request({
    url: '/system/helpCenterShow/listDetailTable',
    method: 'get',
    params,
  });
}

// 阅读量统计接口
export function postClicktimesRecord(data) {
  return FetchData.request({
    url: '/system/helpCenterShow/clicktimesRecord',
    method: 'post',
    data,
  });
}

// 热搜词返回接口
export function postHotSearch(data) {
  return FetchData.request({
    url: '/system/helpCenterShow/hotSearch',
    method: 'post',
    data,
  });
}

// 帮助中心展示，查询接口
export function getlistDetailShowSearch(params) {
  return FetchData.request({
    url: '/system/helpCenterShow/searchDetail',
    method: 'get',
    params,
  });
}
