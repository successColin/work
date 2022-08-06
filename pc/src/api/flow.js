/**
 * @name: flow
 * @author: DELL
 * @date: 2021/9/14 18:46
 * @description：flow
 * @update: 2021/9/14 18:46
 */

import query from './query';
import fetch from './axiosConfig';

// eslint-disable-next-line import/prefer-default-export
export function getFields(params) {
  return fetch.request({
    url: query.GET_TABLE_FIELDS,
    params,
  });
}

/**
 * 获取流程列表
 * @param params
 * @returns {*}
 */
export function getFlowList(params) {
  return fetch.request({
    url: query.GET_FLOW_LIST,
    params,
  });
}

/**
 * 新增流程
 * @param data
 * @returns {*}
 */
export function addFlow(data) {
  return fetch.request({
    url: query.ADD_FLOW,
    data,
    method: 'post',
  });
}

/**
 * 删除流程
 * @param data
 * @returns {*}
 */
export function delFlow(data) {
  return fetch.request({
    url: query.DELETE_FLOW,
    data,
    method: 'post',
  });
}

/**
 * 删除流程
 * @param data
 * @returns {*}
 */
export function getFlowVersion(params) {
  return fetch.request({
    url: query.GET_FLOW_VERSION_LIST,
    params,
  });
}

/**
 * 新增流程版本
 * @param data
 * @returns {*}
 */
export function addFlowVersion(data) {
  return fetch.request({
    url: query.ADD_FLOW_VERSION,
    method: 'post',
    data,
  });
}

/**
 * 删除流程版本
 * @param data
 * @returns {*}
 */
export function delVersion(data) {
  return fetch.request({
    url: query.DELETE_FLOW_VERSION,
    method: 'post',
    data,
  });
}

/**
 * 启用流程版本
 * @param data
 * @returns {*}
 */
export function doUpdateVersion(data) {
  return fetch.request({
    url: query.UPDATE_FLOW_VERSION,
    method: 'post',
    data
  });
}

/**
 * 禁用流程版本
 * @param data
 * @returns {*}
 */
export function doDisabledVersion(data) {
  return fetch.request({
    url: query.DISABLED_FLOW_VERSION,
    method: 'post',
    data
  });
}

/**
 * 新增节点
 * @param data
 * @returns {*}
 */
export function addNode(data) {
  return fetch.request({
    url: query.ADD_VERSION_NODE,
    method: 'post',
    data
  });
}

/**
 * 更改版本流程树
 * @param data
 * @returns {*}
 */
