import { createUnique } from '@/utils/utils';

// 单行文本
export const TextCom = {
  name: '单行文本',
  areaType: 1, // 表示内容区
  dragTable: true, // 能否拖入表格区
  imgUrl: 'baseComp/SingleLineText.svg',
  compType: 1,
  compId: createUnique(),
  compName: 'SingleLineText',
  tableCompName: 'TableInputCol',
  propertyCompName: 'SingleLineTextConfig',
  labelName: '单行文本',
  singleType: 1, // 单行文本类型
  placeholder: '请输入单行文本', // 占位符
  helpInfo: '',
  fieldName: '', // 字段名
  dataSource: {
    relateName: '主表', // 关系名称
    tableName: '', // 表名
    columnName: '', // 字段名称
    columnTypeDict: 0, // 字段类型
    id: 0, // 字段id
    alias: '', // 表别名
    dictObj: null, // 字典表数据
  }, // 数据源
  singleStatus: 1, // 1 普通 2只读 3禁用 4隐藏 2，3合并了
  canShow: true,
  canReadonly: false,
  width: '50%',
  tableWidth: '0.1', // 在表格中的宽度
  shouldRequired: false, // 是否必填
  shouldRepeat: false, // 是否重复
  lengthLimit: '', // 长度限制
  showMoreReg: false, // 是否显示更多规则
  submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
};

// 下拉框
export const SelectCom = {
  name: '下拉框',
  areaType: 1, // 表示内容区
  dragTable: true, // 能否拖入表格区
  imgUrl: 'baseComp/DropDownBox.svg',
  compType: 2,
  compId: createUnique(),
  compName: 'DropDownBox',
  tableCompName: 'TableSelectCol',
  propertyCompName: 'DropDownBoxConfig',
  labelName: '下拉框',
  dropDownType: 1, // 下拉组件类型
  placeholder: '请选择下拉框',
  helpInfo: '', // 帮助信息
  fieldName: '', // 字段名
  filterable: false, // 能否搜索
  dataSource: {
    relateName: '主表', // 关系名称
    tableName: '', //  表名
    columnName: '', // 字段名称
    columnTypeDict: 0, // 字段类型
    id: 0, // 字段id
    alias: '', // 别名
    dictObj: null, // 字典表数据
  },
  sort: 1, // 1 升序 2 降序
  dropDownStyle: 1, // 1 普通风格 2 背景展示风格 3 个性图标风格
  singleStatus: 1, // 控件状态 只读 禁用 隐藏 等
  canShow: true,
  canReadonly: false,
  width: '50%',
  tableWidth: '0.1',
  shouldRequired: false,
  submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
};

// 数据单选框
export const DataOneBoxCom = {
  name: '数据单选框',
  areaType: 1, // 表示内容区
  dragTable: true, // 能否拖入表格区
  imgUrl: 'baseComp/DataSingleSel.svg',
  compType: 6,
  compId: createUnique(),
  compName: 'DataSingleSel',
  tableCompName: 'TableDataSingleSel',
  propertyCompName: 'DataSingleSelConfig',
  labelName: '数据单选框',
  dropDownType: 1,
  placeholder: '请选择数据单选框',
  helpInfo: '', // 帮助信息
  dataSource: {
    relateName: '', // 关系名称
    tableName: '', //  表名
    columnName: '', // 字段名称
    columnTypeDict: 0, // 字段类型
    id: 0, // 字段id
    alias: '', // 别名
    dictObj: null, // 字典表数据
    mainColumnInfo: null, // 主表相关信息
  },
  relateTableArr: [],
  relateTableIndex: 0,
  pane: {
    name: '', // 面板名称
    columnName: '', // 面板字段
    paramArr: [
      // {
      //   name: '', // 变量名称
      //   type: 1, // 变量类型 1 是工作表 2 是固定值 3是公式
      //   compId: '', // 组件id
      //   fixedValue: '', // 固定值
      //   formula: '' // 公式
      // }
    ],
  },
  tableInfo: {
    tableName: '',
    id: 0,
    nameAlias: '',
  },
  enableDict: false, // 是否字典值
  relateType: 1, // 弹窗类型 1是面板 2是菜单
  dialogName: 'PanelDialog', // 弹窗风格
  dialogTitle: '',
  singleStatus: 1,
  canShow: true,
  canReadonly: false,
  defaultValueType: 1, // 1 是固定值 2 是公式
  formulaContent: '', // 公式字符串
  width: '50%',
  tableWidth: '0.1',
  shouldRequired: false,
  submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
};

