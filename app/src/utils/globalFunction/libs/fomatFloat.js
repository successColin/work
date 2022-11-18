// 小数位
// mode 类型：polish=补齐，如果位数不够默认补齐0
const digitPolish = function (value, n, mode = '') {};
const polishNum = function (value, n, mode = '') {
  if (!n) return value;

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

  // 如果小数位大于n
  if (digit.length > n) {
    digit = digit.substring(0, n);
  } else if (mode === 'polish') {
    const len = n - digit.length;
    for (let i = 0; i < len; i += 1) {
      digit += '0';
    }
  }

  const num = `${integer}.${digit}`;
  return Number(num);
};

// 显示千分位
const getThousandth = function (value) {
  if (!value) return value;
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
