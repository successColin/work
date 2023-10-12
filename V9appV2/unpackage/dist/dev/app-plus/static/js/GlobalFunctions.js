/**
 * 全局方法
 */
import { CHECKED_TYPE } from '@/common/constant/checkrules.js';
import { static_btnElementsInfo } from '@/common/constant/constant.js';
import {
  ELEMENT_BOTTOM_BTNS,
  ELEMENT_COMBOX,
  ELEMENT_SEARCHDATA,
  ELEMENT_TOP_BTNS,
} from '@/common/constant/element.js';
import {
  COMMON_DATA_FORMAT,
  TRIGGRT_BaseValue,
  TRIGGRT_Events,
} from '@/common/functions/trigger.js';
import graceChecker from '@/common/graceChecker/graceChecker.js'; //校验
import { commonApi } from '@/common/request/api.js';
import Static_ParamFormat from '@/static/js/paramFormat.js';

/**
 * @param {Object} element
 * @param {Object} param
 * 	{String mobileTabId}面板id
 */
function static_setRules(element, param) {
  let checkrule = element.requisite && element.visiabled ? 'notnull' : '',
    dataRule = CHECKED_TYPE[element.dataFormat] || '',
    ruleArray = [];
  if (element.requisite && element.visiabled) {
    let checkrule = 'notnull';
    const elementTypes = [2, 3, 12, 25, 20, 21, 22];
    if (elementTypes.indexOf(element.baseType) !== -1)
      checkrule = 'notnullSelect';
    //数据和下拉框选择框
    else if (element.baseType === 8) checkrule = 'imgnotnull'; //图片
    ruleArray.push(checkrule);
  }
  if (dataRule) ruleArray.push(dataRule);
  let rule = {
    name: element.elementId,
    checkType: ruleArray.join(','),
    checkRule: '',
    label: element.label,
    errorMsg: element.label + '不能为空',
  };

  if (!param.mobileTabId) return '';
  else return rule;
}
class Static_GlobalFucs {
  constructor(arg) {}
  //判断按钮是否有权限
  Permissiones(bundleId, basetype, formType) {
    const bundlePers = uni.getStorageSync('bundlePermissiones') || {},
      bundlePer = bundlePers[bundleId];
    const element =
        static_btnElementsInfo.find((item) => item.basetype === basetype) || {},
      elementPer = element.permissiones || {},
      elementNoPer = element.noPermissiones || [];
    if (formType && elementNoPer.indexOf(formType) !== -1) return false;

    let flag = false;
    for (let key in elementPer) {
      if (elementPer[key] === bundlePer[key]) {
        flag = true;
        break;
      }
    }

    return flag;
  }
  //获取sql中的变量
  getSQLParams(sql) {
    let sqlArry = sql.match(/(?=\{).*?(?=\})/g) || [],
      arry = [];
    for (let i = 0; i < sqlArry.length; i++) {
      arry.push(sqlArry[i].replace('{', ''));
    }
    return arry;
  }
  //数据转化
  Global_dataFormat(value = '', _this) {
    return COMMON_DATA_FORMAT(value);
  }
  /**
   * 变量获取
   */
  getGlobalParam(_this) {
    //获取全局变量、框架变量
    //框架变量
    const frameType = _this.$store.state.frameType; //框架类型
    const FrameVariable = _this.$store.state.FrameVariable[frameType];
    return {
      userInfo: { ..._this.$store.state.userInfo },
      CurrentUserID: {
        id: _this.$store.state.userId,
        name: _this.$store.state.username,
        relationColumnType: 2,
      },
      BusinessID: {
        id: _this.$store.state.BusinessID,
        name: _this.$store.state.BusinessID,
        relationColumnType: 2,
      },
      ParentID: {
        id: _this.$store.state.ParentID,
        name: _this.$store.state.ParentID,
        relationColumnType: 2,
      },
      frameType, //框架类型
      FrameVariable, //框架变量
    };
  }
  Global_ParamFormat(param = {}, _this) {
    param.storeValues = this.getGlobalParam(_this);
    return Static_ParamFormat(param);
  }
  /**前端触发器
   * @param {Object} param
   * 	{String eventType} 触发器类型 4-加载；2、3-数据变化；1-点击
   *  {Object triggerList} 触发器集合
   * 	{Array triggerElements } 触发控件列表
   *  {Array oldElements } 原始控件列表
   *  {Array currentElements } 除按钮、下拉菜单的所有控件
   *  {Array currentBottomBtns } 底部按钮
   *  {Array currentTopRightBtns } 顶部按钮
   *  {Array currentComboBoxs } 下拉菜单
   *  {Objiect formData} 当前数据
   */
  async formElementsTrigger(param, _this) {
    let elements = param.triggerElements, //包括按钮、下拉菜单、表单控件
      currentData = param.formData || {}; //当前表单数据

    const storeValues = this.getGlobalParam(_this); //全局变量
    const btnsArray = [
      ...ELEMENT_BOTTOM_BTNS,
      ...ELEMENT_TOP_BTNS,
      ...ELEMENT_COMBOX,
    ];
    const arrayGetValue = [...ELEMENT_SEARCHDATA, ...[17]];

    const paramFormatConfig = {
      storeValues: storeValues, //全局变量
      tabStaticParams: param.tabStaticParams || {}, //面板固定变量
      tabsElements: _this.tabsElements,
      tabsFormDatas: _this.tabsFormDatas,
    };
    //加载且不是递归时，先处理表单数据，isRecursion是否为递归
    if (param.eventType === 4 && !param.isRecursion) {
      //如果不是按钮，需要做数据、校验规则的设置
      for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i],
          {
            baseType,
            elementFormat,
            elementId,
            defaultValue,
            mainTableName,
            mainColumnName,
            valueFieldType,
            isMultiple,
          } = element;
        if (baseType === 42) continue; //如果为子面板，不进行数据分析
        if (baseType === 8 && elementFormat !== 2) continue;
        //如果为按钮、下拉框、间隔条跳过
        if (btnsArray.indexOf(baseType) !== -1 || baseType === 11) continue;

        //如果没有值并且有默认值修改原始数据
        let elementValue = currentData[elementId] || '';
        elementValue = COMMON_DATA_FORMAT(elementValue); //转化为对象
        elementValue = {
          ...elementValue,
          ...TRIGGRT_BaseValue(baseType, 1, elementValue.id),
        };

        if (!elementValue.id && defaultValue) {
          //没有值且有默认值时
          elementValue = Static_ParamFormat({
            ...{
              key: defaultValue,
              otherTabId: param.relationMainTab,
              mobileTabId: param.mobileTabId,
              bundleParams: param.bundleParams,
            },
            ...paramFormatConfig,
          });
          if (
            arrayGetValue.indexOf(baseType) !== -1 &&
            mainTableName &&
            mainColumnName &&
            valueFieldType !== 2 &&
            elementValue.id
          ) {
            //如果已经有对应的数据，将不再请求接口
            const key = `${mainTableName}_${elementValue.id}`;
            const selectData = param.searchSelectInfo[key] || '';
            let selectvalue = {};
            if (!selectData) {
              await this.getSearchSelectById(
                _this,
                elementValue.id,
                mainTableName,
                isMultiple
              ).then((value) => {
                param.searchSelectInfo[key] = value;
                let result = {};
                //如果不是是多选
                if (!isMultiple)
                  result = { id: value.id, name: value[mainColumnName] || '' };
                else {
                  let resultLabel = [],
                    resultValue = [];
                  value.map((item) => {
                    resultValue.push(item.id);
                    resultLabel.push(item[mainColumnName] || '');
                  });
                  result = {
                    id: resultValue.join(','),
                    name: resultLabel.join(','),
                  };
                }
                selectvalue = result;
              });
            } else {
              selectvalue = {
                id: selectData.id,
                name: selectData[mainColumnName] || '',
              };
            }
            elementValue = { ...elementValue, ...selectvalue };
          }
        }
        //判断是否值为默认值
        elementValue = {
          ...elementValue,
          ...TRIGGRT_BaseValue(element.baseType, 1, elementValue.id),
        };
        elementValue.relationColumnType = element.relationColumnType;
        elementValue.parameter = element.parameter; //变量名
        param.formData[element.elementId] = elementValue;
      }
    }
    _this.SET_TABS_FORMDATAS({
      //设置面板数据
      tabId: param.mobileTabId,
      formData: param.formData,
    });
    let isSascade = [],
      updateElement = [];
    for (
      let elementIndex = 0, len = elements.length;
      elementIndex < len;
      elementIndex++
    ) {
      const element = elements[elementIndex],
        {
          baseType,
          elementFormat,
          elementId,
          defaultValue,
          mainTableName,
          mainColumnName,
          valueFieldType,
          isMultiple,
          triggerSign,
        } = element;
      if (baseType === 11 || baseType === 42) continue; //如果是间隔条、子面板

      let elementValue = currentData[elementId] || {};
      //获取符合条件的控件事件,顺序按优先级排列
      const triggers = param.triggerList[elementId] || [];
      //获取前端触发器对应事件类型的触发器
      let triggerCur =
        triggers.filter(
          (item) => item.basetype === param.eventType && item.triggerType === 1
        ) || [];
      if (triggerCur.length > 0) {
        //如果存在触发器
        let triggerEvents = TRIGGRT_Events({
          otherTabId: param.relationMainTab,
          mobileTabId: param.mobileTabId,
          element: element,
          triggerCur: triggerCur,
          value: elementValue && elementValue.id,
          type: triggerSign, //区分触发器新旧逻辑 1-新
          paramFormatConfig: paramFormatConfig,
        });
        //遍历符合的事件
        console.log('============================q');
        for (
          let triggerEventIndex = 0, len = triggerEvents.length;
          triggerEventIndex < len;
          triggerEventIndex++
        ) {
          const triggerEvent = triggerEvents[triggerEventIndex],
            compareType = triggerEvent.compareType;
          let trigger = triggerEvent.triggers || [];
          for (
            let triggerIndex = 0, len = trigger.length;
            triggerIndex < len;
            triggerIndex++
          ) {
            console.log('getSearchSelectById' + triggerIndex);
            const triggerItem = trigger[triggerIndex];
            const relationElementId = triggerItem.relationElementId,
              relationElementOldValue =
                param.oldFormData[relationElementId] || {},
              relationOldElementIndex = param.oldElements.findIndex(
                (item) => item.elementId === relationElementId
              ),
              relationOldElement =
                relationOldElementIndex === -1
                  ? ''
                  : param.oldElements[relationOldElementIndex];

            let relationElement = { ...relationOldElement };
            if (!relationElement) continue;

            let triggerParam = {};
            if (compareType) {
              //如果符合条件,拿到最原始的控件属性
              triggerParam = {
                requisite: triggerItem.relationElementRequisite,
                readonly: triggerItem.relationElementReadonly,
                visiabled: triggerItem.relationElementVisible,
              };
            }

            //如果不是按钮还需要判断是否需要修改值
            if (relationElement.baseType === 42) {
              //子面板
              if (triggerItem.canModifyValue)
                updateElement.push(relationElementId);
              const index = param.currentTabsChilds.findIndex(
                (item) => item.elementId === relationElementId
              );
              param.currentTabsChilds[index] = {
                ...relationElement,
                ...triggerParam,
              };
              //如果是加载，初始值需要变换
              if (param.eventType === 4)
                param.oldElements[relationOldElementIndex] = {
                  ...relationElement,
                  ...triggerParam,
                };
            } else if (
              ELEMENT_BOTTOM_BTNS.indexOf(relationElement.baseType) !== -1
            ) {
              //底部按钮
              const index = param.currentBottomBtns.findIndex(
                (item) => item.elementId === relationElementId
              );
              param.currentBottomBtns[index] = {
                ...relationElement,
                ...triggerParam,
              };
              //如果是加载，初始值需要变换
              if (param.eventType === 4)
                param.oldElements[relationOldElementIndex] = {
                  ...relationElement,
                  ...triggerParam,
                };
            } else if (
              ELEMENT_TOP_BTNS.indexOf(relationElement.baseType) !== -1
            ) {
              //顶部按钮
              const index = param.currentTopRightBtns.findIndex(
                (item) => item.elementId === relationElementId
              );
              param.currentTopRightBtns[index] = {
                ...relationElement,
                ...triggerParam,
              };
              //如果是加载，初始值需要变换
              if (param.eventType === 4)
                param.oldElements[relationOldElementIndex] = {
                  ...relationElement,
                  ...triggerParam,
                };
            } else if (
              ELEMENT_COMBOX.indexOf(relationElement.baseType) !== -1
            ) {
              //下拉菜单
              const index = param.currentComboBoxs.findIndex(
                (item) => item.elementId === relationElementId
              );
              param.currentComboBoxs[index] = {
                ...relationElement,
                ...triggerParam,
              };
              //如果是加载，初始值需要变换
              if (param.eventType === 4)
                param.oldElements[relationOldElementIndex] = {
                  ...relationElement,
                  ...triggerParam,
                };
            } else {
              //表单控件
              const index = param.currentElements.findIndex(
                (item) => item.elementId === relationElementId
              );
              const currentE = { ...relationElement, ...triggerParam };
              param.currentElements[index] = currentE;
              //如果是加载，初始值需要变换
              if (param.eventType === 4)
                param.oldElements[relationOldElementIndex] = {
                  ...relationElement,
                  ...triggerParam,
                };

              //如果有值并且是符合条件的
              if (compareType) {
                if (!triggerItem.relationElementValue) continue; //如果没有修改值跳出

                let selectDatas = param.searchSelectInfo || {};
                let relationElementValue = '';
                if (triggerItem.relationElementValue === '@@InitValue') {
                  //恢复到原始值
                  relationElementValue = { ...relationElementOldValue };
                } else {
                  const key = `${mainTableName}_${elementValue.id}`;
                  let selectData = selectDatas[key];

                  //selectData为空
                  if (
                    arrayGetValue.indexOf(baseType) !== -1 &&
                    mainTableName &&
                    mainColumnName &&
                    valueFieldType !== 2 &&
                    elementValue.id &&
                    !selectData
                  ) {
                    await this.getSearchSelectById(
                      _this,
                      elementValue.id,
                      mainTableName,
                      isMultiple
                    ).then((value) => {
                      selectData = value;
                      param.searchSelectInfo[key] = value;
                    });
                  }
                  relationElementValue = Static_ParamFormat({
                    key: triggerItem.relationElementValue,
                    otherTabId: param.relationMainTab,
                    mobileTabId: param.mobileTabId,
                    storeValues: storeValues,
                    tabsElements: _this.tabsElements,
                    tabsFormDatas: _this.tabsFormDatas,
                    data: selectData || {}, //数据选择框数据
                  });
                }

                relationElementValue = COMMON_DATA_FORMAT(relationElementValue); //转化数据格式
                relationElementValue.relationColumnType =
                  relationElement.relationColumnType;
                //如果是数据选择框、扫描框或者是lable(有实体表字段且取值类型不是实体表字段的lable)，调取getSearchSelectById接口
                if (
                  arrayGetValue.indexOf(relationElement.baseType) !== -1 &&
                  relationElement.mainTableName &&
                  relationElement.mainColumnName &&
                  relationElement.valueFieldType !== 2 &&
                  relationElementValue.id
                ) {
                  let selectvalue = {},
                    isGetById = false;
                  //如果已经有对应的数据，将不再请求接口
                  let {
                    mainTableName: rmainTableName,
                    mainColumnName: rmainColumnName,
                    isMultiple: risMultiple,
                  } = relationElement;
                  const key = `${rmainTableName}_${relationElementValue.id}`;
                  const selectData = param.searchSelectInfo[key] || '';
                  if (!selectData) {
                    await this.getSearchSelectById(
                      _this,
                      relationElementValue.id,
                      rmainTableName,
                      risMultiple
                    ).then((value) => {
                      param.searchSelectInfo[key] = value;
                      let result = {};
                      //如果不是是多选
                      if (!risMultiple)
                        result = {
                          id: value.id,
                          name: value[rmainColumnName] || '',
                        };
                      else {
                        let resultLabel = [],
                          resultValue = [];
                        value.map((item) => {
                          resultValue.push(item.id);
                          resultLabel.push(item[rmainColumnName] || '');
                        });
                        result = {
                          id: resultValue.join(','),
                          name: resultLabel.join(','),
                        };
                      }
                      selectvalue = result;
                    });
                  } else {
                    let result = {};
                    //如果不是是多选
                    if (!risMultiple)
                      result = {
                        id: selectData.id,
                        name: selectData[rmainColumnName] || '',
                      };
                    else {
                      let resultLabel = [],
                        resultValue = [];
                      selectData.map((item) => {
                        resultValue.push(item.id);
                        resultLabel.push(item[rmainColumnName] || '');
                      });
                      result = {
                        id: resultValue.join(','),
                        name: resultLabel.join(','),
                      };
                    }
                    selectvalue = result;
                  }
                  relationElementValue = {
                    ...relationElementValue,
                    ...selectvalue,
                  };
                }
                if (param.eventType === 4)
                  param.oldFormData[relationElementId] = {
                    ...relationElementValue,
                  };
                param.formData[relationElementId] = { ...relationElementValue };
              } else {
                //如果不符合条件，回复最原始的值
                if (param.eventType === 4)
                  param.oldFormData[relationElementId] = {
                    ...relationElementOldValue,
                  };
                param.formData[relationElementId] = {
                  ...relationElementOldValue,
                };
              }
            }
            //判断该控件是否有级联触发
            const triggers = param.triggerList[relationElementId] || [];
            let triggerCur =
              triggers.filter(
                (item) =>
                  item.basetype === param.eventType && item.triggerType === 1
              ) || [];
            if (triggerCur.length > 0 && compareType)
              isSascade.push(relationElement);
          }
        }
      }
    }
    console.log(updateElement);
    if (updateElement.length > 0) {
      //需要更新数据的控件id
      const old = param.updateElement || [];
      param.updateElement = [...old, ...updateElement];
    }

    if (isSascade.length > 0) {
      param.triggerElements = isSascade;
      param.isRecursion = true;
      return this.formElementsTrigger(param, _this);
    } else {
      return param;
    }
  }

  //获取数据选择框数据
  getSearchSelectById(_this, value, mainTableName, isMultiple) {
    return commonApi.getSearchSelectById(
      _this,
      {
        id: value,
        tabSource: mainTableName,
      },
      isMultiple
    );
  }
  //数据转化
  /**
   * @param {Object} value
   */
  dataFormat(value = '') {
    try {
      //有起始值的转化成json
      value = JSON.parse(value);
    } catch (e) {}

    if (value && typeof value !== 'object') {
      value = {
        id: value,
        name: value,
      };
    }

    return value;
  }
  //提示封装
  showToast(params) {
    let baseConfig = {
      title: '提示信息',
      icon: 'none',
    };
    params = { ...baseConfig, ...params };
    uni.showToast(params);
  }
  showModal(_this, params, type) {
    let baseConfig = {
      title: _this.$t('basic-inquiry'),
      content: '提示信息',
      cancelText: _this.$t('basic-confirm'),
      confirmText: _this.$t('basic-confirm'),
    };
    if (type === 'error') baseConfig.title = _this.$t('basic-modalTipError');

    params = { baseConfig, ...params };
    uni.showModal(params);
  }
  //校验form表单
  checkForm(params) {
    const rule = params.rule || [],
      formData = params.data || [];

    return {
      isCheck: graceChecker.check(formData, rule),
      errorMsg: graceChecker.error,
    };
  }
  //设置主业务id
  setBusinessID(_this, businessID) {
    let data = this.dataFormat(businessID);
    _this.SET_BusinessID(data.id);
    return data;
  }
  /** 跳转到其他路由
   * @param {Object} 下一个面板的参数
   * @param {String} 编码展示类型
   */
  gotoOtherRoute(params, static_mobileTabShowType) {
    let url = `/pages/${static_mobileTabShowType}?relationTab=${params.tabId}`;
    uni.navigateTo({
      url: url,
    });
  }
}

export default Static_GlobalFucs;
