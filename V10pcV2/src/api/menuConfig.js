/*
 * @Descripttion: 菜单设计模块
 * @Author: cmk
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-22 17:19:58
 */
import { Encrypt, Decrypt } from '@/utils/utils';
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
export function batchDelete(data) {
  return FetchData.request({
    url: 'application/save/batchDelete',
    method: 'post',
    data,
  });
}

// 下载资料
export function downLoadData(data) {
  return FetchData.request({
    url: 'system/materials/downloadRelationFiles',
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
export function getSidebarList(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: 'application/select/list',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 获取侧边列表分页
export function getSidebarPage(data) {
  const menuId = window.vue.$route.params.id;
  if (data.groupContent) {
    data.groupContent = Encrypt(data.groupContent);
  }
  if (data.groupBy) {
    data.groupBy = Encrypt(data.groupBy);
  }
  return FetchData.request({
    url: 'application/select/page',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 获取甘特图
export function ganttPage(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: 'application/select/ganttPage',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 获取甘特图列表
export function ganttList(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: 'application/select/ganttList',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 设置节点
export function updateGanttTime(data) {
  return FetchData.request({
    url: '/application/save/updateGanttTime',
    method: 'post',
    data,
  });
}

// 更新树节点信息
export function updateGanttTreeInfo(data) {
  return FetchData.request({
    url: '/application/save/updateGanttTreeInfo',
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

// 用户签名图片上传
export function uploadSignature(data, callback, source) {
  return FetchData.request({
    url: 'system/signature/uploadSignature',
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

// 文件删除
export function deleteFileFun(params) {
  return FetchData.request({
    url: 'application/file/deleteFile',
    method: 'post',
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
        console.log(resArr);
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
  if (!sessionStorage.firstTempTime) {
    sessionStorage.firstTempTime = +new Date();
    paramObj = {};
    resObj = {};
    timer = null;
  }
  // 10ms以下添加paramObj
  const date = +new Date();
  if (date - sessionStorage.firstTempTime < 500) {
    sessionStorage.firstTempTime = date;
    if (paramObj[key]) {
      const content = `${Decrypt(paramObj[key].selectContent)},${
        params.selectContent
      }`;
      const contentStr = [...new Set(content.split(','))].join(',');
      paramObj[key] = {
        ...paramObj[key],
        selectContent: Encrypt(contentStr),
      };
    } else {
      // paramObj[key] = params;
      console.log(params);
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
      sessionStorage.firstTempTime = '';
    }, 500);
    //
    let inOutTimer = null;
    // 等待定时器 500ms 返回一次
    const inTimer = setInterval(() => {
      if (resObj[key]) {
        console.log(resObj[key]);
        resolve(resObj[key]);
        // 超时定时器清楚
        clearTimeout(inOutTimer);
        // 清除等待定时器
        clearInterval(inTimer);
      }
    }, 200);
    // // 超时定时器
    inOutTimer = setTimeout(() => {
      clearInterval(inTimer);
      sessionStorage.firstTempTime = '';
      reject(new Error('请求超时'));
    }, 5000);
  });
  // return FetchData.request({
  //   url: 'application/select/selectList',
  //   params,
  // });
}

// 获取记录分页列表
export function selectListSingle(params) {
  params = {
    selectContent: Encrypt(params.selectContent),
    selectFrom: Encrypt(params.selectFrom),
    selectWhere: Encrypt(params.selectWhere),
  };
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
export function listMultiTree(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: 'system/multiTree/listMultiTree',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 多表树查询分页
export function pageMultiTree(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: 'system/multiTree/pageMultiTree',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}

// 级联组件开发
export function getCascadeInfo(params) {
  return FetchData.request({
    url: 'application/select/getCascadeInfo',
    params,
  });
}

// 查询汇总数据
export function totalNum(data) {
  const menuId = window.vue.$route.params.id;
  return FetchData.request({
    url: '/application/select/total',
    method: 'post',
    data: {
      menuId,
      ...data,
    },
  });
}
