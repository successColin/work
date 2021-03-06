// import store from '@/store/index';
import AppConfig from '../AppConfig';
import GlobalConfig from '../GlobalConfig';

export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('_v/Login'),
    meta: {
      notChangeTheme: true,
    },
  },
  // 浙政钉关联用户
  {
    path: '/associatedUser',
    name: 'associatedUser',
    component: () => import('_v/Login/AssociatedUser'),
    meta: {
      notChangeTheme: true,
    },
  },
  // 注册
  {
    path: '/register',
    name: 'register',
    redirect: '/register/form',
    component: () => import('_v/Login/components/RegisterForgot'),
    meta: {
      title: 'login.welcomeToRegisterForAPIoT',
    },
    children: [
      {
        path: 'form',
        name: 'form',
        component: () => import('_v/Register/RegisterForm'),
        meta: {
          notChangeTheme: true,
        },
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('_v/Register/RegisterInfo'),
        meta: {
          notChangeTheme: true,
        },
      },
    ],
  },
  // 忘记密码
  {
    path: '/forgotpswd',
    redirect: '/forgotpswd/verifyway',
    component: () => import('_v/Login/components/RegisterForgot'),
    name: 'forgotpswd',
    meta: {
      title: 'login.resetLoginPassword',
    },
    children: [
      {
        path: 'verifyway',
        name: 'verifyway',
        component: () => import('_v/ForgotPswd/VerifyWay'),
        meta: {
          notChangeTheme: true,
        },
      },
      {
        path: 'getverify',
        name: 'getverify',
        component: () => import('_v/ForgotPswd/GetVerify'),
        meta: {
          notChangeTheme: true,
        },
      },
      {
        path: 'resetpswd',
        name: 'resetpswd',
        component: () => import('_v/ForgotPswd/ResetPswd'),
        meta: {
          notChangeTheme: true,
        },
      },
      {
        path: 'successtip',
        name: 'successtip',
        component: () => import('_v/ForgotPswd/SuccessTip'),
        meta: {
          notChangeTheme: true,
        },
      },
    ],
  },
  // 帮助中心
  {
    path: '/helpCenterShow',
    name: 'helpCenterShow',
    component: () => import('_v/HelpCenter/Show'),
    meta: {
      title: '帮助中心',
    },
  },
  // 主页面
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: (resolve) => require(['_v/Layout'], resolve),
    children: [
      ...AppConfig,
      ...GlobalConfig,
      {
        path: '/home',
        name: 'home',
        component: () => import('_v/Home'),
        beforeEnter: async (to, from, next) => {
          // const { homeArr } = store.state.base;
          // console.log(homeArr, 'sssss');
          // if (homeArr.length) {
          //   const current = homeArr[0];
          //   next({
          //     path: `/homePage/${current.homePageId}`,
          //   });
          // } else {
          //   next();
          // }
          next();
        },
        meta: {
          childrenPage: true,
        },
      },
      {
        path: '/role',
        name: 'role',
        component: (resolve) => require(['_v/Role'], resolve),
        meta: {
          title: '角色管理',
          childrenPage: true,
        },
      },
      {
        path: '/flow',
        name: 'flow',
        component: (resolve) => require(['_v/Flow'], resolve),
        meta: {
          title: '流程管理',
          childrenPage: true,
        },
      },
      {
        path: '/knowledge',
        name: 'knowledge',
        component: (resolve) => require(['_v/Knowledge'], resolve),
        meta: {
          title: '知识库',
          childrenPage: true,
        },
        parentName: 'layout',
      },
      // 主页配置
      {
        path: '/homePage/:id',
        name: 'homePage',
        component: () => import('_v/HomeMenu'),
        meta: {
          isModulePage: true,
          childrenPage: false,
        },
        parentName: 'layout',
      },
      {
        path: '/user',
        name: 'user',
        component: (resolve) => require(['_v/Users'], resolve),
        meta: {
          title: '用户管理',
          childrenPage: true,
        },
      },
      {
        path: '/iconManage',
        name: 'iconManage',
        component: (resolve) => require(['_v/IconManage'], resolve),
        meta: {
          title: '图标管理',
          childrenPage: true,
        },
      },
      {
        path: 'entityManage',
        name: 'entityManage',
        component: () => import('_v/EntityManage'),
        meta: {
          title: '实体管理',
          childrenPage: true,
        },
      },
      {
        path: 'orgManage',
        name: 'orgManage',
        component: () => import('_v/orgManage'),
        meta: {
          title: '组织管理',
          childrenPage: true,
        },
      },
      {
        path: 'tenant',
        name: 'tenant',
        component: () => import('_v/Tenant'),
        meta: {
          title: '租户管理',
          childrenPage: true,
        },
      },
      // 通用导入
      {
        path: 'generalImport',
        name: 'generalImport',
        component: () => import('_v/GeneralImport'),
        meta: {
          parentPath: 'HomePageConfig',
        },
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('_v/Dictionary'),
        meta: {
          title: '字典管理',
          childrenPage: true,
        },
      },
      {
        path: 'messageTemplate',
        name: 'messageTemplate',
        component: () => import('_v/MessageTemplate'),
        meta: {
          title: '消息模板',
          childrenPage: true,
        },
      },
      {
        path: 'menuManage',
        name: 'menuManage',
        component: () => import('_v/MenuManage'),
        meta: {
          title: '菜单管理',
          childrenPage: true,
        },
      },
      {
        path: 'postManage',
        name: 'postManage',
        component: () => import('_v/postManage'),
        meta: {
          title: '职位管理',
          childrenPage: true,
        },
      },
      {
        path: 'systemLog',
        name: 'systemLog',
        component: () => import('_v/SystemLog'),
        meta: {
          title: '系统日志',
          childrenPage: true,
        },
      },
      {
        path: 'expression',
        name: 'expression',
        component: () => import('_v/Expression'),
        meta: {
          title: '表达式',
          childrenPage: true,
        },
      },
      {
        path: 'menu/:id',
        name: 'ApiotMenu',
        component: () => import('_v/ApiotMenu'),
        meta: {
          isModulePage: true,
          title: '测试',
          childrenPage: true,
        },
      },
      {
        path: 'helpCenterConfig',
        name: 'helpCenterConfig',
        component: () => import('_v/HelpCenter/Config'),
        meta: {
          title: '帮助中心',
          childrenPage: true,
        },
      },
      {
        path: 'importTemplate',
        name: 'importTemplate',
        component: () => import('_v/ImportTemplate'),
        meta: {
          title: '导入模板配置',
          childrenPage: true,
        },
      },
      {
        path: 'timedTask',
        name: 'timedTask',
        component: () => import('_v/TimedTask'),
        meta: {
          title: '定时任务',
          childrenPage: true,
        },
      },
      // 主页配置
      {
        path: '/HomePageConfig',
        name: 'HomePageConfig',
        component: () => import('_v/HomePageConfig'),
        meta: {
          title: '主页配置',
          childrenPage: true,
        },
      },
      // ureport 集成
      {
        path: 'ureport',
        name: 'ureport',
        component: () => import('_v/UReport'),
        meta: {
          title: 'UReport',
          childrenPage: true,
        },
      },
    ],
  },
  // 菜单角色
  {
    path: '/menuRole/:id',
    name: 'menuRole',
    component: () => import('_v/MenuManage/MenuRole'),
    meta: {
      parentPath: 'menuManage',
    },
  },
  // 菜单配置
  {
    path: '/menuConfig/:id',
    name: 'menuConfig',
    component: () => import('_v/MenuManage/MenuConfig'),
    meta: {
      parentPath: 'menuManage',
    },
  },
  // 主页配置
  {
    path: '/homeMenuConfig/:id',
    name: 'homeMenuConfig',
    component: (resolve) => require(['_v/HomeMenuConfig'], resolve),
    meta: {
      parentPath: 'HomePageConfig',
    },
  },
  // 打印模板
  {
    path: '/printTemplate/:id',
    name: 'printTemplate',
    component: () => import('_v/PrintTemplate'),
    meta: {
      parentPath: 'menuManage',
    },
  },
  {
    path: '/example',
    name: 'example',
    component: () => import('_v/Example'),
  },
  // 401页面
  // {
  //   path: '/401',
  //   name: '401',
  //   component: () => import('_v/ErrorPage/401'),
  // },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('_v/Demo'),
  },
  {
    path: '/demo1',
    name: 'demo1',
    component: () => import('_v/Demo1'),
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
