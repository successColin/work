// 周期字段
export const cycleColumnArr = [
  {
    label: 'timedTask.name',
    prop: 'description',
    compName: 'ElTableColumn',
  },
  {
    label: 'timedTask.expression',
    prop: 'expression',
    compName: 'ElTableColumn',
  },
  {
    label: 'timedTask.remark',
    prop: 'memo',
    compName: 'ElTableColumn',
  },
];
export const cycleParamsObj = {
  expressionType: 'CORN',
};

// 模板字段
export const templateColumnArr = [
  {
    label: 'timedTask.templateName',
    prop: 'templateName',
    compName: 'ElTableColumn',
  },
];

export const templateParamsObj = {
  expressionType: 'CORN',
};

// 存储过程
export const storedColumnArr = [
  {
    label: 'timedTask.storedProcedure',
    prop: 'proceduresName',
    compName: 'ElTableColumn',
  },
];
