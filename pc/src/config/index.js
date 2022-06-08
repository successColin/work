/*
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:54:00
 * @Des: 一些公共配置
 */
module.exports = {
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
};
