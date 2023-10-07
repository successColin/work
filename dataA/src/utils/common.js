import moment from 'moment';
import {defaultChartColor} from '@/constants/global';
import {dynamicGetData, dynamicGetMqttData} from '@/services/design';
import {getXAxisByKey, returnChartPosition, getTimestamp} from '@/utils/utils';
import {encrypt} from '@/utils/secret';

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
      if (res && Array.isArray(res) && res.length) {
        const sliceArr = JSON.stringify(res.slice(0, 30));
        newOObj.apiResponse = JSON.stringify(sliceArr) || '{}';
        newOObj.apiFilterResponse = JSON.stringify(sliceArr) || '{}';
      } else {
        newOObj.apiResponse = res || '{}';
        newOObj.apiFilterResponse = res || '{}';
      }

      const {apiDataFilterId, enableApiFilter, apiFilterFun} = newOObj;
      if (apiDataFilterId && enableApiFilter && apiFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${apiFilterFun}`);
        let result
        try {
          const lastResult = fun()(JSON.parse(res));
          if (lastResult && Array.isArray(lastResult) && lastResult.length) {
            result = lastResult.slice(0, 30);
          } else {
            result = lastResult;
          }
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
      if (data && Array.isArray(data) && data.length) {
        newOObj.SQLResponse = JSON.stringify(data.slice(0, 30)) || '{}';
        newOObj.SQLFilterResponse = JSON.stringify(data.slice(0, 30)) || '{}';
      } else {
        newOObj.SQLResponse = JSON.stringify(data) || '{}';
        newOObj.SQLFilterResponse = JSON.stringify(data) || '{}';
      }

      const {SQLDataFilterId, enableSQLFilter, SQLFilterFun} = newOObj;
      if (SQLDataFilterId && enableSQLFilter && SQLFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        let result
        try {
          const lastResult = fun()(data);
          if (lastResult && Array.isArray(lastResult) && lastResult.length) {
            result = lastResult.slice(0, 30);
          } else {
            result = lastResult;
          }
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
  if (objKey === 'mqttDataConfig') { // 如果是mqtt配置
    const {mqttResponse, mqttDataFilterId, mqttFilterFun, enableMqttFilter, topic} = dataConfig;
    if (key === 'enableMqttFilter' && !value) {
      return {
        ...dataConfig,
        [key]: value,
        mqttFilterResponse: mqttResponse
      }
    }
    if (key === 'enableMqttFilter' && value && !mqttDataFilterId) {
      return {
        ...dataConfig,
        [key]: value,
        mqttFilterResponse: mqttResponse
      }
    }
    if (key === 'enableMqttFilter' && value && mqttDataFilterId && mqttFilterFun) {
      // eslint-disable-next-line no-new-func
      const fun = new Function(`return ${mqttFilterFun}`);
      const lastResult = fun()(JSON.parse(mqttResponse));
      return {
        ...dataConfig,
        [key]: value,
        mqttFilterResponse: JSON.stringify(lastResult)
      }
    }

    if (key === 'mqttDataFilterId' && enableMqttFilter) {
      const {id, filterFun} = value;
      // eslint-disable-next-line no-new-func
      const fun = new Function(`return ${filterFun}`);
      const lastResult = fun()(JSON.parse(mqttResponse));
      return {
        ...dataConfig,
        mqttDataFilterId: id,
        mqttFilterFun: filterFun,
        mqttFilterResponse: JSON.stringify(lastResult)
      }
    }
    if (['mqttSourceId', 'topic'].includes(key)) {
      let mqObj = {
        ...dataConfig
      };
      if (key === 'mqttSourceId') {
        const {ip, username, password, port, id} = value;
        mqObj = {
          ...dataConfig,
          mqttSourceId: id,
          sourceU: encrypt(ip),
          sourceP: encrypt(port),
          sourceA: encrypt(username),
          sourceD: encrypt(password)
        };
      }
      if (key === 'topic') {
        mqObj = {
          ...dataConfig,
          topic: value
        };
      }

      const isObject = (value) => {
        return typeof value === 'object' && value !== null && !(value instanceof Array);
      }
      if (topic) {
        const res = await dynamicGetMqttData({topic});
        try {
          const targetData = JSON.parse(res);
          if (isObject(targetData)) {
            mqObj = {
              ...mqObj,
              mqttResponse: res
            }
          }
          if (Array.isArray(targetData)) {
            mqObj = {
              ...mqObj,
              mqttResponse: JSON.stringify(targetData.slice(0, 30))
            }
          }
        } catch (e) {
          mqObj = {
            ...mqObj,
            mqttResponse: '{}'
          }
        }
      }
      if (!enableMqttFilter) {
        return {
          ...mqObj,
          mqttFilterResponse: mqObj.mqttResponse
        }
      }
      if (enableMqttFilter && !mqttDataFilterId) { // 没有配置数据过滤器调用接口后处理数据
        return {
          ...mqObj,
          mqttFilterResponse: mqObj.mqttResponse
        }
      }
      if (enableMqttFilter && mqttDataFilterId) { // 有配置数据过滤器调用接口后处理数据
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const lastResult = fun()(JSON.parse(mqObj.mqttResponse));
        return {
          ...mqObj,
          mqttFilterResponse: JSON.stringify(lastResult)
        }
      }
      return mqObj
    }
    return {
      ...dataConfig,
      [key]: value
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
export const validConditions = (conDitionsArr = [], data, key, isReturnSingle = true) => {
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
        if (isReturnSingle) { // 是否返回单个值还是返回对象
          color = current[key];
          return color;
        }
        return current;

      }
      continue;
    }
  }
  if (isReturnSingle) { // 是否返回单个值还是返回对象
    return color;
  }
  return {};

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
  if (!markLineConfig.length) {
    return baseConfig;
  }
  const isFlag = markLineConfig.some((item) => item.dataRelation === name && item.dimensionType !== 'none');
  // 高级配置中没有符合当前的柱状图，返回原值
  if (!isFlag) {
    return baseConfig;
  }
  const arrConfig = markLineConfig.filter((item) => item.dataRelation === name && item.dimensionType !== 'none');
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
  const {stylesObj} = config;
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

/**
 * 将颜色色值变浅
 * @param rgbaColor
 * @returns {string}
 */
export const getLightColor = (rgbaColor = '', weight = 1) => {
  if (!rgbaColor) {
    return rgbaColor;
  }
  const copyColor = rgbaColor;
  const reduceC = copyColor.substring(0, copyColor.length - 1);
  const arr = reduceC.split(',');
  const op = +arr.at(-1);
  const lastOp = op * weight;
  arr[arr.length - 1] = ` ${lastOp}`;
  return `${arr.join(',')})`;
};

export const getSeries = (echarts, categories, list, series, colorArr, graphHeightScale = 0.1) => {
  function renderItem(params, api) {
    let categoryIndex = api.value(0);
    let start = api.coord([api.value(1), categoryIndex]);
    let end = api.coord([api.value(2), categoryIndex]);
    let height = api.size([0, 1])[1] * graphHeightScale;

    let rectShape = echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }
    );

    return (
      rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
      }
    );
  }

  let seriesValue = [];
  echarts.util.each(categories, function (category, index) {
    let cgory = categories[index];
    series.forEach((itemS) => {
      list.forEach((itemj) => {
        if (itemj.name == cgory) {
          let data = [];
          let startTime = new Date(itemj.startTime).getTime();
          let endTime = new Date(itemj.endTime).getTime();
          let duration = endTime - startTime;
          if (itemj.typeName == itemS) {
            const colorObj = colorArr.find((c) => c.value === itemS) || {};
            data.push({
              name: itemj.typeName,
              value: [index, startTime, endTime, duration],
              itemStyle: {
                color: colorObj?.c1
              }
            });
            seriesValue.push({
              name: itemS,
              type: 'custom',
              renderItem: renderItem,
              itemStyle: {
                opacity: 0.8
              },
              encode: {
                x: [1, 2],
                y: 0
              },
              data: data
            });
          }
        }
      });
    });
  });
  return seriesValue;
}
/**
 * 获取图例
 * @param legendData
 * @param colorArr
 * @returns {*}
 */
export const getLegendData = (legendData, colorArr) => {
  return legendData.map((item) => {
    const colorObj = colorArr.find((c) => c.value === item);
    if (colorObj) {
      return {
        name: item,
        itemStyle: {
          color: colorObj?.c1 || ''
        }
      }
    }
    return {
      name: item
    }

  })
}

// 保留多少位小数
const toFixed = (num) => {
  if (!num) return 0;
  return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
}

const getDiffTime = (attributeUpdateTime) => {
  //
  if (!attributeUpdateTime) {
    return '';
  }
  const m = attributeUpdateTime / 1000 / 60;
  const h = m / 60;
  const d = h / 24;
  if (d >= 1) {
    return `${toFixed(d)}天`;
  }
  if (h >= 1 && h < 24) {
    return `${toFixed(h)}小时`;
  }
  if (m < 60) {
    return `${toFixed(m)}分钟`;
  }
  return '';
};

/**
 * 获取时间区域甘特图
 * @param config
 * @param list
 * @returns {{yAxis: {axisLabel: {rotate: number, fontFamily: *, color: *, show: *, fontSize: *, fontWeight: *}, axisLine: {lineStyle: {color: *}, show: *}, splitLine: {show: boolean}, show: *, name: *, axisTick: {lineStyle: {color: *}, show: *}, type: *, nameTextStyle: {fontFamily: *, color: *, fontSize: *, fontWeight: *}}, xAxis: {axisLabel: {rotate: number, fontFamily: *, color: *, show: *, fontSize: *, fontWeight: *}, data: *[], axisLine: {lineStyle: {color: *}, show: *}, show: *, name: *, axisTick: {lineStyle: {color: *}, show: *}, type: *, nameTextStyle: {fontFamily: *, color: *, fontSize: *, fontWeight: *}}, legend: {orient: string, pageTextStyle: {color: string}, data: *[], left: string, itemHeight: number, show: *, itemWidth: number, textStyle: {fontFamily: *, color: *, fontSize: *, fontWeight: *}, type: string, pageIconInactiveColor: string, pageIconColor: string}, series: [], dataZoom: [{show: *, type: string}]}}
 */
export const makeTimeGanttChatOption = (config = {}, data = {}, echarts) => {
  const {
    stylesObj,
    enableLegend,
    enableGrid,
    enableXAxis,
    enableYAxis,
    enableData
  } = config;
  const {startTimeAll = '', endTimeAll = '', list = []} = data;
  let {
    gridLeft,
    gridTop,
    gridRight,
    gridBottom,
    legendPosition,
    legendFontFamily,
    legendFontWeight,
    legendFontSize,
    legendColor,
    labelField,
    labelPrefix,
    labelSuffix,
    labelPosition,
    labelFontFamily,
    labelFontWeight,
    labelFontSize,
    labelColor,
    XLineColor,
    graphHeightScale = 0.1,
    XName,
    XFontFamily,
    XFontWeight,
    XFontSize,
    XColor,
    XInterval = 0.1,
    XTickEnable,
    XTickColor,
    XTickLabelFontFamily,
    XTickLabelFontWeight,
    XTickLabelFontSize,
    XTickLabelColor,
    XTickLabelRotate = 0,
    YLineColor,
    YName,
    YFontFamily,
    YFontWeight,
    YFontSize,
    YColor,
    YTickEnable,
    YTickColor,
    YTickLabelFontFamily,
    YTickLabelFontWeight,
    YTickLabelFontSize,
    YTickLabelColor,
    YTickLabelRotate = 0,
    colorArr
  } = stylesObj;
  let legendPos = returnChartPosition(legendPosition);
  const legendData = getXAxisByKey(list, 'typeName'); // 图例

  const yAxis = getXAxisByKey(list, 'name');
  const series = getSeries(echarts, yAxis, list, legendData, colorArr, graphHeightScale);
  let option = {
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#333',
          formatter: ({axisDimension, value}) => {
            if (axisDimension === 'y') {
              return value;
            }
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
      formatter: function (params) {
        return `${params.marker} ${params.name}<br/>
                开始时间: ${moment(params.value[1]).format('YYYY-MM-DD HH:mm:ss')}<br/>
                结束时间: ${moment(params.value[2]).format('YYYY-MM-DD HH:mm:ss')}<br/>
                时长: ${getDiffTime(params.value[3])}`;
      }
      // position: 'top'
      // position: function (point) {
      //   // 固定在顶部
      //   return point;
      // }
    },
    dataZoom: [
      {
        type: 'slider',
        show: enableData,
        labelFormatter: function (value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
        textStyle: {
          color: XColor || '#fff'
        }
      }
    ],
    legend: {
      ...legendPos,
      show: enableLegend,
      textStyle: {
        color: legendColor,
        fontWeight: legendFontWeight,
        fontSize: legendFontSize,
        fontFamily: legendFontFamily
      },
      type: 'scroll',
      pageIconColor: '#fff',
      pageIconInactiveColor: '#4689F5',
      pageTextStyle: {
        color: '#fff'
      },
      itemWidth: 10,
      itemHeight: 10,
      data: getLegendData(legendData, colorArr)
    },
    xAxis: [
      {
        min: getTimestamp(startTimeAll),
        max: getTimestamp(endTimeAll),
        interval: 3600 * 24 * 1000 * XInterval,
        // type: XDataType,
        show: enableXAxis,
        scale: true,
        alignTicks: true,
        minorSplitLine: {
          show: false
        },
        minorTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: enableXAxis,
          lineStyle: {
            color: XLineColor
          }
          // symbol: ['none', 'arrow'],
          // symbolOffset: [20, 10]
        },
        name: XName,
        nameTextStyle: {
          color: XColor,
          fontWeight: XFontWeight,
          fontFamily: XFontFamily,
          fontSize: XFontSize
        },
        axisTick: {
          show: XTickEnable,
          lineStyle: {
            color: XTickColor
          }
        },
        axisLabel: {
          show: enableXAxis,
          color: XTickLabelColor,
          fontWeight: XTickLabelFontWeight,
          fontSize: XTickLabelFontSize,
          fontFamily: XTickLabelFontFamily,
          rotate: XTickLabelRotate,
          formatter: function (val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      }
    ],
    yAxis: {
      data: yAxis,
      splitLine: {
        show: false
      },
      type: 'category',
      show: enableYAxis,
      axisLine: {
        show: enableYAxis,
        lineStyle: {
          color: YLineColor
        }
        // symbol: ['none', 'arrow'],
        // symbolOffset: [20, 10]
      },
      name: YName,
      nameTextStyle: {
        color: YColor,
        fontWeight: YFontWeight,
        fontFamily: YFontFamily,
        fontSize: YFontSize
      },
      axisTick: {
        show: YTickEnable,
        lineStyle: {
          color: YTickColor
        }
      },
      axisLabel: {
        show: enableYAxis,
        color: YTickLabelColor,
        fontWeight: YTickLabelFontWeight,
        fontSize: YTickLabelFontSize,
        fontFamily: YTickLabelFontFamily,
        rotate: YTickLabelRotate
      }
    },
    series
  };
  if (enableGrid) {
    option.grid = {
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
      top: gridTop,
      containLabel: true
    }
  }
  return option;
}
/**
 * 返回关系图的配置信息
 * @param config
 * @param data
 */
export const makeBasicGraphOption = (config = {}, data = []) => {

  const { roam, animation, draggable,enableLabel, enableEdgeLabel, nodeConfig = [], enableNodeConfig, stylesObj: {
    zoomLevel,
    lineWidth = 1,
    lineColor,
    lineType,
    labelFontFamily,
    labelFontWeight,
    labelFontSize,
    labelColor,
    labelPosition,
    labelEdgeFontFamily,
    labelEdgeFontWeight,
    labelEdgeFontSize,
    labelEdgeColor,
    labelEdgePosition,
    dataMappingField
  } } = config;
  let lineData = [], dataValue = [];
  data.forEach((item) => {
    const { id, pid, memo } = item;
    if (id && (![null, undefined].includes(pid))) {
      lineData.push({
        source: id,
        target: pid,
        memo
      });
    };
    const target = nodeConfig.find((node) => `${node.fieldValue}` === `${item[dataMappingField]}`);
    if (enableNodeConfig && target) {
      const { symbolSize } = target;
      dataValue.push({
        symbolSize,
        ...item
      });
    } else {
      dataValue.push(item);
    }
  })
  return {
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#333'
        }
      }
    },
    // backgroundColor: '#10215E',
    series: [
      {
        zoom: zoomLevel,
        type: 'graph',
        layout: 'force',
        animation: animation,
        label: {
          show: enableLabel,
          color: labelColor,
          position: labelPosition,
          fontSize: labelFontSize,
          fontFamily: labelFontFamily,
          fontWeight: labelFontWeight
        },
        edgeLabel: {
          show: enableEdgeLabel,
          color: labelEdgeColor,
          position: labelEdgePosition,
          fontSize: labelEdgeFontSize,
          fontFamily: labelEdgeFontFamily,
          fontWeight: labelEdgeFontWeight,
          formatter: ({data: {memo}}) => {
            return memo;
          }
        },
        draggable: draggable,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        // symbolSize: 50,
        roam: roam,
        data: dataValue,
        force: {
          // initLayout: 'circular'
          // gravity: 0
          repulsion: 100,
          edgeLength: 5
        },
        itemStyle: {
          color: ({ data }) => {
            if (enableNodeConfig) {
              const target = nodeConfig.find((node) => `${node.fieldValue}` === `${data[dataMappingField]}`) || {};
              return target.nodeColor || '#5470C6';
            }
            return '#5470C6';
          }
        },
        edges: lineData,
        lineStyle: {
          color: lineColor,
          opacity: 1,
          type: lineType,
          width: lineWidth
        }
      }
    ]
  };
}
