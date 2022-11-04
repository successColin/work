/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-09 09:29:16
 */
import { baseUrl, PREFIX, VERSION } from '../config';
import { Decrypt } from '../utils';
import FetchData from './axiosConfig';

// 下载点检任务
export function downloadInspectionTasks() {
  return FetchData.request({
    url: '/inspection/downloadTasks',
    method: 'get',
  });
}

// 跳过点检任务
export function inspectionSkip(data) {
  return FetchData.request({
    url: '/inspection/skip',
    method: 'post',
    data,
  });
}

// 文件上传
export function batchUpload(file, data = {}, cb, cbe) {
  console.log('=======================1');
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? `${baseUrl}${PREFIX}/${VERSION}/`
      : `${baseUrl}${PREFIX}/${VERSION}/`; // 请求路径

  console.log(file);
  return uni.uploadFile({
    header: { token: Decrypt(uni.getStorageSync('token') || '') },
    url: `${baseURL}application/file/batchUpload`, // 仅为示例，非真实的接口地址
    filePath: file,
    name: 'files',
    formData: data,
    success: (uploadFileRes) => {
      console.log(uploadFileRes.data);
      if (cb) cb(uploadFileRes.data);
    },
    fail: () => {
      if (cbe) cbe();
    },
  });
}

// 上传点检结果
export function uploadInspectionTask(data) {
  return FetchData.request({
    url: '/inspection/uploadTasks',
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

// 忘记密码，第二步：获取验证码
export function getSendMessageVerifyCode(params) {
  return FetchData.request({
    url: '/messageVerify/sendMessageVerifyCode',
    method: 'get',
    params,
  });
}

// 获取登录页配置
// export function getLoginConfig() {
//   return FetchData.request({
//     url: '/system/global/getGlobalLogin',
//     method: 'get',
//   });
// }
