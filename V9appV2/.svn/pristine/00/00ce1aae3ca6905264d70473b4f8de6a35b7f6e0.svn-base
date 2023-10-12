import { NO_SUBMIT_ELEMENT_TYPE } from '@/common/constant/element.js';
import { CALCULATE } from '@/static/js/calculate.js';
/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 变量转化方法
 */
import dateFormat from '@/static/js/dateFormat.js';

//是否需要取状态管理中的数据
const storeParams = [
  'CurrentUserID',
  'BusinessID',
  'ParentID',
  'GlobalIds',
  'Inspections',
];
let storeValues = {}; //全局变量
let tabStaticParams = {}; //面板固定变量
//系统固定参数表单式
const systemParams = {
  CurrentDate: function () {
    //获取日期
    const date = dateFormat.formatDate('', 'yyyy-MM-dd');
    return {
      id: date,
      name: date,
      relationColumnType: 3,
    };
  },
  CurrentDateTime: function () {
    //获取当前日期时间
    const date = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
    return {
      id: date,
      name: date,
      relationColumnType: 3,
    };
  },
  DateSerialnumber: function () {
    //时间流水号到毫秒
    const date = dateFormat.formatDate('', 'yyyyMMddhhmmssMS');
    return {
      id: date,
      name: date,
      relationColumnType: 1,
    };
  },
  CurrentUserID: function () {
    //获取当前用户
    return storeValues.CurrentUserID;
  },
  Null: function () {
    //设置为空
    return { id: '', name: '', relationColumnType: 1 };
  },
  BusinessID: function () {
    //获取当前数据的主业务ID
    return storeValues.BusinessID;
  },
  ParentID: function () {
    //获取父组件的值ID
    return storeValues.ParentID;
  },
};
//全局方法
const static_functionName = [
  '@@ParamKey',
  '@@GetDuration',
  '@@GetUserProperties',
  '@@StringifyFormData',
  '@@CompoundArithmetic',
];
const systemFunction = {
  //数据选择框获取对应的值
  ParamKey: (data, key) => {
    let functionKey = key.match(/^@@ParamKey\((\S*)*\)/);
    if (data && functionKey.length > 1) {
      functionKey = functionKey[1];
      let result = [];
      if (Array.isArray(data)) {
        //如果是数组
        let resultValue = [];
        data.map((item) => {
          const value =
            typeof item[functionKey] === 'number'
              ? `item[functionKey]`
              : item[functionKey];
          if (value && resultValue.indexOf(item.id) === -1) {
            //去重
            resultValue.push(item.id);
            result.push(item[functionKey]);
          }
        });
        result = result.join(',');
      } else {
        result = data[functionKey];
      }
      return result || '';
    } else {
      return '';
    }
  },
  //获取登录用户中固定的值 例：@@GetUserProperties(orgid,1)
  GetUserProperties: (key) => {
    const { userInfo } = storeValues;
    let functionKey = key.match(/^@@GetUserProperties\((\S*)*\)/);
    functionKey = functionKey.length > 1 ? functionKey[1] : '';
    const functionKeyArry = functionKey.split(','),
      userKey = functionKeyArry[0];
    let param = {
      id: userInfo[userKey] || '',
      name: userInfo[userKey] || '',
    };
    if (functionKeyArry.length > 1)
      param.relationColumnType = functionKeyArry[1];
    return param;
  },
  //获取表单序列值
  StringifyFormData: (mobileTabElements = [], formData = {}) => {
    let count = 0,
      formDatas = {};
    mobileTabElements.map((item) => {
      const { baseType, name, relationColumnType } = item,
        formKey = `key${count + 1}`;
      if (NO_SUBMIT_ELEMENT_TYPE.indexOf(baseType) !== -1 || !name)
        return false; //不提交的控件不不处理
      const elementId = item.elementId,
        value = formData[elementId];
      let param = null;
      if (baseType === 8) param = value || [];
      else if (value) param = value.id;
      if (!param) return false;
      formDatas[formKey] = { name, value: param, type: relationColumnType };
      count++;
    });
    if (count) formDatas.total = count;
    return {
      id: JSON.stringify(formDatas),
    };
  },
  //时长计算
  GetDuration: (key, mobileTabElements = [], formData = {}) => {
    debugger;
    let result = key.match(/(?=\().*?(?=\))/g) || '';
    if (!result) return '';
    result = result[0];
    result = result.replace(/[\(\s+]/g, '');
    let array = result.split(',') || [];
    //计算需要2个值进行计算
    if (array.length.length < 2) return '';
    let startTime = array[0],
      endTime = array[1];
    const patt1 = /^@@/;
    if (patt1.exec(startTime)) {
      const parameterElement =
        mobileTabElements.find((item) => startTime === item.parameter) || '';
      startTime = formData[parameterElement.elementId] || '';
      startTime = typeof startTime === 'object' ? startTime.id : startTime;
    }
    if (patt1.exec(endTime)) {
      const parameterElement =
        mobileTabElements.find((item) => endTime === item.parameter) || '';
      endTime = formData[parameterElement.elementId] || '';
      endTime = typeof endTime === 'object' ? endTime.id : endTime;
    }
    if (!endTime || !startTime) return '';
    //时间格式统一
    startTime = startTime.replace(/-/g, '/');
    endTime = endTime.replace(/-/g, '/');
    if (
      isNaN(startTime) &&
      isNaN(endTime) &&
      !isNaN(Date.parse(startTime)) &&
      !isNaN(Date.parse(endTime))
    ) {
      (startTime = new Date(startTime)), (endTime = new Date(endTime));
      const durationTime = endTime.getTime() - startTime.getTime(),
        leave1 = durationTime % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
        leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
        leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数

      const startY = startTime.getFullYear(),
        startM = startTime.getMonth() + 1,
        endY = endTime.getFullYear(),
        endM = endTime.getMonth() + 1;

      let durationType = '@@StaticMinutes'; //默认计算分
      //@@StaticYears、@@StaticMonths、@@StaticWeeks、@@StaticDays
      //@@StaticHours、@@StaticMinutes、@@StaticSeconds
      if (array.length.length >= 3) durationType = array[2]; //获取计算类型

      const days = Math.floor(durationTime / (24 * 3600 * 1000)), //计算出相差天数
        hours = Math.floor(leave1 / (3600 * 1000)), //计算出小时数
        minutes = Math.floor(leave2 / (60 * 1000)), //计算相差分钟数
        seconds = Math.round(leave3 / 1000), //计算相差秒数
        weeks = Math.abs(durationTime) / 1000 / 60 / 60 / 24 / 7, //计算相差的周
        years = startY - startM,
        months = endY * 12 + endM - (startY * 12 + startM);
      let total = 0;
      if (durationType === '@@StaticYears') total = years;
      else if (durationType === '@@StaticMonths') total = months;
      else if (durationType === '@@StaticWeeks') total = weeks;
      else if (durationType === '@@StaticDays') total = days;
      else if (durationType === '@@StaticHours')
        total = Math.floor(durationTime / 1000 / 60 / 60);
      else if (durationType === '@@StaticSeconds')
        total = Math.floor(durationTime / 1000);
      else total = days * (24 * 60) + hours * 60 + minutes;
      return total;
    } else {
      return '';
    }
  },
  //四则混合 运算 例：@@CompoundArithmetic(({@@rate}+{@@number2})*{@@name},2)
  CompoundArithmetic: (key, mobileTabElements = [], formData = {}) => {
    const { userInfo } = storeValues;
    let functionKey = key.match(/^@@CompoundArithmetic\((\S*)*\)/);
    functionKey = functionKey.length > 1 ? functionKey[1] : '';
    const functionKeyArry = functionKey.split(','),
      userKey = functionKeyArry[0];
    const arr = functionKey.split('@@');
    let params = []; //变量列表
    arr.forEach((item) => {
      if (item.split('}').length > 1) {
        params.push(item.split('}')[0]);
      }
    });
    let paramIsNull = false;
    params.forEach((name) => {
      const parameterElement =
        mobileTabElements.find((item) => '@@' + name === item.parameter) || '';
      let value = formData[parameterElement.elementId] || '';
      value = typeof value === 'object' ? value.id : value;
      functionKey = functionKey.replace('{@@' + name + '}', value || 0);
      if (!!!value) {
        paramIsNull = true;
        return;
      }
    });
    if (paramIsNull) {
      const param = { id: '', name: '' };
      return param;
    }
    let num = 0;
    try {
      num = CALCULATE.run(functionKey.split(',')[0]);
    } catch (e) {
      uni.showToast({
        title: '四则运算除数不能为空或0',
        // title: _this.$t('lang-compound-arithmetic'),
        duration: 1000,
        icon: 'none',
      });
    } finally {
      const n = functionKeyArry[1] > 4 ? 4 : functionKeyArry[1];
      let decimal = Math.pow(10, n);
      num = Math.round(num * decimal) / decimal;
      let param = {
        id: num || '0',
        name: num || '0',
      };
      return param;
    }
  },
};
const isParam = (key = '') => {
  const patt1 = /^@@/;
  //判断key是否以@@开头 如果不是以key开头的直接返回key
  if (!patt1.exec(key)) return false;
  else return true;
};
/**
 * key{String} 变量名称
 * storeValues {Object} 状态管理中存储的变量
 * 			  全局变量
 * 			  控件变量
 *			  frameType 框架类型
 * 				FrameVariable 框架变量
 * otherTabId{Numabr} 其他面板id
 * mobileTabId{Number} 本面板id
 * tabsElements{Object} 所有面板控件集合
 * tabsFormDatas{Object} 所有面板数据集合
 */
const Static_ParamFormat = (params, _this) => {
  if (!isParam(params.key)) return { id: params.key, name: params.key };
  else {
    storeValues = params.storeValues || {}; //状态管理中存储的数据
    tabStaticParams = params.tabStaticParams || {}; //面板固定变量
    const key = params.key, //变量
      otherTabId = params.otherTabId, //其他面板id
      mobileTabId = params.mobileTabId, //本面板id
      functionName =
        static_functionName.find((item) => key.search(item) === 0) || '', //查找是否为全局方法
      tabsElements = params.tabsElements || {}, //面板控件
      tabsFormDatas = params.tabsFormDatas || {}, //面板数据
      bundleParams = params.bundleParams || {};
    const { FrameVariable = {}, frameType } = storeValues;
    const basic = { id: '', name: '', relationColumnType: 1 };
    let key1 = key.replace(/@@/g, ''); //去除@@的变量

    let paramValueFormat = '';
    //全局变量优先级、方法>框架变量>本面板参数>其他面板参数
    if (key1 && key1.toLowerCase() === 'null') key1 = 'Null'; //转化为小写
    if (key1 in systemParams) {
      //是否为全局变量
      paramValueFormat = systemParams[key1].call();
    } else if (functionName) {
      //全局方法
      if (functionName == '@@ParamKey') {
        //如果有方法名。默认走方法
        paramValueFormat = systemFunction.ParamKey(params.data, key);
      } else if (functionName == '@@GetUserProperties') {
        paramValueFormat = systemFunction.GetUserProperties(key);
      } else if (functionName == '@@GetDuration') {
        const mobileTabElements = tabsElements[mobileTabId] || [], //本面板控件
          mobileTabData = tabsFormDatas[mobileTabId] || {}; //本面板数据
        paramValueFormat = systemFunction.GetDuration(
          key,
          mobileTabElements,
          mobileTabData
        );
      } else if (functionName == '@@StringifyFormData') {
        const mobileTabElements = tabsElements[mobileTabId] || [], //本面板控件
          mobileTabData = tabsFormDatas[mobileTabId] || {}; //本面板数据
        paramValueFormat = systemFunction.StringifyFormData(
          mobileTabElements,
          mobileTabData
        );
      } else if (functionName == '@@CompoundArithmetic') {
        const mobileTabElements = tabsElements[mobileTabId] || [], //本面板控件
          mobileTabData = tabsFormDatas[mobileTabId] || {}; //本面板数据
        paramValueFormat = systemFunction.CompoundArithmetic(
          key,
          mobileTabElements,
          mobileTabData
        );
      }
    } else if (key1 in FrameVariable) {
      //框架变量
      paramValueFormat = FrameVariable[key1];
    } else if (key in bundleParams) {
      //菜单变量
      paramValueFormat = bundleParams[key];
    } else if (key1 in tabStaticParams) {
      //面板固定变量
      paramValueFormat = tabStaticParams[key1];
    } else {
      //面板变量
      const mobileTabElements = tabsElements[mobileTabId] || [], //本面板控件
        otherTabElements = tabsElements[otherTabId] || []; //其他面板变量
      let tabId = mobileTabId;
      let element =
        mobileTabElements.find((item) => key === item.parameter) || ''; //对应变量的控件
      if (!element) {
        //如果本面板控件为空才取其他面板的控件
        tabId = otherTabId;
        element = otherTabElements.find((item) => key === item.parameter) || '';
      }

      if (element) {
        //只有控件不可空时执行
        const tabData = tabsFormDatas[tabId] || {}, //对应面板的的数据
          elementId = element.elementId;

        let nodedata = {};
        if (!Array.isArray) {
          //判断是否为数组
          Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
          };
        }
        if (Array.isArray(tabData)) {
          if (tabData.length > 0) nodedata = { ...tabData[0] };
        } else nodedata = nodedata = { ...tabData };

        let elementData = nodedata[elementId] || { id: '', name: '' };

        //如果控件为lable且取值为显示值
        if (
          element.baseType === 17 &&
          element.valueFieldType === 2 &&
          elementData
        ) {
          paramValueFormat = { ...elementData };
          paramValueFormat.id = paramValueFormat.name;
        } else paramValueFormat = { ...elementData };
        paramValueFormat.element = element;
        paramValueFormat.relationColumnType = element.relationColumnType;
      }
    }

    return paramValueFormat || basic;
  }
};

export default Static_ParamFormat;
