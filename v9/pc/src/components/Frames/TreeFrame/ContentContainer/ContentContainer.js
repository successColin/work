/*
 * @Author: Fus
 * @Date:   2019-08-27 15:43:12
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-27 15:13:14
 * @Desc: 框架主体内容（左侧树框架）
 */
import FileDownload from '@/components/Frames/FullListFrame/ContentContainer/FileDownload/FileDownload';
import { CMessage, CSpin } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import RelationFileTab from '@/components/common/RelationFileTab/RelationFileTab';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import {
  BTN_ELEMENT_TYPE,
  HIDE_IN_LIST_ELEMENT_TYPE,
  IGNORE_FORM_ITEM,
  NO_SUBMIT_ELEMENT_TYPE,
  NUMBER_COLUMN_TYPE,
  SEARCH_SELECT_TYPE,
  SELECT_ELEMETN_TYPE,
} from '@/constants/element';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import {
  batchDeletePageData,
  batchUpdate,
  doArchiveCycle,
  doArchiveNormal,
  doBatchArchiveCycle,
  doBatchArchiveNormal,
  getPageData,
  getPageSelectOptions,
  getTreeFrameListData,
  httpRequest,
  insertOrUpdateByTriggers,
  insertOrUpdatePageData,
  insertOrUpdateRelationPageData,
} from '@/services/frame';
import { filedRelationInsert } from '@/services/leftListFrame';
import { getRelationFileTree } from '@/services/relationFileTab';
import {
  compoundArithmetic,
  controlAuthority,
  filterHiddenFormData,
  getDefaultConfirmProps,
  getFunctionComDetail,
  getSelectSearchInfoById,
  getTriggerMapFromEle,
  getUserInfo,
  getValueFromCustomVariables,
  getValueFromGlobalVariables,
  getVariableValueByTree,
  isGlobalOrCustomVar,
  jsonParse,
  jumpFileOfCommon,
  matchGlobalFunctionParam,
  matchGlobalVars,
  multiDataComparison,
  parseFormData,
  parseListData,
  prevSetFormData,
  reducerVariableToArray,
  resetDefaultValue,
  returnJumpMenuData,
  unique,
  validMatchMultiTrigger,
  validTriggerMatch,
} from '@/utils/common';
import { Form, Tabs, message } from 'antd';
import classNames from 'classnames';
import qsStringify from 'qs-stringify';
import { Component } from 'react';
import ButtonLine from './ButtonLine/ButtonLine';
import styles from './ContentContainer.less';
import DetailForm from './DetailForm/DetailForm';
import DetailList from './DetailList/DetailList';
import RelationPopup from './RelationPopup/RelationPopup';

const { TabPane } = Tabs;

