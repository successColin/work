const padLeftZero = function(str) {
  return `00${str}`.substring(str.length);
};

const formatDate = (date, fmt) => {
  if (date) {
    date = typeof date === 'string' ? date.replace(/-/g, '/') : date;
    date = new Date(date);
  } else date = new Date();

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substring(4 - RegExp.$1.length)
    );
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'MS+': date.getMilliseconds(),
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
  // for (const k in o) {
  //   if (new RegExp(`(${k})`).test(fmt)) {
  //     const str = `${o[k]}`;
  //     fmt = fmt.replace(
  //       RegExp.$1,
  //       RegExp.$1.length === 1 ? str : this.padLeftZero(str)
  //     );
  //   }
  // }
  return fmt;
};

export default formatDate;
