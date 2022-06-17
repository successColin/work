/* eslint-disable no-dupe-keys */
/*
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:54:00
 * @Des: 一些公共配置
 */
module.exports = {
  deflautTheme: '#4689F5', // deflautTheme必须在selectColorArr列表中
  selectColorArr: ['#4689F5', '#CC3534'],
  // 白名单
  whitePathName: ['login'],
  // #ifdef H5
  baseUrl: '', // app地址
  // #endif
  // #ifndef H5
  // baseUrl: 'http://47.99.87.62:84', // app地址
  baseUrl: 'http://47.118.76.70:8080', // app地址
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
  ],
};
