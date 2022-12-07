/**
 * @name: query
 * @author: DELL
 * @date: 2021/11/27 15:20
 * @description：query
 * @update: 2021/11/27 15:20
 */
import {PREFIX, V } from '@/constants/config';

export default {
  // 通用
  FILE_UPLOAD: `${PREFIX}/v${V}/FileController/uploadFile`, // 文件上传
  FILE_DELETE: `${PREFIX}/v${V}/FileController/deleteFile`, // 文件删除

  // 登录
  LOGIN_DO_LOGIN: `${PREFIX}/v${V}/login`, // 用户登录
  LOGIN_DO_LOGOUT: `${PREFIX}/v${V}/logout`, // 用户登录

  DATA_FILTER_LIST: `${PREFIX}/v${V}/DvDataFiltersController/listDvDataFilters`, // 获取数据过滤器列表
  DATA_FILTER_UPDATE: `${PREFIX}/v${V}/DvDataFiltersController/modifyDvDataFilters`, // 编辑数据过滤器列表
  DATA_FILTER_ADD: `${PREFIX}/v${V}/DvDataFiltersController/insertDvDataFilters`, // 新增数据过滤器列表
  DATA_FILTER_DELETE: `${PREFIX}/v${V}/DvDataFiltersController/deleteDvDataFilters`, // 删除数据过滤器列表

  GET_HOME_LEFT_GROUP_LIST: `${PREFIX}/v${V}/DvScreenGroupController/listDvScreenGroup`, // 大屏分组列表接口
  ADD_HOME_LEFT_GROUP_LIST: `${PREFIX}/v${V}/DvScreenGroupController/insertDvScreenGroup`, // 大屏分组新增接口
  DEL_HOME_LEFT_GROUP_LIST: `${PREFIX}/v${V}/DvScreenGroupController/deleteDvScreenGroup`, // 大屏分组删除接口
  EDIT_HOME_LEFT_GROUP_LIST: `${PREFIX}/v${V}/DvScreenGroupController/modifyDvScreenGroup`, // 大屏分组修改接口
  PROJECT_VIEW_ADD: `${PREFIX}/v${V}/DvScreenController/insertDvScreen`, // 大屏新增
  PROJECT_VIEW_DEL: `${PREFIX}/v${V}/DvScreenController/deleteDvScreen`, // 大屏删除接口
  PROJECT_VIEW_COPY: `${PREFIX}/v${V}/DvScreenController/copyDvScreen`, // 大屏复制接口
  PROJECT_VIEW_GET_BY_GROUP: `${PREFIX}/v${V}/DvScreenController/listDvScreen`, // 大屏列表接口
  PROJECT_VIEW_UPDATE_GROUP: `${PREFIX}/v${V}/DvScreenController/modifyDvScreenSno`, // 大屏分组更新接口
  PROJECT_VIEW_UPDATE: `${PREFIX}/v${V}/DvScreenController/modifyDvScreen`, // 大屏更新接口

  HOME_GET_USER_LIST: `${PREFIX}/v${V}/user/page`, // 获取用户列表

  HOME_DATASOURCE_ADD: `${PREFIX}/v${V}/DvDatasourceController/insertDatasource`, // 数据源新增
  HOME_DATASOURCE_LIST: `${PREFIX}/v${V}/DvDatasourceController/listDvDatasource`, // 数据源列表
  HOME_DATASOURCE_DEL: `${PREFIX}/v${V}/DvDatasourceController/deleteDatasource`, // 数据源删除
  HOME_DATASOURCE_UPDATE: `${PREFIX}/v${V}/DvDatasourceController/modifyDatasource`, // 数据源编辑

  DESIGN_COMPONENT_LIST: `${PREFIX}/v${V}/DvElementController/listDvElement`, // 获取设计界面中控件列表
  DESIGN_COMPONENT_ADD: `${PREFIX}/v${V}/DvElementController/insertDvElement`, // 设计界面中控件列表保存
  DESIGN_COMPONENT_DEL: `${PREFIX}/v${V}/DvElementController/deleteDvElement`, // 设计界面中控件列表删除
  DESIGN_COMPONENT_DATA: `${PREFIX}/v${V}/DvElementController/getDvElementData`, // 根据控件id获取控件数据
  DESIGN_COMPONENT_DATA_BY_TIME: `${PREFIX}/v${V}/DvElementController/getDvElementDynamicData`, // 动态获取数据
  DESIGN_ELEMENT_REAL_ADD: `${PREFIX}/v${V}/DvElementController/insertDvElementRealtime`, // 大屏控件实时新增接口

  GET_TABLES_LIST: `${PREFIX}/v${V}/DvHostPotController/pageTables`, // 获取数据源
  GET_TANLES_FIELDS_LIST: `${PREFIX}/v${V}/DvHostPotController/listColumns`, // 根据数据源获取字段（不分页）
  GET_TABLE_FIELDS_OBVIOUS: `${PREFIX}/v${V}/DvHostPotController/listDetail`, // 获取表明细
  GET_TABLE_FIELDS_BY_PAGE: `${PREFIX}/v${V}/DvHostPotController/pageColumns`, // 获取表字段

  ADD_HOT_DESIGN_CANVAS: `${PREFIX}/v${V}/DvHostPotController/insetHostPot`, // 新增热区
  GET_HOT_DESIGN_INFO: `${PREFIX}/v${V}/DvHostPotController/getDvHostPotById`, // 获取热区详情
  EDIT_HOT_DESIGN_INFO: `${PREFIX}/v${V}/DvHostPotController/modifyHosPot`, // 修改热区详情
  DEL_HOT_DESIGN: `${PREFIX}/v${V}/DvHostPotController/deleteHostPot`, // 删除热区
  GET_DESIGN_INFO_BY_ELEMENT: `${PREFIX}/v${V}/DvHostPotController/listHostPotByElementId`, // 真实界面获取数据
  BATCH_DESIGN_FOR_LIST: `${PREFIX}/v${V}/DvHostPotController/batchModifyHosPot`, // 批量修改
  GET_ZOOM_LIST_BY_PAGE: `${PREFIX}/v${V}/DvHostPotController/pageHostPotByElementId`,// 分页获取热区列表
  INTERFACE_PUBLISHING: `${PREFIX}/v${V}/DvScreenController/publishDvScreen`, // 界面发布
  GET_REALLY_HOME_LIST: `${PREFIX}/v${V}/DvElementController/formalListDvElement`, // 获取控件真实列表
  DO_DOWNLOAD_DATA: `${PREFIX}/v${V}/DvScreenController/export2Excel`, // 导出Excel
  MENU_CHECK_OVERDUE: `${PREFIX}/v${V}/DvScreenController/resolve` // 校验分享出来的页面是否过期
}
