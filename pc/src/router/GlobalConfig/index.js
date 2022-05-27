import store from '@/store/index';

const GlobalConfig = [
  {
    path: 'globalConfig',
    name: 'globalConfig',
    component: () => import('_v/GlobalConfig'),
    meta: {
      childrenPage: true,
    },
    redirect: () => {
      const { userInfo } = store.state.userCenter;
      const { tenantVO: { tenantCode } } = userInfo;
      if (tenantCode !== 'platform') {
        return '/globalConfig/themeConfig';
      }
      return '/globalConfig/passwordConfig';
    },
    children: [
      {
        path: 'passwordConfig',
        name: 'passwordConfig',
        component: () => import('_v/GlobalConfig/PasswordConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
      {
        path: 'themeConfig',
        name: 'themeConfig',
        component: () => import('_v/GlobalConfig/ThemeConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
      {
        path: 'loginConfig',
        name: 'loginConfig',
        component: () => import('_v/GlobalConfig/LoginConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
      {
        path: 'APPloginConfig',
        name: 'APPloginConfig',
        component: () => import('_v/GlobalConfig/APPLoginConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
      {
        path: 'fileserverConfig',
        name: 'fileserverConfig',
        component: () => import('_v/GlobalConfig/FileserverConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
      {
        path: 'watermarkConfig',
        name: 'watermarkConfig',
        component: () => import('_v/GlobalConfig/WatermarkConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
        },
      },
    ],
  },
];

export default GlobalConfig;
