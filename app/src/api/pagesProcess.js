/*
 * @Author: sss
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-25 14:37:25
 * @desc：流程
 */
import FetchData from './axiosConfig';

// 我发起的
export function getIInitiatedList(params) {
  return FetchData.request({
    url: 'workflowTask/launchByme',
    method: 'get',
    params,
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
    url: 'workflowTask/complated',
    method: 'get',
    params,
  });
}

// 抄送给我
export function getCcTomeList(params) {
  return FetchData.request({
    url: 'workflowTask/ccTome',
    method: 'get',
    params,
  });
}

// 获取节点属性
export function getNodeAttr(params) {
  return FetchData.request({
    url: 'workflowNode/getNodeAttr',
    method: 'get',
    params,
  });
}

// 获取审批流程节点
export function getTaskSite(params) {
  return FetchData.request({
    url: 'workflowTask/instance/taskSite',
    method: 'get',
    params,
  });
}

// 获取驳回节点数据
export function getRejectNodes(params) {
  return FetchData.request({
    url: 'workflowTask/rejectNodes',
    method: 'get',
    params,
  });
}

// 驳回
export function flowReject(data) {
  return FetchData.request({
    url: 'workflowTask/reject',
    method: 'post',
    data,
  });
}

// 同意
export function flowAgree(data) {
  return FetchData.request({
    url: 'workflowTask/agree',
    method: 'post',
    data,
  });
}

// 加签
export function endorsement(data) {
  return FetchData.request({
    url: 'workflowTask/endorsement',
    method: 'post',
    data,
  });
}

// 转审
export function referral(data) {
  return FetchData.request({
    url: 'workflowTask/referral',
    method: 'post',
    data,
  });
}