// 创建url对象
function createObjectURL(object) {
  return window.URL ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

class ContentContainer extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    fromType: '', // 调用类型 （inPopup在弹出面板内）
    prevTabInfo: {}, // 上一个面板的信息(最后在props中取值)
    prevEleObj: {}, // 上一个面板点击的控件信息（最后在props中取值）
    prevSelectedRows: [], // 上个列表面板中选中的数据
  };

  static getDerivedStateFromProps(props, state) {
    // elementMap转为state
    // 原因：弹出第二层面板后发生触发器或修改按钮状态等情况下需要更新elementMap，会造成弹出面板死循环反复弹出
    if (JSON.stringify(props.elementMap) !== '{}' && JSON.stringify(state.elementMap) === '{}') {
      return {
        elementMap: props.elementMap,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      seniorFilter: {}, // 高级筛选
      elementMap: {}, // 控件map
      tabId: null, // 面板id
      listRowData: {}, // 上一个面板的行数据(最后在props中取值)
      formData: {}, // 表单数据
      originFormData: {}, // 原始表单数据（避免触发器影响显示初始状态）
      listDataObj: {}, // 列表数据
      listQueryParams: {
        pageNum: 1,
        pageSize: props.sourcePage,
      }, // 列表请求参数
      listSelectedRows: [], // 列表选择的行数据
      tabDropDownData: {}, // 当前面板下的下拉数据(内容以{表名: [下拉数据]})形式）
      visiblePopup: false, // 弹出面板的显示状态
      triggerPopupEle: {}, // 触发弹出面板的控件信息
      popupTabInfo: {}, // 弹出面板信息
      popupHasFetched: false,
      fileRelationList: {}, // 文件关联信息
      calendarList: [], // 便捷搜索条件
      handleSetCustomSelectList: null, // 自定义选择框弹出列表中选中行后点击确定
      otherParamsInCustomList: null, // 自定义列表中的参数
      loadingStatus: {
        data: false, // 获取数据
      },
      stepList: [], // 进度条数组
      editListDataObj: {}, // 列表可编辑时缓存列表原始数据
      externalParameters: {}, // 外部页面的参数集合
      pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'], // 分页配置

      visibleFileModal: false, // 弹出选择文件
      treeData: [], // 树数据
      treeLoading: false, // 树loading 状态
      expandedKeys: [], // （受控）展开指定的树节点
      treeSelect: [], // 树选中
      relevanceBtnConfig: {},
    };
  }

  componentDidMount() {
    if (this.props.fromType === 'inPopup') {
      const { tabInfo, elementMap, sourcePage } = this.props;
      let refDom = '';
      if (tabInfo.showType === 1) {
        refDom = 'DetailList';
      }
      if (tabInfo.showType === 4) {
        refDom = 'RelationPopup';
      }
      if (refDom) {
        const domHeight = this.refs[refDom].getBoundingClientRect().height;
        const elementList = elementMap[tabInfo.id];
        let btnArr = elementList.filter(
          item => BTN_ELEMENT_TYPE.includes(item.basetype) && item.visiabled,
        );
        let searchArr = elementList.filter(item => item.basetype === 14 && item.visiabled);
        const seniorFilterEle = elementList.find(item => item.basetype === 33 && item.visiabled); // 高级筛选
        let isTrue = false;
        if (btnArr.length || searchArr.length || seniorFilterEle) {
          isTrue = true;
        }
        const realHeight = isTrue ? domHeight - 37 - 33 - 8 - 40 : domHeight - 37 - 8 - 40;
        let pageSize = Math.floor(realHeight / 37);
        const { listQueryParams, pageSizeOptions } = this.state;
        const newPageSizeOptions = [...pageSizeOptions];
        const lastPageSize = tabInfo.calculationOperationBar ? pageSize - 1 : pageSize;
        const newPageSize = sourcePage ? sourcePage : lastPageSize;
        if (!newPageSizeOptions.includes(`${newPageSize}`)) {
          newPageSizeOptions.push(`${newPageSize}`);
        }
        this.setState(
          {
            listQueryParams: {
              ...listQueryParams,
              pageSize: newPageSize,
            },
            pageSizeOptions: newPageSizeOptions,
          },
          () => {
            this.doFetchPageData();
          },
        );
        return;
      }

      this.doFetchPageData();
    }
  }

  // 获取页面的业务数据
  doFetchPageData = () => {
    const {
      tabInfo,
      prevEleObj = {},
      treeNodeData = {},
      prevSelectedRows,
      actionType,
      prevTabInfo,
    } = this.props;
    const { id: nodeId, type: nodeSource } = treeNodeData;
    const { elementMap } = this.state;
    const {
      showType,
      fileRelationTableName,
      fileRelationParam,
      fileRelationColumnName,
      tableGroupName,
    } = tabInfo;
    this.fetchTabDropDownData('normal', () => {
      const listShowType = [1, 4, 5];
      if (
        prevEleObj.basetype === 4 ||
        showType === 6 ||
        prevSelectedRows.length > 1 ||
        actionType === 'addGroup' ||
        actionType === 'addChild' ||
        (prevEleObj.basetype === 24 &&
          !prevSelectedRows.length &&
          listShowType.includes(prevTabInfo.showType))
      ) {
        const elementList = elementMap[tabInfo.id];
        const formData = prevSetFormData({
          elementList: elementList,
          getGlobalVarValues: this.getGlobalVarValues,
        });
        this.getParseFormData(formData, elementList).then(data => {
          this.setState(
            {
              formData: data,
              originFormData: data, // 保留一份原始数据是为了触发器修改值后若不符合触发条件，需要回显原始值
            },
            () => {
              this.fetchTabDropDownData('cascade'); // 获取级联下拉数据
              this.checkTriggerResult();
            },
          );
        });
        return;
      }

      // 列表
      if (listShowType.includes(showType)) {
        this.fetchListData({});
        console.log('列表');
        return;
      } else if (showType === 2) {
        // 表单
        this.fetchFormData();
      } else if (showType === 7) {
        // 关联资料面板
        const relationId = this.getGlobalVarValues({
          varName: fileRelationParam,
        });
        this.relationFileTabRef &&
          this.relationFileTabRef.fetchRelationFiles({
            relationId,
            relationTableName: fileRelationTableName,
            relationColumnName: fileRelationColumnName,
            tableGroupName: tableGroupName,
          });
      } else if (showType === 11) {
        this.getExternalParameters();
      }
    });
  };
  // 获取外部页面的参数
  getExternalParameters = () => {
    const { elementMap } = this.state;
    const {
      tabInfo: { id },
    } = this.props;
    const elementList = elementMap[id] || [];
    const paramElement = elementList.filter(item => !!item.parameter) || [];
    let externalParameters = {};
    paramElement.forEach(item => {
      const { defaultValue, parameter } = item;
      externalParameters[parameter] =
        this.getGlobalVarValues({
          varName: defaultValue,
        }) || defaultValue;
    });
    this.setState({ externalParameters });
  };
  // 获取表单数据
  fetchFormData = () => {
    const { elementMap = {} } = this.state;
    const {
      tabInfo = {},
      pageFrameData,
      treeNodeData,
      advancedQueryMap,
      prevTabInfo,
      prevTabData,
      fromType,
    } = this.props;
    const tabId = tabInfo.id;
    const tabEleList = elementMap[tabId] || []; // 面板内所有的控件信息
    const elementList = tabEleList
      .filter(item => !BTN_ELEMENT_TYPE.includes(item.basetype))
      .map(item => ({
        elementId: item.id,
        name: item.relationColumnName,
        baseType: item.basetype,
        mainColumnName: item.mainColumnName,
        mainTableName: item.mainTableName,
        elementMultiRelation: item.elementMultiRelation,
        relationColumnType: item.relationColumnType,
        elementFormat: item.elementFormat,
      }));
    if (!elementList || !elementList.length) return;
    let id = treeNodeData.id;
    // 弹出面板中的数据需要根据前一个面板中的当前行数据获取
    if (fromType === 'inPopup' && JSON.stringify(prevTabData) !== '{}') {
      // 面板过滤条件
      const filterIdData = advancedQueryMap[tabId].find(item => item.asqlColumnName === 'id') || {};
      const { asqlValueType, asqlValue } = filterIdData;
      // 值类型为【值】，直接取值
      if (asqlValueType === 1) {
        id = asqlValue;
      } else if (asqlValueType === 2) {
        // 值类型为【变量】，取上个面板传入的数据中对应的变量值
        // const ele = elementMap[prevTabInfo.id].find(item => item.parameter === asqlValue) || {};
        // const { id: eleId } = ele;
        // const eleBusData = prevTabData[eleId] || {};
        // id = +eleBusData.id || '';
        id = this.getGlobalVarValues({ varName: asqlValue });
      } else {
        this.checkParseFormData({}, tabEleList);
        return;
      }
    }
    const params = {
      tabSource: tabInfo.relationTableName,
      id,
      elementList,
      // calendarList,
    };
    this.setLoadingStatus('data', true);
    getPageData(params).then(
      res => {
        this.checkParseFormData(res, tabEleList);
      },
      err => this.setLoadingStatus('data', false),
    );
  };

  checkParseFormData = (res, tabEleList) => {
    this.getParseFormData(res, tabEleList).then(formData => {
      this.setState(
        {
          formData,
          originFormData: formData, // 保留一份原始数据是为了触发器修改值后若不符合触发条件，需要回显原始值
        },
        () => {
          this.fetchTabDropDownData('cascade'); // 获取级联下拉数据
          this.checkTriggerResult();
          const { tabInfo, elementMap, tabList, advancedQueryMap } = this.props;
          const currentElementList = elementMap[tabInfo.id] || [];
          let SubPanel = currentElementList.find(item => item.basetype === 42) || {};
          if (JSON.stringify(SubPanel) === '{}' && !SubPanel.relationTabId) return;
          const { relationTabId } = SubPanel;
          let SubPanelTabInfo = tabList.find(item => item.id === relationTabId) || {};
          if (JSON.stringify(SubPanelTabInfo) === '{}') return;
          if (SubPanelTabInfo.showType !== 9) return;
          this.fetchSubPanelListData(SubPanelTabInfo);
        },
      );
      this.setLoadingStatus('data', false);
    });
  };

  async getParseFormData(res, tabEleList) {
    const formData = await parseFormData({
      elementList: tabEleList,
      formData: res,
      getGlobalVarValues: this.getGlobalVarValues,
    });
    return formData;
  }

  /**
   * 获取列表数据
   * @param {array} searchQueryList 便捷搜索条件
   * @param {object} targetTabInfo  目标面板信息（如，数据选择框的弹出列表面板、常规列表面板）
   */
  fetchListData = ({ searchQueryList = [] }) => {
    const {
      tabInfo,
      treeNodeData,
      advancedQueryMap,
      userInfo,
      fromType,
      prevTabData,
      prevTabInfo,
    } = this.props;
    const { elementMap, listQueryParams, seniorFilter } = this.state;
    const { pageNum, pageSize } = listQueryParams;
    const { id: tabId, relationTableName: tabSource, showType, relationColumn } = tabInfo;
    const elementList = elementMap[tabId].map(item => {
      const {
        relationColumnName: name,
        basetype: baseType,
        mainColumnName,
        mainTableName,
        elementMultiRelation,
        id: elementId,
        relationColumnType,
        elementFormat,
      } = item;
      return {
        elementId,
        name,
        baseType,
        mainColumnName,
        mainTableName,
        elementMultiRelation,
        relationColumnType,
        elementFormat,
      };
    });
    let seniorFilterMap = { ...seniorFilter };
    // 关联面板且有关联字段时传入
    if (showType === 4 && relationColumn) {
      const treeNodeId = treeNodeData.id;
      seniorFilterMap = {
        ...seniorFilterMap,
        [relationColumn]: {
          static_connector: 3,
          static_type: 2,
          static_value: treeNodeId,
        },
      };
    }
    const queryList = advancedQueryMap[tabId] || [];
    const { id: nodeId } = treeNodeData;
    const globalMap = {};
    const globalQueryMap = {};
    // 将过滤条件中的全局变量赋值
    queryList.forEach(item => {
      const { asqlValueType, asqlValue, queryType, basetype, apiSql } = item;
      // 面板过滤条件为组合条件方式
      if (queryType === 1 && basetype === 1) {
        // 值类型为【变量】时，需要将变量对应的值传给后台
        if (asqlValueType === 2 || isGlobalOrCustomVar(asqlValue)) {
          globalMap[item.asqlValue] = this.getGlobalVarValues({ varName: asqlValue });
        }
      } else if (queryType === 2 && basetype === 2) {
        // SQL过滤条件方式
        const varArr = matchGlobalVars(apiSql);
        varArr.forEach(varName => {
          globalQueryMap[varName] = this.getGlobalVarValues({
            varName,
            globalMapType: 'globalQueryMap',
          });
        });
      }
    });
    const params = {
      elementList,
      tabId,
      tabSource,
      pageNum,
      pageSize,
      calendarList: searchQueryList,
      globalMap,
      globalQueryMap,
      seniorFilterMap,
    };
    if (!elementList.length) return;
    this.setLoadingStatus('data', true);
    getTreeFrameListData(params).then(
      res => {
        // let data = JSON.parse(JSON.stringify(res));
        const listDataObj = parseListData({
          elementList: elementMap[tabId],
          listDataObj: res,
        });
        this.setState({
          listDataObj: this.setBtnDataToCurrentList(listDataObj),
          calendarList: searchQueryList,
        });
        this.setLoadingStatus('data', false);
      },
      err => this.setLoadingStatus('data', false),
    );
  };

  /**
   * 根据面板的类型将对应的按钮的值转换进数组
   * @param tabInfo
   * @param elementMap
   * @param triggerMap
   * @param dataSource
   * @returns {[]}
   */
  setBtnDataToCurrentList = dataSource => {
    const { tabInfo, triggerMap } = this.props;
    const { elementMap } = this.state;
    if (tabInfo.canLineEdit !== 1) return dataSource;
    let arrList = [];
    let elementList = elementMap[tabInfo.id] || [];
    // 先找到3种按钮控件
    let multiJumpBtn = elementList.find(item => item.basetype === 43); // 多菜单跳转
    let multiTabBtn = elementList.find(item => item.basetype === 44); // 多面板
    let saveBtn = elementList.find(item => item.basetype === 7); // 保存按钮
    // 将triggerMap中的触发器合并成一个数组
    let triggerMapList = [];
    Object.keys(triggerMap).forEach(item => {
      triggerMapList = triggerMapList.concat(triggerMap[item]);
    });
    const getTriggerList = elementid =>
      triggerMapList.filter(
        item =>
          item.relationElementId === elementid && item.triggerType === 1 && item.basetype === 4,
      );
    // 找到每种按钮中对应的加载触发器
    let multiJumpArr = (multiJumpBtn && getTriggerList(multiJumpBtn.id)) || [];
    let multiTabArr = (multiTabBtn && getTriggerList(multiTabBtn.id)) || [];
    let saveArr = (saveBtn && getTriggerList(saveBtn.id)) || [];
    const { datalist = [], ...rest } = dataSource;
    datalist.forEach(item => {
      let newItem = {
        ...item,
      };
      if (multiJumpBtn)
        newItem[multiJumpBtn.id] = this.judgeValueIsTrue(
          multiJumpBtn,
          multiJumpArr[multiJumpArr.length - 1],
          item,
        );
      if (multiTabBtn)
        newItem[multiTabBtn.id] = this.judgeValueIsTrue(
          multiTabBtn,
          multiTabArr[multiTabArr.length - 1],
          item,
        );
      if (saveBtn)
        newItem[saveBtn.id] = this.judgeValueIsTrue(saveBtn, saveArr[saveArr.length - 1], item);
      arrList.push(newItem);
    });
    let newDataSource = {
      datalist: arrList,
      ...rest,
    };
    return newDataSource;
  };
  // 判断按钮的值是否正确
  judgeValueIsTrue = (btn, triggerObj, record) => {
    if (!btn) return false; // 如果按钮不存在，直接返回false
    if (btn && !triggerObj) return !!btn.visiabled; // 如果按钮存在，但是没有对应的触发器，则取值按钮的属性
    const getValueFromCurrentTableColumn = varName => {
      if (!varName) return;
      const { tabInfo, userInfo, treeNodeData } = this.props;
      const { elementMap } = this.state;
      const elementList = elementMap[tabInfo.id];
      if (
        getValueFromGlobalVariables({
          globalVar: varName,
          treeNodeData,
          userInfo,
        })
      ) {
        return getValueFromGlobalVariables({
          globalVar: varName,
          treeNodeData,
          userInfo,
        });
      }
      let currentEle = elementList && elementList.find(item => item.parameter === varName);
      if (!currentEle) return;
      const { basetype, valueFieldType } = currentEle;
      if (basetype === 17 && valueFieldType === 2) {
        return record[currentEle.id].name;
      }
      return record[currentEle.id].id;
    };
    const { endTriggerNum, elementId } = triggerObj;
    let elementIdValue = record[elementId].id;
    return validTriggerMatch(
      triggerObj,
      elementIdValue,
      endTriggerNum,
      getValueFromCurrentTableColumn,
    );
  };
  /**
   * 获取子面板列表数据
   * @param {array} searchQueryList 便捷搜索条件
   * @param {object} targetTabInfo  目标面板信息（如，数据选择框的弹出列表面板、常规列表面板）
   */
  fetchSubPanelListData = SubPanelTabInfo => {
    const {
      elementMap,
      treeNodeData,
      advancedQueryMap,
      userInfo,
      fromType,
      prevTabData,
      prevTabInfo,
    } = this.props;
    const { id: tabId, relationTableName: tabSource, showType, relationColumn } = SubPanelTabInfo;
    const elementList = elementMap[tabId].map(item => {
      const {
        relationColumnName: name,
        basetype: baseType,
        mainColumnName,
        mainTableName,
        elementMultiRelation,
        id: elementId,
        relationColumnType,
        elementFormat,
      } = item;
      return {
        elementId,
        name,
        baseType,
        mainColumnName,
        mainTableName,
        elementMultiRelation,
        relationColumnType,
        elementFormat,
      };
    });
    let seniorFilterMap = {};
    // 关联面板且有关联字段时传入
    if (showType === 4 && relationColumn) {
      const treeNodeId = treeNodeData.id;
      seniorFilterMap = {
        [relationColumn]: {
          static_connector: 3,
          static_type: 2,
          static_value: treeNodeId,
        },
      };
    }
    const queryList = advancedQueryMap[tabId] || [];
    const { id: nodeId } = treeNodeData;
    const globalMap = {};
    const globalQueryMap = {};
    // 将过滤条件中的全局变量赋值
    queryList.forEach(item => {
      const { asqlValueType, asqlValue, queryType, basetype, apiSql } = item;
      // 面板过滤条件为组合条件方式
      if (queryType === 1 && basetype === 1) {
        // 值类型为【变量】时，需要将变量对应的值传给后台
        if (asqlValueType === 2 || isGlobalOrCustomVar(asqlValue)) {
          globalMap[item.asqlValue] = this.getGlobalVarValues({ varName: asqlValue });
        }
      } else if (queryType === 2 && basetype === 2) {
        // SQL过滤条件方式
        const varArr = matchGlobalVars(apiSql);
        varArr.forEach(varName => {
          globalQueryMap[varName] = this.getGlobalVarValues({
            varName,
            globalMapType: 'globalQueryMap',
          });
        });
      }
    });
    const params = {
      elementList,
      tabId,
      tabSource,
      pageNum: 1,
      pageSize: 9999,
      calendarList: [],
      globalMap,
      globalQueryMap,
      seniorFilterMap,
    };
    if (!elementList.length) return;
    this.setLoadingStatus('data', true);
    getTreeFrameListData(params).then(
      res => {
        const listDataObj = parseListData({
          elementList: elementMap[tabId],
          listDataObj: res,
        });
        this.setState({ stepList: listDataObj });
        this.setLoadingStatus('data', false);
      },
      err => this.setLoadingStatus('data', false),
    );
  };
  /**
   * 获取面板下的下拉数据
   *  @param {string} type 下拉类型 （normal-普通下拉，cascade-级联下拉）
   */
  fetchTabDropDownData = (type = 'normal', callback) => {
    const { elementMap, tabDropDownData } = this.state;
    const { tabInfo = {}, filterMap } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    const typeid = type === 'normal' ? 1 : 2;
    // 下拉框控件列表
    const dropDownList = elementList
      .filter(
        item =>
          (SELECT_ELEMETN_TYPE.includes(item.basetype) &&
            !!item.mainTableName &&
            item.elementFormat === typeid) ||
          item.basetype === 15,
      )
      .map(item => ({
        dataSource: item.mainTableName,
        elementId: item.id,
        columnName: item.mainColumnName,
      }));
    if (!dropDownList.length) {
      callback && callback();
      return;
    }
    const globalMap = {};
    Object.keys(filterMap).map(key => {
      filterMap[key].forEach(item => {
        const { asqlValue, asqlValueType } = item;
        if (asqlValueType === 2 || isGlobalOrCustomVar(asqlValue)) {
          globalMap[item.asqlValue] = this.getGlobalVarValues({ varName: asqlValue });
        }
      });
    });
    getPageSelectOptions({ dropDownList, globalMap }).then(res => {
      this.setState({
        tabDropDownData: {
          ...tabDropDownData,
          ...res,
        },
      });
      callback && callback();
    });
  };
  // 获取表单的默认值
  getDefaultFormData = () => {
    const { tabInfo } = this.props;
    const { elementMap } = this.state;
    const eleList = elementMap[tabInfo.id] || [];
    const result = {};
    eleList.forEach(eleObj => {
      const { defaultValue, id: eleId } = eleObj;
      if (isGlobalOrCustomVar(defaultValue)) {
        const value = this.getGlobalVarValues({ varName: defaultValue, eleObj });
        result[eleId] = {
          id: value,
          name: value,
        };
      } else {
        result[eleId] = {
          id: defaultValue,
          name: defaultValue,
        };
      }
    });
    return result;
  };
  // 生成全局变量的值
  /**
   * @param {string} varName 变量名
   * @param {object} eleObj 控件对象
   * @param {object} listActiveRowData 列表的当前行数据
   */
  getGlobalVarValues = ({
    varName,
    eleObj = {},
    listActiveRowData = {},
    isRealValue = true,
    globalMapType = 'globalMap',
    isReturnObj = false, // 返回值是否包含id/name的对象
    formData = this.state.formData,
  }) => {
    if (!varName) return;
    const { langLib } = this.context;
    const { elementMap, originFormData } = this.state;
    const { userInfo, treeNodeData, fromType, prevTabData, prevTabInfo, tabInfo } = this.props;
    if (varName.indexOf('@@GetUserProperties') > -1) {
      return getUserInfo(varName, userInfo, isReturnObj);
    }
    // 加减乘除四则混合运算
    if (varName.indexOf('@@CompoundArithmetic') > -1) {
      let value = compoundArithmetic({
        asqValue: varName,
        getValueFromCurrentTabData: this.getGlobalVarValues,
        CMessage,
        otherParams: { varName, type: 'tree' },
      });
      return isReturnObj ? { id: value, name: value } : value;
    }
    // @@BusinessID 取左侧树的主业务数据（因为左侧树无法配置）
    // 当前时间、当前用户
    const globalVar = getValueFromGlobalVariables({
      globalVar: varName,
      userInfo,
      treeNodeData,
      eleObj,
      isRealValue,
      globalMapType,
      curFormData: formData,
      curEleList: elementMap[tabInfo.id],
      originData: originFormData,
      isReturnObj,
    });
    // 或用户自定义的变量
    const customVar = getValueFromCustomVariables({
      prevListRowData: prevTabData, // @TODO: common中传参待修改
      prevElementList: elementMap[prevTabInfo.id],
      curElementList: elementMap[tabInfo.id],
      curTabData: tabInfo.showType === 2 ? formData : listActiveRowData,
      varName,
      isRealValue,
      globalMapType,
      langLib,
      isReturnObj,
    });
    if (isReturnObj) {
      return globalVar.id ? globalVar : customVar;
    }
    const isOnlyValue = globalMapType === 'globalMap';
    if (isOnlyValue) {
      return globalVar || customVar || '';
    }

    return globalVar.value ? globalVar : customVar;
  };
  // 单个控件的加载触发器逻辑
  singleEleCheckTrigger = ({
    eleObj, // 控件对象
    newElementList, // 更新后的控件列表
    infosObj, // 请求过getInfo接口的数据
    newFormData, // 更新后的表单数据
    checkTriggerBaseTypes = [4, 3], // 需要检测的触发器类型
  }) => {
    const { triggerMap } = this.props;
    const {
      id: eleId,
      triggerSign,
      basetype: originEleBaseType,
      mainTableName: originEleMainTableName,
    } = eleObj;
    // 该元素有配置触发器
    const triggerList = triggerMap[eleId] || [];
    if (!triggerList.length) return;
    // 最外层遍历只走加载触发器，触发器其他控件中则需要匹配赋值和加载
    const triggers = triggerList.filter(
      item => checkTriggerBaseTypes.includes(item.basetype) && item.triggerType === 1,
    );
    triggers.forEach(trigger => {
      // 【加载】的前端触发器事件类型
      const {
        endTriggerNum,
        relationElementId,
        relationElementRequisite,
        relationElementReadonly,
        relationElementVisible,
        relationElementValue,
      } = trigger;
      const matchEleIndex = newElementList.findIndex(item => item.id === relationElementId);
      const targetEle = newElementList[matchEleIndex];
      if (matchEleIndex === -1) return; // 无目标控件
      const {
        basetype: targetEleType,
        id: targetEleId,
        mainColumnName: targetEleMainColumnName,
      } = targetEle;
      let actualVal = newFormData[eleId] ? newFormData[eleId].id : '';
      let matchVal = endTriggerNum;
      if (isGlobalOrCustomVar(actualVal)) {
        // 全局变量
        actualVal = this.getGlobalVarValues({ varName: actualVal });
      }
      if (isGlobalOrCustomVar(endTriggerNum)) {
        matchVal = this.getGlobalVarValues({ varName: endTriggerNum });
      }
      const validMatch = validTriggerMatch(trigger, actualVal, matchVal, this.getGlobalVarValues);
      if (!validMatch) return; // 不满足匹配条件
      let valueObj = { id: relationElementValue, name: relationElementValue };
      if (!relationElementValue) {
        // 如果relationElementValue为空，则值不变
        valueObj = newFormData[targetEleId];
      }
      // 保留旧的控件用旧的触发器逻辑
      if (!triggerSign) {
        const beforeData = newFormData[targetEleId] || {};
        if (beforeData.id) {
          // 若该控件本身有值，则取原值
          valueObj = beforeData;
        }
      }
      // // 有隐藏项的控件需要id和name不同
      // if (HIDDEN_ELEMENT_TYPE.includes(targetEleType)) {
      //   valueObj.name = '';
      // }
      // 值为变量
      if (isGlobalOrCustomVar(relationElementValue)) {
        valueObj = this.getGlobalVarValues({
          varName: relationElementValue,
          eleObj: targetEle,
          isReturnObj: true,
          formData: newFormData,
        });
      }
      newFormData[targetEle.id] = valueObj;
      this.setState({ formData: newFormData });

      // 获取详情接口（或取已有数据）
      const getInfoById = (infoEleObj, infoValueObj, paramName) => {
        const { mainTableName, basetype } = infoEleObj;
        // const detailKey = `${mainTableName}_${infoValueObj.id}`;
        // if (infosObj[detailKey]) {
        //   newFormData[infoEleObj.id] = infosObj[detailKey].valueObj;
        //   newFormData[targetEle.id] = infosObj[detailKey][targetEleMainColumnName];
        //   this.setState({ formData: newFormData });
        // } else {
        const that = this;
        getSelectSearchInfoById(infoEleObj, infoValueObj.id, function(res) {
          const { basetype: infoBaseType } = infoEleObj;
          let targetVlue =
            infoBaseType === 45
              ? res.detailInfo.map(item => item[paramName]).join(',')
              : res.detailInfo[paramName];
          newFormData[infoEleObj.id] = res.valueObj;
          newFormData[targetEle.id] = {
            id:
              infoBaseType === 45
                ? res.detailInfo.map(item => item.id).join(',')
                : res.detailInfo.id,
            name: targetVlue,
          };
          // 如果源控件是多选，被触发控件是数据选择框，需要对数据选择框的数据进行去重
          if ([3, 12, 25].includes(targetEle.basetype) && infoBaseType === 45) {
            const uniqueArr = unique(res.detailInfo, paramName) || [];
            const lastArr = uniqueArr.filter(item => item[paramName]); // 去空值
            if (lastArr.length !== 1) {
              delete newFormData[targetEle.id];
            } else {
              targetVlue = lastArr[0][paramName];
            }
          }
          // 目标控件为选择框，则需要继续校验该控件的触发器并且值是
          if ([45].includes(targetEle.basetype) && targetVlue) {
            getSelectSearchInfoById(targetEle, targetVlue, function(res) {
              newFormData[targetEle.id] = res.valueObj;
              that.setState({ formData: newFormData }, () => {
                that.singleEleCheckTrigger({
                  eleObj: targetEle,
                  newElementList,
                  infosObj,
                  newFormData,
                });
              });
            });
            return;
          }
          if (
            SEARCH_SELECT_TYPE.concat([17]).includes(targetEle.basetype) &&
            !isNaN(Number(targetVlue))
          ) {
            getSelectSearchInfoById(targetEle, targetVlue, function(res) {
              newFormData[targetEle.id] = res.valueObj;
              that.setState({ formData: newFormData }, () => {
                targetEle.basetype !== 17 &&
                  that.singleEleCheckTrigger({
                    eleObj: targetEle,
                    newElementList,
                    infosObj,
                    newFormData,
                  });
              });
            });
          } else {
            that.setState({ formData: newFormData });
          }
        });
        // }
      };
      // 源控件为选择框
      if (SEARCH_SELECT_TYPE.includes(originEleBaseType) && !!relationElementValue) {
        // 全局函数入参
        const paramName = matchGlobalFunctionParam(relationElementValue);
        // 取当前数据选择框中选中的详情数据对应参数值
        if (paramName) {
          getInfoById(eleObj, newFormData[eleId], paramName);
        }
      } else if (
        SEARCH_SELECT_TYPE.includes(targetEleType) &&
        newFormData[targetEleId] &&
        !!relationElementValue
      ) {
        // 目标控件为选择框
        getInfoById(targetEle, newFormData[targetEleId], targetEleMainColumnName);
      } else if (
        targetEle.basetype === 17 &&
        targetEle.valueFieldType !== 2 &&
        !!relationElementValue
      ) {
        getInfoById(targetEle, newFormData[targetEleId], targetEleMainColumnName);
      }
      newElementList.splice(matchEleIndex, 1, {
        ...newElementList[matchEleIndex],
        requisite: relationElementRequisite,
        readonly: relationElementReadonly,
        visiabled: relationElementVisible,
      });
    });
  };
  // 再进进入面板时，验证触发器是否匹配
  checkTriggerResult = () => {
    const { tabInfo, tabData, triggerMap } = this.props;
    const { formData, elementMap } = this.state;
    const elementList = elementMap[tabInfo.id];
    const newElementList = [...elementList];
    const newFormData = { ...formData };
    if (JSON.stringify(formData) === '{}') return;
    const infosObj = {}; // 数据选择框走过getById的实体表+id数据的详情
    elementList.forEach(eleObj => {
      this.singleEleCheckTrigger({
        eleObj,
        newElementList,
        infosObj,
        newFormData,
        checkTriggerBaseTypes: [4],
      });
    });
    this.setState({
      elementMap: {
        ...elementMap,
        [tabInfo.id]: newElementList,
      },
    });
  };
  // 点击之前的判断
  checkBeforeHandleClick = (btn, record) => {
    const { executeCondition, defaultConditions } = btn;
    const { tabInfo } = this.props;
    const { showType } = tabInfo;
    const { langLib } = this.context;
    const makeTriggerObj = str => {
      // 将执行前的条件处理成对应的数据
      if (!str) return;
      let executeConditionJson = JSON.parse(executeCondition) || {};
      const { formula, fortype = '', ...rest } = executeConditionJson;
      let triggerObj = {
        endTriggerNum: formula,
        ...rest,
      };
      let methodType = fortype.toLowerCase();
      if (methodType === 'or') {
        triggerObj.methodType = 2;
      }
      if (methodType === 'and') {
        triggerObj.methodType = 1;
      }
      return triggerObj;
    };
    if (showType === 2) {
      if (!executeCondition) {
        return true;
      } else {
        if (!executeCondition) return true;
        let triggerObj = makeTriggerObj(executeCondition);
        let isTrue = validMatchMultiTrigger(triggerObj, this.getGlobalVarValues);
        if (!isTrue) {
          const { isFalse } = triggerObj;
          CMessage(isFalse, 'error');
          return false;
        } else {
          return true;
        }
      }
    } else {
      // 列表上的判断
      const { listSelectedRows = [], elementMap } = this.state;
      const { canLineEdit } = tabInfo;
      const { basetype } = btn;
      let ListArr =
        canLineEdit === 1 && [7, 43, 44].includes(basetype) ? [record] : listSelectedRows;
      let isDefaultTrue = false,
        isExecuteConditionTrue = false;
      if (!defaultConditions) {
        // 没有默认条件时返回true
        isDefaultTrue = true;
      } else if (defaultConditions === 1 && ListArr.length === 1) {
        // defaultConditions=1且只选择一条数据了返回true
        isDefaultTrue = true;
      } else if (defaultConditions === 1 && (!ListArr.length || ListArr.length !== 1)) {
        isDefaultTrue = false;
        CMessage(langLib['message.error.onlyOne'], 'error');
        return;
      } else if (defaultConditions === 2 && ListArr.length) {
        // defaultConditions=2且只选择2条及2条以上数据了返回true
        isDefaultTrue = true;
      } else if (defaultConditions === 2 && !ListArr.length) {
        CMessage(langLib['message.pease.choose.more'], 'error');
        isDefaultTrue = false;
        return;
      }
      if (!executeCondition) {
        isExecuteConditionTrue = true;
      } else {
        if (!ListArr.length) {
          isExecuteConditionTrue = false;
          CMessage(langLib['message.please.choose'], 'error');
        } else {
          let newExecuteCondition = makeTriggerObj(executeCondition);
          const { isFalse } = newExecuteCondition;
          // 首先将提示标语换成正确的
          let str = [],
            flagArr = [];
          const errMsg = ({ msg, record, elementList, recordIndex }) => {
            // 修改错误信息
            const varArr = matchGlobalVars(msg);
            let newStr = msg;
            if (varArr.length) {
              varArr.forEach(item => {
                let currentElement = elementList.find(ele => ele.parameter === item);
                if (currentElement) {
                  newStr = newStr.replace(`{${item}}`, `${currentElement.displayName}`);
                }
              });
            } else {
              newStr = newStr;
            }
            return newStr;
          };
          let triggerObj = makeTriggerObj(executeCondition);
          const { tabInfo, userInfo, activeTreeNode, tabList } = this.props;
          ListArr.forEach((item, index) => {
            const { elementMap } = this.state;
            const getValueFromCurrentTableColumn = varName => {
              if (typeof varName === 'object') {
                varName = varName.varName;
              }
              if (!varName) return;

              const elementList = elementMap[tabInfo.id];
              const value = this.getGlobalVarValues({
                varName,
              });
              if (value) return value;

              let currentEle = elementList && elementList.find(item => item.parameter === varName);
              if (!currentEle) return;
              const { basetype, valueFieldType } = currentEle;
              if (basetype === 17 && valueFieldType === 2) {
                return item[currentEle.id].name;
              }
              return item[currentEle.id].id;
            };
            let isTrue = validMatchMultiTrigger(triggerObj, getValueFromCurrentTableColumn);
            flagArr.push(isTrue);
          });
          let isTrueArr = flagArr.filter(item => !!item);

          isExecuteConditionTrue = isTrueArr.length === ListArr.length ? true : false;

          if (!isExecuteConditionTrue) {
            const errMeg = errMsg({
              msg: isFalse,
              elementList: elementMap[tabInfo.id],
            });
            message.error(errMeg);
            return;
          }
        }
      }
      return isDefaultTrue && isExecuteConditionTrue;
    }
  };
  // 点击按钮
  handleClickBtn = (btn, ...rest) => {
    if (!this.checkBeforeHandleClick(btn)) return;
    const { basetype } = btn;
    const { tabInfo, tabData, triggerMap } = this.props;
    const { formData, elementMap } = this.state;
    const elementList = elementMap[tabInfo.id];
    const newElementList = [...elementList];
    const newFormData = { ...formData };
    this.singleEleCheckTrigger({
      eleObj: btn, // 控件对象
      newElementList, // 更新后的控件列表
      infosObj: {}, // 请求过getInfo接口的数据
      newFormData, // 更新后的表单数据
      checkTriggerBaseTypes: [1], // 只匹配【点击】触发器
    });
    const doClickBtn = () => {
      this.setState({
        elementMap: {
          ...elementMap,
          [tabInfo.id]: newElementList,
        },
      });
      switch (basetype) {
        case 7:
          this.handleSave(btn, 'normal');
          break; // 保存按钮
        case 6:
          this.handleDel(btn, rest);
          break; // 删除按钮
        case 4:
          this.handleAdd(btn);
          break; // 新增按钮
        case 5:
          this.handleEdit(btn);
          break; // 编辑按钮
        case 18:
          this.handleAdd(btn);
          break; // 关联-新增按钮
        case 24:
          this.handleNormalBtn(btn);
          break; // 普通按钮
        case 26:
          this.handleArchive(btn);
          break; // 归档按钮
        case 28:
          this.handleArchive(btn);
          break; // 普通归档按钮
        case 29:
          this.handleSave(btn, 'batch');
          break; // 批量保存
        case 30:
          this.handleExport(btn);
          break; // 导出按钮
        case 34:
          this.handleArchive(btn);
          break; // 批量普通归档按钮
        case 35:
          this.handleArchive(btn);
          break; // 批量归档按钮
        case 51:
          this.handleExportRelatedData(btn);
          break; // 批量归档按钮
        default:
          return;
      }
    };
    setTimeout(() => {
      doClickBtn();
    }, 0);
  };
  // 跳转至按钮中配置的url
  linkToUrl = (btn, url) => {
    const globalVars = matchGlobalVars(url);
    let resultUrl = url;
    if (globalVars.length) {
      const { listSelectedRows } = this.state;
      globalVars.forEach(varName => {
        const value = this.getGlobalVarValues({
          varName,
          listActiveRowData: listSelectedRows[0],
        });
        resultUrl = resultUrl.replace(`{${varName}}`, value);
      });
    }
    window.open(resultUrl);
  };
  // 导出全部
  handleExport = btn => {
    const { tabInfo, userInfo, elementMap, treeNodeData, advancedQueryMap } = this.props;
    const { elementFormat, dataFormat } = btn;
    if (elementFormat === 2) return;
    const { calendarList = [], seniorFilter } = this.state;
    const tabId = tabInfo.id;
    const elementList = elementMap[tabId]
      .filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype);
      })
      .map(item => {
        let obj = {
          name: item.relationColumnName,
          baseType: item.basetype,
          mainColumnName: item.mainColumnName,
          mainTableName: item.mainTableName,
          elementId: item.id,
          displayName: item.displayName,
          visiabled: item.visiabled,
          relationColumnName: item.relationColumnName,
          relationTableName: item.relationTableName,
          elementMultiRelation: item.elementMultiRelation,
        };
        if (item.basetype === 9) {
          obj = {
            ...obj,
            relationColumnType: item.relationColumnType,
            elementFormat: item.elementFormat,
          };
        }
        return obj;
      });
    if (!elementList || !elementList.length) return;
    const queryList = advancedQueryMap[tabId] || [];
    const globalMap = {};
    const globalQueryMap = {};
    // 将过滤条件中的全局变量赋值
    queryList.forEach(item => {
      const { asqlValueType, asqlValue, queryType, basetype, apiSql } = item;
      // 面板过滤条件为组合条件方式
      if (queryType === 1 && basetype === 1) {
        // 值类型为【变量】时，需要将变量对应的值传给后台
        if (asqlValueType === 2 || isGlobalOrCustomVar(asqlValue)) {
          globalMap[item.asqlValue] = this.getGlobalVarValues({ varName: asqlValue });
        }
      } else if (queryType === 2 && basetype === 2) {
        // SQL过滤条件方式
        const varArr = matchGlobalVars(apiSql);
        varArr.forEach(varName => {
          globalQueryMap[varName] = this.getGlobalVarValues({
            varName,
            globalMapType: 'globalQueryMap',
          });
        });
      }
    });
    const params = {
      tabSource: tabInfo.relationTableName,
      elementList,
      tabId,
      calendarList,
      globalMap,
      globalQueryMap,
      dataFormat,
    };
    params.seniorFilterMap = seniorFilter;
    if (tabInfo.showType === 4) {
      params.seniorFilterMap = {
        ...seniorFilter,
        [tabInfo.relationColumn]: {
          static_connector: 3,
          static_type: 2,
          static_value: JSON.parse(treeNodeData.id),
        },
      };
    }
    this.setBtnLoading(btn, true);
    const that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', query.FULL_EXPORT_ALL_TO_EXCEL, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('token', userInfo.token);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
      if (this.status === 200) {
        var blob = this.response;
        var filename = tabInfo.name + '.xls';
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
          navigator.msSaveBlob(blob);
        } else {
          var a = document.createElement('a');
          var url = createObjectURL(blob);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          that.setBtnLoading(btn, false);
        }
      } else {
        that.setBtnLoading(btn, false);
      }
    };
    xhr.send(JSON.stringify(params));
  };
  // http触发器
  doHttpRequest = (btn, column, record) => {
    const { id: btnId } = btn;
    const { langLib } = this.context;
    const { triggerMap } = this.props;
    const curEleTrigger = triggerMap[btnId] || [];
    const triggers = curEleTrigger.filter(item => item.triggerType === 5) || [];
    if (!triggers.length) {
      this.doBtnRefresh(btn);
      return;
    }
    const globalMap = {};
    const triggerIdsArr = [];
    triggers.forEach(trigger => {
      triggerIdsArr.push(trigger.id);
      const { httpRequestList = [] } = trigger;
      httpRequestList.forEach(httpRequest => {
        const { paramValue } = httpRequest;
        if (column) {
          // 如果column有值，就走行编辑中的逻辑，没有的话走正常的
          const { userInfo, treeNodeData, tabInfo } = this.props;
          const { elementMap } = this.state;
          globalMap[paramValue] = getVariableValueByTree({
            userInfo,
            treeNodeData,
            varName: paramValue,
            elementList: elementMap[tabInfo.id],
            formValues: record,
          });
        } else {
          if (isGlobalOrCustomVar(paramValue)) {
            globalMap[paramValue] = this.getGlobalVarValues({
              varName: paramValue,
              isReturnObj: false,
            });
          }
        }
      });
    });
    const triggerIds = triggerIdsArr.join(',');
    this.setBtnLoading(btn, true);
    httpRequest({ triggerIds, globalMap }).then(
      res => {
        CMessage(langLib['message.check.success']);
        this.setBtnLoading(btn, false);
        this.doBtnRefresh(btn);
      },
      err => this.setBtnLoading(btn, false),
    );
  };
  // 按钮的刷新逻辑
  doBtnRefresh = (btn, callback) => {
    const { fromType, afterSave } = this.props;
    const { basetype, elementFormat } = btn;
    if (BTN_ELEMENT_TYPE.includes(basetype) && basetype !== 30) {
      // 除导出按钮外其他按钮
      if (elementFormat === 1) {
        // 刷新本面板
        this.doFetchPageData();
      } else if (elementFormat === 2 && fromType === 'inPopup') {
        // 关闭本面板并刷新上一个面板
        afterSave && afterSave(true);
      } else if (elementFormat === 3) {
        // 刷新框架
        this.doRefreshFrame();
      } else {
        callback && callback();
      }
    }
  };
  // 刷新框架
  doRefreshFrame = () => {
    const { tabs } = this.props;
    const { activeTabKey: tabKey } = tabs;
    const setRefresh = isRefreshing => {
      this.context.dispatch({
        type: 'tabs/updateTabInfo',
        payload: {
          tabKey,
          isRefreshing,
        },
      });
    };
    setRefresh(true);
    setTimeout(() => setRefresh(false), 0);
  };
  // 点击新增
  handleAdd = btn => {
    const { relationTabId } = btn;
    if (!relationTabId) return;
    this.setPopupTabInfo({ eleObj: btn });
  };
  // 点击编辑
  handleEdit = btn => {
    const { relationTabId } = btn;
    if (!relationTabId) return;
    const { listSelectedRows } = this.state;
    const { langLib } = this.context;
    const selectedLen = listSelectedRows.length;
    if (!selectedLen) {
      // 未选择数据
      CMessage(langLib['message.error.noSelected'], 'error');
      return;
    } else if (selectedLen > 1) {
      // 选了多条
      CMessage(langLib['message.error.onlyOne'], 'error');
      return;
    }
    this.setPopupTabInfo({
      eleObj: btn,
      listRowData: listSelectedRows[0],
    });
  };
  // 删除选中的数据（列表）
  handleDel = btn => {
    const { relationTableName: tableName } = btn;
    const { listSelectedRows, listDataObj } = this.state;
    let { total, pageNum, pageSize } = listDataObj;
    const { langLib } = this.context;
    const ids = listSelectedRows.map(item => item.id && item.id.id);
    if (!listSelectedRows.length) {
      // 未选择数据
      CMessage(langLib['message.error.noSelected'], 'error');
      return;
    } else if (!ids.length) {
      // 列表未配置id
      CMessage(langLib['message.error.noId'], 'error');
      return;
    }
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      onOk: () => {
        return batchDeletePageData({ tableName, ids: ids.join(',') }).then(res => {
          CMessage(langLib['message.del.success']);
          if ((pageNum - 1) * pageSize === total - listSelectedRows.length && pageNum !== 1) {
            pageNum = pageNum - 1;
          }
          this.setState({
            listSelectedRows: [],
            listQueryParams: {
              pageNum: pageNum,
              pageSize: pageSize,
            },
          });
          this.doHttpRequest(btn);
          this.fetchListData({});
          closeModal();
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };
  handleExportRelatedData = btn => {
    const { tabInfo, userInfo, elementMap } = this.props;
    const { listSelectedRows } = this.state;
    const { langLib } = this.context;
    if (!listSelectedRows.length) {
      CMessage(langLib['message.error.noSelected'], 'warning');
      return;
    }
    const { dataFormat, elementFormat, relationTableName, parameter, alignment = 1 } = btn; // alignment 关联资料下载
    const idEle = elementMap[tabInfo.id].find(ele => ele.relationColumnName === 'id') || {};
    const nameEle = elementMap[tabInfo.id].find(ele => ele.relationColumnName === 'description'); // 名称 改 描述
    const keycodeEle = elementMap[tabInfo.id].find(ele => ele.relationColumnName === 'keycode');
    const ids = listSelectedRows.map(item => item[`${idEle.id}`].id);

    console.log(keycodeEle, elementMap[tabInfo.id]);
    const formatType = !dataFormat || dataFormat === 1 ? 'ALL' : 'RELATED_FILE_ONLY';
    const inductionType = !elementFormat || elementFormat === 1 ? 'BIZ_CODE_NAME' : 'CREATE_USER';

    function createObjectURL(object) {
      return window.URL
        ? window.URL.createObjectURL(object)
        : window.webkitURL.createObjectURL(object);
    }

    if (alignment === 2) {
      const treeArr = [];
      const params = [];
      listSelectedRows.forEach((item, i) => {
        console.log(item);
        params.push({
          key: 0 - i,
          relationId: item[`a${idEle.id}`] || item[`${keycodeEle.id}`]['id'] || '',
          fileType: 1,
          fileKey: 0,
          title:
            (item[`a${keycodeEle.id}`] || item[`${keycodeEle.id}`]['id'] || '') +
            '_' +
            (item[`a${nameEle.id}`] || item[`${nameEle.id}`]['id'] || ''),
          relationTableName,
        });
      });
      getRelationFileTree(params).then(res => {
        console.log(res);
        this.setState({
          treeData: res,
          visibleFileModal: true,
          expandedKeys: [],
          relevanceBtnConfig: btn,
        });
      });
    } else {
      let that = this;
      that.setState({
        loadingStatus: {
          ...that.state.loadingStatus,
          data: true,
        },
      });
      let xhr = new XMLHttpRequest();
      xhr.open(
        'get',
        `${
          query.DO_EXPORT_RELATED_DATA_TO_ZIP
        }?relationIds=${ids}&inductionType=${inductionType}&formatType=${formatType}&bizTableName=${relationTableName}`,
        true,
      );
      xhr.responseType = 'blob';
      xhr.setRequestHeader('token', userInfo.token);
      xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
      xhr.onload = function(e) {
        if (this.status === 200) {
          let blob = this.response;
          let filename = `${parameter || null}.zip`;
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
            navigator.msSaveBlob(blob);
          } else {
            let a = document.createElement('a');
            let url = createObjectURL(blob);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            that.setState({
              loadingStatus: {
                ...that.state.loadingStatus,
                data: false,
              },
            });
          }
        } else {
          that.setState({
            loadingStatus: {
              ...that.state.loadingStatus,
              data: false,
            },
          });
        }
      };
      xhr.send();
    }
  };
  // 归档按钮
  handleArchive = btn => {
    const { formData = {}, listSelectedRows, elementMap } = this.state;
    const { langLib } = this.context;
    const { prevTabInfo, tabInfo, triggerMap, prevTabData, userInfo, treeNodeData } = this.props;
    let id = formData.id; // 表单取id
    if (tabInfo !== 1) {
      // 非表单取列表选中数据
      const selectedLen = listSelectedRows.length;
      if (!selectedLen) {
        CMessage(langLib['message.error.noSelected'], 'error');
        return;
      } else if (selectedLen > 1) {
        CMessage(langLib['message.error.onlyOne'], 'error');
        return;
      } else {
        const idObj = listSelectedRows[0].id || {};
        id = idObj.id || '';
      }
    }
    const { relationTableName: static_tableName, id: btnId, basetype } = btn;
    const triggers = triggerMap[btnId] || [];
    const static_triggerIds = triggers
      .filter(item => item.triggerType === 2)
      .map(item => item.id)
      .join(',');
    const static_globalMap = getTriggerMapFromEle({
      curEle: btn,
      curEleTriggerList: triggers,
      prevTabEleList: elementMap[prevTabInfo.id],
      prevTabData,
      userInfo,
      treeNodeData,
      curTabEleList: elementMap[tabInfo.id],
      curTabData: tabInfo.showType === 2 ? formData : listSelectedRows[0],
    });
    const params = {
      id,
      static_tableName,
      static_triggerIds,
      static_globalMap,
    };
    let api = null;
    switch (basetype) {
      case 26:
        api = doArchiveCycle;
        break;
      case 28:
        api = doArchiveNormal;
        break;
      case 34:
        api = doBatchArchiveCycle;
        break;
      case 35:
        api = doBatchArchiveNormal;
        break;
      default:
        api = doArchiveCycle;
        break;
    }
    this.setBtnLoading(btn, true);
    api(params).then(
      res => {
        CMessage(langLib['message.check.success']);
        this.doHttpRequest(btn);
        this.setBtnLoading(btn, false);
      },
      err => this.setBtnLoading(btn, false),
    );
  };
  // 普通按钮
  handleNormalBtn = btn => {
    const { id: btnId, relationTabId, url, jumpFunctionId, passParam } = btn;
    const { langLib } = this.context;
    const { formData, elementMap, listSelectedRows = [] } = this.state;
    const {
      triggerMap,
      prevTabInfo,
      tabInfo,
      prevTabData,
      userInfo,
      treeNodeData,
      tabList,
    } = this.props;
    const curEleTrigger = triggerMap[btnId] || [];
    const getIds = type =>
      curEleTrigger
        .filter(item => item.triggerType === type)
        .map(item => item.id)
        .join(',');
    const static_globalMap = getTriggerMapFromEle({
      curEle: btn,
      curEleTriggerList: triggerMap[btnId],
      prevTabEleList: elementMap[prevTabInfo.id],
      prevTabData,
      userInfo,
      treeNodeData,
      curTabEleList: elementMap[tabInfo.id],
      globalIds: listSelectedRows.map(item => item.id.id).join(','),
      curTabData: tabInfo.showType === 2 ? formData : listSelectedRows[0],
    });
    const params = {
      static_globalMap,
      static_triggerIds: getIds(2),
      static_procedure_triggerids: getIds(3),
    };
    // 跳转url
    if (url) {
      this.linkToUrl(btn, url);
    }
    if (relationTabId) {
      // 弹出面板
      this.doBtnRefresh(btn);
      this.setPopupTabInfo({
        eleObj: btn,
        listRowData: tabInfo.showType === 2 ? formData : listSelectedRows[0],
      });
      return;
    }
    // 若普通按钮弹出的是批量面板，需要选择数据才可进行
    const relationTabInfo = tabList.find(item => item.id === relationTabId) || {};
    if (relationTabInfo.showType === 6 && !this.getPrevSelectedRowIds()) {
      return false;
    }
    if (jumpFunctionId) {
      this.jumpMenu(btn, tabInfo.showType === 2 ? 1 : '');
    }
    const { static_triggerIds, static_procedure_triggerids } = params;
    if (!static_triggerIds && !static_procedure_triggerids) {
      // 后台触发器
      this.doHttpRequest(btn);
      return;
    }
    this.setBtnLoading(btn, true);
    insertOrUpdateByTriggers(params).then(
      res => {
        CMessage(langLib['message.check.success']);
        this.doHttpRequest(btn);
        this.setBtnLoading(btn, false);
      },
      err => this.setBtnLoading(btn, false),
    );
  };
  // 跳转菜单
  jumpMenu = (btn, type) => {
    const { tabInfo, elementMap, user, userInfo, functionData, tabs } = this.props;
    const { passParam, jumpFunctionId } = btn;
    const { langLib } = this.context;
    let result = controlAuthority(user.functionList, jumpFunctionId);
    if (!result.length) {
      // 如果在菜单中心没有找到对应的菜单，不允许跳转到对应的页面
      CMessage(langLib['message.warn.nopromiss'], 'error');
      return;
    }
    let data = {}; // 判断数据源来自表单中的还是列表
    if (type) {
      const { form } = this.detailFormRef && this.detailFormRef.props;
      data = form && form.getFieldsValue(); // 获取表单中的所有数据值
    } else {
      const { listSelectedRows } = this.state;
      let data1 = listSelectedRows[0] || {};
      data = JSON.parse(JSON.stringify(data1));
    }
    let passParams = jsonParse(passParam, 'array') || [];
    const elementList = elementMap[tabInfo.id] || [];
    const fileData = returnJumpMenuData(
      functionData.id,
      data,
      elementList,
      passParams,
      userInfo,
      getValueFromGlobalVariables,
      type,
      true,
    );
    const { tabKey, comKey, title } = getFunctionComDetail(result[0]);
    this.jumpFile(tabKey, comKey, title, fileData, result);
  };
  // 点击保存按钮
  /**
   * @param {object} btn  当前按钮控件
   * @param {string} saveType 保存类型（normal-普通保存  batch-批量保存）
   */
  handleSave = (btn, saveType = 'normal') => {
    const { langLib } = this.context;
    const { originNode, elementMap } = this.state;
    const { fromType, afterSave, prevSelectedRows, prevEleObj, actionType, tabInfo } = this.props;
    const { form } = this.detailFormRef.props;
    form &&
      form.validateFieldsAndScroll((errs, values) => {
        if (errs) return;
        // 整合参数
        const params = this.resumeSaveParams(values, btn);
        // 去除前端的隐藏表单项
        let reqParams = filterHiddenFormData(params);
        let saveApi =
          fromType === 'inPopup' ? insertOrUpdateRelationPageData : insertOrUpdatePageData;
        // 批量保存
        if (saveType === 'batch' || prevSelectedRows.length > 1) {
          const ids = this.getPrevSelectedRowIds();
          if (!ids) {
            CMessage(langLib['message.error.noData'], 'error');
            return;
          }
          reqParams = {
            ...reqParams,
            static_ids: ids,
            id: null,
          };
          saveApi = batchUpdate;
        }
        // 由新增按钮弹出的面板中的保存按钮，一律不传id或批量修改逻辑
        if (prevEleObj.basetype === 4) {
          reqParams = {
            ...reqParams,
            id: null,
            static_ids: null,
          };
          // 如果页面上有多选控件并且是生成多条数据的，就切换接口
          const elementObj = elementMap[tabInfo.id] || [];
          const checkMultiChoiceIsExist = elementObj.find(
            item => item.basetype === 45 && item.elementFormat === 1,
          );
          if (checkMultiChoiceIsExist && reqParams[checkMultiChoiceIsExist.relationColumnName]) {
            const { relationColumnName, id: elementId } = checkMultiChoiceIsExist;
            let newParams = { ...reqParams };
            newParams.static_ids = reqParams[relationColumnName];
            delete newParams[relationColumnName];
            delete newParams.static_dataSource1;
            delete newParams.static_dataSource2;
            newParams.static_elementId = elementId;
            reqParams = {
              ...newParams,
            };
            saveApi = filedRelationInsert;
          }
        }
        reqParams.id = reqParams.id ? reqParams.id : null;
        this.setBtnLoading(btn, true);
        saveApi(reqParams).then(
          res => {
            CMessage(langLib['message.save.success']);
            // this.setBtnLoading(btn, false);
            this.detailFormRef && this.detailFormRef.props.form.resetFields();
            this.doHttpRequest(btn);
            if (fromType === 'inPopup') {
              // 弹出面板内的保存按钮，点击后统一关闭弹框，且重新刷新上一个面板的数据
              afterSave && afterSave(true);
            } else {
              if (actionType === 'addChild') {
                // 新增子级时，因保存后刷新的是父层数据，故只做清空
                this.setState({ formData: {} });
                const textEditor = this.detailFormRef && this.detailFormRef.textEditorRef;
                textEditor && textEditor.clearContent();
              } else {
                this.doFetchPageData();
              }
              // 非弹出面板的需要手动清除数据且刷新树
              this.setState({ fileRelationList: {} }); // 清空文件缓存
              this.props.doFetchTree(false);
              this.setBtnLoading(btn, false);
            }
          },
          err => this.setBtnLoading(btn, false),
        );
      });
  };
  // 将id-value转换成key-value
  resumeNormalParams = (values, elementList) => {
    const formValues = {};
    Object.keys(values).forEach(key => {
      const eleObj = elementList.find(item => `${item.id}` === key);
      if (!eleObj) return;
      const { relationColumnName, basetype, relationColumnType } = eleObj;
      let keyValue = values[key];
      if (basetype === 1 && NUMBER_COLUMN_TYPE.includes(relationColumnType)) {
        if (values[key] === null || values[key] === '') keyValue = '';
      }
      if (basetype === 39 && keyValue && keyValue.editorState) {
        keyValue = keyValue.editorState.toHTML();
      }
      if (
        key.indexOf(IGNORE_FORM_ITEM) !== -1 || // 去除有隐藏项的显示项名称
        NO_SUBMIT_ELEMENT_TYPE.includes(eleObj.basetype) || // 去除有隐藏项的显示项名称
        !relationColumnName // 没有业务表字段的不提交
      )
        return;
      // 空值转换
      formValues[eleObj.relationColumnName] = resetDefaultValue(eleObj, keyValue, false);
    });
    return formValues;
  };

  // 保存前对额外参数整合
  resumeSaveParams = (values, btn) => {
    const { relationTableName, id: btnId } = btn;
    const { formData, fileRelationList = {}, elementMap, listSelectedRows } = this.state;
    const {
      treeNodeData,
      tabInfo,
      actionType,
      triggerMap,
      frameData,
      prevTabInfo = {},
      tabList = {},
      prevTabData,
      fromType,
      userInfo,
    } = this.props;
    const { datasource1, datasource2, groupColumn } = frameData;
    // const formValues = {};
    const elementList = elementMap[tabInfo.id] || [];
    // Object.keys(values).forEach(key => {
    //   const eleObj = elementList.find(item => `${item.id}` === key);
    //   if (!eleObj) return;
    //   const { relationColumnName, basetype } = eleObj;
    //   let keyValue = values[key] || '';
    //   if (basetype === 39 && keyValue && keyValue.editorState) {
    //     keyValue = keyValue.editorState.toHTML();
    //   }
    //   if (
    //     (key.indexOf(IGNORE_FORM_ITEM) !== -1) || // 去除有隐藏项的显示项名称
    //     (NO_SUBMIT_ELEMENT_TYPE.includes(eleObj.basetype)) || // 去除有隐藏项的显示项名称
    //     (!relationColumnName) // 没有业务表字段的不提交
    //   ) return;
    //   // 空值转换
    //   formValues[eleObj.relationColumnName] = resetDefaultValue(eleObj, keyValue, false);
    // });
    const formValues = this.resumeNormalParams(values, elementList);
    const static_globalMap = getTriggerMapFromEle({
      curEle: btn,
      curEleTriggerList: triggerMap[btnId],
      prevTabEleList: elementMap[prevTabInfo.id],
      prevTabData,
      userInfo,
      treeNodeData,
      curTabEleList: elementMap[tabInfo.id],
      curTabData: tabInfo.showType === 2 ? formData : listSelectedRows[0],
    });
    // 获取
    let params = {
      ...formValues,
      static_tableName: relationTableName,
      static_dataSource1: datasource1,
      static_dataSource2: datasource2,
      static_fileIds: fileRelationList,
      static_globalMap,
    };
    const { isGroup, id: nodeId } = treeNodeData;
    // 有配置后台触发器
    const curEleTrigger = triggerMap[btnId] || [];
    params.static_triggerIds = curEleTrigger
      .filter(item => item.triggerType === 2)
      .map(item => item.id)
      .join(',');
    params.static_procedure_triggerids = curEleTrigger
      .filter(item => item.triggerType === 3)
      .map(item => item.id)
      .join(',');
    // 不是在弹出面板内的保存，即：
    // 对于树节点的保存
    if (fromType !== 'inPopup') {
      // 若没有rootid、groupid的值，则手动生成
      if (actionType === 'addGroup') {
        // 新增组
        params.rootid = nodeId;
      } else if (actionType === 'addChild') {
        // 新增组内
        const isMultiTable = !!datasource1 && !!datasource2;
        if (isGroup) {
          // 组下第一层元素
          if (isMultiTable) {
            // 多表时
            params = { ...params, [groupColumn]: nodeId, rootid: 0 };
          } else {
            params.rootid = nodeId;
          }
        } else {
          // 元素下的元素
          if (isMultiTable) {
            // 多表时
            params = { ...params, [groupColumn]: treeNodeData.groupId, rootid: nodeId };
          } else {
            params.rootid = nodeId;
          }
        }
      }
      // 若界面配置中有rootid和groupid，则取界面中的数据
      if ('rootid' in formValues) params.rootid = formValues.rootid || 0;
      if (formValues[groupColumn]) params[groupColumn] = formValues[groupColumn];
    }
    return params;
  };
  // 校验批量保存
  getPrevSelectedRowIds = () => {
    const { prevSelectedRows } = this.props;
    const { langLib } = this.context;
    // 未选择数据
    if (!prevSelectedRows.length) {
      CMessage(langLib['message.error.noData'], 'error');
      return false;
    }
    const idList = prevSelectedRows.filter(item => item.id).map(item => item.id.id) || [];
    if (!idList.length) {
      // 列表项未配置id
      CMessage(langLib['message.error.noId'], 'error');
      return false;
    }
    return idList.join(',');
  };
  // 更新配置的按钮loading状态
  setBtnLoading = (btn, loading) => {
    const { elementMap } = this.state;
    const { tabInfo } = this.props;
    const tabId = tabInfo.id;
    const elementList = elementMap[tabInfo.id] || [];
    const newElementList = [...elementList];
    const btnIndex = newElementList.findIndex(item => item.id === btn.id);
    newElementList.splice(btnIndex, 1, {
      ...btn,
      static_loading: loading,
    });
    this.setState({
      elementMap: {
        ...elementMap,
        [tabId]: newElementList,
      },
    });
  };
  // 更新主区块loading状态
  setLoadingStatus = (type, loading) => {
    const { loadingStatus } = this.state;
    this.setState({
      loadingStatus: {
        ...loadingStatus,
        [type]: loading,
      },
    });
  };
  // 筛选出tab头信息
  filterTabNameList = () => {
    const { matchTabList } = this.props;
    return matchTabList.map(tab => ({
      key: tab.id,
      tab: <span title={tab.name}>{tab.name}</span>,
    }));
  };
  // 切换面板
  handleChangeTab = activeTabKey => {
    const {
      matchTabList,
      setFrameState,
      fetchPageData,
      form,
      actionType,
      sourcePage,
      elementMap,
    } = this.props;
    const tabInfo = matchTabList.find(item => item.id === +activeTabKey) || {};
    // form.resetFields();
    this.setState({
      listData: [],
      formData: {},
      prevTabInfo: {},
      listRowData: {},
      listSelectedRows: [],
      fileRelationList: {},
      listQueryParams: {
        pageNum: 1,
        pageSize: sourcePage,
      },
    });
    const { showType, calculationOperationBar } = tabInfo;
    setFrameState(
      {
        tabInfo,
        // form,
      },
      () => {
        let refDom = '';
        if (showType === 1) {
          refDom = 'DetailList';
        }
        if (showType === 4) {
          refDom = 'RelationPopup';
        }
        if (refDom) {
          const domHeight = this.refs[refDom].getBoundingClientRect().height;
          const elementList = elementMap[+activeTabKey];
          let btnArr = elementList.filter(
            item => BTN_ELEMENT_TYPE.includes(item.basetype) && item.visiabled,
          );
          let searchArr = elementList.filter(item => item.basetype === 14 && item.visiabled);
          const seniorFilterEle = elementList.find(item => item.basetype === 33 && item.visiabled); // 高级筛选
          let isTrue = false;
          if (btnArr.length || searchArr.length || seniorFilterEle) {
            isTrue = true;
          }
          const realHeight = isTrue ? domHeight - 37 - 33 - 8 - 40 : domHeight - 37 - 8 - 40;
          let pageSize = Math.floor(realHeight / 37);
          const { listQueryParams, pageSizeOptions } = this.state;
          const newPageSizeOptions = [...pageSizeOptions];
          const lastPageSize = calculationOperationBar ? pageSize - 1 : pageSize;
          const newPageSize = sourcePage ? sourcePage : lastPageSize;
          if (!newPageSizeOptions.includes(`${newPageSize}`)) {
            newPageSizeOptions.push(`${newPageSize}`);
          }
          this.setState(
            {
              listQueryParams: {
                ...listQueryParams,
                pageSize: newPageSize,
              },
              pageSizeOptions: newPageSizeOptions,
            },
            () => {
              !(actionType === 'addGroup' || actionType === 'addChild') && this.doFetchPageData();
            },
          );
          return;
        }
        !(actionType === 'addGroup' || actionType === 'addChild') && this.doFetchPageData();
      },
    );
  };
  /**
   * 设置弹出面板信息
   * @param {object} eleObj 控件信息
   * @param {object} listRowData 行数据(若是表单，则取表单数据作为行数据)
   * @param {string} tabIdKey 面板id参数名（relationTabId-关联弹出面板、selectListTabId-数据选择框的弹出列表）
   */
  setPopupTabInfo = ({
    eleObj,
    listRowData = {},
    tabIdKey = 'relationTabId',
    handleSetCustomSelectList,
    otherParamsInCustomList,
  }) => {
    const { tabList } = this.props;
    const { jumpType } = eleObj;
    if (jumpType === 3) {
      // 不执行任何逻辑
      return;
    } else if (jumpType === 2) {
      // 跳转菜单
      this.multiJumpBtn(eleObj, listRowData);
      return;
    }
    const popupTabInfo = tabList.find(item => item.id === eleObj[tabIdKey]);
    if (!popupTabInfo) return;
    this.setState({
      popupTabInfo,
      listRowData,
      visiblePopup: true,
      triggerPopupEle: eleObj,
      handleSetCustomSelectList,
      otherParamsInCustomList,
    });
  };
  // 关闭弹出面板
  handleCancelModal = (needReFetch = false) => {
    this.setState(
      {
        visiblePopup: false,
        popupTabInfo: {},
        listSelectedRows: [],
      },
      () => {
        // @TODO: 切换页面后需要保存页码的数据，否则每次关闭弹框都重新获取第一页
        needReFetch && this.doFetchPageData();
      },
    );
  };
  setContainerState = (itemObj, callback) => {
    this.setState(itemObj, () => callback && callback());
  };
  // 根据默认值在本面板上找到对应的参数名控件，然后给默认值控件赋值,返回一个全新的数据集合
  getDefaultValueFromCurrentTab = ({ currentTabData = {}, elementMap, tabInfo }) => {
    const { id: tabId } = tabInfo;
    const elementList = elementMap[tabId] || [];
    let newData = { ...currentTabData };
    elementList.forEach(item => {
      const { defaultValue, parameter, id } = item;
      if (defaultValue && defaultValue.indexOf('@@') > -1) {
        let orgEleObj = elementList.find(items => items.parameter === defaultValue);
        if (orgEleObj) {
          const { id: orgEleObjId } = orgEleObj;
          const itemData = (newData[`${id}`] && newData[`${id}`]) || {};
          if (!itemData.id) newData[`${id}`] = newData[`${orgEleObjId}`];
        }
      }
    });
    return newData;
  };
  // 获取面板内容
  getTabContent = (isSingleTab = false) => {
    const {
      pageSizeOptions,
      stepList,
      formData,
      listDataObj,
      listQueryParams,
      tabDropDownData,
      listSelectedRows,
      originFormData,
      fileRelationList,
      elementMap = {},
      editListDataObj,
      externalParameters,
    } = this.state;
    const {
      form,
      actionType,
      tabData = {},
      advancedQueryMap,
      tabInfo = {},
      triggerMap,
      originElementMap,
      treeNodeData,
      tabList,
      originTabData,
      prevTabInfo = {},
      prevTabData = [],
      filterMap,
      functionData,
      userInfo,
      elementComputedObj,
      afterSave,
      setPrevContainerState,
      prevEleObj,
      handleSetPrevCustomSelectList,
      matchTabList,
      otherParamsInCustomList,
      filePassList,
      setFrameState,
      fromType,
    } = this.props;
    if (JSON.stringify(elementMap) === '{}') return;
    // 单个面板
    const renderTabItem = tabItem => {
      const { showType, id: tabId, basetype: tabType, name, jumpUrl } = tabItem;
      const elementList = (tabId ? elementMap[tabId] : []) || [];
      const hasSearchQuery = elementList.filter(item => item.quickQuery).length;
      const contentCls = classNames({
        [styles.contentWrap]: true,
        [styles.listWrap]: showType === 1 || showType === 4 || showType === 5,
        [styles.formWrap]: showType === 2 || showType === 6,
        [styles.relationFileTab]: showType === 7,
        [styles.hasSearchQuery]: hasSearchQuery,
      });
      const publicProps = {
        setContainerState: this.setContainerState,
        setPopupTabInfo: this.setPopupTabInfo,
        getGlobalVarValues: this.getGlobalVarValues,
        tabInfo: tabItem,
        prevTabInfo,
        prevTabData,
        functionData,
        userInfo,
        multiJump: this.multiJumpBtn,
        saveInListBtn: this.saveInList,
        multiTabJump: this.multiTabBtn,
      };
      const footerBtnProps = {
        ...publicProps,
        // form,
        tabList,
        triggerMap,
        actionType,
        elementList,
        handleClickBtn: this.handleClickBtn,
      };
      const detailListProps = {
        ...publicProps,
        elementMap,
        treeNodeData,
        tabList,
        listQueryParams,
        listDataObj,
        setContainerState: this.setContainerState,
        triggerMap,
        fetchListData: this.fetchListData,
        setSelected: (listSelectedRows = {}) => this.setState({ listSelectedRows }),
        listSelectedRows,
        handleDeleteBtn: this.handleDel,
        selectType:
          otherParamsInCustomList && !otherParamsInCustomList.multiple ? 'radio' : 'checkbox',
        afterSave,
        setPrevContainerState,
        prevEleObj,
        tabDropDownData,
        handleSetPrevCustomSelectList,
        updateEditLine: this.updateEditLine,
        editListDataObj,
        pageSizeOptions,
        fromType,
        elementComputedObj,
      };
      const footerBtn = <ButtonLine {...footerBtnProps} />;
      // 列表
      const renderList = (
        <div key={tabId} className={contentCls} ref="DetailList">
          {/* {showType !== 5 && footerBtn} */}
          <div className={styles.content}>
            <DetailList {...detailListProps} BtnLine={(showType !== 5 && footerBtn) || null} />
          </div>
          {/* {showType === 5 && footerBtn} */}
        </div>
      );
      // 表单
      const renderForm = (
        <div key={tabId} className={contentCls}>
          <div className={styles.content}>
            <Form>
              <DetailForm
                {...publicProps}
                // form={form}
                formData={this.getDefaultValueFromCurrentTab({
                  currentTabData: formData,
                  elementMap,
                  tabInfo,
                })}
                originFormData={originFormData}
                triggerMap={triggerMap}
                filterMap={filterMap}
                elementMap={elementMap}
                originElementMap={originElementMap}
                treeNodeData={treeNodeData}
                tabData={tabData}
                tabList={tabList}
                advancedQueryMap={advancedQueryMap}
                originTabData={originTabData}
                tabDropDownData={tabDropDownData}
                fileRelationList={fileRelationList}
                wrappedComponentRef={form => (this.detailFormRef = form)}
                stepList={stepList}
                filePassList={filePassList}
                setFrameState={setFrameState}
              />
            </Form>
          </div>
          <ButtonLine {...footerBtnProps} fromType="form" />
        </div>
      );
      if (showType === 1) {
        // 列表类型
        return renderList;
      } else if (showType === 2 || showType === 6) {
        // 表单类型、批量类型
        return renderForm;
      } else if (showType === 4) {
        // 业务关联面板(包含关联弹出面板)
        return (
          <div className={contentCls} ref="RelationPopup">
            <RelationPopup
              detailListProps={detailListProps}
              advancedQueryMap={advancedQueryMap}
              footerBtnProps={footerBtnProps}
            />
          </div>
        );
      } else if (showType === 7) {
        // 关联文档
        return (
          <div className={contentCls}>
            <RelationFileTab
              wrappedComponentRef={ref => (this.relationFileTabRef = ref)}
              functionData={functionData}
              userInfo={userInfo}
            />
          </div>
        );
      } else if (showType === 11) {
        return (
          <div className={contentCls}>
            <iframe
              id="tree_iframe"
              src={`${jumpUrl}?${qsStringify(externalParameters)}`}
              frameBorder={0}
              style={{ width: '100%', height: 'calc(100%)' }}
            />
          </div>
        );
      }
    };
    // 弹出面板中只展示一个面板
    if (isSingleTab) {
      return renderTabItem(tabInfo);
    }
    return matchTabList.map(tabItem => {
      const { name, id, showType } = tabItem;
      if (showType !== 9) {
        return (
          <TabPane tab={name} key={`${id}`}>
            {renderTabItem(tabItem)}
          </TabPane>
        );
      }
    });
  };

  // 多面板跳转
  multiTabBtn = (btn, record) => {
    if (!this.checkBeforeHandleClick(btn, record)) return;
    const { tabInfo, elementMap } = this.props;
    const { jumpMenuList = [] } = btn;
    if (!jumpMenuList) return;
    let elementList = elementMap[tabInfo.id] || [];
    for (let i = 0; i < jumpMenuList.length; i++) {
      let condition = jumpMenuList[i];
      const { preconditions } = condition;
      let normalArr = jsonParse(preconditions, 'array') || [];
      let newCondition = reducerVariableToArray(normalArr, record, elementList, 'tree');
      if (multiDataComparison(newCondition)) {
        const { jumpTabId } = condition;
        let eleObj = { relationTabId: jumpTabId };
        this.setPopupTabInfo({
          eleObj,
          listRowData: record,
          tabIdKey: 'relationTabId',
        });
        return;
      }
    }
  };
  // 列表中的保存按钮
  saveInList = (btn, record) => {
    if (!this.checkBeforeHandleClick(btn, record)) return;
    const { elementMap } = this.state;
    const { langLib } = this.context;
    const { tabInfo, triggerMap, userInfo, treeNodeData, fromType, afterSave } = this.props;
    const { id: btnId, relationTableName } = btn;
    const elementList = elementMap[tabInfo.id];
    let values = {};
    Object.keys(record).forEach(item => {
      values[`${item}`] = record[item].id;
    });
    const formValues = this.resumeNormalParams(values, elementList);
    // 有配置后台触发器
    const curEleTrigger = triggerMap[btnId] || [];
    const static_triggerIds = curEleTrigger
      .filter(item => item.triggerType === 2)
      .map(item => item.id)
      .join(',');
    const static_procedure_triggerids = curEleTrigger
      .filter(item => item.triggerType === 3)
      .map(item => item.id)
      .join(',');
    let static_globalMap = {};
    if (curEleTrigger && curEleTrigger.length) {
      curEleTrigger.forEach(item => {
        const { relationColumnValue, valueType, triggerType, procedureMap } = item;
        if (valueType === 2) {
          static_globalMap[relationColumnValue] = getVariableValueByTree({
            userInfo,
            treeNodeData,
            varName: relationColumnValue,
            elementList,
            formValues,
          });
        } else if (triggerType === 3 && procedureMap) {
          Object.keys(procedureMap).forEach(item => {
            static_globalMap[procedureMap[item]] = getVariableValueByTree({
              userInfo,
              treeNodeData,
              varName: procedureMap[item],
              elementList,
              formValues,
            });
          });
        }
      });
    }
    const reqParams = {
      static_globalMap,
      static_procedure_triggerids,
      static_triggerIds,
      ...formValues,
      static_tableName: relationTableName,
    };
    insertOrUpdatePageData(reqParams).then(res => {
      CMessage(langLib['message.save.success']);
      // if (fromType === 'inPopup') {
      //   // 弹出面板内的保存按钮，点击后统一关闭弹框，且重新刷新上一个面板的数据
      //   afterSave && afterSave(true);
      // } else {
      //   this.doFetchPageData();
      // }
      this.doBtnRefresh(btn, () => {
        this.doFetchPageData();
      });
      this.doHttpRequest(btn, 'column', formValues);
    });
  };
  // 多菜单跳转
  multiJumpBtn = (btn, record) => {
    if (!this.checkBeforeHandleClick(btn, record)) return;
    const { tabInfo, elementMap } = this.props;
    const { jumpMenuList = [] } = btn;
    if (!jumpMenuList) return;
    let elementList = elementMap[tabInfo.id] || [];
    for (let i = 0; i < jumpMenuList.length; i++) {
      let condition = jumpMenuList[i];
      const { preconditions } = condition;
      let normalArr = jsonParse(preconditions, 'array') || [];
      let newCondition = reducerVariableToArray(normalArr, record, elementList, 'tree');
      if (multiDataComparison(newCondition)) {
        this.multiJumpToFile(condition, record);
        return;
      }
    }
  };
  // 跳转菜单的时候逻辑处理
  multiJumpToFile = (condition, record) => {
    const { tabInfo, elementMap, user, userInfo, functionData, tabs } = this.props;
    const { passParam, jumpFunctionId } = condition;
    const { langLib } = this.context;
    if (!jumpFunctionId) return;
    let result = controlAuthority(user.functionList, jumpFunctionId);
    if (!result.length) {
      CMessage(langLib['message.warn.nopromiss'], 'error');
      return;
    }
    let data = JSON.parse(JSON.stringify(record)); // 判断数据源来自表单中的还是列表
    let passParams = jsonParse(passParam, 'array') || [];
    const elementList = elementMap[tabInfo.id] || [];
    const fileData = returnJumpMenuData(
      functionData.id,
      data,
      elementList,
      passParams,
      userInfo,
      getValueFromGlobalVariables,
      tabInfo.showType === 2 ? 1 : '',
    );
    const { tabKey, comKey, title } = getFunctionComDetail(result[0]);
    this.jumpFile(tabKey, comKey, title, fileData, result);
  };
  // 菜单跳转过去，把有存在的菜单先关闭再打开
  jumpFile = (tabKey, comKey, title, fileData, result) => {
    const { tabs, afterSave } = this.props;
    if (!tabKey) return;
    if (afterSave) afterSave(false);
    const { dispatch } = this.context;
    jumpFileOfCommon({ tabKey, comKey, title, tabs, fileData, functionData: result[0], dispatch });
  };

  onCheckNode = e => {
    console.log(e);
    const arr = [];
    e.checkedNodes.forEach(item => {
      if (item.props.fileType === 2) {
        arr.push(item.key);
      }
    });
    this.setState({
      treeSelect: arr,
    });
  };

  // 选择文件下载
  handleSelectFileDownload = () => {
    console.log('好的给你下载');

    // 通过类型判断下载 全部 和 部分
    const { selectedListArr, relevanceBtnConfig, treeSelect } = this.state;
    const { langLib } = this.context;
    if (!treeSelect.length) {
      CMessage('请选择文件', 'warning');
      return;
    }
    const { dataFormat, elementFormat, relationTableName, parameter } = relevanceBtnConfig;
    const { tabInfo, elementMap, userInfo } = this.props;
    const idEle = elementMap[tabInfo.id].find(ele => ele.relationColumnName === 'id');
    const ids = selectedListArr.map(item => item[`a${idEle.id}`]);
    const formatType = !dataFormat || dataFormat === 1 ? 'ALL' : 'RELATED_FILE_ONLY'; // 数据格式
    const inductionType = !elementFormat || elementFormat === 1 ? 'BIZ_CODE_NAME' : 'CREATE_USER'; // 文件格式目录类型
    function createObjectURL(object) {
      return window.URL
        ? window.URL.createObjectURL(object)
        : window.webkitURL.createObjectURL(object);
    }

    // 全部内容下载
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open(
      'get',
      `${
        query.DO_EXPORT_RELATED_DATA_TO_ZIP_SELECT
      }?relationIds=${ids}&inductionType=${inductionType}&formatType=${formatType}&bizTableName=${relationTableName}&fileIds=${treeSelect.join(
        ',',
      )}`,
      true,
    );
    xhr.responseType = 'blob';
    xhr.setRequestHeader('token', userInfo.token);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
      if (this.status === 200) {
        let blob = this.response;
        let filename = `${parameter || null}.zip`;
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
          navigator.msSaveBlob(blob);
        } else {
          let a = document.createElement('a');
          let url = createObjectURL(blob);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          that.setState({
            downLoadLoading: false,
          });
        }
      } else {
        that.setState({
          downLoadLoading: false,
        });
      }
    };
    xhr.send();

    this.setState({ visibleFileModal: false });
  };

  setStatus = (obj, callback) => {
    this.setState(obj, () => {
      callback && callback();
    });
  };

  render() {
    const {
      loadingStatus,
      visiblePopup,
      popupTabInfo = {},
      listRowData = {},
      formData = {},
      triggerPopupEle,
      listSelectedRows,
      handleSetCustomSelectList,
      otherParamsInCustomList,

      visibleFileModal,
      treeData,
      treeLoading,
      expandedKeys,
    } = this.state;
    const { loading, tabInfo = {}, fromType, actionType, ...rest } = this.props;
    const { showType } = tabInfo;
    const tabCls = classNames({
      'custom-pageConfig-tabs': true,
      [styles.tabWrap]: true,
    });

    const fileModalConfig = {
      visible: visibleFileModal,
      title: '选择文件下载',
      size: 'default',
      onCancel: () => this.setState({ visibleFileModal: false }),
      onOk: () => this.handleSelectFileDownload(),
    };
    return (
      <div className={styles.wrap}>
        <CSpin spinning={loadingStatus.data}>
          {fromType === 'inPopup' ? (
            this.getTabContent(true)
          ) : (
            <Tabs
              className={tabCls}
              activeKey={`${tabInfo.id}`}
              animated={false}
              onChange={activeTabKey => this.handleChangeTab(activeTabKey)}
            >
              {this.getTabContent()}
            </Tabs>
          )}
        </CSpin>
        <CreateModal
          visible={visiblePopup}
          title={popupTabInfo.name}
          className={styles.modal}
          // onOk={() => this.handleSave(popupBtn)}
          onCancel={() => this.handleCancelModal(false)}
          footer={null}
          size="large"
          // key={new Date().getTime()}
        >
          <ContentContainer
            {...rest}
            tabInfo={popupTabInfo}
            prevTabData={showType === 2 ? formData : listRowData}
            prevTabInfo={tabInfo}
            prevEleObj={triggerPopupEle}
            prevSelectedRows={listSelectedRows}
            // prevTabData={listRowData || formData}
            afterSave={this.handleCancelModal}
            setPrevContainerState={this.setContainerState}
            handleSetPrevCustomSelectList={handleSetCustomSelectList}
            otherParamsInCustomList={otherParamsInCustomList}
            fromType="inPopup"
          />
        </CreateModal>
        {/* 关联文件资料下载 */}
        <CreateModal {...fileModalConfig}>
          <FileDownload
            treeData={treeData}
            onCheckNode={this.onCheckNode}
            treeLoading={treeLoading}
            expandedKeys={expandedKeys}
            setStatus={this.setStatus}
          />
        </CreateModal>
      </div>
    );
  }
}

export default ContentContainer;
