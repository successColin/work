/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-27 17:01:59
 * 知识库管理
 */
import FetchData from './axiosConfig';

// 分页查询列表
export function pageFiles(params) {
  return FetchData.request({
    url: '/system/knowledge/listFiles',
    method: 'GET',
    params,
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

// // 忘记密码，第二步：校验验证码
// export function postDoMessageVerify(data) {
//   return FetchData.request({
//     url: '/messageVerify/doMessageVerify',
//     method: 'post',
//     data,
//   });
// }

// // 忘记密码，第三步：重置密码
// export function postResetPassword(data) {
//   return FetchData.request({
//     url: '/register/resetPassword',
//     method: 'post',
//     data,
//   });
// }

// // 获取登录页配置
// export function getLoginConfig() {
//   return FetchData.request({
//     url: '/system/global/getGlobalLogin',
//     method: 'get',
//   });
// }
