import {defaultChartColor} from '@/constants/global';
import {dynamicGetData} from '@/services/design';

/**
 * @name: common
 * @author: DELL
 * @date: 2021/12/16 16:45
 * @description：common
 * @update: 2021/12/16 16:45
 */

export const supplementaryColor = (ln, cn) => {
  let supplementaryColor = []
  if (ln > cn) {
    const diff = ln - cn; // 计算出还差多少色值
    for (let i = 0; i < diff; i++) {
      let index = i % 10;
      supplementaryColor.push({
        c1: defaultChartColor[index],
        c2: defaultChartColor[index]
      })
    }
  }
  return supplementaryColor;
}

export const changeDataConfig = async ({value, key, objKey, info, dataSourceId: sourceId}) => {
  const dataSourceId = window.atob(sourceId);
  let dataConfig = JSON.parse(JSON.stringify(info[objKey])) || {};
  if (['apiDataFilterId', 'SQLDataFilterId'].includes(key) && ['apiDataConfig', 'SqlDataConfig'].includes(objKey)) {
    const {id, response, filterFun} = value;
    const isTrue = objKey === 'SqlDataConfig';
    dataConfig = {
      ...dataConfig,
      [key]: id,
      [isTrue ? 'SQLFilterResponse' : 'apiFilterResponse']: response,
      [isTrue ? 'SQLFilterFun' : 'apiFilterFun']: filterFun
    }
  }
  // sql 或者apj 启用关闭数据过滤器
  if (key === 'enableApiFilter' && value && objKey === 'apiDataConfig' && dataConfig.apiDataFilterId && dataConfig.apiFilterFun) {
    // eslint-disable-next-line no-new-func
    const fun = new Function(`'use strict';
                  return ${dataConfig.apiFilterFun}`);
    let result
    try {
      result = fun()(JSON.parse(dataConfig.apiResponse)) || '{}'
    } catch (e) {
      result = JSON.parse(dataConfig.apiResponse)
    }
    dataConfig.apiFilterResponse = JSON.stringify(result);
  } else if (key === 'enableApiFilter' && !value) { // 关闭api数据过滤器，数据还原
    dataConfig.apiFilterResponse = dataConfig.apiResponse;
  } else if (key === 'enableSQLFilter' && !value) { // 关闭api数据过滤器，数据还原
    dataConfig.SQLFilterResponse = dataConfig.SQLResponse;
  } else if (key === 'enableSQLFilter' && value && objKey === 'SqlDataConfig' && dataConfig.SQLDataFilterId && dataConfig.SQLFilterFun) {
    // eslint-disable-next-line no-new-func
    const fun = new Function(`'use strict';
                  return ${dataConfig.SQLFilterFun}`);
    let result
    try {
      result = fun()(JSON.parse(dataConfig.SQLResponse)) || '{}'
    } catch (e) {
      result = JSON.parse(dataConfig.SQLResponse);
    }
    dataConfig.SQLFilterResponse = JSON.stringify(result);
  }
  let newOObj = {};
  if (key !== 'apiDataFilterId' && objKey === 'apiDataConfig' || key !== 'SQLDataFilterId' && objKey === 'SqlDataConfig') {
    newOObj = {
      ...dataConfig,
      [key]: value,
      dataSourceId
    };
  } else {
    newOObj = {
      ...dataConfig,
      dataSourceId
    };
  }
  if (objKey === 'apiDataConfig' && ['apiUrl', 'requestType', 'requestParams', 'requestHeader'].includes(key)) {
    const params = {
      dataJson: JSON.stringify(newOObj),
      dataType: 2
    }
    try {
      const data = await dynamicGetData(params);
      let res = data[0].response || '{}';
      try {
        JSON.parse(res);
      } catch (e) {
        res = JSON.stringify({
          isErr: true,
          message: res
        })
      }
      newOObj.apiResponse = res || '{}';
      newOObj.apiFilterResponse = res || '{}';
      const {apiDataFilterId, enableApiFilter, apiFilterFun} = newOObj;
      if (apiDataFilterId && enableApiFilter && apiFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${apiFilterFun}`);
        let result
        try {
          result = fun()(JSON.parse(res));
        } catch (e) {
          result = JSON.parse(res);
        }
        newOObj.apiFilterResponse = JSON.stringify(result) || '{}';
      }
    } catch (e) {
      const data = e.data;
      newOObj.apiResponse = JSON.stringify(data);
    }
  }
  if (
    objKey === 'SqlDataConfig'
    &&
    (
      key === 'SQL'
      ||
      key === 'enableDataManage' && value && newOObj.variableConfig && newOObj.variableConfig.length
      ||
      key === 'variableConfig' && value.length && newOObj.enableDataManage
    )
  ) {
    const params = {
      dataJson: JSON.stringify(newOObj),
      dataType: 3
    }
    if (newOObj.enableDataManage) {
      params.varJson = JSON.stringify(newOObj.variableConfig || []);
    }
    try {
      const data = await dynamicGetData(params);
      newOObj.SQLResponse = JSON.stringify(data) || '{}';
      newOObj.SQLFilterResponse = JSON.stringify(data) || '{}';
      const {SQLDataFilterId, enableSQLFilter, SQLFilterFun} = newOObj;
      if (SQLDataFilterId && enableSQLFilter && SQLFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        let result
        try {
          result = fun()(data);
        } catch (e) {
          result = data;
        }
        newOObj.SQLFilterResponse = JSON.stringify(result) || '{}';
      }
    } catch (e) {
      const data = e.data;
      newOObj.SQLResponse = JSON.stringify(data);
    }
  }
  if (objKey === 'dataConfig') {
    newOObj = {
      ...newOObj,
      [key]: value
    }
  }
  return newOObj;
}

/**
 * 判断条件是否生效及返回对应的数据
 * @param conDitionsArr 条件配置
 * @param data 数据，永远条件配置中的比较
 * * retun key 字段值
 */
export const validConditions = (conDitionsArr = [], data, key) => {
  let color = '';
  let n = conDitionsArr.length;
  for (let i = 0; i < n; i++) {
    const current = conDitionsArr[i];
    const {config = {}} = current;
    const {list = []} = config;
    if (!list.length) { // 如果条件中没有配置条件，则继续执行，匹配，直到匹配到第一个生效的条件（后续的条件不继续判断，节省性能），然后退出循环
      continue;
    } else {
      const flag = checkDetials(config, data);
      if (flag) {
        color = current[key];
        return color;
      }
      continue;

    }
  }
  return color;
}
export const checkDetials = (config, data) => {
  const {list = [], status} = config;
  let n = list.length;
  let arr = [];
  for (let i = 0; i < n; i++) {
    const flag = checkLevelDetials(list[i], data); // 往第二层的数据继续查询
    arr.push(flag);
  }
  if (n === 1) {
    return arr[0];
  }
  if (status === 1) { // 并且
    return arr.every((item) => item);
  }
  if (status === 2) { // 或者
    return arr.some((item) => item);
  }
  return false;
}

export const checkLevelDetials = (config, data) => {
  const {list = [], status} = config;
  let arr = [];
  let n = list.length;
  for (let i = 0; i < n; i++) {
    const {compare, field, value} = list[i];
    const conditionObj = {
      compare,
      realValue: data[field] || '', // 列表中的真实数据
      targetValue: value // 目标数据， 需要和真实数据对比，如果满足条件，返回true
    }
    const flag = validTriggerMatch(conditionObj);
    arr.push(flag);
  }
  if (n === 1) {
    return arr[0];
  }
  if (status === 1) { // 并且
    return arr.every((item) => item);
  }
  if (status === 2) { // 或者
    return arr.some((item) => item);
  }
  return false;
}

/**
 * 验证是否匹配触发条件
 * @param {object} triggerObj 触发器详情
 * @param {string} actualVal 实际需要比对的值
 * @param {string} matchVal 匹配值
 */
export const validTriggerMatch = (triggerObj) => {
  const {compare, realValue, targetValue} = triggerObj;
  // 如果字段和值都没有则不满足条件
  if (!realValue && !targetValue) {
    return false;
  }
  const NUMBER_COMPARE_TYPE = [2, 3, 4, 5]; // >、 <、>=、<=四种属于数值类型比较
  if (NUMBER_COMPARE_TYPE.includes(compare) && !isNaN(realValue) && !isNaN(targetValue)) {
    const normalValNum = +targetValue;
    const actualValNum = +realValue;
    if (compare === 2 && actualValNum < normalValNum) {
      return true;
    }
    if (compare === 3 && actualValNum <= normalValNum) {
      return true;
    }
    if (compare === 4 && actualValNum > normalValNum) {
      return true;
    }
    if (compare === 5 && actualValNum >= normalValNum) {
      return true;
    }
    return false;
  }

  switch (compare) {
    case 1:
      return `${realValue}` === `${targetValue}`; // 等于
    case 6:
      return `${realValue}` !== `${targetValue}`; // 不等于
    default:
      return false;
  }
};

/**
 * 判断条件是否生效及返回对应的数据
 * @param conDitionsArr sql条件配置
 * @param data 数据，永远条件配置中的比较
 */
export const validSqlConditions = (conDitionsArr = []) => {
  let color = '';
  let n = conDitionsArr.length;
  for (let i = 0; i < n; i++) {
    const {config = {}, ...rest} = conDitionsArr[i];
    const {list = []} = config;
    if (!list.length) { // 如果条件中没有配置条件，则继续执行，匹配，直到匹配到第一个生效的条件（后续的条件不继续判断，节省性能），然后退出循环
      continue;
    } else {
      const flag = checkSqlDetials(config);
      if (flag) {
        // color = fieldRelColor;
        return rest;
      }
      continue;

    }
  }
  return color;
}
export const checkSqlDetials = (config) => {
  const {list = [], status} = config;
  let n = list.length;
  let arr = [];
  for (let i = 0; i < n; i++) {
    const flag = checkSqlLevelDetials(list[i]); // 往第二层的数据继续查询
    arr.push(flag);
  }
  if (n === 1) {
    return arr[0];
  }
  if (status === 1) { // 并且
    return arr.every((item) => item);
  }
  if (status === 2) { // 或者
    return arr.some((item) => item);
  }
  return false;
}

export const checkSqlLevelDetials = (config) => {
  const {list = [], status} = config;
  let arr = [];
  let n = list.length;
  for (let i = 0; i < n; i++) {
    const {compare, content, value} = list[i];
    const conditionObj = {
      compare,
      realValue: content || '', // 列表中的真实数据
      targetValue: value // 目标数据， 需要和真实数据对比，如果满足条件，返回true
    }
    const flag = validTriggerMatch(conditionObj);
    arr.push(flag);
  }
  if (n === 1) {
    return arr[0];
  }
  if (status === 1) { // 并且
    return arr.every((item) => item);
  }
  if (status === 2) { // 或者
    return arr.some((item) => item);
  }
  return false;
}

/**
 * 将rgba的颜色转换成16进制
 * @param color
 * @returns {string}
 */
export const hexify = (color) => {
  let values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  let a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2);
}
/**
 * 将rgb的颜色转换成16进制
 * @param str
 * @returns {string}
 */
export const setRgbTo16 = (str) => {
  let reg = /^(rgb|RGB)/;
  if (!reg.test(str)) {
    return;
  }
  let arr = str.slice(4, str.length - 1).split(',')
  let color = '#';
  for (let i = 0; i < arr.length; i++) {
    let t = Number(arr[i]).toString(16)
    if (t == '0') { //如果为“0”的话，需要补0操作,否则只有5位数
      t = t + '0'
    }
    color += t;
  }
  // eslint-disable-next-line consistent-return
  return color;
}

/**
 * 图表中的标线配置
 * @param baseConfig
 * @param name
 * @param markLineConfig
 * @returns {{}|*}
 */
export const getChartMarkLineConfig = ({baseConfig, name, markLineConfig = []}) => {
  // 没有数据返回原值
  if (!markLineConfig.length) return baseConfig;
  const isFlag = markLineConfig.some((item) => item.dataRelation === name && item.dimensionType !== 'none');
  console.log(222, name);
  // 高级配置中没有符合当前的柱状图，返回原值
  if (!isFlag) return baseConfig;
  const arrConfig = markLineConfig.filter((item) => item.dataRelation === name && item.dimensionType !== 'none');
  console.log(111);
  arrConfig.forEach((item) => {
    const {
      markLabel = '',
      dimensionType = 'none',
      meanColor = '',
      labelSize = 16,
      labelPosition = 'end',
      labelColor = '#fff',
      meanWidth = 1,
      num = 0,
      meanType = 'solid'
    } = item;
    if (['x', 'y'].includes(dimensionType)) {
      const key = dimensionType === 'x' ? 'xAxis' : 'yAxis';
      baseConfig.markLine.data.push({
        name: markLabel,
        [key]: num,
        lineStyle: {
          color: meanColor || null,
          type: meanType,
          width: meanWidth
        },
        label: {
          show: true,
          formatter: function ({name, value}) {
            const lastLabel = name ? `${name}: ${value}` : value;
            return lastLabel;
          },
          position: labelPosition,
          color: labelColor,
          fontSize: labelSize
        }
      });
    } else {
      baseConfig.markLine.data.push({
        type: dimensionType,
        name: markLabel,
        lineStyle: {
          color: meanColor || null,
          type: meanType,
          width: meanWidth
        },
        label: {
          show: true,
          formatter: function ({name, value}) {
            const lastLabel = name ? `${name}: ${value}` : value;
            return lastLabel;
          },
          position: labelPosition,
          color: labelColor,
          fontSize: labelSize
        }
      });
    }
  })
  return baseConfig;
}
/**
 * 处理标线
 * @param baseChatConfig
 * @param config
 * @returns {*}
 */
export const firstReduce = (baseChatConfig, config) => {
  const { stylesObj } = config;
  let {
    enableMarkMax = false, // 标记最大值
    enableMarkMin = false, // 标记最小值
    markBgColor = '#4689F5', // 标记背景颜色
    markerColor = '#fff', // 标记字体颜色
    symbolIcon = 'pin', // 标记图标
    symbolSize = 50, // 标记大小
    enableMean = false, // 是否启用均值线
    meanColor = '#4689F5', // 均值线颜色
    meanType = 'dashed', // 均值线类型
    enableMeanLabel = true, // 是否显示标签
    meanLabelColor = '#ffffff', // 均值线标签颜色
    meanLabelSize = 12, // 均值线标签字体大小
    meanLabelPosition = 'end' // 均值线标签位置
  } = stylesObj;
  if (!(!enableMarkMax && !enableMarkMin)) {
    const markMax = {
      type: 'max',
      symbol: symbolIcon,
      symbolSize: symbolSize,
      label: {
        color: markerColor
      },
      itemStyle: {
        color: markBgColor
      }
    }
    const markMin = {
      type: 'min',
      symbol: symbolIcon,
      symbolSize: symbolSize,
      label: {
        color: markerColor
      },
      itemStyle: {
        color: markBgColor
      }
    }

    if (enableMarkMax) {
      baseChatConfig.markPoint.data.push(markMax);
    }
    if (enableMarkMin) {
      baseChatConfig.markPoint.data.push(markMin);
    }
  }
  if (enableMean) {
    baseChatConfig.markLine.data.push({
      type: 'average',
      lineStyle: {
        color: meanColor,
        type: meanType
      },
      label: {
        show: enableMeanLabel,
        position: meanLabelPosition,
        color: meanLabelColor,
        fontSize: meanLabelSize
      }
    });
  }
  return baseChatConfig;
}
