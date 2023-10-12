import validation from './test.js';

// 将px转化为rpx
export function px2rpx(value) {
  value = String(value);
  // 判断是否为数字
  if (validation.number(value)) {
    value /= uni.upx2px(100) / 100;
  }
  return value;
}
// 将rpx转px
export function rpx2px(value) {
  value = String(value);
  // 判断是否为数字
  if (validation.number(value)) {
    value = uni.upx2px(value);
  }
  return value;
}

// 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export function addUnit(value = 'auto', unit = 'rpx') {
  value = String(value);
  // 用uView内置验证规则中的number判断是否为数值
  return validation.number(value) ? `${value}${unit}` : value;
}
