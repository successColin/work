/**
 * @name: home
 * @author: DELL
 * @date: 2021/11/27 15:20
 * @description：home
 * @update: 2021/11/27 15:20
 */
import axios from '@/utils/axios';
import query from '@/constants/query';

/**
 * 获取主页分组列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getHomeGroupList(params) {
  return axios({
    url: query.GET_HOME_LEFT_GROUP_LIST,
    method: 'get',
    params
  })
}

/**
 * 新增主页分组
 * @param params
 * @returns {AxiosPromise}
 */
export function addHomeGroupList(params) {
  return axios({
    url: query.ADD_HOME_LEFT_GROUP_LIST,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除分组
 * @param params
 * @returns {AxiosPromise}
 */
export function delHomeGroup(params) {
  return axios({
    url: query.DEL_HOME_LEFT_GROUP_LIST,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 修改分组名称
 * @param params
 * @returns {AxiosPromise}
 */
export function editHomeGroup(params) {
  return axios({
    url: query.EDIT_HOME_LEFT_GROUP_LIST,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取分组里面的大屏列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getViewByGroup(params) {
  return axios({
    url: query.PROJECT_VIEW_GET_BY_GROUP,
    method: 'get',
    params
  })
}

/**
 * 新增大屏
 * @param params
 * @returns {AxiosPromise}
 */
export function addView(params) {
  return axios({
    url: query.PROJECT_VIEW_ADD,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除大屏
 * @param params
 * @returns {AxiosPromise}
 */
export function delView(params) {
  return axios({
    url: query.PROJECT_VIEW_DEL,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 复制大屏
 * @param params
 * @returns {AxiosPromise}
 */
export function copyView(params) {
  return axios({
    url: query.PROJECT_VIEW_COPY,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 大屏切换分组
 * @param params
 * @returns {AxiosPromise}
 */
export function switchViewGroup(params) {
  return axios({
    url: query.PROJECT_VIEW_UPDATE_GROUP,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 修改大屏
 * @param params
 * @returns {AxiosPromise}
 */
export function updateView(params) {
  return axios({
    url: query.PROJECT_VIEW_UPDATE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取数据源列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getDatasource(params) {
  return axios({
    url: query.HOME_DATASOURCE_LIST,
    method: 'get',
    params
  })
}

/**
 * 新增数据源列表
 * @param params
 * @returns {AxiosPromise}
 */
export function addDatasource(params) {
  return axios({
    url: query.HOME_DATASOURCE_ADD,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除数据源
 * @param params
 * @returns {AxiosPromise}
 */
export function delDatasource(params) {
  return axios({
    url: query.HOME_DATASOURCE_DEL,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 编辑数据源
 * @param params
 * @returns {AxiosPromise}
 */
export function updateDatasource(params) {
  return axios({
    url: query.HOME_DATASOURCE_UPDATE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取数据过滤器接口
 * @param params
 * @returns {AxiosPromise}
 */
export function getDataFilterList(params = {}) {
  return axios({
    url: query.DATA_FILTER_LIST,
    method: 'get',
    params
  })
}

/**
 * 获取mqtt列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getMqttList(params) {
  return axios({
    url: query.DATA_MQTT_LIST,
    method: 'get',
    params
  })
}

/**
 * 新增数据过滤器
 * @param params
 * @returns {AxiosPromise}
 */
export function insertDataFilter(params) {
  return axios({
    url: query.DATA_FILTER_ADD,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 新增mqtt
 * @param params
 * @returns {AxiosPromise}
 */
export function insertDataMqtt(params) {
  return axios({
    url: query.DATA_MQTT_ADD,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 新增数据过滤器
 * @param params
 * @returns {AxiosPromise}
 */
export function updateDataFilter(params) {
  return axios({
    url: query.DATA_FILTER_UPDATE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 新增数据过滤器
 * @param params
 * @returns {AxiosPromise}
 */
export function updateMqtt(params) {
  return axios({
    url: query.DATA_MQTT_UPDATE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除数据过滤器
 * @param params
 * @returns {AxiosPromise}
 */
export function delDataFilter(params) {
  return axios({
    url: query.DATA_FILTER_DELETE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 删除数mqtt
 * @param params
 * @returns {AxiosPromise}
 */
export function delMqtt(params) {
  return axios({
    url: query.DATA_MQTT_DELETE,
    method: 'post',
    params,
    contentType: 'json'
  })
}

/**
 * 获取平台的用户
 * @param params
 * @returns {*}
 */
export function getUserList(params) {
  return axios({
    url: query.HOME_GET_USER_LIST,
    method: 'get',
    params,
    contentType: 'form'
  })
}

