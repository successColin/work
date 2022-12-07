// 获取el当前位子
export function getElPos(element) {
  const rect = element.getBoundingClientRect();
  const top = document.documentElement.clientTop;
  const left = document.documentElement.clientLeft;

  return {
    top: rect.top - top,
    bottom: rect.bottom - top,
    left: rect.left - left,
    right: rect.right - left
  };
}

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
    9: '九'
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
    'S+': time.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${time.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  Object.keys(date).forEach((k) => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? date[k]
          : `00${date[k]}`.substr(`${date[k]}`.length)
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
  return function (...args) {
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
  return function (...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 生成唯一值
export function createUnique() {
  const str = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789';
  const {length} = str;
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

// 判断url是否正确
export function IsURL(str_url = '') {
  if (!str_url) return false;
  const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
    + '|' // 允许IP和DOMAIN（域名）
    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
    + '[a-z]{2,6})' // first level domain- .com or .museum
    + '(:[0-9]{1,4})?' // 端口- :80
    + '((/?)|' // a slash isn't required if there is no file name
    + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
  const re = new RegExp(strRegex);
  return re.test(str_url);
}

// 判断路径是否是图片路径
export function CheckImgExists(imgurl = '') {
  if (!imgurl) return false;
  let ImgObj = new Image(); //判断图片是否存在
  ImgObj.src = imgurl;
  return new Promise(function (resolve) {
    ImgObj.onload = () => {
      resolve(true);
    }
    ImgObj.onerror = () => {
      console.log('false');
      resolve(false);
    }
  });
}

/**
 * 返回数组中的最大值
 * @param arr 数组 ，也有可能是数组对象
 * @param key 对象的某个属性
 */
export function getMax(arr, key) {
  if (!key) {
    return arr.reduce((num1, num2) => {
      return num1 > num2 ? num1 : num2
    }
    )
  }
  return arr.reduce((obj1, obj2) => {
    return obj1[key] > obj2[key] ? obj1[key] : obj2[key]
  }
  )
}

// 16进制转RGB值
export function _hexToRgb(hex) {
  const HASH$1 = '#', EMPTY_STRING$1 = '';
  hex = hex.replace(HASH$1, EMPTY_STRING$1); // HASH$1 = '#' ; EMPTY_STRING$1 = ''
  const bigint = parseInt(hex, 16);
  return {
    r: bigint >> 16 & 255,
    g: bigint >> 8 & 255,
    b: bigint & 255
  };
}

/**
 * 根据图表图例的类型返回对应的配置
 * @param legendPosition
 * @returns {{top: string, orient: string, left: string}|{orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}|{top: string, orient: string, left: string}}
 */
export function returnChartPosition(legendPosition) {
  let legendPos;
  if (legendPosition === 'tl') {
    legendPos = {
      top: 'top',
      left: 'left',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'tc') {
    legendPos = {
      left: 'center',
      top: 'top',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'tr') {
    legendPos = {
      top: 'top',
      left: 'right',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'bl') {
    legendPos = {
      top: 'bottom',
      left: 'left',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'bc') {
    legendPos = {
      top: 'bottom',
      left: 'center',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'br') {
    legendPos = {
      top: 'bottom',
      left: 'right',
      orient: 'horizontal'
    }
  }
  if (legendPosition === 'lt') {
    legendPos = {
      top: 'top',
      left: 'left',
      orient: 'vertical'
    }
  }
  if (legendPosition === 'lc') {
    legendPos = {
      top: 'middle',
      left: 'left',
      orient: 'vertical'
    }
  }
  if (legendPosition === 'lb') {
    legendPos = {
      top: 'bottom',
      left: 'left',
      orient: 'vertical'
    }
  }
  if (legendPosition === 'rt') {
    legendPos = {
      top: 'top',
      left: 'right',
      orient: 'vertical'
    }
  }
  if (legendPosition === 'rc') {
    legendPos = {
      top: 'middle',
      left: 'right',
      orient: 'vertical'
    }
  }
  if (legendPosition === 'rb') {
    legendPos = {
      top: 'bottom',
      left: 'right',
      orient: 'vertical'
    }
  }
  return legendPos;
}

/**
 * 根据key获取arr中的x轴
 * @param arr
 * @param key
 * @returns {[]}
 */
export function getXAxisByKey(arr = [], key) {
  const axis = [];
  arr.forEach((item) => {
    if (!axis.includes(item[key])) {
      axis.push(item[key]);
    }
  })
  return axis;
}


// toFixed 修复
export const toFixed = (num, s) => {
  let times = Math.pow(10, s);
  let des = num * times + 0.5;
  des = parseInt(des, 10) / times;
  return des + '';
}

// 根据文件的绝对路径获取对应的文件
export function getBlob({ url, method = 'get', contentType }, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.responseType = 'blob';
  if (contentType) {
    xhr.setRequestHeader('content-type', contentType);
  }
  xhr.onload = function() {
    if (xhr.status === 200) {
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

export function dataURLtoBlob(dataurl, name) {
  // base64转file
  let arr = dataurl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  };
  return new File([u8arr], name, {
    type: mime
  });
}

// 生成预览url
export function makeUrl() {
  const {pathname, origin} = window.location;
  const arr = pathname.split('/');
  const n = arr.length;
  arr[n - 1] = 'menu'
  // const newPathName = `${origin}${arr.join('/')}/${this.$route.query.id}`;
  return `${origin}${arr.join('/')}/`;
}
