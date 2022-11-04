// 小数位
// mode 类型：polish=补齐，如果位数不够默认补齐0
const fomatFloat = function (value, n, mode = '') {
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

export default fomatFloat;
