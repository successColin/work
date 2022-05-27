/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-11-09 15:03:33
 */
import FetchData from './axiosConfig';

// 账号密码登录
export function postLoginForm(data) {
  return FetchData.request({
    url: 'login',
    method: 'post',
    showMsg: true,
    data,
  });
}

// 忘记密码，第一步获取用户信息
export function getRestPwdAccountByType(params) {
  return FetchData.request({
    url: '/register/getRestPwdAccountByType',
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

// 忘记密码，第二步：校验验证码
export function postDoMessageVerify(data) {
  return FetchData.request({
    url: '/messageVerify/doMessageVerify',
    method: 'post',
    data,
  });
}

// 忘记密码，第三步：重置密码
export function postResetPassword(data) {
  return FetchData.request({
    url: '/register/resetPassword',
    method: 'post',
    data,
  });
}

// 获取登录页配置
export function getLoginConfig() {
  return FetchData.request({
    url: '/system/global/getGlobalLogin',
    method: 'get',
  });
}
