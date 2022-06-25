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
};
