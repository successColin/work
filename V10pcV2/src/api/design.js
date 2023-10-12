/**
 * @name: design
 * @author: DELL
 * @date: 2022/4/15 15:16
 * @description：design
 * @update: 2022/4/15 15:16
 */
import query from './query';
import fetch from './axiosConfig';

// 流程重新发起
// eslint-disable-next-line import/prefer-default-export
export function dynamicGetData(data) {
  return fetch.request({
    url: query.ASYNC_HOME_DATA,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 控件新增
 * @param data
 * @returns {*}
 */
export function insertElement(data) {
  return fetch.request({
    url: query.INSERT_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 删除
 * @param data
 * @returns {*}
 */
export function delComponent(data) {
  return fetch.request({
    url: query.DEL_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 获取控件列表
 * @param params
 * @returns {*}
 */
export function fetchElementList(params) {
  return fetch.request({
    url: query.GET_ELEMENT_ELEMENT_LIST,
    method: 'get',
    params
  });
}

/**
 * 获取控件值
 * @param data
 * @returns {*}
 */
export function fetchElementData(data) {
  return fetch.request({
    url: query.GET_ELEMENT_DATA,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}
/**
 * 保存配置
 * @param data
 * @returns {*}
 */
export function saveElementList(data) {
  return fetch.request({
    url: query.BATCH_UPDATE_ELEMENT_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 实时获取数据
 * @returns {*}
 */
export function getInfoById(data) {
  return fetch.request({
    url: query.GET_ELEMENTT_DATA_BY_REALLY,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 获取主页路由
 * @returns {*}
 */
export function fetchHomeRoute() {
  return fetch.request({
    url: query.GET_HOME_ROUTE
  });
}

/**
 * 实时获取数据
 * @returns {*}
 */
export function getFieldsList(data) {
  return fetch.request({
    url: query.GET_ELEMENTT_DATA_BY_REALLY,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 新增热区
 * @param params
 * @returns {*}
 */
export function doAddHotDesign(data) {
  return fetch.request({
    url: query.ADD_HOT_DESIGN_CANVAS,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}
/**
 * 获取热区详情
 * @param params
 * @returns {*}
 */
export function getHotInfo(params) {
  return fetch.request({
    url: query.GET_HOT_DESIGN_INFO,
    method: 'get',
    params
  });
}
/**
 * 修改热区
 * @param params
 * @returns {*}
 */
export function editHotInfo(data) {
  return fetch.request({
    url: query.EDIT_HOT_DESIGN_INFO,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}
/**
 * 删除热区
 * @param params
 * @returns {*}
 */
export function delHotInfo(data) {
  return fetch.request({
    url: query.DEL_HOT_DESIGN,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}
/**
 * 批量修改控件信息
 * @param params
 * @returns {*}
 */
export function batch(data) {
  return fetch.request({
    url: query.BATCH_DESIGN_FOR_LIST,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}
/**
 * 分页获取图层列表
 * @param params
 * @returns {*}
 */
export function getZoomByPage(params) {
  return fetch.request({
    url: query.GET_ZOOM_LIST_BY_PAGE,
    method: 'get',
    params
  });
}

/**
 * 获取表明细
 * @param params
 * @returns {*}
 */
export function getObvious(params) {
  return fetch.request({
    url: query.GET_TABLE_FIELDS_OBVIOUS,
    method: 'get',
    params
  });
}

/**
 * 获取控件上的热区
 * @param params
 * @returns {*}
 */
export function getZoom(data) {
  return fetch.request({
    url: query.GET_DESIGN_INFO_BY_ELEMENT,
    method: 'post',
    data,
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 * 复制
 * @param params
 * @returns {*}
 */
export function copyElement({ id }) {
  return fetch.request({
    url: `${query.COPY_DESIGN_ELEMENT}?elementId=${id}`,
    method: 'post',
  });
}
