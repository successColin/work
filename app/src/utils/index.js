import docTypeUrl from '@/static/img/fileType/DOC.svg';
import fileTypeUrl from '@/static/img/fileType/FILE.svg';
import imgTypeUrl from '@/static/img/fileType/IMAG.svg';
import mp3TypeUrl from '@/static/img/fileType/MP3.svg';
import mp4TypeUrl from '@/static/img/fileType/MP4.svg';
import otyerTypeUrl from '@/static/img/fileType/OTHER.svg';
import pdfTypeUrl from '@/static/img/fileType/PDF.svg';
import pptTypeUrl from '@/static/img/fileType/PPT.svg';
import txtTypeUrl from '@/static/img/fileType/TXT.svg';
import xlsTypeUrl from '@/static/img/fileType/XLS.svg';
import zipTypeUrl from '@/static/img/fileType/ZIP.svg';
import cnchar from 'cnchar';
import 'cnchar-poly';
import CryptoJS from 'crypto-js';

// 数字转换成对应汉字
export function numToChinese(num) {
  const f = {
    0: '',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
  };
  num = num.toString();
  let str = '';
  for (let i = 0; i < num.length; i += 1) {
    str += f[num[i]];
  }
  return str;
}

/**
 * 将时间戳转换成日期
 */
export function formatDate(time, format) {
  const date = {
    'y+': time.getFullYear(), // 获取完整的年份(4位,1970)
    'M+': time.getMonth() + 1,
    'd+': time.getDate(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds(),
    'q+': Math.floor((time.getMonth() + 3) / 3),
    'S+': time.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${time.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }
  Object.keys(date).forEach((k) => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? date[k]
          : `00${date[k]}`.substr(`${date[k]}`.length),
      );
    }
  });

  return format;
}

export function toDate(val, mode = 'MM-dd hh:mm:ss') {
  if (val === 0) {
    return '-';
  }

  const newDate = new Date();
  newDate.setTime(val * 1000);

  return newDate.format(mode);
}

/**
 * 将日期转换成时间戳
 */

export function toTimestamp(Time) {
  const timestamp = Math.round(Time.getTime() / 1000);
  return timestamp;
}

// 随机最小到最大之间一个数 如果传入字符串 返回两位数 不足0补全
export function randint(n, m) {
  const c = m - n + 1;
  const num = Math.random() * c + Number(n);
  if (typeof n === 'string') {
    return Math.floor(num)
      .toString()
      .padStart(2, '0');
  }
  return Math.floor(num);
}

// 返回符号和字符串 默认两位小数 四舍五入
export function currency(value, decimal = 2) {
  value = parseFloat(value);
  if (!Number.isFinite(value) || (!value && value !== 0)) return '';
  const stringified = value.toFixed(decimal);
  return stringified;
}

// 解析url
export function getQueryString(name, str) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r;
  if (str) {
    r = str.split('?')[1].match(reg);
  } else {
    r = window.location.search.substr(1).match(reg);
  }
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

// 防抖函数
export function debounce(fn, delay = 200) {
  let timer = null;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // 模拟触发change事件
      fn.apply(this, args);
      // 清空计时器
      timer = null;
    }, delay);
  };
}

// 节流函数
export function throttle(fn, delay = 200) {
  let timer = null;
  return function(...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

const key = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');
const iv = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');

// // 解密方法
export function Decrypt(word) {
  // const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  // const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  // const decrypt = CryptoJS.AES.decrypt(srcs, key,
  // { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  // const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  // return decryptedStr.toString();
  if (!word) return;
  const dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(word), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(dec);
}

// 加密方法
export function Encrypt(word) {
  if (!word) return;
  // const srcs = CryptoJS.enc.Utf8.parse(word);
  // console.log('CryptoJS.enc.Utf8.parse(word)', srcs);
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // return encrypted.ciphertext.toString().toUpperCase();
  return encrypted.ciphertext.toString();
}

/**
 * 表单提交时，后台校验返回的错误信息处理成文字信息
 * @param errorObj
 * @param callback
 */
export function errorMessageProcessing(errorObj = {}, callback) {
  let message = '';
  Object.keys(errorObj).forEach((item) => {
    const html = `${item}${errorObj[item]}`;
    message += html;
  });
  callback(message);
}

// 提取尾字母大写
export function fontChange(userName) {
  if (!userName) return '';
  const len = userName.length;
  return cnchar.spell(userName.substring(len - 2), 'first', 'up');
}

// 自定义图标分组id
export const definedIconGroupID = [1, 2, 3];

// 生成唯一值
export function createUnique() {
  const str = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789';
  const { length } = str;
  const arr = [];
  const newArr = [];
  for (let i = 0; i < 6; i += 1) {
    const newIndex = Math.round(Math.random() * length);
    arr.push(str.charAt(newIndex));
  }
  arr.forEach((item) => {
    const newIndex = Math.round(Math.random() * 6);
    newArr.splice(newIndex, 0, item);
  });
  // console.log(newArr.join(''));
  // const unique = +new Date();
  // const random = Math.floor(Math.random() * 100);
  // return `${unique}${random}`;
  return newArr.join('');
}

export function showTimeName(timeString) {
  const date = new Date(timeString);
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  // today 为今天凌晨的时间
  const dayTime = 24 * 60 * 60 * 1000;
  const delta = today - date; // 得到相差的时间 ms
  if (delta > 0) {
    if (delta <= dayTime) {
      return '昨天';
    }
    if (delta <= 2 * dayTime) {
      return '前天';
    }
  } else if (-delta < dayTime) {
    return '今天';
  }
  return timeString;
}

// 根据文件的绝对路径获取对应的文件
export function getBlob({ url, token, method = 'get', contentType }, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.responseType = 'blob';
  xhr.setRequestHeader('token', token);
  if (contentType) {
    xhr.setRequestHeader('content-type', contentType);
  }
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.response);
      cb(xhr.response);
    }
  };
  xhr.send();
}

