/* eslint-disable no-dupe-keys */
/*
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:54:00
 * @Des: 一些公共配置
 */
module.exports = {
  deflautTheme: '#4689f5', // deflautTheme必须在selectColorArr列表中
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
  // 白名单
  whitePathName: ['login', 'weChat/registerLogin', 'weChat/loginByOpenId'],
  // #ifdef H5
  baseUrl: '', // app地址
  // #endif
  // #ifndef H5
  // baseUrl: 'http://192.168.0.20:8080', // cl
  baseUrl: 'http://47.118.76.70:8080', // ios审核环境环境
  // baseUrl: 'http://47.99.87.62:93', // 商务演示
  // baseUrl: 'http://120.26.220.36',
  // baseUrl: 'http://192.168.0.23:8080',
  // baseUrl: 'http://120.26.220.36',
  // baseUrl: 'http://192.168.0.28:8080',
  // baseUrl: 'https://smrz.ywsoft.vip',
  // #endif
  PREFIX: '/api', // 前缀
  VERSION: 'v1', // 版本号，默认为1，后续有其他接口版本号是其他值
  geoMapKey: {
    MP_KEY: '62ce1772e201f8c2e427d2c27396478a',
    H5_KEY: 'b3aae43b3231eda4fc001ba13a60ceb7',
  }, // 高德地图key
  qqMapKey: 'FE6BZ-H2XWX-JH64V-7NL3Z-ABUA3-3LBND', // 腾讯地图key
  // app固定菜单
  appRouteArr: [
    {
      label: '知识库',
      routeName: 'sysKnowledge',
      url: '/knowledgeBase/index',
    },
    {
      label: '扫一扫',
      routeName: 'sysScan',
      url: '',
    },
    {
      label: '消息',
      routeName: 'sysNotification',
      url: '/Message/index',
    },
    {
      label: '离线点检',
      routeName: 'inspection',
      url: '/inspection/inspection/route',
    },
    {
      label: '流程',
      routeName: 'sysProcess',
      url: '/PagesProcess/index',
    },
    {
      label: '用户登录管理',
      routeName: 'userloginManage',
      url: '/userloginManage/index',
    },
  ],
};
