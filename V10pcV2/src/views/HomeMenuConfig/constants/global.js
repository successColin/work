/**
 * @name: global
 * @author: DELL
 * @date: 2022/3/29 11:42
 * @description：global
 * @update: 2022/3/29 11:42
 */

// eslint-disable-next-line import/prefer-default-export
export const menuProperties = { // 菜单属性
  width: 1920, // 设计区域宽
  height: 1080, // 设计区域高
  bgColor: '#FFF', // 背景颜色
  gridSize: 24, // 栅格大小
  enable: true, // 是否启用栅格，默认启用，值为true
  bgImage: '', // 背景图片
  showType: 1, // 展示类型， 默认按高低比例展示， 1、 按屏幕宽比例展示；
  enableShadows: true, // 是否启用阴影
  xShadow: 0, // 水平阴影
  yShadow: 0, // 垂直阴影
  shadowDistance: 0, // 阴影距离
  blurRadius: 4, // 模糊半径
  shadowColor: 'rgba(0,0,0,.16)', // 阴影颜色
};
export const menuAppProperties = { // 菜单属性
  width: 360, // 大屏默认宽度
  height: 640, // 大屏默认高度
  bgImage: '', // 背景图片
  bgColor: '#FFF', // 背景颜色
  gridSize: 20, // 栅格大小
  enable: true, // 是否启用栅格，默认启用，值为true
  showType: 2, // 展示类型， 默认按高低比例展示，1， 屏幕宽高展示； 2、 按屏幕宽比例展示； 3、按屏幕高比例展示； 4、 按根据设计图真实比例展示
  enableShadows: true, // 是否启用阴影
  xShadow: 0, // 水平阴影
  yShadow: 0, // 垂直阴影
  shadowDistance: 0, // 阴影距离
  blurRadius: 4, // 模糊半径
  shadowColor: 'rgba(0,0,0,.16)', // 阴影颜色
};

export const predefineColors = [
  '#EE5E5E',
  '#FC8256',
  '#FAB71C',
  '#10B98A',
  '#0EBEC4',
  '#5A80ED',
  '#8A5AED',
  '#ED437B',
  '#708DB7',
  '#ACB4BE',

  '#FFEAEB',
  '#FFECE5',
  '#FFF5DB',
  '#E3FBF5',
  '#E3FDFD',
  '#E5F0FF',
  '#F7EEFF',
  '#FEE9F0',
  '#EEF4FC',
  '#F2F4F8',

  '#333333',
  '#666666',
  '#808080',
  '#AAAAAA',
  '#C0C0C0',
  '#CACACA',
  '#D7D7D7',
  '#E3E3E3',
  '#EDEDED',
  '#F5F5F5',
];

export const requestOptions = [{ // 请求方法类型设置
  label: 'GET',
  value: 1
}, {
  label: 'POST',
  value: 2
}];

// 线标记
export const symbolOptions = [
  {
    label: '无',
    value: 'none'
  },
  {
    label: '空心圆',
    value: 'emptyCircle'
  }, {
    label: '实心圆',
    value: 'circle'
  }, {
    label: '正方形',
    value: 'rect'
  }, {
    label: '三角形',
    value: 'triangle'
  }, {
    label: '菱形',
    value: 'diamond'
  }, {
    label: '气泡',
    value: 'pin'
  }, {
    label: '箭头',
    value: 'arrow'
  }
];

// 线类型
export const LineTYPE = [
  {
    label: '实线',
    value: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed'
  }, {
    label: '点线',
    value: 'dotted'
  }
];

// 时间类型
export const TIME_TYPE = [
  // {
  //   label: '时间',
  //   value: 1
  // },
  {
    label: '时间日期',
    value: 3
  },
  {
    label: '日',
    value: 2
  }, {
    label: '周',
    value: 4
  }, {
    label: '月',
    value: 5
  }, {
    label: '年',
    value: 6
  }
];

// 我发起的流程
export const initiatedArr = ['DRAFT', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'REVOKED'];
