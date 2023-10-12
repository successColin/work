import query from './query';
import fetch from './axiosConfig';

// 获取自定义图标
export function getIconList(params) {
  return fetch.request({
    url: query.GET_ICON_LIST,
    method: 'get',
    params,
  });
}

// 批量上传图标
export function batchUpload(params) {
  return fetch.request({
    url: query.BATCH_UPLOAD_INCON,
    method: 'post',
    data: params,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

// 批量删除图标
export function batchDeleteIcon(params) {
  return fetch.request({
    url: query.DELETE_ICON_BY_BATCH,
    method: 'delete',
    params,
  });
}