// 数据多选框
export const DataMultiBoxCom = {
  name: '数据多选框',
  areaType: 1, // 表示内容区
  dragTable: true, // 能否拖入表格区
  imgUrl: 'baseComp/DataMultiSel.svg',
  compType: 7,
  compId: createUnique(),
  compName: 'DataMultiSel',
  tableCompName: 'TableDataMultiSel',
  propertyCompName: 'DataMultiSelConfig',
  labelName: '数据多选框',
  dropDownType: 1,
  placeholder: '请选择数据多选框',
  helpInfo: '', // 帮助信息
  dataSource: {
    relateName: '', // 关系名称
    tableName: '', //  表名
    columnName: '', // 字段名称
    columnTypeDict: 0, // 字段类型
    id: 0, // 字段id
    alias: '', // 别名
    dictObj: null, // 字典表数据
    mainColumnInfo: null, // 主表相关信息
  },
  multiTable: {
    table: {
      tableName: '',
      alias: '',
      id: '',
    },
    column: {
      columnName: '',
      id: '',
      columnTypeDict: 0,
    },
  }, // 多选字段来源
  pane: {
    name: '', // 面板名称
    columnName: '', // 面板字段
    paramArr: [
      // {
      //   name: '', // 变量名称
      //   type: 1, // 变量类型 1 是工作表 2 是固定值 3是公式
      //   compId: '', // 组件id
      //   fixedValue: '', // 固定值
      //   formula: '' // 公式
      // }
    ],
  },
  relateTableArr: [],
  tableInfo: {
    tableName: '',
    id: 0,
    nameAlias: '',
  },
  enableDict: false, // 是否字典值
  relateType: 1, // 弹窗类型 1是面板 2是菜单
  dialogName: 'PanelDialog', // 弹窗风格
  dialogTitle: '',
  singleStatus: 1,
  canShow: true,
  canReadonly: false,
  width: '50%',
  tableWidth: '0.1',
  shouldRequired: false,
  submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
};

// 日期时间框
export const DateTimeCom = {
  name: '日期时间框',
  areaType: 1, // 表示内容区
  dragTable: true, // 能否拖入表格区
  imgUrl: 'baseComp/DateTimePickerBox.svg',
  compType: 9,
  compId: createUnique(),
  compName: 'DateTimePickerBox',
  tableCompName: 'TableDateTimePickerCol',
  propertyCompName: 'DateTimePickerBoxConfig',
  labelName: '日期时间框',
  placeholder: '请选择日期时间',
  startPlaceholder: '请选择开始日期时间',
  endPlaceholder: '请选择结束日期时间',
  helpInfo: '',
  dataSource: {
    relateName: '主表',
    tableName: '',
    columnName: '',
    columnTypeDict: 0,
    id: 0,
    alias: '',
    dictObj: null, // 字典表数据
  },
  singleStatus: 1,
  canShow: true,
  canReadonly: false,
  defaultType: '', // 默认值类型 空 无 1 当前时间 2 自定义
  width: '50%',
  tableWidth: '0.1',
  shouldRequired: false,
  timeInterval: false, // 是否选择区间
  minTimeObj: {
    type: 1,
    minTime: '',
    formula: '',
  }, // 最小时间
  maxTimeObj: {
    type: 1,
    maxTime: '',
    formula: '',
  }, // 最大时间
  submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
};
