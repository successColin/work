import query from './query';
import fetch from './axiosConfig';

// 获取菜单列表
export function getFunctionList(params) {
  return fetch.request({
    url: query.GET_MENU_CENTER,
    method: 'get',
    noToken: true,
    params,
  });
}

// 获取菜单列表
export function getKonwledgeList(params) {
  return fetch.request({
    url: query.GET_KNOWLEDGE_ALL,
    method: 'get',
    noToken: true,
    params,
  });
}
// 新增文件夹
export function addFolder(data) {
  return fetch.request({
    url: query.ADD_KNOWLEDGE_FOLDER,
    method: 'post',
    data,
  });
}

// 编辑文件
export function editFolder(data) {
  return fetch.request({
    url: query.EDIT_KNOWLEDGE_FOLDER,
    method: 'post',
    data,
  });
}

// 分页获取列表
export function getFileList(params) {
  return fetch.request({
    url: query.GET_KNOWLEDGE_LIST_BY_PAGE,
    method: 'get',
    params,
  });
}

// 文件删除
export function delFiles(data) {
  return fetch.request({
    url: query.DEL_KNOWLEDGE_FILES,
    method: 'post',
    data,
  });
}

// 移动文件
export function moveFiles(data) {
  return fetch.request({
    url: query.MOVE_KNOWLEDGE_FILES,
    method: 'post',
    data,
  });
}
// 获取收藏列表
export function getCollectList(params) {
  return fetch.request({
    url: query.GET_COLLECT_FILES_LIST,
    method: 'get',
    params,
  });
}

// 收藏文件
export function doCollect(data) {
  return fetch.request({
    url: query.COLLECT_FILES,
    method: 'post',
    data,
  });
}

// 取消收藏
export function unCollect(data) {
  return fetch.request({
    url: query.UNCOLLECT_FILES,
    method: 'post',
    data,
  });
}

// 访问文件
export function visitFiles(data) {
  return fetch.request({
    url: query.VISIT_KNOWLEDGE_FILE,
    method: 'post',
    data,
  });
}

// 最近常用
export function getCommonList(params) {
  return fetch.request({
    url: query.LAST_KNOWLEDGE_FILE_LIST,
    params,
    method: 'get',
  });
}

// 分享文件
export function shareFiles(data) {
  return fetch.request({
    url: query.SHARE_KNOWLEDGE_FILES,
    method: 'post',
    data,
  });
}

// 获取我的分享的文件列表
export function getShareFiles(params) {
  return fetch.request({
    url: query.GET_SHARE_KNOWLEDGE_FILES_LIST,
    method: 'get',
    params,
  });
}

// 取消分享
export function doCancelShareFiles(data) {
  return fetch.request({
    url: query.CANCEL_SHARE_KNOWLEDGE_FILES,
    method: 'post',
    data,
  });
}

// 获取他人的分享
export function getOthersShareFiles(params) {
  return fetch.request({
    url: query.GET_OTHERS_SHARE_KNOWLEDGE_FILES,
    method: 'get',
    params,
  });
}

// 修改被分享人
export function doUpdateShareUser(data) {
  return fetch.request({
    url: query.DO_SET_KNOWLEDGE_USER,
    method: 'post',
    data,
  });
}

// 获取分享人列表
export function getShareList(params) {
  return fetch.request({
    params,
    url: query.DO_GET_KNOWLEDGE_SHARE,
    method: 'get',
  });
}

// 获取用户接口
export function getUserList(params) {
  return fetch.request({
    params,
    url: query.GET_KNOWLEDGE_USER_LIST,
    method: 'get',
  });
}

// 文件下载
export function downloadFiles(params) {
  return fetch.request({
    params,
    url: query.DO_KNOWLEDGE_DOWNLOAD,
    method: 'get',
  });
}

// 修改权限
export function upadteKnowledge(data) {
  return fetch.request({
    method: 'post',
    data,
    url: query.DO_UPDATE_KNOWLEDGE_AUTH,
  });
}

// 获取业务列表
export function getBussinessList(params) {
  return fetch.request({
    method: 'get',
    params,
    url: query.DO_FETCH_BUSSINESS,
  });
}

// 获取子文件里面的列表
export function fetchBusList(params) {
  return fetch.request({
    method: 'get',
    params,
    url: query.DO_SEARCH_BUSSINESS,
  });
}

// 关联资料列表
export function listFiles(params) {
  return fetch.request({
    method: 'get',
    params,
    url: '/system/materials/listFiles',
  });
}

// 关联资料新增文件夹
export function saveFolder(data) {
  return fetch.request({
    url: '/system/materials/saveFolder',
    method: 'post',
    data,
  });
}

// 关联资料编辑文件
export function updateFolder(data) {
  return fetch.request({
    url: '/system/materials/updateFolder',
    method: 'post',
    data,
  });
}

// 关联资料文件下载
export function downFiles(data) {
  return fetch.request({
    url: '/system/materials/downFiles',
    method: 'post',
    responseType: 'blob',
    data,
  });
}

// 关联资料本地文件删除
export function deleteFile(data) {
  return fetch.request({
    url: '/system/materials/deleteFile',
    method: 'post',
    data,
  });
}

// 关联资料关联知识库
export function bindKl(data) {
  return fetch.request({
    url: '/system/materials/bindKl',
    method: 'post',
    data,
  });
}

// 关联资料解绑知识库
export function unbindKl(data) {
  return fetch.request({
    url: '/system/materials/unbindKl',
    method: 'post',
    data,
  });
}

// 关联资料上传新版本
export function replaceFile(data, callback, source) {
  return fetch.request({
    url: '/system/materials/replaceFile',
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

// 搜索关联资料列表
export function searchFiles(params) {
  return fetch.request({
    method: 'get',
    params,
    url: '/system/materials/searchFiles',
  });
}

// 获取关联历史列表
export function getHistory(data) {
  return fetch.request({
    method: 'POST',
    data,
    url: '/system/materials/getHistory',
  });
}