export function updateVersionTree(data) {
  return fetch.request({
    url: query.UPDATE_VERSION_NODE_TREE,
    method: 'post',
    data,
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 删除节点上的树
 * @param data
 */
export function delVersionNodeTree(params) {
  return fetch.request({
    url: query.DEL_VERSION_NODE_IN_TREE,
    method: 'delete',
    params
  });
}

/**
 * 获取节点详情
 * @param params
 * @returns {*}
 */
export function getNodeInfo(params) {
  return fetch.request({
    url: query.GET_FLOW_NODE_INFO,
    params
  });
}

/**
 * 修改节点信息
 * @param data
 * @returns {*}
 */
export function updateNodeInfo(data) {
  return fetch.request({
    url: query.UPDATE_FLOW_NODE_INFO,
    method: 'put',
    data,
    hasArray: true,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 我发起的
 * @param params
 * @returns {*}
 */
export function getIInitiatedList(params) {
  return fetch.request({
    params,
    url: query.GET_I_INITIATED
  });
}

/**
 * 待我处理的任务
 * @param params
 * @returns {*}
 */
export function getMyTodoList(params) {
  return fetch.request({
    params,
    url: query.GET_MY_TODO_LIST
  });
}

/**
 * 已经完成的任务
 * @param params
 * @returns {*}
 */
export function getCompletedTasks(params) {
  return fetch.request({
    params,
    url: query.GET_MY_COMPLETED_TASKS_LIST
  });
}
/**
 * 流程审批填写节点提交
 * @param data
 * @returns {*}
 */
export function submitInfo(data) {
  return fetch.request({
    url: query.FLOW_SUBMIT,
    method: 'post',
    data,
  });
}

/**
 * 流程审批时的时候同意
 * @param data
 * @returns {*}
 */
export function agree(data) {
  return fetch.request({
    url: query.FLOW_AGREE,
    method: 'post',
    data,
  });
}

/**
 * 流程审批时的驳回
 * @param data
 * @returns {*}
 */
export function reject(data) {
  return fetch.request({
    url: query.FLOW_REJECT,
    method: 'post',
    data,
  });
}

/**
 * 编辑节点
 * @param data
 * @returns {*}
 */
export function editNode(data) {
  return fetch.request({
    url: query.FLOW_NODE_EDIT,
    method: 'put',
    data
  });
}

/**
 * 获取任务待办中流程列表
 * @param params
 * @returns {*}
 */
export function getFlowListInTask(params) {
  return fetch.request({
    url: query.GET_TASK_FLOW_LIST,
    method: 'get',
    params
  });
}

/**
 * 获取驳回的驳回节点
 * @param params
 * @returns {*}
 */
export function getRejectNodesArr(params) {
  return fetch.request({
    url: query.GET_TASK_FLOW_REJECTNODES,
    method: 'get',
    params
  });
}

/**
 * 转审
 * @param data
 * @returns {*}
 */
export function doReferral(data) {
  return fetch.request({
    url: query.DO_TASK_FLOW_REFERRAL,
    method: 'post',
    data
  });
}

export function doEndorsement(data) {
  return fetch.request({
    url: query.DO_TASK_FLOW_COUNTERSIGN,
    method: 'post',
    data
  });
}

// 流程重新发起
export function doLaunch(data) {
  return fetch.request({
    url: query.DO_RESET_LAUNCH,
    method: 'post',
    data
  });
}

// 流程撤回
export function revokeFlow(data) {
  return fetch.request({
    url: query.DO_REVOKE_FLOW,
    method: 'post',
    data
  });
}

/**
 * 获取当前节点的之前节点
 * @param params
 * @returns {*}
 */
export function getBeforesNode(params) {
  return fetch.request({
    url: query.GET_BEFORE_FLOW_NODE,
    method: 'get',
    params
  });
}

/**
 * 获取流程分组列表
 * @param params
 * @returns {*}
 */
export function getFlowGroup(params) {
  return fetch.request({
    url: query.GET_FLOW_GROUP_LIST,
    method: 'get',
    params
  });
}

/**
 * 新增流程分组
 * @param data
 * @returns {*}
 */
export function addGroup(data) {
  return fetch.request({
    url: query.ADD_FLOW_GROUP,
    method: 'post',
    data
  });
}

/**
 * 删除分组
 * @param data
 * @returns {*}
 */
export function delGroup(params) {
  return fetch.request({
    url: query.DELETE_FLOW_GROUP,
    method: 'delete',
    params
  });
}

/**
 * 修改流程分组的属性
 * @param data
 * @returns {*}
 */
export function updateGroup(data) {
  return fetch.request({
    url: query.UPDATE_FLOW_GROUP,
    method: 'put',
    data
  });
}

/**
 * 修改分组排序
 * @param data
 * @returns {*}
 */
export function switchGroupSno(data) {
  return fetch.request({
    url: query.SWITCH_FLOW_GROUP,
    method: 'post',
    data
  });
}

/**
 * 修改流程信息
 * @param data
 * @returns {*}
 */
export function editFlow(data) {
  return fetch.request({
    url: query.EDIT_FLOW,
    method: 'post',
    data
  });
}

/**
 * 获取代理接口列表
 * @returns {*}
 */
export function fetchApiList() {
  return fetch.request({
    url: query.GET_API_LIST,
    method: 'get'
  });
}
