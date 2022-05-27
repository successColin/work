import { dynamicGetData } from '@/api/design';

/**
 * @name: common
 * @author: DELL
 * @date: 2021/12/16 16:45
 * @description：common
 * @update: 2021/12/16 16:45
 */

export const defaultChartColor = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#131E45'];

export const supplementaryColor = (ln, cn) => {
  const supplementaryColorArr = [];
  if (ln > cn) {
    const diff = ln - cn; // 计算出还差多少色值
    for (let i = 0; i < diff; i += 1) {
      const index = i % 10;
      supplementaryColorArr.push({
        c1: defaultChartColor[index],
        c2: defaultChartColor[index]
      });
    }
  }
  return supplementaryColorArr;
};

export const changeDataConfig = async ({
  value,
  key,
  objKey,
  info,
  dataSourceId
}) => {
  let dataConfig = JSON.parse(JSON.stringify(info[objKey])) || {};
  if (['apiDataFilterId', 'SQLDataFilterId'].includes(key) && ['apiDataConfig', 'SqlDataConfig'].includes(objKey)) {
    const {
      id,
      response,
      filterFun
    } = value;
    const isTrue = objKey === 'SqlDataConfig';
    dataConfig = {
      ...dataConfig,
      [key]: id,
      [isTrue ? 'SQLFilterResponse' : 'apiFilterResponse']: response,
      [isTrue ? 'SQLFilterFun' : 'apiFilterFun']: filterFun
    };
  }
  // sql 或者apj 启用关闭数据过滤器
  if (key === 'enableApiFilter' && value && objKey === 'apiDataConfig' && dataConfig.apiDataFilterId && dataConfig.apiFilterFun) {
    // eslint-disable-next-line no-new-func
    const fun = new Function(`'use strict';
                  return ${dataConfig.apiFilterFun}`);
    let result;
    try {
      result = fun()(JSON.parse(dataConfig.apiResponse)) || '{}';
    } catch (e) {
      result = JSON.parse(dataConfig.apiResponse);
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
    let result;
    try {
      result = fun()(JSON.parse(dataConfig.SQLResponse)) || '{}';
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
    };
    try {
      const data = await dynamicGetData(params);
      let res = data[0].response || '{}';
      try {
        JSON.parse(res);
      } catch (e) {
        res = JSON.stringify({
          isErr: true,
          message: res
        });
      }
      newOObj.apiResponse = res || '{}';
      newOObj.apiFilterResponse = res || '{}';
      const {
        apiDataFilterId,
        enableApiFilter,
        apiFilterFun
      } = newOObj;
      if (apiDataFilterId && enableApiFilter && apiFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${apiFilterFun}`);
        let result;
        try {
          result = fun()(JSON.parse(res));
        } catch (e) {
          result = JSON.parse(res);
        }
        newOObj.apiFilterResponse = JSON.stringify(result) || '{}';
      }
    } catch (e) {
      const { data } = e;
      newOObj.apiResponse = JSON.stringify(data);
    }
  }
  if (
    objKey === 'SqlDataConfig'
    &&
    (
      key === 'SQL'
      ||
      (key === 'enableDataManage' && value && newOObj.variableConfig && newOObj.variableConfig.length)
      ||
      (key === 'variableConfig' && value.length && newOObj.enableDataManage)
    )
  ) {
    const params = {
      dataJson: JSON.stringify(newOObj),
      dataType: 3
    };
    if (newOObj.enableDataManage) {
      params.varJson = JSON.stringify(newOObj.variableConfig || []);
    }
    try {
      let data = await dynamicGetData(params);
      if (Array.isArray(data) && data.length > 30) {
        data = data.slice(0, 30);
      }
      newOObj.SQLResponse = JSON.stringify(data) || '{}';
      newOObj.SQLFilterResponse = JSON.stringify(data) || '{}';
      const {
        SQLDataFilterId,
        enableSQLFilter,
        SQLFilterFun
      } = newOObj;
      if (SQLDataFilterId && enableSQLFilter && SQLFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        let result;
        try {
          result = fun()(data);
        } catch (e) {
          result = data;
        }
        newOObj.SQLFilterResponse = JSON.stringify(result) || '{}';
      }
    } catch (e) {
      const { data } = e;
      newOObj.SQLResponse = JSON.stringify(data);
    }
  }
  if (objKey === 'dataConfig') {
    newOObj = {
      ...newOObj,
      [key]: value
    };
  }
  return newOObj;
};

/**
 * 根据图表图例的类型返回对应的配置
 * @param legendPosition
 */
export function returnChartPosition(legendPosition) {
  let legendPos;
  if (legendPosition === 'tl') {
    legendPos = {
      top: 'top',
      left: 'left',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'tc') {
    legendPos = {
      left: 'center',
      top: 'top',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'tr') {
    legendPos = {
      top: 'top',
      left: 'right',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'bl') {
    legendPos = {
      top: 'bottom',
      left: 'left',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'bc') {
    legendPos = {
      top: 'bottom',
      left: 'center',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'br') {
    legendPos = {
      top: 'bottom',
      left: 'right',
      orient: 'horizontal'
    };
  }
  if (legendPosition === 'lt') {
    legendPos = {
      top: 'top',
      left: 'left',
      orient: 'vertical'
    };
  }
  if (legendPosition === 'lc') {
    legendPos = {
      top: 'middle',
      left: 'left',
      orient: 'vertical'
    };
  }
  if (legendPosition === 'lb') {
    legendPos = {
      top: 'bottom',
      left: 'left',
      orient: 'vertical'
    };
  }
  if (legendPosition === 'rt') {
    legendPos = {
      top: 'top',
      left: 'right',
      orient: 'vertical'
    };
  }
  if (legendPosition === 'rc') {
    legendPos = {
      top: 'middle',
      left: 'right',
      orient: 'vertical'
    };
  }
  if (legendPosition === 'rb') {
    legendPos = {
      top: 'bottom',
      left: 'right',
      orient: 'vertical'
    };
  }
  return legendPos;
}

// 判断url是否正确
export function IsURL(str_url = '') {
  const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
      + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' // ftp的user@
      + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
      + '|' // 允许IP和DOMAIN（域名）
      + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
      + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
      + '[a-z]{2,6})' // first level domain- .com or .museum
      + '(:[0-9]{1,4})?' // 端口- :80
      + '((/?)|' // a slash isn't required if there is no file name
      + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
  const re = new RegExp(strRegex);
  return re.test(str_url);
}

/**
 * 根据key获取arr中的x轴
 * @param arr
 * @param key
 * @returns {[]}
 */
export function getXAxisByKey(arr = [], key) {
  const axis = [];
  arr.forEach((item) => {
    if (!axis.includes(item[key])) {
      axis.push(item[key]);
    }
  });
  return axis;
}
/**
 * 验证是否匹配触发条件
 * @param {object} triggerObj 触发器详情
 * @param {string} actualVal 实际需要比对的值
 * @param {string} matchVal 匹配值
 */
export const validTriggerMatch = (triggerObj) => {
  const { compare, realValue, targetValue } = triggerObj;
  // 如果字段和值都没有则不满足条件
  if (!realValue && !targetValue) return false;
  const NUMBER_COMPARE_TYPE = [2, 3, 4, 5]; // >、 <、>=、<=四种属于数值类型比较
  // eslint-disable-next-line no-restricted-globals
  if (NUMBER_COMPARE_TYPE.includes(compare) && !isNaN(realValue) && !isNaN(targetValue)) {
    const normalValNum = +targetValue;
    const actualValNum = +realValue;
    if (compare === 2 && actualValNum < normalValNum) return true;
    if (compare === 3 && actualValNum <= normalValNum) return true;
    if (compare === 4 && actualValNum > normalValNum) return true;
    if (compare === 5 && actualValNum >= normalValNum) return true;
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

export const checkLevelDetials = (config, data) => {
  const { list = [], status } = config;
  const arr = [];
  const n = list.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < n; i++) {
    const { compare, field, value } = list[i];
    const conditionObj = {
      compare,
      realValue: data[field] || '', // 列表中的真实数据
      targetValue: value // 目标数据， 需要和真实数据对比，如果满足条件，返回true
    };
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
};

export const checkDetials = (config, data) => {
  const { list = [], status } = config;
  const n = list.length;
  const arr = [];
  // eslint-disable-next-line no-plusplus
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
};

/**
 * 判断条件是否生效及返回对应的数据
 * @param conDitionsArr 条件配置
 * @param data 数据，永远条件配置中的比较
 * * retun key 字段值
 */
export const validConditions = (conDitionsArr = [], data, key) => {
  let color = '';
  const n = conDitionsArr.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < n; i++) {
    const current = conDitionsArr[i];
    const { config = {} } = current;
    const { list = [] } = config;
    if (!list.length) { // 如果条件中没有配置条件，则继续执行，匹配，直到匹配到第一个生效的条件（后续的条件不继续判断，节省性能），然后退出循环
      // eslint-disable-next-line no-continue
      continue;
    } else {
      const flag = checkDetials(config, data);
      if (flag) {
        color = current[key];
        return color;
      }
      // eslint-disable-next-line no-continue
      continue;
    }
  }
  return color;
};
