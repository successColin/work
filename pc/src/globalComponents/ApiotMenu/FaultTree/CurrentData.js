// 现象 column
export const phenomenonColumn = [
  {
    label: '现象编码',
    prop: 'keycode',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '现象名称',
    prop: 'name',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '现象描述',
    prop: 'memo',
    compName: 'ElTableColumn',
    isChinese: true,
  },
];

// 原因 column
export const whyColumn = [
  {
    label: '原因编码',
    prop: 'keycode',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '原因名称',
    prop: 'name',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '原因描述',
    prop: 'memo',
    compName: 'ElTableColumn',
    isChinese: true,
  },
];

// 措施 column
export const measuresColumn = [
  {
    label: '措施编码',
    prop: 'keycode',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '措施名称',
    prop: 'name',
    compName: 'ElTableColumn',
    isChinese: true,
  },
  {
    label: '措施描述',
    prop: 'memo',
    compName: 'ElTableColumn',
    isChinese: true,
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
