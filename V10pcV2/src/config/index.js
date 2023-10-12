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
    { value: 'is null', label: 'is null' },
    { value: 'is not null', label: 'is not null' },
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
  normalPage: [
    'approvalPage',
    'appCustomPage',
    'sharePage',
    'forgotpswd',
    'verifyway',
    'getverify',
    'resetpswd',
    'successtip',
    'form',
    'info',
  ],
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
    'approvalPage',
    'appCustomPage',
    'sharePage',
    '404',
    '401',
    'example',
    // 'homeMenu',
    'demo',
    'demo1',
    'ApiotMenu',
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
    {
      label: '用户登录管理',
      routeName: 'userloginManage',
    },
    {
      label: '文章',
      routeName: 'MoreInfor',
    },
    {
      label: '日历',
      routeName: 'calendar',
    },
    {
      label: '健康度检查',
      routeName: 'health',
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
  nodeComType: {
    8: 'ExtInt',
    7: 'StoredProcedure',
    6: 'BackgroundData'
  },
  formulaData: [
    // type 1 表示哪里都有 2表示只在触发器影响控件里面有 3 表示是执行函数 4 代表 app
    {
      name: '常用公式',
      children: [
        {
          name: 'GET_TOKEN',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          des: '',
        },
        {
          name: 'GET_SELDATA',
          isFormula: true,
          type: 2,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_SELDATA</span>函数获取数据选择框带出值公式<br/>参数：2个<br/>示例：<span class="red">GET_SELDATA</span>(组件,"orgId"),返回选中组件带出的orgId<br/>参数：5个<br/>示例：<span class="red">GET_SELDATA</span>(组件,"orgId", "sys_org", "name", "id"),得到选中组件带出的orgId,然后根据orgId当作sys_org表的id去查出他的name，最终返回name的值',
        },
        {
          name: 'GET_USER_ID',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_USER_ID</span>函数获取当前用户id<br/>参数：无<br/>示例：<span class="red">GET_USER_ID</span>(),返回当前用户的id',
        },
        {
          name: 'GET_ORG_ID',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_ORG_ID</span>函数获取当前用户组织id<br/>参数：无<br/>示例：<span class="red">GET_ORG_ID</span>(),返回当前用户的组织id',
        },
        {
          name: 'GET_ROLES_ID',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_ROLES_ID</span>函数获取当前用户的所属角色<br/>参数：无<br/>示例：<span class="red">GET_ROLES_ID</span>(),返回当前用户的所属角色',
        },
        {
          name: 'GET_MENU_ID',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: false,
          des: '<span class="red">GET_MENU_ID</span>函数获取当前菜单id<br/>参数：无<br/>示例：<span class="red">GET_MENU_ID</span>(),返回当前菜单的菜单id',
        },
        {
          name: 'GET_TABLE_IDS',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: false,
          des: '<span class="red">GET_TABLE_IDS</span>函数获取当前最后操作表格选中数据的的ids<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IDS</span>(),返回最后操作表格选中数据的的ids',
        },
        {
          name: 'BULK_ADD',
          isFormula: true,
          type: 3,
          onlyIsWeb: true,
          des: '<span class="red">BULK_ADD</span>函数批量新增多对多<br/>参数不定，参数都为组件，逗号相隔</br>示例：<span class="red">BULK_ADD</span>(组件1,组件2),如果组件1的值是1,2;组件2的值是3,4<br/>返回1,3;1,4;2,3;2,4;4条数据',
        },
        {
          name: 'BULK_ONE_ADD',
          isFormula: true,
          type: 3,
          onlyIsWeb: true,
          des: '<span class="red">BULK_ONE_ADD</span>函数批量新增一一对应<br/>参数不定，参数都为组件，逗号相隔</br>示例：<span class="red">BULK_ONE_ADD</span>(组件1,组件2),如果组件1的值是1,2;组件2的值是3,4<br/>返回1,3;2,4;2条数据',
        },
        {
          name: 'CREATE_UNIQUE',
          isFormula: true,
          type: 3,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">CREATE_UNIQUE</span>函数创建唯一值<br/>参数：无<br/>示例：<span class="red">CREATE_UNIQUE</span>(),返回一个随机的唯一值<br/>参数：1个<br/>示例：<span class="red">CREATE_UNIQUE</span>(1),返回结果为1',
        },
        {
          name: 'GET_SCAN_VALUE',
          isFormula: true,
          type: 4,
          onlyIsWeb: false,
          des: '<span class="red">GET_SCAN_VALUE</span>函数获取当前app扫描的值<br/>参数：无<br/>示例：<span class="red">GET_SCAN_VALUE</span>(),返回app扫描的值',
        },
        {
          name: 'GET_SHOW_VALUE',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_SHOW_VALUE</span>函数获取数据单选框，数据多选框，label等组件显示值函数<br/>参数：1个<br/>示例：<span class="red">GET_SHOW_VALUE</span>(组件)，返回当前选中组件的显示值',
        },
        {
          name: 'GET_VALUE_COUNT',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_VALUE_COUNT</span>函数根据逗号获取值得个数<br/>参数：1个<br/>示例：<span class="red">GET_VALUE_COUNT</span>(组件)，返回当前选中组件根据逗号切割出值的个数',
        },
        {
          name: 'GET_TABLE_VALUE',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_TABLE_VALUE</span>函数获取组件所属表格的选中数据的该组件值得集合，逗号隔开<br/>参数：1个<br/>示例：span class="red">GET_TABLE_VALUE</span>(组件)，返回该组件所属表格选中数据的该组件值得集合',
        },
        {
          name: 'GET_TABLE_IS_NULL',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_TABLE_IS_NULL</span>函数判断组件所属表格是否没有选中数据<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IS_NULL</span>(),该组件所属表格有选中值返回false，不然，返回true',
        },
        {
          name: 'GET_TABLE_IS_NO_DATA',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_TABLE_IS_NO_DATA</span>函数判断组件所属表格有无数据<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IS_NO_DATA</span>(),该组件所属表格有选中值返回false，不然，返回true',
        },
        {
          name: 'GET_TIME_GAP',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: "<span class='red'>GET_TIME_GAP</span>函数获取两个时间间隔<br/>参数：2个<br/>示例：<span class='red'>GET_TIME_GAP</span>(startTime,endTime),返回结束时间到开始时间的间隔单位为天<br/>参数：3个，第三个参数为'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'中的一个<br/>示例：<span class='red'>GET_TIME_GAP</span>(startTime,endTime,'years'),返回结束时间到开始时间的间隔单位为年",
        },
        {
          name: 'GET_TIME_RES',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_TIME_RES</span>函数获取时间结果<br/>参数：4个<br/>第一个参数代表类型 1是 相加 2是相减<br/>第二个参数代表起始时间<br/>第三个参数代表间隔时间<br/>第4个参数代表间隔时间单位 1 是天 2 是周 3 是月 4 是年 默认不传即为1<br/>示例：<span class="red">GET_TIME_RES</span>(1,startTime,100,1),返回startTime加上100天后的日期结果',
        },
        {
          name: 'BEFORE_IN_AFTER',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: true,
          des: '<span class="red">BEFORE_IN_AFTER</span>函数判断前面的数据是否被后面的包含<br/>参数：第一参数为组件，后面的参数为","相隔的值，拼成数组<br/>示例：<span class="red">BEFORE_IN_AFTER</span>(组件,1,2,3),返回组件值是否是1,2,3内中的值，是返回true，不是则为false',
        },
        {
          name: 'BEFORE_NOT_IN_AFTER',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: true,
          des: '<span class="red">BEFORE_NOT_IN_AFTER</span>函数判断前面的数据是否不被后面的包含<br/>参数：第一参数为组件，后面的参数为"，"相隔的值，拼成数组<br/>示例：<span class="red">BEFORE_NOT_IN_AFTER</span>(组件,1,2,3),返回组件值是否不是1,2,3内中的值，是返回false，不是则为true',
        },
        {
          name: 'GET_TEXT',
          isFormula: true,
          type: 1,
          onlyIsWeb: true,
          isVariables: false,
          des: '<span class="red">GET_TEXT</span>函数获取到一个字符串<br/>参数：1个<br/>示例：<span class="red">GET_TEXT</span>(组件),返回组件值是字符串类型',
        },
      ],
    },
    {
      name: '日期函数',
      children: [
        {
          name: 'GET_DATE',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_DATE</span>函数获取当前日期<br/>参数：无<br/>示例：<span class="red">GET_DATE</span>(),返回当前日期',
        },
        {
          name: 'GET_DATETIME',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_DATETIME</span>函数获取当前日期时间<br/>参数：无<br/>示例：<span class="red">GET_DATETIME</span>(),返回当前日期时间',
        },
        {
          name: 'GET_YEAR',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_YEAR</span>函数获取当前年<br/>参数：无<br/>示例：<span class="red">GET_YEAR</span>(),返回当前年',
        },
        {
          name: 'GET_MONTH',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_MONTH</span>函数获取当前月<br/>参数：无<br/>示例：<span class="red">GET_MONTH</span>(),返回当前月',
        },
        {
          name: 'GET_WEEK',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          des: '<span class="red">GET_WEEK</span>函数获取当前星期<br/>参数：无<br/>示例：<span class="red">GET_WEEK</span>(),返回当前星期',
        },
        {
          name: 'GET_DAY',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_DAY</span>函数获取当前月的第几天<br/>参数：无<br/>示例：<span class="red">GET_DAY</span>(),返回当前月的第几天',
        },
        {
          name: 'GET_TIMESTAMP',
          isFormula: true,
          type: 1,
          onlyIsWeb: false,
          isVariables: true,
          des: '<span class="red">GET_TIMESTAMP</span>函数获取当前时间戳<br/>参数：无<br/>示例：<span class="red">GET_TIMESTAMP</span>(),返回当前时间戳',
        },
      ],
    },
    {
      name: '自定义页面函数',
      children: [
        { name: 'GET_FIELD_VALUE', isFormula: true, type: 5, des: '' },
      ],
    },
    {
      name: '流程引擎函数',
      children: [
        {
          name: 'GET_FLOW_DATA_ID',
          isFormula: true,
          type: 6,
          onlyIsWeb: false,
          des: '',
        },
      ],
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
    '.png, .jpg,.jpeg, .gif, .txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .mp3, .mp4, .avi, .vsdx, .zip, .rar, .m4a, .xmind, .emmx, .log, .chm, .tiff, .tif, .7z',
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
