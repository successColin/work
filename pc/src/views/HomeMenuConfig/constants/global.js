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
  showType: 1, // 展示类型， 默认按高低比例展示， 1、 按屏幕宽比例展示；
  enableShadows: true, // 是否启用阴影
  xShadow: 0, // 水平阴影
  yShadow: 0, // 垂直阴影
  shadowDistance: 0, // 阴影距离
  blurRadius: 4, // 模糊半径
  shadowColor: 'rgba(0,0,0,.16)', // 阴影颜色
};

export const predefineColors = ['#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
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
