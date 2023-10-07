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
 * 获取设计页面控件列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getDesignList(params) {
  return axios({
    url: query.DESIGN_COMPONENT_LIST,
    method: 'get',
    params
  })
}

/**
 * 文件上传
 * @param params 文件流
 * @returns {AxiosPromise} 返回数据
 */
export function uploadFile(params) {
  return axios({
    url: query.FILE_UPLOAD,
    method: 'post',
    params,
    contentType: 'file'
  })
}

/**
 * 导出配置
 * @param params
 * @returns {AxiosPromise}
 */
export function download(params) {
  return axios({
    noCheck: true,
    url: query.DO_DOWNLOAD_ELEMENT_CONFIG,
    method: 'post',
    params,
    responseType: 'blob',
    contentType: 'form'
  })
}

/**
 * 导入配置
 * @param params
 * @returns {AxiosPromise}
 */
export function uploadConfig(params) {
  return axios({
    url: query.DO_UP_ELEMENT_CONFIG,
    method: 'post',
    params,
    contentType: 'file'
  })
}

/**
 * 设计界面的控件新增修改
 * @param params
 * @returns {AxiosPromise}
 */
export function updateOrInsertElement(params) {
  return axios({
    url: query.DESIGN_COMPONENT_ADD,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 动态获取数据
 * @param params
 * @returns {AxiosPromise}
 */
export function dynamicGetData(params) {
  return axios({
    url: query.DESIGN_COMPONENT_DATA_BY_TIME,
    method: 'post',
    contentType: 'json',
    params
  })
}
/**
 * 动态获取数据
 * @param params
 * @returns {AxiosPromise}
 */
export function dynamicGetMqttData(params) {
  return axios({
    url: query.DESIGN_COMPONENT_DATA_BY_MQTT,
    method: 'get',
    params
  })
}

/**
 * 删除组件
 * @param params
 * @returns {AxiosPromise}
 */
export function delComponent(params) {
  return axios({
    url: query.DESIGN_COMPONENT_DEL,
    method: 'post',
    contentType: 'json',
    params
  })
}

/**
 * 根据控件id获取该控件的值
 * @param params
 * @returns {AxiosPromise}
 */
export function getInfoById(params) {
  return axios({
    url: query.DESIGN_COMPONENT_DATA,
    method: 'post',
    contentType: 'json',
    params
  })
}

/**
 * 大屏控件新增（拖入控件新增）
 * @param params
 * @returns {*}
 */
export function insertElement(params) {
  return axios({
    url: query.DESIGN_ELEMENT_REAL_ADD,
    method: 'post',
    contentType: 'json',
    params
  })
}

/**
 * 获取数据源列表
 * @param params
 * @returns {*}
 */
export function getTableList(params) {
  return axios({
    url: query.GET_TABLES_LIST,
    method: 'get',
    params
  })
}

/**
 * 不分页获取字段列表
 * @param params
 * @returns {*}
 */
export function getFieldsList(params) {
  return axios({
    url: query.GET_TANLES_FIELDS_LIST,
    method: 'get',
    params
  })
}

/**
 * 获取表明细
 * @param params
 * @returns {*}
 */
export function getObvious(params) {
  return axios({
    url: query.GET_TABLE_FIELDS_OBVIOUS,
    method: 'get',
    params
  })
}

/**
 * 分页获取表字段
 * @param params
 * @returns {*}
 */
export function getFiledsByPage(params) {
  return axios({
    url: query.GET_TABLE_FIELDS_BY_PAGE,
    method: 'get',
    params
  })
}

/**
 * 新增热区
 * @param params
 * @returns {*}
 */
export function doAddHotDesign(params) {
  return axios({
    url: query.ADD_HOT_DESIGN_CANVAS,
    method: 'post',
    contentType: 'json',
    params
  })
}

/**
 * 获取热区详情
 * @param params
 * @returns {*}
 */
export function getHotInfo(params) {
  return axios({
    url: query.GET_HOT_DESIGN_INFO,
    method: 'get',
    params
  })
}

/**
 * 修改热区
 * @param params
 * @returns {*}
 */
export function editHotInfo(params) {
  return axios({
    url: query.EDIT_HOT_DESIGN_INFO,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除热区
 * @param params
 * @returns {*}
 */
export function delHotInfo(params) {
  return axios({
    url: query.DEL_HOT_DESIGN,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取控件上的热区
 * @param params
 * @returns {*}
 */
export function getZoom(params) {
  return axios({
    url: query.GET_DESIGN_INFO_BY_ELEMENT,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 批量修改控件信息
 * @param params
 * @returns {*}
 */
export function batch(params) {
  return axios({
    url: query.BATCH_DESIGN_FOR_LIST,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 分页获取图层列表
 * @param params
 * @returns {*}
 */
export function getZoomByPage(params){
  return axios({
    url: query.GET_ZOOM_LIST_BY_PAGE,
    method: 'get',
    params
  })
}

/**
 * 设计界面发布
 * @param params
 * @returns {AxiosPromise}
 */
export function doPublish(params) {
  return axios({
    url: query.INTERFACE_PUBLISHING,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取真实界面的
 * @param params
 * @returns {AxiosPromise}
 */
export function fetchComList(params) {
  return axios({
    url: query.GET_REALLY_HOME_LIST,
    method: 'get',
    params
  })
}

/**
 * 下载按钮
 * @param params
 * @returns {AxiosPromise}
 */
export function doDownLoad(params) {
  return axios({
    url: query.DO_DOWNLOAD_DATA,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 校验分享出来的页面是否过期
 * @param params
 * @returns {AxiosPromise}
 */
export function overdue(params) {
  return axios({
    url: query.MENU_CHECK_OVERDUE,
    method: 'post',
    params,
    contentType: 'form'
  })
}

/**
 * 通过按钮调用配置好的接口
 * @param params
 * @returns {AxiosPromise}
 */
export function btnPost(params) {
  return axios({
    url: query.DO_BTN_GET_METHOD,
    method: 'post',
    params,
    contentType: 'json'
  })
}
