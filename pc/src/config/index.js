/*
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:54:00
 * @Des: 一些公共配置
 */
module.exports = {
  exportTips: [
    // 条件
    { content: '1、请按照模板对应字段备注填写相应数据；' },
    { content: '2、如有多张工作表，只导入第一张工作表；' },
    { content: '3、请勿擅自修改模版内的表头字段，以免导入失败；' },
    { content: '4、导入数据最多5000条；' },
  ],
  lambdaArr: [
    // 条件
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: 'in', label: 'in' },
    { value: 'not in', label: 'not in' },
  ],
  loginStyleArr: [
    {
      name: '平铺式轮播风格',
      value: 1,
    },
    {
      name: '卡片式轮播风格',
      value: 2,
    },
  ],
  stylePercentageArr: [
    {
      name: '比例70%',
      value: 1,
      label: '70%',
    },
    {
      name: '比例60%',
      value: 2,
      label: '60%',
    },
    {
      name: '比例50%',
      value: 3,
      label: '50%',
    },
  ],
  themeColor: '#4689F5', // 这个色号必须和主题色是一个颜色才行，要不然出来的css模板文件是空的,element-ui的默认主题色是#409EFF
  selectColorArr: [
    '#4689f5',
    '#C62127',
    '#EE5E5E',
    '#FAB71C',
    '#FC8256',
    '#34C7BE',
    '#10B98A',
    '#1CA6FF',
    '#A853F2',
    '#EF4373',
    '#708DB7',
  ],
  userColorArr: ['#4689f5', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'], // 用户头像颜色
  whitePathName: [
    'dataA',
    'login',
    'associatedUser',
    'form',
    'info',
    'verifyway',
    'getverify',
    'resetpswd',
    'successtip',
    'helpCenterShow',
    'appCustomPage',
    'sharePage',
    '404',
    '401',
    'example',
    // 'homeMenu',
    'demo',
    'demo1',
  ],
  baseUrl: '', // 全局设置地址包括打包后静态文件地址、路由地址。默认空特殊项目需要添加
  PREFIX: '/api', // 前缀
  VERSION: 'v1', // 版本号，默认为1，后续有其他接口版本号是其他值
  appRouteArr: [
    {
      label: '知识库',
      routeName: 'sysKnowledge',
    },
    {
      label: '扫一扫',
      routeName: 'sysScan',
    },
    {
      label: '消息',
      routeName: 'sysNotification',
    },
    {
      label: '离线点检',
      routeName: 'inspection',
    },
    {
      label: '流程',
      routeName: 'sysProcess',
    },
  ],
  approvalType: [
    // 审批类型，用于流程
    { name: '或签(一名审批人通过或否决即可)', value: 'ONE_PASS_OR_REJECT' },
    { name: '会签(需所有审批人通过)', value: 'ALL_PASS_OR_REJECT' },
    {
      name: '会签(需一名审批人通过，否决需全员否决)',
      value: 'ONE_PASS_OR_ALL_REJECT',
    },
  ],
  formulaData: [
    // type 1 表示哪里都有 2表示只在触发器影响控件里面有 3 表示是执行函数 4 代表 app
    {
      name: '常用公式',
      children: [
        { name: 'GET_SELDATA', isFormula: true, type: 2 },
        { name: 'GET_USER_ID', isFormula: true, type: 1 },
        { name: 'GET_ORG_ID', isFormula: true, type: 1 },
        { name: 'GET_ROLES_ID', isFormula: true, type: 1 },
        { name: 'GET_MENU_ID', isFormula: true, type: 1 },
        // { name: 'GET_TABLE_IDS', isFormula: true, type: 1 },
        { name: 'BULK_ADD', isFormula: true, type: 3 },
        { name: 'BULK_ONE_ADD', isFormula: true, type: 3 },
        { name: 'CREATE_UNIQUE', isFormula: true, type: 3 },
        { name: 'GET_SCAN_VALUE', isFormula: true, type: 4 },
        { name: 'GET_SHOW_VALUE', isFormula: true, type: 1 },
        { name: 'GET_TABLE_VALUE', isFormula: true, type: 1 },
      ],
    },
    {
      name: '日期函数',
      children: [
        { name: 'GET_DATE', isFormula: true, type: 1 },
        { name: 'GET_DATETIME', isFormula: true, type: 1 },
        { name: 'GET_YEAR', isFormula: true, type: 1 },
        { name: 'GET_MONTH', isFormula: true, type: 1 },
        { name: 'GET_WEEK', isFormula: true, type: 1 },
        { name: 'GET_DAY', isFormula: true, type: 1 },
        { name: 'GET_TIMESTAMP', isFormula: true, type: 1 },
      ],
    },
    {
      name: '自定义页面函数',
      children: [{ name: 'GET_FIELD_VALUE', isFormula: true, type: 5 }],
    },
    {
      name: '服务器函数',
      children: [
        // { name: 'GET_IP', isFormula: true },
        // { name: 'GET_TIME', isFormula: true },
      ],
    },
  ],
  allowFileType:
    '.png, .jpg,.jpeg, .gif, .txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .mp3, .mp4, .avi, .vsdx, .zip, .rar, .m4a, .xmind, .emmx, .log, .chm',
  timeShortcuts: [
    {
      text: '今天',
      onClick(picker) {
        const t =
          new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24;
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 1);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '昨天',
      onClick(picker) {
        const t = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 1);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '最近一周',
      onClick(picker) {
        const t =
          new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24;
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '最近一个月',
      onClick(picker) {
        // const t = new Date(new Date().toLocaleDateString()).getTime() + 3600 * 1000 * 24;
        // const end = new Date(t - 1000);
        // const start = new Date(t - 3600 * 1000 * 24 * 30);
        // picker.$emit('pick', [start, end]);
        const end = new Date();
        const year = end.getFullYear();
        const month = end.getMonth() + 1; // 0-11表示1-12月
        const day = end.getDate();
        const dateObj = {};
        dateObj.end = `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
        const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
        if (month - 1 <= 0) {
          // 如果是1月，年数往前推一年<br>
          dateObj.start = `${year - 1}-${12}-${day}`;
        } else {
          const startMonthDay = new Date(
            year,
            parseInt(month, 10) - 1,
            0,
          ).getDate();
          if (startMonthDay < day) {
            // 1个月前所在月的总天数小于现在的天日期
            if (day < endMonthDay) {
              // 当前天日期小于当前月总天数
              dateObj.start = `${year}-${month - 1}-${
                startMonthDay - (endMonthDay - day)
              }`;
            } else {
              dateObj.start = `${year}-${month - 1}-${startMonthDay}`;
            }
          } else {
            dateObj.start = `${year}-${month - 1}-${day}`;
          }
        }
        const arr = dateObj.start.split('-');
        const allDay = new Date(arr[0], arr[1], 0).getDate();
        if (+arr[2] + 1 > allDay) {
          arr[1] = +arr[1] + 1;
          arr[2] = '01';
          if (arr[1] > 12) {
            arr[0] = +arr[0] - 1;
            arr[1] = '01';
          }
        } else {
          arr[2] = +arr[2] + 1;
        }
        const newStartTime = `${arr[0]}-${arr[1]
          .toString()
          .padStart(2, '0')}-${arr[2].toString().padStart(2, '0')}`;
        picker.$emit('pick', [
          `${newStartTime} 00:00:00`,
          `${dateObj.end} 23:59:59`,
        ]);
      },
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const year = end.getFullYear();
        const month = end.getMonth() + 1; // 0-11表示1-12月
        const day = end.getDate();
        const dateObj = {};
        dateObj.end = `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
        const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
        if (month - 3 <= 0) {
          // 如果是1、2、3月，年数往前推一年
          // 3个月前所在月的总天数
          const start3MonthDay = new Date(
            year - 1,
            12 - (3 - parseInt(month, 10)),
            0,
          ).getDate();
          if (start3MonthDay < day) {
            // 3个月前所在月的总天数小于现在的天日期
            dateObj.start = `${year - 1}-${12 - (3 - month)}-${start3MonthDay}`;
          } else {
            dateObj.start = `${year - 1}-${12 - (3 - month)}-${day}`;
          }
        } else {
          // 3个月前所在月的总天数
          const start3MonthDay = new Date(
            year,
            parseInt(month, 10) - 3,
            0,
          ).getDate();
          if (start3MonthDay < day) {
            // 3个月前所在月的总天数小于现在的天日期
            if (day < endMonthDay) {
              // 当前天日期小于当前月总天数,2月份比较特殊的月份
              dateObj.start = `${year}-${month - 3}-${
                start3MonthDay - (endMonthDay - day)
              }`;
            } else {
              dateObj.start = `${year}-${month - 3}-${start3MonthDay}`;
            }
          } else {
            dateObj.start = `${year}-${month - 3}-${day}`;
          }
        }
        const arr = dateObj.start.split('-');
        const allDay = new Date(arr[0], arr[1], 0).getDate();
        if (+arr[2] + 1 > allDay) {
          arr[1] = +arr[1] + 1;
          arr[2] = '01';
          if (arr[1] > 12) {
            arr[0] = +arr[0] - 1;
            arr[1] = '01';
          }
        } else {
          arr[2] = +arr[2] + 1;
        }
        const newStartTime = `${arr[0]}-${arr[1]
          .toString()
          .padStart(2, '0')}-${arr[2].toString().padStart(2, '0')}`;
        picker.$emit('pick', [
          `${newStartTime} 00:00:00`,
          `${dateObj.end} 23:59:59`,
        ]);
      },
    },
    {
      text: '大于当前时间',
      onClick(picker) {
        const end = new Date('2099/12/31 00:00:00');
        const start = new Date();
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '小于当前时间',
      onClick(picker) {
        const end = new Date();
        const start = new Date('1900/01/01 00:00:00');
        picker.$emit('pick', [start, end]);
      },
    },
  ],
  engIndex: [
    { name: 'A', i: 0 },
    { name: 'B', i: 1 },
    { name: 'C', i: 2 },
    { name: 'D', i: 3 },
    { name: 'E', i: 4 },
    { name: 'F', i: 5 },
    { name: 'G', i: 6 },
    { name: 'H', i: 7 },
    { name: 'I', i: 8 },
    { name: 'G', i: 9 },
    { name: 'K', i: 10 },
    { name: 'L', i: 11 },
    { name: 'M', i: 12 },
    { name: 'N', i: 13 },
    { name: 'O', i: 14 },
    { name: 'P', i: 15 },
    { name: 'Q', i: 16 },
    { name: 'R', i: 17 },
    { name: 'S', i: 18 },
    { name: 'T', i: 19 },
    { name: 'U', i: 20 },
    { name: 'V', i: 21 },
    { name: 'W', i: 22 },
    { name: 'X', i: 23 },
    { name: 'Y', i: 24 },
    { name: 'Z', i: 25 },
  ],
  allOption: {
    color: '#FFEAEB',
    enUS: 'all',
    fontColor: '#E02020',
    icon: { icon: 'icon-dajuanbaogao', color: '#5A80ED' },
    name: '全部',
    sno: 0,
    value: 0,
    zhCN: '全部',
    zhTW: '全部',
  },
};
