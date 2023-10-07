import cnchar from 'cnchar';

export const fileName = '';
// 计算时间间隔
export function getDurationTime(startDate, endDate) {
  debugger;
  // 时间格式统一
  let startTime = startDate.replace(/-/g, '/');
  let endTime = endDate.replace(/-/g, '/');
  console.log(Date.parse(startTime));
  console.log(Date.parse(endTime));
  console.log(Number.isNaN(startTime));
  console.log(Number.isNaN(Date.parse(startTime)));
  if (
    !Number.isNaN(Date.parse(startTime)) &&
    !Number.isNaN(Date.parse(endTime))
  ) {
    startTime = new Date(startTime);
    endTime = new Date(endTime);
    const durationTime = endTime.getTime() - startTime.getTime();
    const leave1 = durationTime % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    // const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩 余的毫秒数

    const startY = startTime.getFullYear();
    const startM = startTime.getMonth() + 1;
    const endY = endTime.getFullYear();
    const endM = endTime.getMonth() + 1;

    const days = Math.floor(durationTime / (24 * 3600 * 1000)); // 计算出相差天数
    const hours = Math.floor(leave1 / (3600 * 1000)); // 计算出小时数
    const minutes = Math.floor(leave2 / (60 * 1000)); // 计算相差分钟数
    // const seconds = Math.round(leave3 / 1000); // 计算相差秒数
    const weeks = Math.abs(durationTime) / 1000 / 60 / 60 / 24 / 7; // 计算相差的周
    const years = startY - endY;
    const months = endY * 12 + endM - (startY * 12 + startM);

    return {
      years,
      months,
      weeks,
      days,
      hour: Math.floor(durationTime / 1000 / 60 / 60),
      minutes: days * (24 * 60) + hours * 60 + minutes,
      seconds: Math.floor(durationTime / 1000),
    };
  }
  return {};
}

// 提取尾字母大写
export function fontChange(userName) {
  if (!userName) return '';
  const len = userName.length;
  return cnchar.spell(userName.substring(len - 2), 'first', 'up');
}
