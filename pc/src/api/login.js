/*
 * @Descripttion: 登录模块接口
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 17:19:58
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
    method: 'get',
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

// 注册，第一步：注册信息
export function postRegister(data) {
  return FetchData.request({
    url: '/register/register',
    method: 'post',
    data,
  });
}

// 注册，第二步：完善信息
export function postPerfectInformation(data) {
  return FetchData.request({
    url: '/register/perfectInformation',
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

// 获取登录页配置
export function auth(data) {
  return FetchData.request({
    url: '/oauth2Login',
    method: 'post',
    data,
  });
}

// 浙政钉扫码登录
export function zwdingtalkScanLogin(data) {
  return FetchData.request({
    url: 'zwdingtalkScanLogin',
    method: 'post',
    data,
  });
}

// 浙政钉单点登录
export function zwdingtalkLogin(data) {
  return FetchData.request({
    url: 'zwdingtalkLogin',
    method: 'post',
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
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

// 踢登确认
export function exchangeTokenLogin(data) {
  return FetchData.request({
    url: 'exchangeTokenLogin',
    method: 'post',
    data,
  });
}
