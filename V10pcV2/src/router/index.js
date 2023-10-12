import Vue from 'vue';
import VueRouter from 'vue-router';
import { baseUrl, themeColor, whitePathName, normalPage } from '../config';
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
  // console.log(to);
  // 登录注册等页面，主题色不变
  if (to.meta.notChangeTheme) {
    changeThemeColor(themeColor, false);
  } else {
    initThemeColor();
  }
  const pathName = to.meta.parentPath ? to.meta.parentPath : to.name;
  // console.log(
  //   whitePathName,
  //   store.state.base.allRouteName,
  //   pathName,
  //   to.name,
  //   to,
  // );
  // 不在白名单跟权限页面的地址去404
  if (
    store.state.base.allRouteName.includes(pathName) ||
    whitePathName.includes(pathName)
  ) {
    // console.log(to);
    if (
      to.name !== 'login' &&
      !normalPage.includes(to.name) &&
      !localStorage.token
    ) {
      next('/login');
    } else {
      next();
    }
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
