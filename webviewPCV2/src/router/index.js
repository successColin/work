import Vue from 'vue';
import VueRouter from 'vue-router';
import { baseUrl, themeColor } from '../config';
import { changeThemeColor, initThemeColor } from '../utils/themeColorClient';
import routes from './Routes';
// import { parseQuery, stringifyQuery } from './routerUtils/query';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  base: baseUrl,
  // stringifyQuery, // 序列化query参数
  // parseQuery, // 反序列化query参数
  mode: 'history',
});

router.beforeEach(async (to, from, next) => {
  // 登录注册等页面，主题色不变
  if (to.meta.notChangeTheme) {
    changeThemeColor(themeColor, false);
  } else {
    initThemeColor();
  }
  next();
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
