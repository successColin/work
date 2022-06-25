/*
 * @Descripttion: 菜单设计模块
 * @Author: cmk
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-22 17:19:58
 */
import FetchData from './axiosConfig';

// 根据菜单id获取设计列表
export function listSysDesignMenu(params) {
  return FetchData.request({
    url: 'system/design/listSysDesignMenu',
    params,
  });
}

// 根据设计菜单id获取角色列表
export function listRole(params) {
  return FetchData.request({
    url: 'system/design/listRole',
    params,
  });
}

// 根据设计菜单id获取操作列表
export function listOperationLog(params) {
  return FetchData.request({
    url: 'system/design/listOperationLog',
    params,
  });
}

// 复制设计列表
export function copyDesign(data) {
  return FetchData.request({
    url: 'system/design/copyDesign',
    method: 'post',
    data,
  });
}

// 修改设计
export function modifyDesign(data) {
  return FetchData.request({
    url: 'system/design/modifyDesign',
    method: 'put',
    data,
  });
}

// 修改是否展示流程
export function enableWorkflow(data) {
  return FetchData.request({
    url: 'system/design/enableWorkflow',
    method: 'put',
    data,
  });
}

// 是否启用
export function enableDesign(data) {
  return FetchData.request({
    url: 'system/design/enableDesign',
    method: 'put',
    data,
  });
}

// 删除设计
export function deleteDesign(params) {
  return FetchData.request({
    url: 'system/design/deleteDesign',
    method: 'delete',
    params,
  });
}

// 保存设计
export function saveLayout(data) {
  return FetchData.request({
    url: 'system/design/saveLayout',
    method: 'post',
    data,
  });
}

// 保存触发器
export function saveDesignTriggers(data) {
  return FetchData.request({
    url: 'system/triggers/saveDesignTriggers',
    method: 'post',
    data,
  });
}

// 获取触发器列表
export function listDesignTriggers(params) {
  return FetchData.request({
    url: 'system/triggers/listDesignTriggers',
    params,
  });
}

// 根据链路编码查询信息
export function getDesignTriggers(params) {
  return FetchData.request({
    url: 'system/triggers/getDesignTriggers',
    params,
  });
}

// 启用停用触发器
export function enableAndDisableTriggers(data) {
  return FetchData.request({
    url: 'system/triggers/enableAndDisableTriggers',
    method: 'post',
    data,
  });
}

// 获取关系图数据
export function getDesignTriggersLinkDiagram(params) {
  return FetchData.request({
    url: 'system/triggers/getDesignTriggersLinkDiagram',
    params,
  });
}

// 编辑触发器
export function modifyDesignTriggers(data) {
  return FetchData.request({
    url: 'system/triggers/modifyDesignTriggers',
    method: 'put',
    data,
  });
}

// 删除触发器
export function batchDeleteDesignTriggers(params) {
  return FetchData.request({
    url: 'system/triggers/batchDeleteDesignTriggers',
    method: 'delete',
    params,
  });
}

// 获取存储过程
export function listProcedures(params) {
  return FetchData.request({
    url: 'system/procedures/listProcedures',
    params,
  });
}

// 根据存储过程id获取参数信息
export function listProceduresParameter(params) {
  return FetchData.request({
    url: 'system/procedures/listProceduresParameter',
    params,
  });
}

