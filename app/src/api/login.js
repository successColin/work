/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-10-29 15:44:56
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

// 获取配置信息
export function getGlobalAppLogin() {
  return FetchData.request({
    url: '/system/global/getGlobalAppLogin',
    method: 'get',
  });
}

// 浙政钉单点登录
export function zwdingtalkLogin(data) {
  return FetchData.request({
    url: 'zwdingtalkLogin',
    method: 'post',
    data,
  });
}

// 标准单点登录
export function ssoLogin(params) {
  return FetchData.request({
    url: 'system/ssoLogin/getToken',
    method: 'get',
    params,
  });
}

// 标准单点登录
export function verifyToken(params) {
  return FetchData.request({
    url: 'register/verifyToken',
    method: 'get',
    params,
  });
}
// 微信免登接口
export function wxLoginByOpenId(data) {
  return FetchData.request({
    url: 'weChat/loginByOpenId',
    method: 'post',
    showMsg: true,
    data,
  });
}
// 微信登录
export function wxLogin(data) {
  return FetchData.request({
    url: 'weChat/login',
    method: 'post',
    data,
  });
}

// 微信注册
export function wxRegister(data) {
  return FetchData.request({
    url: 'weChat/registerLogin',
    method: 'post',
    data,
  });
}

// 踢登确认
export function exchangeTokenLogin(data) {
  return FetchData.request({
    url: 'exchangeTokenLogin',
    method: 'post',
    data,
  });
}
