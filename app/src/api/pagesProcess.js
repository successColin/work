/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 10:20:42
 * @desc：流程
 */
import FetchData from './axiosConfig';

// 我发起的
export function getIInitiatedList() {
  return FetchData.request({
    url: '/workflowTask/launchByme',
    method: 'get',
  });
}

// 待我处理的任务
export function getMyTodoList(params) {
  return FetchData.request({
    url: '/workflowTask/mytodo',
    method: 'get',
    params,
  });
}

// 已经完成的任务
export function getCompletedTasks(params) {
  return FetchData.request({
    url: '/workflowTask/complated',
    method: 'get',
    params,
  });
}

// 获取节点属性
export function getNodeAttr(params) {
  return FetchData.request({
    url: '/workflowNode/getNodeAttr',
    method: 'get',
    params,
  });
}

// 获取审批流程节点
export function getTaskSite(params) {
  return FetchData.request({
    url: '/workflowTask/instance/taskSite',
    method: 'get',
    params,
  });
}
