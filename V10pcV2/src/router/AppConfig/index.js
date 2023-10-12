const AppConfig = [
  {
    path: 'appConfig',
    name: 'appConfig',
    component: () => import('_v/AppConfig'),
    meta: {
      childrenPage: true,
    },
    redirect: () => '/appConfig/funcPage',
    children: [
      {
        path: 'funcPage',
        name: 'funcPage',
        component: () => import('_v/AppConfig/FuncPage'),
        meta: {
          childrenPage: true,
          parentPath: 'appConfig',
          parentName: 'APP配置',
          transitionName: 'fade',
        },
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import('_v/AppConfig/Mine'),
        meta: {
          childrenPage: true,
          parentPath: 'appConfig',
          parentName: 'APP配置',
          transitionName: 'fade',
        },
      },
      {
        path: 'paramPage',
        name: 'paramPage',
        component: () => import('_v/AppConfig/ParamPage'),
        meta: {
          childrenPage: true,
          parentPath: 'appConfig',
          parentName: 'APP配置',
          transitionName: 'fade',
        },
      },
    ],
  },
];

export default AppConfig;
