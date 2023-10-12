// 小数位
// mode 类型：polish=补齐，如果位数不够默认补齐0
const polishNum = function(value, n, mode = '') {
  if (!value || typeof value === 'string') return value;
  const arry = `${value}`.split('.');
  let integer = '';
  let digit = '';

  if (arry.length >= 1) {
    // eslint-disable-next-line prefer-destructuring
    integer = arry[0];
  }
  if (arry.length === 2) {
    // eslint-disable-next-line prefer-destructuring
    digit = arry[1];
  }

  let len = digit.length;
  if (len > n) len = n;
  let x = 1;
  for (let i = 0; i < len; i += 1) {
    x += '0';
  }
  x = +x;
  let v = Math.floor(value * x) / x;
  if (!v && n) v = v.toFixed(len);
  if (mode === 'polish') v = v.toFixed(n);
  return v;
};

// 显示千分位
const getThousandth = function(value) {
  if (!value || typeof value === 'string') return value;
  let inputValue = value.toString();
  const index = inputValue.indexOf('.');
  if (index !== -1) {
    const intNum = inputValue
      .substring(0, index)
      .replace(/\B(?=(?:\d{3})+$)/g, ',');
    const dot = inputValue.substring(index, inputValue.length);
    inputValue = intNum + dot;
  } else {
    inputValue = inputValue
      .substring(0, inputValue.length)
      .replace(/\B(?=(?:\d{3})+$)/g, ',');
  }
  return inputValue;
};

export default { getThousandth, polishNum };
