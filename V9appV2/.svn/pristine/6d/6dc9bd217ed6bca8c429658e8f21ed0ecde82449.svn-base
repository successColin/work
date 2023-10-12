/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 触发器方法
 */
import { CHECKED_TYPE } from '@/common/constant/checkrules.js';
import { ELEMNT_BASE_VALUE } from '@/common/constant/element.js';
import { TRIGGER_Conditions } from '@/common/constant/triggers.js';
import dateFormat from '@/static/js/dateFormat.js';
import Static_ParamFormat from '@/static/js/paramFormat.js';
import EsEnum from './EsEnum.js';
//转化数据
export const COMMON_DATA_FORMAT = (value = '') => {
  if (
    typeof value === 'string' &&
    value.indexOf('{') !== -1 &&
    value.indexOf('}') !== -1
  ) {
    try {
      value = JSON.parse(value);
    } catch (e) {}
  }

  if (typeof value !== 'object') {
    value = {
      id: value || '',
      name: value || '',
    };
  }

  return value;
};

//获取控件变量值
export const ELEMENT_PARAMER_FORMAT = (baseConfig = {}) => {
  return Static_ParamFormat(baseConfig);
};

//转化默认值
const BasicDatasEnum = new EsEnum([
  { code: 'BASESTRING', name: '' },
  { code: 'BASEINTZERO', name: 0 },
  { code: 'BASEARRAY', name: [] },
  { code: 'BASEDATETIME', name: '1970-01-01' },
]);
export const TRIGGRT_BaseValue = (elementType, type = 1, name) => {
  //type：1=将系统值转化为空;2=转化为系统默认值
  const dateArray = [9, 31];
  let baseName = name;
  if (dateArray.indexOf(elementType) !== -1 && name)
    baseName = dateFormat.formatDate(baseName, 'yyyy-MM-dd');
  let base =
    ELEMNT_BASE_VALUE.find(
      (item) => item.elmentType.indexOf(elementType) !== -1
    ) || {};
  let baseValue = { id: name };
  if (type === 1 && base.basicData === BasicDatasEnum.getCodeByName(baseName))
    baseValue = { id: '', name: '' };
  else if (type === 2 && !name) {
    let value = BasicDatasEnum.getNameByCode(base.basicData);
    if (value !== 'error') baseValue = { id: value, name: value };
  }
  return baseValue;
};

export const TRIGGRT_GetRule = (element, $t = '') => {
  //设置校验规则
  let dataRule = CHECKED_TYPE[element.dataFormat] || '', //数据格式
    ruleArray = [],
    rule = '';
  if (element.visiabled) {
    //只有可见的控件设置校验规则
    if (element.requisite) {
      //必填
      let checkrule = 'notnull';
      const elementTypes = [2, 3, 12, 25, 20, 21, 22];
      if (elementTypes.indexOf(element.baseType) !== -1)
        checkrule = 'notnullSelect';
      //数据和下拉框选择框
      else if (element.baseType === 8) checkrule = 'imgnotnull'; //图片
      ruleArray.push(checkrule);
    }
    if (dataRule) ruleArray.push(dataRule); //根据控件的数据格式设置校验规则
    if (ruleArray.length > 0)
      rule = {
        name: element.elementId,
        checkType: ruleArray.join(','),
        checkRule: '',
        label: element.label,
      };
  }
  return rule;
};
/**
 * triggerType：触发器类型
 * eventType：事件类型
 */
//按事件区分触发器
function getTriggerByEvent(element, triggerCur) {
  let triggerEvent = {};
  triggerCur.map((item) => {
    if (item.elementEvent in triggerEvent) {
      //如果对应的事件已经存在
      triggerEvent[item.elementEvent].triggers.push(item);
    } else {
      let param = {
        conditionType: item.conditionType, //匹配条件
        endTriggerNum: item.endTriggerNum, //匹配值
        eventBasepriority: item.eventBasepriority || 0, //触发器执行顺序
        methodType: item.methodType, //如果是多控件时的条件类型
        triggers: [item],
      };
      let key = item.elementEvent || item.id; //如果没有elementEvent，每个触发器当做一个事件
      triggerEvent[key] = param;
    }
  });
  return triggerEvent;
}

