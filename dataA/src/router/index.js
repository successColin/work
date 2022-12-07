/**
 * 路由配置
 * @type {{mode: string, routes: [{path: string, component: function(): *}]}}
 */
const {baseUrl} = require('@/constants/config');

export default {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login/index')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('@/pages/Configuration/index')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home/index')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/pages/Preview/index')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/Test/index')
    },
    {
      path: '/menu/:id',
      name: 'menu',
      component: () => import('@/pages/Menu/index')
    },
    {
      path: '/expired',
      name: 'expired',
      component: () => import('@/pages/ExpiredPage/index')
    }
  ],
  base: process.env.NODE_ENV === 'production' ? baseUrl : '/',
  mode: 'history'
};
