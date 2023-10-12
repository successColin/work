/**
 * 时间比较
 */
const getDifferScale = function (value) {
  let format = null;
  // 获取转化比（天数跟毫秒数的比例）
  if (value === 1) {
    format = parseFloat(24 * 60 * 60 * 1000);
  } else if (value === 2) {
    // 获取转化比（小时数跟毫秒数的比例）
    format = parseFloat(60 * 60 * 1000);
  } else if (value === 3) {
    // 获取转化比（分钟数跟毫秒数的比例）
    format = parseFloat(60 * 1000);
  } else if (value === 4) {
    // 获取转化比（秒数跟毫秒数的比例）
    format = parseFloat(1000);
  }
  return format;
};

// 获取两个日期的相差日期数(differ 相差天数：1、相差小时数：2、相差分钟数：3、相差秒数：4)
const getDifferDate = function (firstDate, secondDate, differ) {
  const startDate = new Date(firstDate);
  const endDate = new Date(secondDate);
  // 计算两个日期相差的毫秒数
  const msecNum = endDate.getTime() - startDate.getTime();
  // 计算两个日期相差的天数
  const dayNum = Math.floor(msecNum / getDifferScale(differ));
  return dayNum;
};

const padLeftZero = function (str) {
  return `00${str}`.substring(str.length);
};
const formatDate = function (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.y}`.substring(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.M + 1,
    'd+': date.d,
    'h+': date.h,
    'm+': date.m,
    's+': date.s,
    'MS+': date.ms,
  };

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`;
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  });
  return fmt;
};

// type 1=天；2=月；3=年
// datetype before=之前；after=之后
const getRecentDay = function ({ n = 1, type = 1, datetype = 'before', fmt }) {
  const dd = new Date();

  let _month = 0;
  let _day = 0;
  if (datetype === 'before' && type === 2) _month = dd.getMonth() - n;
  else if (datetype === 'before' && type === 3) _month = dd.getMonth() - n * 12;
  else if (datetype === 'after' && type === 2) _month = dd.getMonth() + n;
  else if (datetype === 'after' && type === 3) _month = dd.getMonth() + n * 12;
  else if (datetype === 'after' && type === 1) _day = dd.getDate() + n;
  else _day = dd.getDate() - n;

  if (type === 2 || type === 3) dd.setMonth(_month);
  else dd.setDate(_day);

  const y = dd.getFullYear();
  const M = dd.getMonth();
  const d = dd.getDate();
  const h = dd.getHours();
  const m = dd.getMinutes();
  const s = dd.getSeconds();
  const ms = dd.getMilliseconds();
  const day = formatDate({ y, M, d, h, m, s, ms }, fmt);
  return day;
};

export default { getDifferDate, getRecentDay };
