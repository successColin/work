import FetchData from './axiosConfig';

// 下载
export function downloadSingle(params) {
  return FetchData.request({
    method: 'get',
    params,
    responseType: 'blob',
    url: '/apiFile/fileDownload',
  });
}

// 查询
export function getFileUrlList(params) {
  return FetchData.request({
    url: '/apiFile/getFileUrlList',
    params,
  });
}
