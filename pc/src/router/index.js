import Vue from 'vue';
import VueRouter from 'vue-router';
import { baseUrl, themeColor, whitePathName } from '../config';
import store from '../store';
import { changeThemeColor, initThemeColor } from '../utils/themeColorClient';
import routes from './Routes';
import { stringifyQuery, parseQuery } from './routerUtils/query';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  base: baseUrl,
  stringifyQuery, // 序列化query参数
  parseQuery, // 反序列化query参数
  mode: 'history',
});

router.beforeEach(async (to, from, next) => {
  // 登录注册等页面，主题色不变
  if (to.meta.notChangeTheme) {
    changeThemeColor(themeColor, false);
  } else {
    initThemeColor();
  }
  const pathName = to.meta.parentPath ? to.meta.parentPath : to.name;
  // 不在白名单跟权限页面的地址去404
  if (
    store.state.base.allRouteName.includes(pathName) ||
    whitePathName.includes(pathName)
  ) {
    // const toName = to.name;
    // if (toName === 'home') {
    //   await store.dispatch('getHomeRoute');
    //   const { homeArr } = store.state.base;
    //   if (homeArr.length) {
    //     const current = homeArr[0];
    //     next({
    //       path: `/homeMenu/${current.homePageId}`,
    //     });
    //   } else {
    //     next();
    //   }
    //   // if (index !== -1) {
    //   //   // next({
    //   //   //   path: to.path
    //   //   // });
    //   // } else if (homeArr.length) {
    //   //   const current = homeArr[0];
    //   //   next({
    //   //     path: `/homeMenu/${current.homePageId}`,
    //   //   });
    //   // } else {
    //   //   next();
    //   // }
    // } else {
    //   next();
    // }
    // console.log(pathName, 'route');
    next();
  } else {
    next('/404');
  }
});

// 解决报错
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => err);
};

export default router;