// 获取文件之后进行下载
export function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const body = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}

// 生成别名
export function createAlias(tableName) {
  const unique = createUnique();
  return `${tableName.slice(0, 2)}__${unique}`;
}

// 获取字符串匹配正则的字符串、起始位置
export function getChartsByEx(str, regExp) {
  const patt = new RegExp(regExp, 'g');
  const chartsPosArry = [];
  let result;
  // eslint-disable-next-line no-cond-assign
  while ((result = patt.exec(str)) != null) {
    chartsPosArry.push({
      result,
      from: result.index,
      to: patt.lastIndex,
    });
  }
  return chartsPosArry;
}

// 将绝对路径的图片装换成base64的图片
export function makeUrlToBase64(url, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    callback(dataURL);
    return dataURL;
  };
  img.src = url;
}
// 将base64的图片转换成File对象
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 将毫秒装换成时分秒的时长
 * @param s
 * @returns {string}
 */
export const getSeconds = (s = 0) => {
  // eslint-disable-next-line radix
  let sTime = parseInt(s) || 0; // 秒
  let mTime = 0; // 分
  let hTime = 0; // 时
  if (sTime > 60) {
    // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    // eslint-disable-next-line radix
    mTime = parseInt(sTime / 60);
    // 获取秒数，秒数取佘，得到整数秒数
    // eslint-disable-next-line radix
    sTime = parseInt(sTime % 60);
    //  如果分钟大于60，将分钟转换成小时
    if (mTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      // eslint-disable-next-line radix
      hTime = parseInt(mTime / 60);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      // eslint-disable-next-line radix
      mTime = parseInt(mTime % 60);
    }
  }
  let result = '';
  if (sTime >= 0 && sTime < 10) {
    // eslint-disable-next-line radix
    result = `0${parseInt(sTime)}`;
  } else {
    // eslint-disable-next-line radix
    result = `${parseInt(sTime)}`;
  }
  if (mTime >= 0 && mTime < 10) {
    // eslint-disable-next-line radix
    result = `0${parseInt(mTime)}:${result}`;
  } else {
    // eslint-disable-next-line radix
    result = `${parseInt(mTime)}:${result}`;
  }
  if (hTime >= 0 && hTime < 10) {
    // eslint-disable-next-line radix
    result = `0${parseInt(hTime)}:${result}`;
  } else {
    // eslint-disable-next-line radix
    result = `${parseInt(hTime)}:${result}`;
  }
  return result;
};

export const fileType = (name) => {
  if (name) {
    const arr = name.split('.');
    const type = arr[arr.length - 1].toLocaleLowerCase();
    if (['xls', 'xlsx'].indexOf(type) !== -1) {
      return xlsTypeUrl;
    }
    if ('txt'.indexOf(type) !== -1) {
      return txtTypeUrl;
    }
    if (['ppt', 'pptx'].indexOf(type) !== -1) {
      return pptTypeUrl;
    }
    if ('pdf'.indexOf(type) !== -1) {
      return pdfTypeUrl;
    }
    if (['doc', 'docx'].indexOf(type) !== -1) {
      return docTypeUrl;
    }
    if ('mp3'.indexOf(type) !== -1) {
      return mp3TypeUrl;
    }
    if ('mp4'.indexOf(type) !== -1) {
      return mp4TypeUrl;
    }
    if (['zip', 'rar'].indexOf(type) !== -1) {
      return zipTypeUrl;
    }
    if (['jpg', 'jpeg', 'png', 'gif'].indexOf(type) !== -1) {
      return imgTypeUrl;
    }
    return otyerTypeUrl;
  }
  return otyerTypeUrl;
};

// 节点类型（1目录 2文档 3图片 4视频 5 音频 6 其他）
export const fileTypeImg = (obj) => {
  if (obj.sysKlTree && obj.sysKlTree.treeType === 1) {
    return fileTypeUrl;
  }
  if (obj.sysKlTree && obj.sysKlTree.treeType === 3) {
    return imgTypeUrl;
  }
  if (obj.sysKlTree && obj.sysKlTree.treeType === 4) {
    return mp4TypeUrl;
  }
  if (obj.sysKlTree && obj.sysKlTree.treeType === 5) {
    return mp3TypeUrl;
  }
  if (obj.sysKlTree && obj.sysKlTree.treeType === 6) {
    return otyerTypeUrl;
  }
  if (obj.sysKlTree && obj.sysKlTree.treeType === 2) {
    let url = '';
    if (obj.sysKlTree && obj.sysKlTree.url) {
      url = obj.sysKlTree.url;
    } else {
      url = obj.url;
    }
    const suffixArr = url.split('.');
    const suffix = suffixArr[suffixArr.length - 1];
    if ('txt'.indexOf(suffix) !== -1) return txtTypeUrl;
    if (['xls', 'xlsx'].indexOf(suffix) !== -1) return xlsTypeUrl;
    if (['ppt', 'pptx'].indexOf(suffix) !== -1) return pptTypeUrl;
    if ('pdf'.indexOf(suffix) !== -1) return pdfTypeUrl;
    if (['doc', 'docx'].indexOf(suffix) !== -1) return docTypeUrl;
    if (['zip', 'rar'].indexOf(suffix) !== -1) return zipTypeUrl;
  }
  return otyerTypeUrl;
};
