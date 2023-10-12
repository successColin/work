/*
 * @Descripttion: 导入模板配置
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:19:58
 */
import FetchData from './axiosConfig';

// 分组列表
export function getListSort(params) {
  return FetchData.request({
    url: '/system/sysImportConfig/listSort',
    method: 'get',
    params,
  });
}

// 新增分组
export function addInsertSort(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/insertSort',
    method: 'post',
    data,
  });
}

// 切换分组
export function changeModifySortSon(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifySortSon',
    method: 'post',
    data,
  });
}

// 删除分组
export function deleteSort(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/deleteSort',
    method: 'post',
    data,
  });
}

// 编辑分组
export function updateModifySort(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifySort',
    method: 'post',
    data,
  });
}

// 获取导入模板列表
export function getPageTemplate(params) {
  return FetchData.request({
    url: '/system/sysImportConfig/pageTemplate',
    method: 'get',
    params,
  });
}

// 新增模板
export function insertTemplate(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/insertTemplate',
    method: 'post',
    data,
  });
}

// 编辑模板
export function updateModifyTemplate(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifyTemplate',
    method: 'post',
    data,
  });
}

// 删除模板
export function deleteTemplate(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/deleteTemplate',
    method: 'post',
    data,
  });
}

// 字段列表
export function getListColoumns(params) {
  return FetchData.request({
    url: '/system/sysImportConfig/listColoumns',
    method: 'get',
    params,
  });
}

// 字段新增
export function addInsertColoumns(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/insertColoumns',
    method: 'post',
    data,
  });
}

// 字段修改
export function updateModifyColoumns(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifyColoumns',
    method: 'post',
    data,
  });
}

// 字段删除
export function deleteColoumns(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/deleteColoumns',
    method: 'post',
    data,
  });
}

// 正则表达式
export function getExpressionList(params) {
  return FetchData.request({
    url: '/system/sysExpression/list',
    method: 'get',
    params,
  });
}

// 模板下载
export function downloadTemplate(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/downloadTemplate',
    method: 'post',
    data,
  });
}

// 是否必填
export function updateModifyColoumnNotNull(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifyColoumnNotNull',
    method: 'post',
    data,
  });
}

// 是否必填
export function batchInsertColoumns(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/batchInsertColoumns',
    method: 'post',
    data,
  });
}

// 字段优先级
export function updateModifyColoumnSno(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifyColoumnSno',
    method: 'post',
    data,
  });
}

// 编码规则
export function addCodeRule(data) {
  return FetchData.request({
    url: '/system/code/codeRule',
    method: 'post',
    data,
  });
}

// 修改编码规则
export function updateCodeRule(data) {
  return FetchData.request({
    url: '/system/code/codeRule',
    method: 'put',
    data,
  });
}

// 获取编码规则
export function getCodeRule(params) {
  return FetchData.request({
    url: '/system/code/codeRule',
    method: 'get',
    params,
  });
}

// 删除编码规则
export function deleteCodeRule(params) {
  return FetchData.request({
    url: '/system/code/deleteCodeRule',
    method: 'delete',
    params,
  });
}

// 绑定编码规则
export function bindColoumnsCodeRule(data) {
  return FetchData.request({
    url: '/sysImportConfig/isColoumnsCodeRule',
    method: 'post',
    data,
  });
}

// 特殊编码规则（入表）
// 组织表
export function importTemplateOrgStart(data) {
  return FetchData.request({
    url: '/system/special/importTemplateOrgStart',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 用户表
export function importTemplateUserStart(data) {
  return FetchData.request({
    url: '/system/special/importTemplateUserStart',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 设备和位置表
export function importTemplatePDStart(data) {
  return FetchData.request({
    url: '/system/special/importTemplatePDStart',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 特殊导入校验
export function importSpecialTemplate(data) {
  return FetchData.request({
    url: '/system/special/importTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 特殊编码规则（校验模板）
// 组织表
export function checkOrgSpecialTemplate(data) {
  return FetchData.request({
    url: '/system/special/checkOrgTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 设备位置表
export function checkPDSpecialTemplate(data) {
  return FetchData.request({
    url: '/system/special/checkPDTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 用户表
export function checkUserSpecialTemplate(data) {
  return FetchData.request({
    url: '/system/special/checkUserTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 特殊表校验进度监控
export function getCheckSpecialProgress(params) {
  return FetchData.request({
    url: '/system/special/getCheckProgress',
    method: 'get',
    params,
  });
}

// 特殊表
export function getCheckSpecialSpecialProgress(params) {
  return FetchData.request({
    url: '/system/special/getUploadProgress',
    method: 'get',
    params,
  });
}

// ------------------------
// 树接口
// 树结构校验模板
export function checkTreeTemplate(data) {
  return FetchData.request({
    url: '/system/treeImport/checkTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 校验进度监控
export function getCheckTreeProgress(params) {
  return FetchData.request({
    url: '/system/treeImport/getCheckProgress',
    method: 'get',
    params,
  });
}

// 进度监控
export function getUploadTreeProgress(params) {
  return FetchData.request({
    url: '/system/treeImport/getUploadProgress',
    method: 'get',
    params,
  });
}

// 导入校验
export function importTreeTemplate(data) {
  return FetchData.request({
    url: '/system/treeImport/importTemplate',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 树结构表入表
export function importTemplateTreeOrgStart(data) {
  return FetchData.request({
    url: '/system/treeImport/importTemplateOrgStart',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 错误信息导出
// 常规导出
export function exportErrorMessage(params) {
  return FetchData.request({
    url: '/system/sysImportExport/exportErrorMessage',
    method: 'get',
    params,
  });
}
// 树导出
export function exportErrorTreeMessage(params) {
  return FetchData.request({
    url: '/system/treeImport/exportErrorMessage',
    method: 'get',
    params,
  });
}
export function exportErrorSpecialMessage(params) {
  return FetchData.request({
    url: '/system/special/exportErrorMessage',
    method: 'get',
    params,
  });
}
// ============= 陈珑 接口
// 通用导入
export function importData(data) {
  return FetchData.request({
    url: '/system/sysImport/importData',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 校验进度监控
export function getCheckSysImportProgress(params) {
  return FetchData.request({
    url: '/system/sysImport/getCheckProgress',
    method: 'get',
    params,
  });
}

// 进度监控
export function getUploadsysImportProgress(params) {
  return FetchData.request({
    url: '/system/sysImport/getUploadProgress',
    method: 'get',
    params,
  });
}

// 文件上传
export function uploadTemplate(data, callback, source) {
  return FetchData.request({
    url: '/system/sysImportConfig/uploadTemplate',
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

// 绑定编码规则
export function modifyDownloadType(data) {
  return FetchData.request({
    url: '/system/sysImportConfig/modifyDownloadType ',
    method: 'post',
    data,
  });
}

// 定制化接口
// 导入数据
export function importDevice(data) {
  return FetchData.request({
    url: '/deviceSyn/importDevice',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

//  进度监控
// /deviceSyn/exportErrorMessage 异常信息导出

// 校验进度监控
export function getCheckDeviceSynProgress(params) {
  return FetchData.request({
    url: '/deviceSyn/getCheckProgress',
    method: 'get',
    params,
  });
}

// 进度监控
export function getImportDeviceSynProgress(params) {
  return FetchData.request({
    url: '/deviceSyn/getImportProgress',
    method: 'get',
    params,
  });
}