// 根据菜单id获取菜单设计
export function getDesignMenu(params) {
  return FetchData.request({
    url: 'application/select/getDesignMenu',
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

// 按钮新增
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

// 获取侧边列表
export function getSidebarList(params) {
  return FetchData.request({
    url: 'application/select/list',
    params,
  });
}

// 获取侧边列表分页
export function getSidebarPage(params) {
  return FetchData.request({
    url: 'application/select/page',
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

// 文件上传
export function batchUpload(data, callback, source) {
  return FetchData.request({
    url: 'application/file/batchUpload',
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

// 单个菜单
export function getSysDesignMenu(params) {
  return FetchData.request({
    url: 'system/design/getSysDesignMenu',
    params,
  });
}

// 面板相关的接口
// 获取面板列表
export function pagePanel(params) {
  return FetchData.request({
    url: 'system/panel/pagePanel',
    params,
  });
}

// 获取全部面板列表
export function listPanel(params) {
  return FetchData.request({
    url: 'system/panel/listPanel',
    params,
  });
}

// 新增面板
export function addPanel(data) {
  return FetchData.request({
    url: 'system/panel/addPanel',
    method: 'post',
    data,
  });
}

// 修改面板
export function modifyPanel(data) {
  return FetchData.request({
    url: 'system/panel/modifyPanel',
    method: 'put',
    data,
  });
}

// 复制设计列表
export function copyPanel(data) {
  return FetchData.request({
    url: 'system/design/copyPanel',
    method: 'post',
    data,
  });
}

// 删除面板
export function batchDeletePanel(params) {
  return FetchData.request({
    url: 'system/panel/batchDeletePanel',
    method: 'delete',
    params,
  });
}

// 筛选记录新增
export function insertSearchRecords(data) {
  return FetchData.request({
    url: 'system/search/insertSearchRecords',
    method: 'post',
    data,
  });
}

// 筛选记录查询
export function listSearchRecords(params) {
  return FetchData.request({
    url: 'system/search/listSearchRecords',
    params,
  });
}

// 修改面板
export function updateSearchTitle(data) {
  return FetchData.request({
    url: 'system/search/updateSearchTitle',
    method: 'put',
    data,
  });
}

// 获取设备位置树
export function listDeviceTree(params) {
  return FetchData.request({
    url: 'system/device/listDevicePositionTree',
    params,
  });
}

// 分页获取设备位置树
export function pageDevicePositionTree(params) {
  return FetchData.request({
    url: 'system/device/pageDevicePositionTree',
    params,
  });
}

// 获取导入导出模板列表(全部)不分页
export function getSysImportTemplateList(params) {
  return FetchData.request({
    url: 'system/sysImportExport/getSysImportTemplateList',
    params,
  });
}

// 获取导入导出模板列表(全部)分页
export function getPageSysImportTemplateList(params) {
  return FetchData.request({
    url: 'system/sysImportExport/getPageSysImportTemplateList',
    params,
  });
}

// 根据条件获取DB数据列表
export function selectList(params) {
  return FetchData.request({
    url: 'application/select/selectList',
    params,
  });
}

// 获取记录分页列表
export function selectMulList(params) {
  return FetchData.request({
    url: '/system/multiTree/selectList',
    params,
  });
}

// 获取故障树
export function listFaultTree(params) {
  return FetchData.request({
    url: 'system/malfunction/treeListAsync/keycode',
    params,
  });
}

// 分页获取故障树
export function treeListPageList(params) {
  return FetchData.request({
    url: 'system/malfunction/treeListPage/searchValue',
    params,
  });
}

// 故障现象列表
export function phenomenonList(params) {
  return FetchData.request({
    url: 'system/malfunction/phenomenonList',
    params,
  });
}

// 故障原因列表
export function reasonList(params) {
  return FetchData.request({
    url: 'system/malfunction/reasonList/page',
    params,
  });
}

// 故障措施列表
export function measureList(params) {
  return FetchData.request({
    url: 'system/malfunction/measureList',
    params,
  });
}

// 关联故障树
export function associatedPhenomenon(data) {
  return FetchData.request({
    url: 'system/malfunction/relations',
    method: 'post',
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

// 取消关联故障树
export function deleteAssociated(params) {
  return FetchData.request({
    url: 'system/malfunction/relation/id',
    method: 'delete',
    params,
  });
}

// 取消关联故障树
export function exportTemplate(data) {
  return FetchData.request({
    url: 'system/sysImportExport/exportTemplate',
    method: 'post',
    data,
  });
}

// 多表树查询
export function listMultiTree(params) {
  return FetchData.request({
    url: 'system/multiTree/listMultiTree',
    params,
  });
}

// 多表树查询分页
export function pageMultiTree(params) {
  return FetchData.request({
    url: 'system/multiTree/pageMultiTree',
    params,
  });
}
