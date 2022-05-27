// 数字转换成对应汉字
export const dataArrList = [
  {
    fileName: '表格文件.xls',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.txt',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.ppt',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.pdf',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.doc',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.mp3',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.jpg',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.mp4',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.doc',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.mp3',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.jpg',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
  {
    fileName: '表格文件.mp4',
    state: '王小二 2021-12-01 18:20 更新',
    url: '业务文件/报表统计/人员统计',
  },
];

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
