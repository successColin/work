/*
 * @Author: cmk
 * @Date: 2021-04-19 09:23:10
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-19 16:53:55
 * @Des: 实体管理接口
 */
import FetchData from './axiosConfig';

// 获取密码有效期
export function listSysUserValid(params) {
  return FetchData.request({
    url: 'system/userValid/listSysUserValid',
    params,
  });
}

// 设置用户密码有效期
export function modifySysUserValid(data) {
  return FetchData.request({
    url: 'system/userValid/modifySysUserValid',
    method: 'post',
    data,
  });
}

// 删除密码有效期
export function deleteSysUserValid(params) {
  return FetchData.request({
    url: 'system/userValid/deleteSysUserValid',
    method: 'delete',
    params,
  });
}
