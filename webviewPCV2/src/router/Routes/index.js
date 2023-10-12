export default [
  {
    path: '/',
    redirect: '/customImport',
  },
  // 泰州石化定制化：定制导入
  {
    path: '/customImport',
    name: 'customImport',
    component: () => import('_v/CustomImport'),
    meta: {
      title: '定制化导入',
    },
  },
  // 泰州石化定制化：样品台账
  {
    path: '/sampleLedger',
    name: 'sampleLedger',
    component: () => import('_v/SampleLedger'),
    meta: {
      title: '样品台账',
    },
  },
  // 泰州石化定制化：附件下载
  {
    path: '/attachmentsView',
    name: 'attachmentsView',
    component: () => import('_v/AttachmentsView'),
    meta: {
      title: '附件下载',
    },
  },
  // 404页面
  {
    path: '/404',
    name: '404',
    component: () => import('_v/ErrorPage/404'),
  },
  {
    path: '*', // 匹配所有路由
    redirect: '/404',
  },
];
