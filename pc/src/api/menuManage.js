/*
 * @Descripttion: 菜单管理模块
 * @Author: cmk
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-22 17:19:58
 */
import FetchData from './axiosConfig';

// 获取菜单管理 模块以及分组
export function sysMenuList(params) {
  return FetchData.request({
    url: 'system/sysMenu/list',
    params,
  });
}

// 获取菜单分页
export function sysMenuPage(params) {
  return FetchData.request({
    url: '/system/sysMenu/page',
    params,
  });
}

// 新增菜单管理 模块以及分组
export function sysMenuAdd(data) {
  return FetchData.request({
    url: 'system/sysMenu/add',
    method: 'post',
    data,
  });
}

// 编辑菜单管理 模块以及分组
export function sysMenuEdit(data) {
  return FetchData.request({
    url: 'system/sysMenu/edit',
    method: 'put',
    data,
  });
}

// 删除菜单管理 模块以及分组
export function sysMenuDelete(params) {
  return FetchData.request({
    url: 'system/sysMenu/logicDel',
    method: 'delete',
    params,
  });
}

// 修改菜单管理排序 模块以及分组
export function switchLocation(data) {
  return FetchData.request({
    url: 'system/sysMenu/switchLocation',
    method: 'post',
    data,
  });
}

// 获取菜单中心
export function menuCenter(params) {
  return FetchData.request({
    url: 'system/sysMenu/menuCenter',
    params,
  });
}

// 获取收藏的菜单
export function menuCenterFav(params) {
  return FetchData.request({
    url: '/system/sysMenu/menuCenter/fav',
    params,
  });
}

// 取消收藏菜单
export function postChangeCollect(data) {
  return FetchData.request({
    url: '/system/sysMenu/collect',
    method: 'post',
    showMsg: true,
    data,
  });
}

// 导入菜单
export function importMenu(data) {
  return FetchData.request({
    url: '/system/design/importMenu',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data',
    },
    data,
  });
}
// 导出菜单
export function exportMenu(params) {
  return FetchData.request({
    url: '/system/design/exportMenu',
    params,
  });
}
// 复制单个菜单
export function copyMenu(data) {
  return FetchData.request({
    url: '/system/design/copyMenu',
    method: 'post',
    data,
  });
}

// 关联主页
export function linkHomePage(data) {
  return FetchData.request({
    url: '/system/sysMenu/linkHomePage',
    method: 'post',
    data,
  });
}
