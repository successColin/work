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
      // {
      //   path: 'login',
      //   name: 'login',
      //   component: () => import('_v/AppConfig/Login'),
      //   meta: {
      //     childrenPage: true,
      //     parentPath: 'appConfig',
      //     parentName: 'APP配置',
      //   },
      // },
      // {
      //   path: 'infoMaintain',
      //   name: 'infoMaintain',
      //   component: () => import('_v/AppConfig/InfoMaintain'),
      //   meta: {
      //     childrenPage: true,
      //     parentPath: 'appConfig',
      //     parentName: 'APP配置',
      //   },
      // },
      {
        path: 'funcPage',
        name: 'funcPage',
        component: () => import('_v/AppConfig/FuncPage'),
        meta: {
          childrenPage: true,
          parentPath: 'appConfig',
          parentName: 'APP配置',
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
        },
      },
    ],
  },
];

export default AppConfig;