/**前端触发器比较
 * @param {String} conditionType 比较符
 * @param {String} endTriggerNum 比较值
 * @param {String,Number} value 当前值
 */
//如果为触发条件为多条件
function compareTriggerMuch(config = {}, endTriggerNum) {
  let endTriggerNumObj = '',
    methodType = config.methodType || '';
  //如果没有条件类型或者触发值返回false
  if (!methodType || !endTriggerNum) return false;
  try {
    endTriggerNumObj = JSON.parse(endTriggerNum);
  } catch (e) {
    endTriggerNumObj = [];
  }
  let paramFormatConfig = config.paramFormatConfig || {};

  paramFormatConfig.otherTabId = config.otherTabId;
  paramFormatConfig.mobileTabId = config.mobileTabId;

  let flag = true;
  for (let i = 0, len = endTriggerNumObj.length; i < len; i++) {
    const endTriggerNumValue = endTriggerNumObj[i];
    let key = endTriggerNumValue.key,
      cond = endTriggerNumValue.cond,
      endTriggerNum = endTriggerNumValue.value;
    const conditionType = TRIGGER_Conditions.find((item) => item.name === cond);
    key = Static_ParamFormat({ ...{ key }, ...paramFormatConfig });
    endTriggerNum = Static_ParamFormat({
      ...{ key: endTriggerNum },
      ...paramFormatConfig,
    });
    //如果条件类型为AND
    if (methodType === 1) {
      //只要false就是false 就break
      if (!staticCondition(conditionType, endTriggerNum.id, key.id)) {
        flag = false;
        break;
      }
    } else if (methodType === 2) {
      //如果条件类型为OR
      if (staticCondition(conditionType, endTriggerNum.id, key.id)) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
  }
  return flag;
}
function staticCondition(conditionType, endTriggerNum, value) {
  if (!conditionType) return true;
  const type = conditionType.type,
    condition = conditionType.value;
  //如果需要转化为数字的，但endTriggerNum或者value为非数字 返回false
  if (type === 'Number' && (isNaN(endTriggerNum) || isNaN(value))) return false;
  switch (type) {
    case 'Number':
      endTriggerNum = Number(endTriggerNum);
      value = Number(value);
      break;
    case 'String':
      endTriggerNum = String(endTriggerNum);
      value = String(value);
      break;
    case 'Boolean':
      value = Boolean(value);
      break;
    default:
      break;
  }

  if (condition === 1) {
    //大于
    return value > endTriggerNum;
  } else if (condition === 2) {
    //小于
    return value < endTriggerNum;
  } else if (condition === 3) {
    //等于
    return value === endTriggerNum;
  } else if (condition === 4) {
    //大于等于
    return value >= endTriggerNum;
  } else if (condition === 5) {
    //小于等于
    return value <= endTriggerNum;
  } else if (condition === 6) {
    //不等于
    return value !== endTriggerNum;
  } else if (condition === 7) {
    //为空
    return value === false;
  } else if (condition === 8) {
    //不为空
    return value === true;
  }
}
export const TRIGGRT_ConditionFnc = staticCondition;

function compareTrigger(config = {}, endTriggerNum, value) {
  const conditiontype = config.conditionType;
  if (!conditiontype) return true;

  if (conditiontype === 9) {
    //为多控件
    return compareTriggerMuch(config, endTriggerNum);
  } else {
    const conditionType = TRIGGER_Conditions.find(
      (item) => item.value === conditiontype
    );
    return staticCondition(conditionType, endTriggerNum, value);
  }
}

//判断应该执行什么事件：如果有一个事件是符合的执行，其余事件不执行，
//如果有多个事件同时满足，按照优先级高度执行，优先级1>2
export const TRIGGRT_Events = (param) => {
  const element = param.element;
  const triggerEvent = getTriggerByEvent(element, param.triggerCur),
    type = param.type || 0,
    paramFormatConfig = param.paramFormatConfig || {};
  //type=1:判断对应的事件是否符合触发条件，type=0不判断事件是否符合
  let compareEvent = [], //符合事件
    noCompareEvent = []; //不符合事件
  for (let key in triggerEvent) {
    const triggerEventValue = triggerEvent[key];
    let conditionType = triggerEventValue.conditionType,
      endTriggerNum = triggerEventValue.endTriggerNum || '',
      compareTriggerConfig = {
        conditionType: triggerEventValue.conditionType, //触发条件
        methodType: triggerEventValue.methodType, //如果为多条件触发时触发的条件类型
        otherTabId: param.otherTabId,
        mobileTabId: param.mobileTabId,
        paramFormatConfig: paramFormatConfig,
      };

    endTriggerNum = Static_ParamFormat({
      ...{
        key: endTriggerNum,
        otherTabId: param.otherTabId,
        mobileTabId: param.mobileTabId,
      },
      ...paramFormatConfig,
    });
    endTriggerNum = COMMON_DATA_FORMAT(endTriggerNum); //转化为json对象
    if (compareTrigger(compareTriggerConfig, endTriggerNum.id, param.value)) {
      // 判断是否符合条件
      triggerEventValue.compareType = 1; //事件符合
      compareEvent.push(triggerEventValue);
    } else {
      triggerEventValue.compareType = 0; //事件不符合
      noCompareEvent.push(triggerEventValue);
    }
  }
  let events = [];
  if (type === 1) events = compareEvent;
  //只去符合的事件
  else events = [...compareEvent, ...noCompareEvent]; //取所有事件
  //按照优先级排序
  function compareSmallToBig(property) {
    return function (a, b) {
      var value1 = a[property] || 1;
      var value2 = b[property] || 1;
      return value1 - value2;
    };
  }
  return events.sort(compareSmallToBig('eventBasepriority'));
};
//获取触发器id及其变量的值（除前端触发器）
export const TRIGGRT_NOTWEB = (param) => {
  const noWebTrigger =
    param.triggers.filter(
      (item) => item.triggerType !== 1 && item.triggerType !== 4
    ) || [];
  //获取对应的触发器id
  let triggerIds = { triggerIds: [], paramValues: [] }, //后端触发器
    procedure_triggerIds = { triggerIds: [], paramValues: [] }, //存储过程触发器
    http_triggerIds = { triggerIds: [], paramValues: [] }; //http触发器

  for (let i = 0, len = noWebTrigger.length; i < len; i++) {
    let trigger = noWebTrigger[i];
    if (trigger.triggerType === 2) {
      //后端触发器
      triggerIds.triggerIds.push(trigger.id);
      //如果是变量
      if (trigger.valueType == 2 && trigger.relationColumnValue) {
        const paramValues = triggerIds.paramValues;
        if (paramValues.indexOf(trigger.relationColumnValue) === -1)
          triggerIds.paramValues.push(trigger.relationColumnValue);
      }
    } else if (trigger.triggerType === 3) {
      //存储过程
      procedure_triggerIds.triggerIds.push(trigger.id);
      //如果有变量
      let procedureMap = trigger.procedureMap || '';
      if (procedureMap) {
        for (let key in procedureMap) {
          const paramValues = procedure_triggerIds.paramValues;
          if (
            procedureMap[key] &&
            paramValues.indexOf(procedureMap[key]) === -1
          )
            procedure_triggerIds.paramValues.push(procedureMap[key]);
        }
      }
    } else if (trigger.triggerType === 5) {
      //http
      http_triggerIds.triggerIds.push(trigger.id);
      //如果有变量
      if (trigger.httpRequestList && trigger.httpRequestList.length > 0) {
        let result = trigger.httpRequestList.map((item) => item.paramValue);
        http_triggerIds.paramValues = [
          ...http_triggerIds.paramValues,
          ...result,
        ];
      }
    }
  }
  return { triggerIds, procedure_triggerIds, http_triggerIds };
};
