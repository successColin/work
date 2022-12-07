/**
 * @name: design
 * @author: DELL
 * @date: 2021/12/7 14:56
 * @description：design
 * @update: 2021/12/7 14:56
 */

import axios from '@/utils/axios';
import query from '@/constants/query';

/**
 * 用户登录
 * @param params
 * @returns {AxiosPromise}
 */
export function userLogin(params) {
  return axios({
    url: query.LOGIN_DO_LOGIN,
    method: 'post',
    params,
    contentType: 'json'
  })
}
/**
 * 用户登出
 * @param params
 * @returns {AxiosPromise}
 */
export function userLogout(params) {
  return axios({
    url: query.LOGIN_DO_LOGOUT,
    method: 'post',
    params,
    contentType: 'json'
  })
}
