export default {
  computed: {
    // dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    timeago() {
      return function(oldTime) {
        const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const now = new Date().getTime(); // 获取当前时间毫秒
        const oldT = new Date(oldTime).getTime();
        const diffValue = now - oldT; // 时间差

        if (diffValue < 0) {
          return '';
        }
        const minC = diffValue / minute; // 计算时间差的分，时，天，周，月
        const hourC = diffValue / hour;
        const dayC = diffValue / day;
        const weekC = diffValue / week;
        const monthC = diffValue / month;
        let result = '';
        if (monthC >= 1 && monthC <= 3) {
          result = ` ${parseInt(monthC, 10)}月前`;
        } else if (weekC >= 1 && weekC <= 3) {
          result = ` ${parseInt(weekC, 10)}周前`;
        } else if (dayC >= 1 && dayC <= 6) {
          result = ` ${parseInt(dayC, 10)}天前`;
        } else if (hourC >= 1 && hourC <= 23) {
          result = ` ${parseInt(hourC, 10)}小时前`;
        } else if (minC >= 1 && minC <= 59) {
          result = ` ${parseInt(minC, 10)}分钟前`;
        } else if (diffValue >= 0 && diffValue <= minute) {
          result = '刚刚';
        } else {
          result = oldTime && oldTime.slice(0, 16);
        }
        return result;
      };
    },
  },
};
