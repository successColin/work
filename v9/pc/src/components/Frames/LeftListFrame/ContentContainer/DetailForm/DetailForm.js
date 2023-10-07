import {
  CBraftEditor,
  CDatePicker,
  CheckBoxSearchSelect,
  CImageshow,
  CInput,
  CInputNumber,
  CLabel,
  CMapInput,
  CQRCode,
  CRate,
  CSelect,
  CTextArea,
  CUpload,
  ImgUnRelation,
  NormalSearchSelect,
  SplitLine,
} from '@/components/common/BasicWidgets';
import styles from '@/components/common/FormItems/FormItems.less';
import FrameStepBar from '@/components/common/FrameStepBar/FrameStepBar';
import LabelTip from '@/components/common/LabelTip/LabelTip';
import {
  BTN_ELEMENT_TYPE,
  EMPTY_ITEM,
  FILTER_ELEMENT_TYPE,
  IGNORE_FORM_ITEM,
  NUMBER_COLUMN_TYPE,
  SEARCH_SELECT_TYPE,
  SELECT_ELEMETN_TYPE,
  TIME_FORMATE_TYPES,
} from '@/constants/element';
import { BaseContext } from '@/constants/global';
import { jsFunctions, validJsFunctions } from '@/constants/jsTriggerFunctions';
import {
  getCheckBoxSearchDetail,
  getNormalSearchDetail,
  getPageSelectOptions,
} from '@/services/frame';
import {
  getValueFromGlobalVariables,
  isGlobalOrCustomVar,
  jsonParse,
  matchGlobalFunctionParam,
  parseDecimal,
  setElementToValue,
  setValueToElement,
  validTriggerMatch,
} from '@/utils/common';
import { Col, Form, Radio, Select, Steps } from 'antd';
import 'braft-editor/dist/index.css';
import classNames from 'classnames';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayClassify, reduceArrObj } from '../../method';
import DataSelectList from '../DataSelectList/NormalSearchSelect';
import formStyles from './DetailForm.less';

