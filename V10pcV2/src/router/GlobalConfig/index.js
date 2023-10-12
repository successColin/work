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
      const {
        tenantVO: { tenantCode },
      } = userInfo;
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
          transitionName: 'fade',
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
          transitionName: 'fade',
        },
      },
      {
        path: 'thirdLinks',
        name: 'thirdLinks',
        component: () => import('_v/GlobalConfig/ThirdLinks'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
          transitionName: 'fade',
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
          transitionName: 'fade',
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
          transitionName: 'fade',
        },
      },
      {
        path: 'homeConfig',
        name: 'homeConfig',
        component: () => import('_v/GlobalConfig/HomeConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
          transitionName: 'fade',
        },
      },
      {
        path: 'reportConfig',
        name: 'reportConfig',
        component: () => import('_v/GlobalConfig/ReportConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
          transitionName: 'fade',
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
          transitionName: 'fade',
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
          transitionName: 'fade',
        },
      },
      {
        path: 'remoteConfig',
        name: 'remoteConfig',
        component: () => import('_v/GlobalConfig/RemoteConfig'),
        meta: {
          childrenPage: true,
          parentPath: 'globalConfig',
          parentName: '全局参数',
          transitionName: 'fade',
        },
      },
    ],
  },
];

export default GlobalConfig;
