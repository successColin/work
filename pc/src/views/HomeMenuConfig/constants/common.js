import { dynamicGetData } from '@/api/design';
import { formatDate } from '_u/utils';

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

// 常规的公式
export const getVariableValue = (varKey) => {
  const roleIds = window.vue.$store.state.userCenter.userInfo.roleIds || [];
  const { name } = window.vue.$route;
  console.log(name);
  switch (varKey) {
    case '[GET_USER_ID]()':
      return window.vue.$store.state.userCenter.userInfo.id;
    case '[GET_ORG_ID]()':
      return window.vue.$store.state.userCenter.userInfo.orgId;
    case '[GET_ROLES_ID]()':
      return roleIds.join(',');
    case '[GET_DATE]()':
      return formatDate(new Date(), 'yyyy-MM-dd');
    case '[GET_DATETIME]()':
      return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
    case '[GET_YEAR]()':
      return new Date().getFullYear();
    case '[GET_MONTH]()':
      return new Date().getMonth();
    case '[GET_WEEK]()':
      return new Date().getDay();
    case '[GET_DAY]()':
      return new Date().getDate();
    case '[GET_TIMESTAMP]()':
      return new Date().getTime();
    case '[GET_MENU_ID]()':
      return window.vue.$route.query.id;
    default: return null;
  }
};

// 判断是否有公式的值
export const reduceVariableConfig = (arr = []) => {
  const newArr = arr.reduce((data, pre) => {
    const { valueType = 1, value, name } = pre;
    if (valueType === 1 && name) {
      return data.concat([{ value, name }]);
    }
    if (valueType === 2 && name) {
      const newValue = getVariableValue(value);
      return data.concat({
        name,
        value: newValue
      });
    }
    return data;
  }, []);
  return newArr;
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
    const fun = new Function(`'use strict';return ${dataConfig.SQLFilterFun}`);
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
    if (newOObj.enableDataManage && newOObj.variableConfig.length) {
      const reduceVariableArr = reduceVariableConfig(newOObj.variableConfig);
      params.varJson = JSON.stringify(reduceVariableArr || []);
    }
    try {
      let data = await dynamicGetData(params);
      if (Array.isArray(data) && data.length > 30) {
        data = data.slice(0, 30);
      }
      newOObj.SQLResponse = JSON.stringify(data) || '{}';
      newOObj.SQLFilterResponse = JSON.stringify(data) || '{}';
      console.log(newOObj, 'zz');
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
  const {
    compare,
    realValue,
    targetValue
  } = triggerObj;
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
  const {
    list = [],
    status
  } = config;
  const arr = [];
  const n = list.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < n; i++) {
    const {
      compare,
      field,
      value
    } = list[i];
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
  const {
    list = [],
    status
  } = config;
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

/**
 * 获取水球图的配置
 * @param config
 * @param data
 * @param echarts
 */
export const getLiquidfillOption = (params = {}) => {
  const { config, data, echarts } = params;
  const {
    stylesObj: {
      colorArr,
      radius,
      shape,
      waveNum,
      animationDuration,
      waveLength,
      amplitude,
      waveAnimation,
      outlineShow,
      borderDistance,
      borderColor,
      borderWidth,
      shadowColor, // 阴影颜色
      shadowBlur, // 阴影距离
      bgColor, // 内部背景颜色
      bgBorderColor, // 内部背景边框颜色
      bgBorderWidth, // 内部背景边框宽度
      bgShadowColor, // 背景阴影颜色
      bgShadowBlur, // 背景阴影距离
      labelPosition, // 文字位置inside， left， right， top，bottom
      labelFontSize, // 文字大小
      labelFontWeight, // 文字
      labelColor, // 文字颜色
      labelShow // 是否显示文字
    },
    dataType,
    dataConfig: { staticValue },
    SqlDataConfig,
  } = config;
  let lastData = {};
  const seriesData = [];
  const cn = colorArr.length; // 颜色长度
  if (Object.prototype.hasOwnProperty.call(params, 'data')) {
    if (dataType === 1) {
      lastData = JSON.parse(staticValue);
    }
    if (dataType === 2 || dataType === 3) {
      lastData = data;
    }
  } else {
    if (dataType === 1) {
      lastData = JSON.parse(staticValue);
    }
    if (dataType === 3) {
      const { SQLFilterResponse = '[]' } = SqlDataConfig;
      lastData = JSON.parse(SQLFilterResponse);
    }
  }
  const supplementaryColorArr = supplementaryColor(waveNum, cn);
  const per1 = lastData.value || 0;
  const colorList = [...colorArr, ...supplementaryColorArr];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < waveNum; i++) {
    seriesData.push(
      {
        value: per1,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0, // 0%时的颜色 从上往下看 最上面是0%
              color: colorList[i].c1 || colorList[i].c2 || '#fff'
            }, {
              offset: 1, // 100%时的颜色 从上往下看 最上面是0%
              color: colorList[i].c2 || colorList[i].c1 || '#fff'
            }])
          }
        }
      }
    );
  }
  return {
    series: [
      {
        type: 'liquidFill',
        name: '',
        radius: `${radius}%`,
        shape,
        waveLength,
        amplitude,
        waveAnimation,
        direction: animationDuration,
        data: seriesData,
        outline: {
          show: outlineShow,
          borderDistance,
          itemStyle: {
            borderWidth,
            borderColor,
            shadowBlur,
            shadowColor
          }
        },
        backgroundStyle: {
          color: bgColor,
          borderColor: bgBorderColor,
          borderWidth: bgBorderWidth,
          shadowColor: bgShadowColor,
          shadowBlur: bgShadowBlur
        },
        label: {
          normal: {
            formatter: () => `${(lastData.value || 0) * 100}%`,
            show: labelShow,
            // color: labelColor,
            insideColor: labelColor,
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            position: labelPosition
          }
        }
      }
    ]
  };
};

/**
 * 获取到组件的初始化传参
 * @param config
 * @param routeQuers
 * @param otherParams
 * @returns {{varJson: string, id}}
 */
export const getRequestParams = ({
  config = {},
  routeQuery = {},
  otherParams = {},
  elseParams = {}
}) => {
  const {
    id,
    componentId,
    SqlDataConfig: {
      variableConfig = []
    }
  } = config;
  const reduce = (
    obj // 将Object 处理成 Array
  ) =>
    Object.keys(obj)
      .map((item) => ({
        name: item,
        value: obj[item]
      }));

  const satisfyParams = {};
  if (JSON.stringify(otherParams) !== '{}') {
    Object.keys(otherParams)
      .forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.replace(`${componentId}_`, '');
          satisfyParams[key] = otherParams[item];
        }
      });
  }
  const initVarConfig = variableConfig.reduce((last, pre) => {
    const { value, valueType = 1, name } = pre;
    if (name) {
      return {
        ...last,
        [name]: valueType === 1 ? value : getVariableValue(value)
      };
    }
    return last;
  }, {});
  const currentParams = {
    ...initVarConfig,
    ...routeQuery,
    ...satisfyParams,
    ...elseParams
  };
  const arr = reduce(currentParams);
  return {
    id,
    varJson: JSON.stringify(arr)
  };
};
