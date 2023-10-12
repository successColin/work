/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2023-10-08 08:44:14
 * @desc：菜单配置
 */
import { Encrypt } from '../utils';
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
export function getListData(data) {
  return FetchData.request({
    url: '/application/select/list',
    method: 'post',
    data,
  });
}

// 获取列表信息-分页
export function getListPage(data) {
  return FetchData.request({
    url: '/application/select/page',
    method: 'post',
    data,
  });
}

// 获取列表单条
export function getSidebarSingle(data) {
  return FetchData.request({
    url: 'application/select/single',
    method: 'post',
    data,
  });
}

// 文件下载，存储于临时路径中
// isAddPrefix
export function downloadFile(filesUrl, isAddPrefix = true) {
  if (isAddPrefix) filesUrl = `system/waterMark/addWaterMark?url=${filesUrl}`;
  return FetchData.downloadFile({
    url: filesUrl,
    isAddPrefix,
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

// 用户签名图片上传
export function uploadSignature(file, data = {}) {
  return FetchData.uploadFile({
    url: 'system/signature/uploadSignature',
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
export function batchDelete(data) {
  return FetchData.request({
    url: 'application/save/batchDelete',
    method: 'post',
    data,
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
export function selectListSingle(params) {
  return FetchData.request({
    url: 'application/select/selectList',
    params,
  });
}

let paramObj = {};
let resObj = {};
let timer = null;
// 根据条件获取DB数据列表
export function selectList(params) {
  // console.log(params);
  // selectContent 只有一个id的不走接口直接返回
  if (params.selectContent === 'id') {
    const trempParams = JSON.parse(JSON.stringify(params));
    if (
      trempParams.selectWhere.indexOf('and') === -1 &&
      trempParams.selectWhere.indexOf('or') === -1
    ) {
      const arr = trempParams.selectWhere.slice(1, -1).split('(');
      const idsStr = arr[1].slice(0, -1);
      const idsArr = idsStr.split(',');
      const resArr = [];
      let flag = true;
      idsArr.forEach((id) => {
        if (Number.isNaN(+id)) {
          flag = false;
        }
        resArr.push({
          id,
        });
      });
      if (flag) {
        return Promise.resolve(resArr);
      }
    }
  }
  // 截取10ms以内的请求
  // 根据wehre条件生成key
  const key = `${params.selectWhere.replace(/\.|\s/g, '')}`.replace(
    /\(|\)/g,
    '',
  );
  // 第一次的请求的时候赋值，初始化值
  if (!uni.getStorageSync('firstTempTime')) {
    uni.setStorageSync('firstTempTime', +new Date());
    paramObj = {};
    resObj = {};
    timer = null;
  }
  // 10ms以下添加paramObj
  const date = +new Date();
  if (date - uni.getStorageSync('firstTempTime') < 100) {
    uni.setStorageSync('firstTempTime', date);
    if (paramObj[key]) {
      const content = `${paramObj[key].selectContent},${params.selectContent}`;
      const contentStr = [...new Set(content.split(','))].join(',');
      paramObj[key] = {
        ...paramObj[key],
        selectContent: Encrypt(contentStr),
      };
    } else {
      // paramObj[key] = params;
      paramObj[key] = {
        selectContent: Encrypt(params.selectContent),
        selectFrom: Encrypt(params.selectFrom),
        selectWhere: Encrypt(params.selectWhere),
      };
    }
  }
  return new Promise((resolve, reject) => {
    // 有新的进；来 清楚上一次的触发器，保证请求只有一次
    clearTimeout(timer);
    timer = setTimeout(async () => {
      resObj = await FetchData.request({
        url: 'application/select/selectAllList',
        data: { paramList: paramObj },
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
      });
      console.log(resObj);
      uni.setStorageSync('firstTempTime', '');
    }, 100);
    //
    let inOutTimer = null;
    // 等待定时器 500ms 返回一次
    const inTimer = setInterval(() => {
      if (resObj[key]) {
        resolve(resObj[key]);
        // 超时定时器清楚
        clearTimeout(inOutTimer);
        // 清除等待定时器
        clearInterval(inTimer);
      }
    }, 200);
    // 超时定时器
    inOutTimer = setTimeout(() => {
      clearInterval(inTimer);
      uni.setStorageSync('firstTempTime', '');
      reject(new Error('请求超时'));
    }, 5000);
  });
  // return FetchData.request({
  //   url: 'application/select/selectList',
  //   params,
  // });
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

// 根据扫描获取扫描数据
export function getScanData(data) {
  const menuId = uni.getStorageSync('curMenuId') || '';
  data.menuId = menuId;
  return FetchData.request({
    url: '/application/select/scanQuery',
    method: 'post',
    data,
  });
}

// 多表树查询
export function listMultiTree(data) {
  const menuId = uni.getStorageSync('curMenuId') || '';
  data.menuId = menuId;
  return FetchData.request({
    url: 'system/multiTree/listMultiTree',
    method: 'post',
    data,
  });
}

// 多表树查询分页
export function pageMultiTree(data) {
  const menuId = uni.getStorageSync('curMenuId') || '';
  data.menuId = menuId;
  return FetchData.request({
    url: 'system/multiTree/pageMultiTree',
    method: 'post',
    data,
  });
}

// 根据组件id查询角标信息
export function getSubscript(params) {
  return FetchData.request({
    url: 'application/select/getSubscript',
    params,
  });
}

// 查询当前时间登录用户的站内信数量
export function getMailCount(params) {
  return FetchData.request({
    url: 'innerMail/queryCount',
    params,
  });
}

// 级联组件开发
export function getCascadeInfo(params) {
  return FetchData.request({
    url: 'application/select/getCascadeInfo',
    params,
  });
}

// 查询字段唯一性
export function getColumnUniqueness(params) {
  return FetchData.request({
    url: 'application/select/getColumnUniqueness',
    params,
  });
}

// 公告启用查询接口
export function getAnnounceList(params) {
  return FetchData.request({
    url: 'system/announce/listAnnounce',
    params,
  });
}

// 公告详情接口
export function getAnnounceDetail(params) {
  return FetchData.request({
    url: 'system/announce/searchAnnounceDetail',
    params,
  });
}

// 公告分组数量查询接口
export function getAnnounceGroup(params) {
  return FetchData.request({
    url: 'system/announce/listAnnounceGroup',
    params,
  });
}

// 获取步骤列表
export function getStepRecordList(params) {
  return FetchData.request({
    url: 'system/stepRecord/listRecord',
    params,
  });
}

// 外链地址转换
export function shortLink(data) {
  return FetchData.request({
    url: '/system/panel/shortLink',
    method: 'post',
    data,
  });
}
