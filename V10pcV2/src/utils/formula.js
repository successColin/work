const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();
// 减
parser.setFunction('SUB', (params) => {
  console.log(params);
  let res = '';
  params.forEach((v, i) => {
    console.log(res);
    if (i === 0) {
      res = v;
    } else {
      res -= v;
    }
  });
  return res;
});
// 乘
parser.setFunction('MUL', (params) => {
  let res = '';
  params.forEach((v, i) => {
    if (i === 0) {
      res = v;
    } else {
      res *= v;
    }
  });
  return res;
});
// 除
parser.setFunction('DIV', (params) => {
  let res = '';
  params.forEach((v, i) => {
    if (i === 0) {
      res = v;
    } else {
      res /= v;
    }
  });
  return res;
});

// 服务器函数
// ip
parser.setFunction('GET_IP', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求ip');
  return '';
});
parser.setFunction('GET_TIME', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('时间');
  return '';
});
parser.setFunction('GET_YEAR', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求年');
  return '';
});
parser.setFunction('GET_MONTH', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求月');
  return '';
});
parser.setFunction('GET_WEEK', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求星期');
  return '';
});
parser.setFunction('GET_DAY', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求日');
  return '';
});
parser.setFunction('GET_TIMESTAMP', (params) => {
  if (params.length !== 0) {
    return;
  }
  console.log('请求时间戳');
  return '';
});

export default parser;
