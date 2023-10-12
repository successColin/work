/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-11-30 19:04:10
 */
import FetchData from './axiosConfig';

// 根据关键字获取提示
export function getInputtips(params) {
  return FetchData.request(
    {
      url: '/assistant/inputtips',
      method: 'GET',
      params,
      isNonstandard: true,
    },
    'https://restapi.amap.com/v3/'
  );
}

// 忘记密码，第一步获取用户信息
export function getRestPwdAccountByType(params) {
  return FetchData.request({
    url: '/register/getRestPwdAccountByType',
    method: 'GET',
    params,
  });
}
