/*
 * @Description: 样品台账
 * @Author: ytx
 * @Date: 2021-04-27 08:40:13
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-14 16:06:53
 */

import FetchData from './axiosConfig';

// 查询监测记录设备树
export function getDeviceTree(params) {
  return FetchData.request({
    url: '/sampleLing/getDeviceTree',
    method: 'get',
    params,
  });
}

// 查询监测记录
export function listLubrication(params) {
  return FetchData.request({
    url: '/sampleLing/listLubrication',
    method: 'get',
    params,
  });
}

// 查询检测区间值
export function getHeadLubrication(params) {
  return FetchData.request({
    url: '/sampleLing/getHeadLubrication',
    method: 'get',
    params,
  });
}
