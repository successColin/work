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

export default { getDifferDate };
