import fetch from '../utils/fetch';
import query from '../constants/query';


// 获取消息服务
export function getServe(params) {
  return fetch(query.GET_MESSAGE_SERVER, {
    method: 'post',
    params,
  });
}

// 获取cron
export function getCron(params) {
  return fetch(query.GET_CRON, {
    method: 'post',
    params,
  });
}

// 获取模板列表
export function getMessageTemplateList(params) {
  return fetch(query.GET_SERVER_LIST, {
    method: 'post',
    params,
  });
}

// 获取消息详情
export function getInfo(params) {
  return fetch(query.GET_MESSAGE_DETIALS + params.id, {
    method: 'get',
  });
}

// 校验sql
export function checkSql(params) {
  return fetch(query.CHECK_SQL, {
    method: 'post',
    params,
  });
}

// 新增或者修改消息
export function doMessageTask(params) {
  return fetch(query.MESSAGE_INSERTORUPDATE_API, {
    method: 'post',
    params,
  });
}

// 删除消息
export function deleteMessage(params) {
  return fetch(query.DELETE_MESSAGE_LIST, {
    method: 'delete',
    params,
  });
}

// 获取联系人
export function getReceiver(params) {
  return fetch(query.DO_GET_RECEIVER + params.id, {
    method: 'get',
  });
}

// 新增修改联系人
export function insertOrUpdateReceiver(params) {
  return fetch(query.DO_UPDATE_INSERTT_RECEIVER, {
    method: 'post',
    params,
  });
}