const { Option } = Select;
const { Step } = Steps;

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
  userInfo: state.user.userInfo,
}))
class DetailForm extends Component {
  static contextType = BaseContext;
  state = {
    isNew: false,
    formData: {},
    isClick: true, // 是点击
    editorState: {},
    modeType: false, // 1:详情，0、null: 简约
  };
  // url设置
  setFileUrl = (data, eleObj) => {
    const { id } = eleObj;
    const { formData, tabInfo, tabData, setFrameState, form } = this.props;
    form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${id}`]: JSON.stringify({
              id: data,
              name: data,
            }),
          },
        },
      },
      () => {
        form &&
          form.setFieldsValue({
            [`a${id}`]: data,
          });
      },
    );
  };

  // 判断触发值是否是变量，如果是变量变成对应的值
  reducevVariableToData = arr => {
    if (!arr.length) return;
    const { getValueFromCurrentTabData } = this.props;
    let newData = [];
    arr.forEach(item => {
      if (
        item.endTriggerNum &&
        item.endTriggerNum.indexOf('@@') > -1 &&
        item.endTriggerNum.split('@@').length < 3
      ) {
        item.endTriggerNum = getValueFromCurrentTabData(item.endTriggerNum);
      }
      newData.push(item);
    });
    return newData;
  };

  // 数据选择框 根据id获取详情
  fetchDetailById = (eleObj, id) => {
    const { mainTableName: tabSource, mainColumnName, id: eleId, basetype, triggerSign } = eleObj;
    const api = basetype === 45 ? getCheckBoxSearchDetail : getNormalSearchDetail;
    const params = {
      [basetype === 45 ? 'tableName' : 'tabSource']: tabSource,
      [basetype === 45 ? 'ids' : 'id']: id,
    };
    api(params).then(res => {
      const { setFrameState, tabData, tabInfo } = this.props;
      let resData =
        basetype === 45
          ? {
              id: res.map(item => item.id).join(','),
              name: res.map(item => item[mainColumnName]).join(','),
            }
          : {
              id: res.id || '',
              name: res[mainColumnName] || '',
            };
      setFrameState(
        {
          tabData: {
            ...tabData,
            [tabInfo.id]: {
              ...tabData[tabInfo.id],
              [`a${eleId}`]: JSON.stringify(resData),
            },
          },
        },
        () => {
          // 该控件为选择框，则需要继续校验该控件的触发器
          if (SEARCH_SELECT_TYPE.includes(basetype)) {
            if (!triggerSign) {
              this.handleTriggerEvent(eleObj, res);
            } else {
              this.handleNewTriggerEvent(eleObj, res);
            }
          }
        },
      );
    });
  };
  // 触发器实现新(数据选择框)
  handleNewTriggerEvent = (eleObj = {}, selecctedData = {}, data = {}) => {
    const {
      getValueFromCurrentTabData,
      originTabData,
      form,
      triggerMap,
      activeTreeNode,
      elementMap = {},
      tabInfo = {},
      formData,
      tabData = {},
      setFrameState,
      tabList,
    } = this.props;
    const { id, basetype: eleObjBasetype } = eleObj;
    const eleTriggers = triggerMap[id];
    const targetEleList = []; // 目标控件列表
    const elementList = elementMap[tabInfo.id];
    // triggerType对应触发器值1前端2后3存储4js5http6jira
    // basetype对于的点击事件，区分数据变化，加载
    const triggers =
      (eleTriggers && eleTriggers.filter(item => item.triggerType === 1 && item.basetype === 3)) ||
      [];
    let unsetData = {};
    let eventType = arrayClassify(triggers, 'elementEvent') || []; // 处理出来有几种前端触发器事件
    if (!eventType.length) return;
    let reduceEventType = reduceArrObj(
      eventType,
      'endTriggerNum',
      'conditionType',
      'eventBasepriority',
      'methodType',
    );
    let triggerList = this.reducevVariableToData(reduceEventType),
      ids = ''; // 默认值处理成值
    if (eleObjBasetype === 45) {
      ids =
        JSON.stringify(selecctedData) !== '{}' ? selecctedData.map(item => item.id).join(',') : '';
    }
    let list =
      triggerList.filter(item => {
        const { endTriggerNum } = item;
        return validTriggerMatch(
          item,
          eleObjBasetype === 45 ? ids : selecctedData.id,
          endTriggerNum,
          getValueFromCurrentTabData,
        );
      }) || []; // 过滤出符合条件的事件
    if (!list.length) return;
    list.sort((a, b) => {
      return a.eventBasepriority - b.eventBasepriority;
    }); // 排序
    let newList = [];
    list.forEach(item => {
      newList.push(item.list);
    });
    let lastList = newList.reduce((a, b) => {
      return a.concat(b);
    });
    lastList.forEach(trigger => {
      const {
        canModifyValue,
        relationElementValue,
        relationElementId,
        relationElementRequisite,
        relationElementReadonly,
        relationElementVisible,
      } = trigger;
      const targetEle = elementList.find(item => item.id === relationElementId);
      // 全局函数入参
      if (!targetEle) return;
      const {
        basetype,
        id,
        valueFieldType,
        mainColumnName,
        relationColumnName,
        relationTabId,
      } = targetEle;
      let listTableInfo = tabList.find(item => item.id === relationTabId) || {};
      const { showType } = listTableInfo;
      if (basetype === 42 && canModifyValue && showType === 1) {
        const { getSubPanelListData } = this.props;
        getSubPanelListData({});
      }
      if (basetype !== 42 && relationElementValue === '@@InitValue') {
        let formData = originTabData[tabInfo.id];
        unsetData[`a${id}`] = formData[[`a${id}`]];
        let targetEleValue =
          formData[[`a${id}`]] &&
          JSON.parse(formData[[`a${id}`]]) &&
          JSON.parse(formData[[`a${id}`]]).id;
        // 该控件为选择框，则需要继续校验该控件的触发器
        if (SEARCH_SELECT_TYPE.includes(basetype) && !isNaN(Number(targetEleValue))) {
          if (basetype === 17 && valueFieldType === 2) return;
          this.fetchDetailById(targetEle, +targetEleValue);
        }
      } else if (relationElementValue === '@@Null') {
        unsetData[`a${id}`] = JSON.stringify({ id: '', name: '' });
      } else if (!relationElementValue) {
        unsetData = { ...unsetData };
      } else {
        const funcParam = matchGlobalFunctionParam(relationElementValue);
        let targetEleName = selecctedData[funcParam];
        if (!targetEleName) {
          targetEleName =
            relationElementValue && relationElementValue.indexOf('@@') > -1
              ? getValueFromCurrentTabData(relationElementValue)
              : relationElementValue;
        }
        if (valueFieldType === 2) {
          unsetData[`a${id}`] = JSON.stringify({
            id: targetEleName,
            name: selecctedData[mainColumnName],
          });
        } else {
          unsetData[`a${id}`] = JSON.stringify({
            id: targetEleName || '',
            name: targetEleName || '',
          });
        }
        if (eleObjBasetype === 45 && !!funcParam && !SEARCH_SELECT_TYPE.includes(basetype)) {
          // 如果触发器初始控件是多选框并且被触发的控件有对应的paramKey，就拼装数据
          if (JSON.stringify(selecctedData) !== '{}') {
            targetEleName = selecctedData.map(item => item[funcParam]).join(',');
            let data1 = {
              id: selecctedData.map(item => item[funcParam]).join(','),
              name: selecctedData.map(item => item[funcParam]).join(','),
            };
            unsetData[`a${id}`] = JSON.stringify(data1);
          } else {
            unsetData[`a${id}`] = JSON.stringify({ id: '', name: '' });
          }
        } else if (eleObjBasetype === 45 && !funcParam && !SEARCH_SELECT_TYPE.includes(basetype)) {
          unsetData[`a${id}`] = JSON.stringify({
            id: relationElementValue,
            name: relationElementValue,
          });
        }
        // 如果触发器初始控件是多选框并且被触发的控件是数据选择框，
        if (eleObjBasetype === 45 && [3, 12, 25, 17].includes(basetype)) {
          let arr = [],
            param = '';
          if (funcParam) {
            if (JSON.stringify(selecctedData) !== '{}') {
              selecctedData.forEach(item => {
                let value = item[funcParam];
                if ((typeof value === 'number' || !!value) && arr.indexOf(item[funcParam]) === -1) {
                  arr.push(value);
                }
              });
              param = arr.join(',');
              param = Array.from(new Set(param.split(','))).join(',');
            } else {
              param = '';
            }
          } else {
            param = relationElementValue;
          }
          // 去重之后有一个值的，会调用接口，反之不调用
          if (!isNaN(Number(param))) {
            if (basetype === 17 && valueFieldType === 2) return;
            this.fetchDetailById(targetEle, +param);
          }
        }
        // 该控件为选择框，则需要继续校验该控件的触发器
        if (basetype === 45) {
          if (eleObjBasetype === 45 && JSON.stringify(selecctedData) !== '{}') {
            let arr = [];
            selecctedData.forEach(item => {
              let value = item[funcParam];
              if ((typeof value === 'number' || !!value) && arr.indexOf(item[funcParam]) === -1) {
                arr.push(value);
              }
            });
            targetEleName = arr.join(',');
          }
          !!targetEleName && this.fetchDetailById(targetEle, targetEleName);
        }

        // 该控件为选择框，则需要继续校验该控件的触发器
        if (
          eleObjBasetype !== 45 &&
          targetEleName &&
          SEARCH_SELECT_TYPE.concat([17]).includes(basetype) &&
          !isNaN(Number(targetEleName))
        ) {
          if (basetype === 17 && valueFieldType === 2) return;
          this.fetchDetailById(targetEle, +targetEleName);
        }
        if ([1, 2, 15, 20, 21, 22].includes(basetype)) {
          // todo 级联赋值，目前先不放开，后续放开注释就行
          this.handleChange(targetEle, targetEleName);
        }
      }
      form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
      targetEleList.push({
        ...targetEle,
        requisite: relationElementRequisite,
        readonly: relationElementReadonly,
        visiabled: relationElementVisible,
      });
    });
    const newElementList = [...elementList];
    targetEleList.length &&
      targetEleList.forEach(changedItem => {
        const targetIndex = newElementList.findIndex(item => changedItem.id === item.id);
        newElementList.splice(targetIndex, 1, changedItem);
      });
    setFrameState({
      tabData: {
        ...tabData,
        [tabInfo.id]: {
          ...tabData[tabInfo.id],
          ...unsetData,
        },
      },
      elementMap: {
        ...elementMap,
        [tabInfo.id]: newElementList,
      },
    });
  };
  // 触发器实现老(数据选择框)
  handleTriggerEvent = (eleObj = {}, selecctedData = {}, data = {}) => {
    const {
      form,
      triggerMap,
      activeTreeNode,
      elementMap = {},
      tabInfo = {},
      formData,
      tabData = {},
      setFrameState,
      isNew,
    } = this.props;
    const { id } = eleObj;
    const eleTriggers = triggerMap[id];
    const targetEleList = []; // 目标控件列表
    const elementList = elementMap[tabInfo.id];
    // triggerType对应触发器值1前端2后3存储4js5http6jira
    // basetype对于的点击事件，区分数据变化，加载
    const triggers =
      (eleTriggers && eleTriggers.filter(item => item.triggerType === 1 && item.basetype === 3)) ||
      [];
    const unsetData = {};
    triggers.forEach(trigger => {
      const {
        relationElementValue,
        relationElementId,
        relationElementRequisite,
        relationElementReadonly,
        relationElementVisible,
      } = trigger;
      const targetEle = elementList.find(item => item.id === relationElementId);
      // 全局函数入参
      const funcParam = matchGlobalFunctionParam(relationElementValue);
      const { basetype, id, valueFieldType, mainColumnName, relationColumnName } = targetEle;
      let targetEleName = selecctedData[funcParam];
      if (valueFieldType === 2) {
        unsetData[`a${id}`] = JSON.stringify({
          id: targetEleName,
          name: selecctedData[mainColumnName],
        });
      } else {
        unsetData[`a${id}`] = JSON.stringify({
          id: targetEleName || '',
          name: targetEleName || '',
        });
      }
      // 该控件为选择框，则需要继续校验该控件的触发器
      if (SEARCH_SELECT_TYPE.includes(basetype) && !isNaN(Number(targetEleName))) {
        if (basetype === 17 && valueFieldType === 2) return;
        this.fetchDetailById(targetEle, +targetEleName);
      }
      form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
      targetEleList.push({
        ...targetEle,
        requisite: relationElementRequisite,
        readonly: relationElementReadonly,
        visiabled: relationElementVisible,
      });
    });
    const newElementList = [...elementList];
    targetEleList.length &&
      targetEleList.forEach(changedItem => {
        const targetIndex = newElementList.findIndex(item => changedItem.id === item.id);
        newElementList.splice(targetIndex, 1, changedItem);
      });
    setFrameState({
      tabData: {
        ...tabData,
        [tabInfo.id]: {
          ...tabData[tabInfo.id],
          ...unsetData,
          ...data,
        },
      },
      elementMap: {
        ...elementMap,
        [tabInfo.id]: newElementList,
      },
    });
  };
  // 直接删除多选便签
  deletteSetChecBoxValue = (selecteds, eleObj) => {
    const { form } = this.props;
    const {
      mainTableName: tabSource,
      relationColumnName,
      id,
      mainColumnName,
      triggerSign,
    } = eleObj;
    const {
      triggerMap,
      activeTreeNode,
      elementMap = {},
      tabInfo = {},
      formData,
      tabData = {},
      setFrameState,
      isNew,
    } = this.props;
    form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${id}`]: JSON.stringify(selecteds),
          },
        },
      },
      () => {
        if (!selecteds.id) {
          this.handleNewTriggerEvent(eleObj);
          return;
        }
        getCheckBoxSearchDetail({
          tableName: tabSource,
          ids: selecteds.id,
        }).then(res => {
          this.handleNewTriggerEvent(eleObj, res);
        });
      },
    );
  };
  // 设置多选框的数据
  handleSetChecBoxValue = (selecteds = [], eleObj) => {
    const { form } = this.props;
    const { relationColumnName, id, mainColumnName, triggerSign } = eleObj;
    const {
      triggerMap,
      activeTreeNode,
      elementMap = {},
      tabInfo = {},
      formData,
      tabData = {},
      setFrameState,
      isNew,
    } = this.props;
    form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
    let data = {
      id: selecteds.map(item => item.id).join(','),
      name: selecteds.map(item => item[mainColumnName]).join(','),
    };
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${id}`]: JSON.stringify(data),
          },
        },
      },
      () => {
        this.handleNewTriggerEvent(eleObj, selecteds, data);
      },
    );
  };
  // 设置数据选择框的值
  handleSetSelectSearchValue = (selecteds = [], eleObj) => {
    const {
      triggerMap,
      activeTreeNode,
      elementMap = {},
      tabInfo = {},
      formData,
      tabData = {},
      setFrameState,
      isNew,
    } = this.props;
    const { form } = this.props;
    const selecctedData = selecteds[0] || {};
    const { relationColumnName, id, mainColumnName, triggerSign } = eleObj;
    form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
    if (!triggerSign) {
      this.handleTriggerEvent(eleObj, selecctedData, {
        [`a${id}`]: JSON.stringify({
          id: selecctedData.id || '',
          name: selecctedData[mainColumnName] || '',
        }),
      });
      return;
    }
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${id}`]: JSON.stringify({
              id: selecctedData.id || '',
              name: selecctedData[mainColumnName] || '',
            }),
          },
        },
      },
      () => {
        this.handleNewTriggerEvent(eleObj, selecctedData, {
          [`a${id}`]: JSON.stringify({
            id: selecctedData.id || '',
            name: selecctedData[mainColumnName] || '',
          }),
        });
      },
    );
  };
  // js触发器转化参数名称及值
  getJsTriggerParmValues = eleObj => {
    const { triggerMap, getValueFromCurrentTabData } = this.props;
    const { id: eleId, basetype: eleType } = eleObj;
    const triggerList = triggerMap[eleId] || [];
    const triggers = triggerList.filter(item => item.triggerType === 4 && item.basetype === 5);
    if (!triggers.length) return false;
    const result = {};
    triggers.forEach(trigger => {
      const { jsFunctionList } = trigger;
      if (!jsFunctionList || !jsFunctionList.length) return;
      jsFunctionList.forEach(jsFunObj => {
        const { valueType, param, paramValue } = jsFunObj;
        if (valueType === 2) {
          result[param] = getValueFromCurrentTabData(paramValue);
        } else {
          result[param] = paramValue;
        }
      });
    });
    return result;
  };
  // 修改数字框
  handleChangeInputNumber = (eleObj, val) => {
    const newVal = val === null ? '' : val;
    const { setFrameState, tabData, tabInfo } = this.props;
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${eleObj.id}`]: JSON.stringify({ id: newVal, name: newVal }),
          },
        },
      },
      () => {
        this.handleChange(eleObj, newVal);
      },
    );
  };
  // 根据控件类型生成对应控件
  setElementToWidget = (eleObj, valueObj = {}) => {
    const {
      functionData = {},
      form,
      formData,
      setFrameState,
      elementMap,
      tabInfo,
      fileRelationList,
      filePassList,
      filterMap,
      getValueFromCurrentTabData,
      triggerSign,
      updataState,
    } = this.props;
    const { canmodify } = functionData.attributes;
    const {
      id,
      defaultValue,
      selectListTabId,
      relationColumnType,
      basetype,
      readonly,
      mainTableName,
      mainColumnName,
      relationTableName,
      relationTabId,
      visiabled,
      placeholderText,
      elementFormat,
      displayName,
    } = eleObj;
    const baseProps = {
      key: `${eleObj.relationColumnName}_${eleObj.id}`,
      disabled: !!readonly || !canmodify,
      placeholder: placeholderText,
    };
    if (basetype === 1) {
      // 数字输入框
      if (NUMBER_COLUMN_TYPE.includes(relationColumnType)) {
        const jsTriggerParamObj = this.getJsTriggerParmValues(eleObj);
        const _props = {
          ...baseProps,
          onChange: val => this.handleChangeInputNumber(eleObj, val),
        };
        if (jsTriggerParamObj) {
          // 有js触发器的计算属性
          const { max, min } = jsTriggerParamObj;
          if (max && !isNaN(Number(max))) _props.max = max;
          if (min && !isNaN(Number(min))) _props.min = min;
        }
        return <CInputNumber {..._props} />;
      }
      return (
        // 输入框
        <CInput
          {...baseProps}
          onChange={e => this.handleChangeInputNumber(eleObj, e.target.value)}
        />
      );
    } else if (SELECT_ELEMETN_TYPE.includes(basetype)) {
      // 下拉框
      const _props = {
        ...baseProps,
        onChange: val => this.handleChange(eleObj, `${val}`),
      };
      return (
        <CSelect {..._props}>
          <Option value={''} key="0_index">
            <FormattedMessage id="global.choose" />
          </Option>
          {this.getOptions(eleObj.id)}
        </CSelect>
      );
    } else if (basetype === 3) {
      const { jumpType, jumpMenuList } = eleObj;
      const hasColor =
        (relationTabId && (jumpType === 1 || !jumpType)) || (jumpType === 2 && jumpMenuList.length);
      if (selectListTabId) {
        return (
          // 数据选择框
          <DataSelectList
            {...baseProps}
            {...this.props}
            eleObj={eleObj}
            filterMap={filterMap}
            form={form}
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            setSelected={selecteds => this.handleSetSelectSearchValue(selecteds, eleObj)}
            handleClickValue={() => !!hasColor && this.props.setPopupTabInfo(eleObj, formData)}
            doSearchList={() => selectListTabId && this.props.setPopupTabInfo1(eleObj, formData)}
            getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
          />
        );
      } else {
        return (
          // 数据选择框
          <NormalSearchSelect
            {...baseProps}
            eleObj={eleObj}
            filterMap={filterMap}
            form={form}
            valueObj={
              JSON.stringify(formData) !== '{}' &&
              formData[`a${eleObj.id}`] &&
              JSON.stringify(formData[`a${eleObj.id}`]) !== '{}'
                ? JSON.parse(formData[`a${eleObj.id}`])
                : {}
            }
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            setSelected={selecteds => this.handleSetSelectSearchValue(selecteds, eleObj)}
            handleClickValue={() => !!hasColor && this.props.setPopupTabInfo(eleObj, formData)}
            getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
          />
        );
      }
    } else if (basetype === 45) {
      const _props = {
        ...baseProps,
        eleObj,
        filterMap,
        form,
        multiple: true,
        valueObj:
          JSON.stringify(formData) !== '{}' &&
          formData[`a${eleObj.id}`] &&
          JSON.stringify(formData[`a${eleObj.id}`]) !== '{}'
            ? JSON.parse(formData[`a${eleObj.id}`])
            : {},
        handleClickValue: () => relationTabId && this.props.setPopupTabInfo(eleObj, formData),
        mainTableName,
        mainColumnName,
      };
      if (selectListTabId) {
        return (
          <DataSelectList
            {..._props}
            {...this.props}
            doSearchList={() => selectListTabId && this.props.setPopupTabInfo1(eleObj, formData)}
            getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
            deleteTag={data => this.deletteSetChecBoxValue(data, eleObj)}
            setSelected={selecteds => this.handleSetChecBoxValue(selecteds, eleObj)}
          />
        );
      }
      return (
        <CheckBoxSearchSelect
          {..._props}
          getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
          deleteTag={data => this.deletteSetChecBoxValue(data, eleObj)}
          setSelected={selecteds => this.handleSetChecBoxValue(selecteds, eleObj)}
        />
      );
    } else if (basetype === 32) {
      let id =
        elementMap[tabInfo.id] &&
        elementMap[tabInfo.id].find(item => item.relationColumnName === 'id').id;
      const ele =
        elementMap[tabInfo.id] &&
        elementMap[tabInfo.id].find(item => item.relationColumnName === 'id');
      const { stateId, typeId, priorityId, elementFormat, parameter } = eleObj;
      return (
        // 上传文件
        <div>
          <CImageshow
            {...this.props}
            {...baseProps}
            relationParams={{
              relationPriorityId: eleObj.priorityId,
              relationStateId: eleObj.stateId,
              relationTypeId: eleObj.typeId,
              relationId: jsonParse(formData['a' + id]).name,
              relationTableName,
              parameter,
              setFrameState,
              filePassList,
              defaultValue: eleObj.defaultValue,
              updataState,
            }}
            eleObj={eleObj}
            relationFileObj={fileRelationList}
            setFileInfo={(fileId, fileObj) => this.handleFileChange(eleObj, fileId, fileObj)}
            onRemoveFile={removeId => this.handleRemoveFile(eleObj, removeId)}
            setParentState={this.setParentState}
            ref={'uploadForm'}
          />
        </div>
      );
    } else if (basetype === 8 || basetype === 13) {
      let id =
        elementMap[tabInfo.id] &&
        elementMap[tabInfo.id].find(item => item.relationColumnName === 'id').id;
      const ele =
        elementMap[tabInfo.id] &&
        elementMap[tabInfo.id].find(item => item.relationColumnName === 'id');
      const { stateId, typeId, priorityId, elementFormat, parameter } = eleObj;
      if (elementFormat === 2) {
        const valueObj = (formData[`a${eleObj.id}`] && JSON.parse(formData[`a${eleObj.id}`])) || {};
        return (
          <ImgUnRelation
            {...baseProps}
            eleObj={eleObj}
            setFileUrl={url => this.setFileUrl(url, eleObj)}
            urlVal={valueObj.id || ''}
          />
        );
      }
      return (
        // 上传文件
        <div>
          <CUpload
            {...baseProps}
            relationParams={{
              relationPriorityId: eleObj.priorityId,
              relationStateId: eleObj.stateId,
              relationTypeId: eleObj.typeId,
              relationId: jsonParse(formData['a' + id]).name,
              relationTableName,
              parameter,
              setFrameState,
              filePassList,
              defaultValue: eleObj.defaultValue,
              updataState,
            }}
            eleObj={eleObj}
            relationFileObj={fileRelationList}
            setFileInfo={(fileId, fileObj) => this.handleFileChange(eleObj, fileId, fileObj)}
            onRemoveFile={removeId => this.handleRemoveFile(eleObj, removeId)}
            setParentState={this.setParentState}
            ref={'uploadForm'}
            // fileRelationList={fileRelationList}
            // setFileInfo={fileRelationList => this.reduceFiles(eleObj, fileRelationList)}
          />
        </div>
      );
    } else if (basetype === 9) {
      const jsTriggerParamObj = this.getJsTriggerParmValues(eleObj);
      const _props = {
        ...baseProps,
        format: TIME_FORMATE_TYPES[elementFormat || 1],
        showTime: elementFormat !== 2,
        onChange: date => this.setHiddenValue(eleObj, date),
      };
      if (jsTriggerParamObj) {
        // 有js触发器的计算属性
        _props.disabledDate = current => jsFunctions.getDatePickerRange(current, jsTriggerParamObj);
        _props.disabledTime = current => jsFunctions.getDatePickerRange(current, jsTriggerParamObj);
      }
      return <CDatePicker {..._props} />;
    } else if (basetype === 10) {
      return (
        // 多行文本
        <CTextArea {...baseProps} onChange={e => this.handleChange(eleObj, e.target.value)} />
      );
    } else if (basetype === 15) {
      return (
        // 多行文本
        <Radio.Group {...baseProps} onChange={e => this.handleChange(eleObj, e.target.value)}>
          {this.getRadioGroup(eleObj.id)}
        </Radio.Group>
      );
    } else if (basetype === 17) {
      return (
        <CLabel
          {...baseProps}
          onChange={value => this.handleChange(eleObj, value)}
          relationTabId={relationTabId}
          onClick={() => relationTabId && this.props.setPopupTabInfo(eleObj, formData)}
        />
      );
    } else if (basetype === 36) {
      return (
        // 评分
        <CRate {...baseProps} onChange={value => this.handleChange(eleObj, value)} />
      );
    } else if (basetype === 39) {
      const valueObj = (formData[`a${eleObj.id}`] && JSON.parse(formData[`a${eleObj.id}`])) || {};
      return <CBraftEditor {...baseProps} eleObj={eleObj} textValue={valueObj.id || ''} />;
    } else if (basetype === 50) {
      return (
        <CQRCode
          eleObj={eleObj}
          valueObj={
            JSON.stringify(formData) !== '{}' &&
            formData[`a${eleObj.id}`] &&
            JSON.stringify(formData[`a${eleObj.id}`]) !== '{}'
              ? JSON.parse(formData[`a${eleObj.id}`])
              : {}
          }
        />
      );
    } else if (basetype === 46) {
      return <CMapInput title={displayName} {...baseProps} />;
    } else {
      return <CInput {...baseProps} onChange={e => this.handleChange(eleObj, e.target.value)} />;
    }
  };
  setParentState = obj => {
    this.setState(obj);
  };
  // 删除文件
  handleRemoveFile = (eleObj, removeId) => {
    const { fileRelationList, setFrameState, filePassList, updataState } = this.props;
    const newFilesObj = _.cloneDeep(fileRelationList);
    const newFilesPassObj = _.cloneDeep(filePassList);
    Object.keys(fileRelationList).forEach(key => {
      if (+key === removeId) {
        delete newFilesObj[key];
      }
    });
    Object.keys(filePassList).forEach(key => {
      if (+key === removeId) {
        delete newFilesObj[key];
      }
    });
    updataState({ fileRelationList: newFilesObj });
    setFrameState({ filePassList: newFilesPassObj });
  };
  // 更新关联文件
  handleFileChange = (eleObj, fileId, fileObj) => {
    const { stateId, typeId, priorityId, id: eleId, parameter } = eleObj;
    const { fileRelationList, setFrameState, form, filePassList, updataState } = this.props;
    form && form.resetFields([`a${eleId}`]);
    const newFiles = {
      [fileId]: {
        stateId,
        typeId,
        priorityId,
      },
    };
    updataState({
      fileRelationList: {
        ...fileRelationList,
        ...newFiles,
      },
    });
    if (parameter) {
      const newFilePass = [
        {
          ...fileObj,
          stateId,
          typeId,
          priorityId,
        },
      ];
      let files = filePassList[parameter] || [];
      files = [...files, ...newFilePass];
      let newFilePassList = filePassList;
      newFilePassList[parameter] = files;
      setFrameState({
        filePassList: newFilePassList,
      });
    }
  };
  // 数据变化
  handleNewChange = (eleObj, valStr) => {
    const { id, relationColumnType } = eleObj;
    if (relationColumnType === 4) {
      valStr = parseDecimal(valStr + '');
    }
    const {
      tabList,
      activeTreeNode,
      userInfo,
      originTabData,
      triggerMap,
      form,
      tabInfo,
      elementMap,
      setFrameState,
      originElementMap,
      getValueFromCurrentTabData,
      tabData,
      isNew,
    } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    let leftListTabInfo = tabList.find(item => item.showType === 3);
    let leftIdEle = elementMap[leftListTabInfo.id].find(item => item.relationColumnName === 'id');
    const triggerData =
      (triggerMap[id] &&
        triggerMap[id].filter(item => item.basetype !== 4 && item.triggerType === 1)) ||
      [];
    let eventType = arrayClassify(triggerData, 'elementEvent') || []; // 处理出来有几种前端触发器事件
    if (!eventType.length) return;
    let reduceEventType = reduceArrObj(
      eventType,
      'endTriggerNum',
      'conditionType',
      'eventBasepriority',
      'methodType',
    );
    let triggerList = this.reducevVariableToData(reduceEventType); // 默认值处理成值
    let list =
      triggerList.filter(item => {
        const { endTriggerNum } = item;
        return validTriggerMatch(item, valStr, endTriggerNum, getValueFromCurrentTabData);
      }) || []; // 过滤出符合条件的事件
    if (!list.length) return;
    list.sort((a, b) => {
      return a.eventBasepriority - b.eventBasepriority;
    }); // 排序
    let newList = [];
    list.forEach(item => {
      newList.push(item.list);
    });
    let lastList = newList.reduce((a, b) => {
      return a.concat(b);
    });
    const targetEleList = []; // 目标控件列表
    let targetEleData = {}; // 目标控件的值
    const CascadeDropbox = []; // 级联下拉框
    // 对应的触发器事件
    if (lastList.length) {
      lastList.forEach(item => {
        let {
          endTriggerNum,
          relationElementId,
          relationElementRequisite,
          relationElementReadonly,
          relationElementVisible,
          relationElementValue,
          canModifyValue,
        } = item;
        relationElementValue = relationElementValue === null ? '' : relationElementValue;
        const targetEle = elementList.find(item => item.id === relationElementId) || {};
        const { basetype, id: targetEleId, valueFieldType, mainColumnName } = targetEle;
        if (targetEle.elementFormat === 2) CascadeDropbox.push(targetEle);
        let value = relationElementValue;
        if (basetype === 42 && canModifyValue) {
          const { getSubPanelListData } = this.props;
          getSubPanelListData({});
        }
        if (relationElementValue === '@@InitValue') {
          let formData = originTabData[tabInfo.id];
          targetEleData[`a${targetEleId}`] = formData[[`a${targetEleId}`]];
        } else if (relationElementValue === '@@Null') {
          targetEleData[`a${targetEleId}`] = JSON.stringify({ id: '', name: '' });
        } else if (!relationElementValue) {
          targetEleData = { ...targetEleData };
        } else if (isGlobalOrCustomVar(relationElementValue)) {
          value =
            getValueFromGlobalVariables({
              globalVar: relationElementValue,
              treeNodeData:
                activeTreeNode &&
                JSON.stringify(activeTreeNode) !== '{}' &&
                JSON.parse(activeTreeNode[`${leftIdEle.id}`]),
              userInfo,
            }) || getValueFromCurrentTabData(relationElementValue);
          targetEleData[`a${targetEleId}`] = JSON.stringify({ id: value, name: value });
        } else {
          targetEleData[`a${targetEleId}`] = JSON.stringify({ id: value, name: value });
        }
        // 目标控件
        const { relationColumnName, id, relationColumnType } = targetEle;
        // 该控件为选择框，则需要继续校验该控件的触发器
        if (value && SEARCH_SELECT_TYPE.includes(basetype) && !isNaN(Number(value))) {
          if (basetype === 17 && valueFieldType === 2) return;
          this.fetchDetailById(targetEle, +value);
        } else if (basetype === 45 && value) {
          this.fetchDetailById(targetEle, value);
        }
        if ([1, 2, 15, 20, 21, 22].includes(basetype)) {
          // todo 级联赋值，目前先不放开，后续放开注释就行
          this.handleChange(targetEle, value);
        }
        // 属性的改变-改变对应数据
        targetEleList.push({
          ...targetEle,
          requisite: relationElementRequisite,
          readonly: relationElementReadonly,
          visiabled: relationElementVisible,
        });
        // 值的改变-直接表单赋值
        form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
      });
      // 更新元素属性
      const newElementList = [...elementList];
      targetEleList.length &&
        targetEleList.forEach(changedItem => {
          const targetIndex = newElementList.findIndex(item => changedItem.id === item.id);
          newElementList.splice(targetIndex, 1, changedItem);
        });
      let obj = {};
      CascadeDropbox.forEach(item => {
        obj[`a${item.id}`] = '';
      });
      form.setFieldsValue(obj); // 值恢复
      setFrameState(
        {
          elementMap: {
            ...elementMap,
            [tabInfo.id]: [...newElementList],
          },
          tabData: {
            ...tabData,
            [tabInfo.id]: {
              ...tabData[tabInfo.id],
              ...targetEleData,
            },
          },
        },
        () => {
          if (CascadeDropbox.length) {
            this.fetchEleDropDownData(CascadeDropbox, eleObj, valStr);
          }
        },
      );
    } else {
      form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
      setFrameState({
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
          },
        },
      });
    }
  };
  // 数据改变(老)
  handleChange = (eleObj, valStr) => {
    const { triggerSign } = eleObj;
    const {
      tabList,
      activeTreeNode,
      userInfo,
      originTabData,
      triggerMap,
      form,
      tabInfo,
      elementMap,
      setFrameState,
      originElementMap,
      getValueFromCurrentTabData,
      tabData,
      isNew,
    } = this.props;
    if (triggerSign) {
      setFrameState(
        {
          tabData: {
            ...tabData,
            [tabInfo.id]: {
              ...tabData[tabInfo.id],
              [`a${eleObj.id}`]: JSON.stringify({ id: valStr, name: valStr }),
            },
          },
        },
        () => {
          this.handleNewChange(eleObj, valStr);
        },
      );
      return;
    }
    const { id } = eleObj;
    const elementList = elementMap[tabInfo.id] || [];
    const originElementList = originElementMap[tabInfo.id];
    let leftListTabInfo = tabList.find(item => item.showType === 3);
    let leftIdEle = elementMap[leftListTabInfo.id].find(item => item.relationColumnName === 'id');
    let newOriginElementMap = JSON.parse(JSON.stringify(originElementMap));
    const triggerData =
      (triggerMap[id] &&
        triggerMap[id].filter(item => item.basetype !== 4 && item.triggerType === 1)) ||
      [];
    const targetEleList = []; // 目标控件列表
    const targetEleData = {}; // 目标控件的值
    const CascadeDropbox = []; // 级联下拉框
    if (triggerData.length) {
      // 对应的触发器事件
      if (triggerData.length) {
        triggerData.forEach(item => {
          let {
            beginTriggerNum,
            endTriggerNum,
            relationElementId,
            relationElementRequisite,
            relationElementReadonly,
            relationElementVisible,
            relationElementValue,
            canModifyValue,
          } = item;
          relationElementValue = relationElementValue === null ? '' : relationElementValue;
          const validMatch = validTriggerMatch(
            item,
            valStr,
            endTriggerNum,
            getValueFromCurrentTabData,
          );
          const targetEle = elementList.find(item => item.id === relationElementId) || {};
          if (targetEle.elementFormat === 2) CascadeDropbox.push(targetEle);
          let value = relationElementValue;
          if (isGlobalOrCustomVar(relationElementValue)) {
            value =
              getValueFromGlobalVariables({
                globalVar: relationElementValue,
                treeNodeData:
                  activeTreeNode &&
                  JSON.stringify(activeTreeNode) !== '{}' &&
                  JSON.parse(activeTreeNode[`${leftIdEle.id}`]),
                userInfo,
              }) || getValueFromCurrentTabData(relationElementValue);
          }
          // 目标控件
          const { relationColumnName, id, relationColumnType } = targetEle;
          if (validMatch) {
            // 属性的改变-改变对应数据
            targetEleList.push({
              ...targetEle,
              requisite: relationElementRequisite,
              readonly: relationElementReadonly,
              visiabled: relationElementVisible,
            });
            // 值的改变-直接表单赋值
            // relationColumnName && form.setFieldsValue({
            //   [`a${id}`]: relationColumnType === 2 ? Number(value) : value,
            // });
            form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
            targetEleData[`a${id}`] = JSON.stringify({ id: value, name: value });
          } else {
            // form.resetFields([`a${id}`]); // 值恢复
            // // 属性恢复原始状态
            const originTargetEle = originElementList.find(item => item.id === relationElementId);
            originTargetEle && targetEleList.push(originTargetEle);
          }
        });
        // 更新元素属性
        // const newElementList = [...newOriginElementMap[tabInfo.id]];
        const newElementList = [...elementList];
        targetEleList.length &&
          targetEleList.forEach(changedItem => {
            const targetIndex = newElementList.findIndex(item => changedItem.id === item.id);
            newElementList.splice(targetIndex, 1, changedItem);
          });
        let obj = {};
        CascadeDropbox.forEach(item => {
          obj[`a${item.id}`] = '';
        });
        form.setFieldsValue(obj); // 值恢复
        setFrameState(
          {
            elementMap: {
              ...elementMap,
              [tabInfo.id]: newElementList,
            },
            tabData: {
              ...tabData,
              [tabInfo.id]: {
                ...tabData[tabInfo.id],
                ...targetEleData,
                [`a${eleObj.id}`]: JSON.stringify({ id: valStr, name: valStr }),
              },
            },
          },
          () => {
            if (CascadeDropbox.length) {
              this.fetchEleDropDownData(CascadeDropbox, eleObj, valStr);
            }
          },
        );
      } else {
      }
    } else {
      form.resetFields([`a${id}`, `${IGNORE_FORM_ITEM}${id}`]);
      setFrameState({
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${eleObj.id}`]: JSON.stringify({ id: valStr, name: valStr }),
          },
        },
      });
    }
  };
  // 获取当前下拉框的下拉数据
  fetchEleDropDownData = (CascadeDropbox, eleObj, valStr) => {
    const { filterMap, updataState, tabDropDownData } = this.props;
    // 下拉框控件列表
    const dropDownList = CascadeDropbox.filter(
      item => SELECT_ELEMETN_TYPE.includes(item.basetype) && !!item.mainTableName,
    ).map(item => ({
      dataSource: item.mainTableName,
      elementId: item.id,
    }));
    if (!dropDownList.length) return;
    const globalMap = {};
    // 从实体过滤器过滤出含有下拉控件的过滤器
    let dropFilterMap = {};
    Object.keys(filterMap).forEach(item => {
      if (dropDownList.find(items => Number(items.elementId) === Number(item))) {
        dropFilterMap[item] = filterMap[item];
      }
    });
    Object.keys(dropFilterMap).map(key => {
      dropFilterMap[key].forEach(item => {
        const { asqlValue, asqlValueType } = item;
        if (asqlValueType === 2) {
          // globalMap[item.asqlValue] = this.getGlobalVarValues({ varName: asqlValue });
          if (asqlValue === eleObj.parameter) {
            globalMap[item.asqlValue] = valStr;
          } else {
            globalMap[item.asqlValue] = '';
          }
        }
      });
    });
    getPageSelectOptions({ dropDownList, globalMap }).then(res => {
      updataState({
        tabDropDownData: {
          ...tabDropDownData,
          ...res,
        },
      });
    });
  };

  // 获取下拉框数据
  getOptions = id => {
    let { tabDropDownData = {} } = this.props;
    const optionData = tabDropDownData[id] || [];
    // 只显示下拉数据有id和name的项，否则不显示
    return optionData
      .filter(item => item.name)
      .map(item => (
        <Option value={item.id} key={`select_option_${item.id}`}>
          {item.name}
        </Option>
      ));
  };
  // 单选框
  getRadioGroup = id => {
    let { tabDropDownData = {} } = this.props;
    const optionData = tabDropDownData[id] || [];
    // 只显示下拉数据有id和name的项，否则不显示
    return optionData
      .filter(item => item.name)
      .map(item => (
        <Radio value={item.id} key={`Radio_${item.id}`}>
          {item.name}
        </Radio>
      ));
  };
  // 修改表象控件时对应修改隐藏真实值的控件
  setHiddenValue = (eleObj, eleValue) => {
    const { setFrameState, tabData, tabInfo, form } = this.props;
    const { relationColumnName, id } = eleObj;
    const value = setElementToValue(eleObj, eleValue);
    let valStr = eleValue ? moment(eleValue).format('YYYY-MM-DD HH:mm:ss') : '';
    setFrameState(
      {
        tabData: {
          ...tabData,
          [tabInfo.id]: {
            ...tabData[tabInfo.id],
            [`a${eleObj.id}`]: JSON.stringify({ id: valStr, name: valStr }),
          },
        },
      },
      () => {
        form.setFieldsValue({ [`a${id}`]: valStr });
        this.handleChange(eleObj, valStr);
      },
    );
  };

  // 返回对应的值
  returnValue = (defaultValue, activeTreeNode, leftIdEle, eleObj, userInfo) => {
    return (
      getValueFromGlobalVariables({
        globalVar: defaultValue,
        treeNodeData:
          activeTreeNode &&
          JSON.stringify(activeTreeNode) !== '{}' &&
          JSON.parse(activeTreeNode[`${leftIdEle.id}`]),
        eleObj,
        userInfo,
      }) || defaultValue
    );
  };
  // 自定义校验规则
  customValidRule = (params, eleObj, rule, value, callback) => {
    const { langLib } = this.context;
    if (!params) {
      // 无js触发器计算属性的不校验
      callback();
      return;
    }
    validJsFunctions({
      params,
      eleObj,
      langLib,
      value,
      callback,
    });
  };

  // 生成隐藏表单项
  setHiddenItem = (eleObj, jsTriggerParamObj) => {
    const {
      tabList,
      activeTreeNode,
      form,
      formData,
      userInfo,
      tabInfo,
      prevTabInfo,
      prevListRowData,
      elementMap,
      tabData,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      relationColumnName,
      displayName,
      columnSpan,
      requisite,
      basetype,
      id,
      defaultValue,
      tooltipText,
    } = eleObj;
    let valueObj = formData[`a${id}`] ? JSON.parse(formData[`a${id}`]) : '';
    let leftListTabInfo = tabList.find(item => item.showType === 3);
    let leftIdEle = elementMap[leftListTabInfo.id].find(item => item.relationColumnName === 'id');
    const initialValue =
      setValueToElement(eleObj, valueObj.name) ||
      getValueFromGlobalVariables({
        globalVar: defaultValue,
        eleObj,
        treeNodeData:
          activeTreeNode &&
          JSON.stringify(activeTreeNode) !== '{}' &&
          JSON.parse(activeTreeNode[`${leftIdEle.id}`]),
        isRealValue: false,
        userInfo,
      }) ||
      '';
    const label = <LabelTip iconType="start" eleObj={eleObj} />;
    return (
      <Fragment>
        <Form.Item // 显示的控件
          label={label}
        >
          {getFieldDecorator(`${IGNORE_FORM_ITEM}${id}`, {
            initialValue:
              basetype === 9 && String(initialValue).indexOf('1970 00:00:00') > -1
                ? ''
                : initialValue,
            rules: [
              {
                required: !!requisite,
                message: <FormattedMessage id="global.required" />,
              },
              {
                validator: (...args) => this.customValidRule(jsTriggerParamObj, eleObj, ...args),
              },
            ],
          })(this.setElementToWidget(eleObj, valueObj))}
        </Form.Item>
        <div className="hide">
          {/* <div> */}
          <Form.Item // 隐藏的实际值控件
            label={displayName}
          >
            {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
              // initialValue: eleObj.basetype === 9 ? (valueObj ? valueObj : '') : (valueObj.id ? valueObj.id : ''),
              initialValue:
                valueObj.id ||
                getValueFromGlobalVariables({
                  globalVar: defaultValue,
                  treeNodeData:
                    activeTreeNode &&
                    JSON.stringify(activeTreeNode) !== '{}' &&
                    JSON.parse(activeTreeNode[`${leftIdEle.id}`]),
                  eleObj,
                  userInfo,
                }) ||
                defaultValue ||
                '',
              rules: [
                {
                  required: false,
                  message: <FormattedMessage id="global.required" />,
                },
              ],
            })(<CInput />)}
          </Form.Item>
        </div>
      </Fragment>
    );
    // }
  };
  // 根据类型生成表单项
  setItem = eleObj => {
    // if (!this.validEleObjToShow(eleObj)) return;
    const { langLib } = this.context;
    const {
      activeTreeNode,
      tabList,
      form,
      formData = {},
      userInfo,
      tabInfo,
      prevTabInfo,
      prevListRowData,
      elementMap,
    } = this.props;
    const { modeType } = this.state;
    const { getFieldDecorator } = form;
    const {
      relationColumnName,
      relationColumnType,
      displayName,
      columnSpan,
      requisite,
      basetype,
      id,
      defaultValue,
      visiabled,
      tooltipText,
      issimple,
      segmentationstyle,
    } = eleObj;
    if (formData[`a${id}`] === 'null' || JSON.stringify(formData[`a${id}`]) === '{}') {
      formData[`a${id}`] = JSON.stringify({ id: null, name: null });
    }
    let leftListTabInfo = tabList.find(item => item.showType === 3);
    let leftIdEle = elementMap[leftListTabInfo.id].find(item => item.relationColumnName === 'id');
    const label = <LabelTip iconType="start" eleObj={eleObj} />;
    const jsTriggerParamObj = this.getJsTriggerParmValues(eleObj);
    const initialValue =
      formData[`a${id}`] !== 'null' && formData[`a${id}`]
        ? relationColumnType === 4
          ? parseDecimal(String(JSON.parse(formData[`a${id}`]).name))
          : JSON.parse(formData[`a${id}`]).name ||
            this.returnValue(defaultValue, activeTreeNode, leftIdEle, eleObj, userInfo)
        : this.returnValue(defaultValue, activeTreeNode, leftIdEle, eleObj, userInfo);
    let SingleItem = null;
    if (basetype === 11) {
      // 分割线
      SingleItem = <SplitLine title={displayName} segmentationstyle={segmentationstyle} />;
    } else if ([3, 9, 45].includes(basetype) || (basetype === 8 && eleObj.elementFormat === 2)) {
      // 需要生成隐藏表单项的控件
      SingleItem = this.setHiddenItem(eleObj, jsTriggerParamObj);
    } else if (FILTER_ELEMENT_TYPE.includes(basetype)) {
      SingleItem = (
        <Form.Item label={label}>
          {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
            initialValue:
              formData[`a${id}`] && JSON.parse(formData[`a${id}`]).id
                ? Number(JSON.parse(formData[`a${id}`]).id)
                : Number(defaultValue) === 0
                ? ''
                : Number(defaultValue),
            rules: [
              {
                required: !!requisite,
                message: <FormattedMessage id="global.required" />,
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    } else if (basetype === 32) {
      SingleItem = (
        <Form.Item label={label}>
          {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
            initialValue,
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    } else if (basetype === 8 || basetype === 13) {
      SingleItem = (
        <Form.Item label={label}>
          {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
            initialValue,
            rules: [
              {
                required: !!requisite,
                validator: (_, value, callback) => {
                  const fileList = (this.refs && this.refs.uploadForm.state.fileList) || [];
                  if (!!requisite && !fileList.length) {
                    if (basetype === 13) {
                      callback(langLib['validator.upload.noFiles']);
                      return;
                    }
                    callback(langLib['validator.upload.noData']);
                  } else {
                    callback();
                  }
                },
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    } else if (basetype === 39) {
      SingleItem = (
        <Form.Item label={label}>
          {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
            initialValue,
            validateTrigger: 'onBlur',
            rules: [
              {
                required: !!requisite,
                validator: (_, value, callback) => {
                  if (
                    (!!requisite && !value) ||
                    (!!requisite && value.editorState && value.editorState.isEmpty())
                  ) {
                    callback(langLib['validator.textEditor.noData']);
                  } else {
                    callback();
                  }
                },
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    } else if (basetype === 42) {
    } else {
      SingleItem = (
        <Form.Item label={label}>
          {getFieldDecorator(`a${id}` || `${EMPTY_ITEM}_${id}`, {
            initialValue,
            rules: [
              {
                required: !!requisite,
                message: <FormattedMessage id="global.required" />,
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    }
    const span = (columnSpan && columnSpan > 100) || !columnSpan ? 12 : columnSpan;
    if (!modeType) {
      return (
        <Col span={span} key={`a${id}`} className={visiabled ? '' : 'hide'}>
          {SingleItem}
        </Col>
      );
    }
    if (modeType) {
      let isTrue = true;
      if (visiabled) {
        isTrue = issimple;
      }
      if (!visiabled) {
        isTrue = false;
      }
      return (
        <Col span={span} key={`a${id}`} className={isTrue ? '' : 'hide'}>
          {SingleItem}
        </Col>
      );
    }
    return (
      <Col span={span} key={`a${id}`} className={visiabled ? '' : 'hide'}>
        {SingleItem}
      </Col>
    );
  };
  // 生成表单项
  getFormItems = () => {
    const { tabInfo, elementMap, triggerMap } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    // 纯表单里的控件（不包括按钮）
    const pureElementList = elementList.filter(item => !BTN_ELEMENT_TYPE.includes(item.basetype));
    return pureElementList.map(ele => {
      return this.setItem(ele);
    });
  };
  // 生成步骤条
  renderStep = () => {
    const {
      stepList,
      tabInfo,
      elementMap,
      tabList,
      advancedQueryMap,
      prevListRowData,
      prevTabInfo,
      userInfo,
    } = this.props;
    const currentElementList = elementMap[tabInfo.id] || [];
    let SubPanel = currentElementList.find(item => item.basetype === 42) || {};
    if (JSON.stringify(SubPanel) === '{}' || !SubPanel.relationTabId) return;
    const { relationTabId } = SubPanel;
    let SubPanelTabInfo = tabList.find(item => item.id === relationTabId) || {};
    if (JSON.stringify(SubPanelTabInfo) === '{}' || SubPanelTabInfo.showType !== 9) return;
    let defaultProps = {
      ...this.props,
      tabInfo: SubPanelTabInfo,
    };
    let stepBarList = stepList ? stepList.datalist : [];
    return <FrameStepBar list={stepBarList} {...defaultProps} />;
  };
  doEnableSimplicity = e => {
    this.setState({
      modeType: e,
    });
  };

  render() {
    const { className, tabInfo, elementMap, triggerMap, formData } = this.props;
    const wrapCls = classNames({
      [styles.wrap]: true,
      [formStyles.formWrap]: true,
      [className]: true,
    });
    const { issimpleenable } = tabInfo;
    return (
      <div id="a" className={wrapCls}>
        {/*{!!issimpleenable && <div className={formStyles.switchWrap}>*/}
        {/*  <div className={formStyles.switchPos}>*/}
        {/*    <Switch*/}
        {/*      onChange={this.doEnableSimplicity}*/}
        {/*    />*/}
        {/*    开启简约模式*/}
        {/*   </div>*/}
        {/*  </div>*/}
        {/*  }*/}
        <div className={styles.itemWrap}>
          {this.renderStep()}
          {this.getFormItems()}
        </div>
      </div>
    );
  }
}

export default Form.create()(DetailForm);
