import fetch from '@/api/axiosConfig';
import query from '@/api/query';
// 上传授权
export function doUploadLicense(data) {
  return fetch.request({
    url: query.DO_UPLOAD_LICENSE,
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}
// 获取授权详情
export function getLicense(data) {
  return fetch.request({
    url: query.GET_INFO_LICENSE,
    method: 'post',
    data,
  });
}
