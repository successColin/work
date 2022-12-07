import '@/components/index';
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routes from './router/index.js';
import ElementUI from 'element-ui';
import BaiduMap from 'vue-baidu-map'
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store';
import {message} from './utils/message.js';
import '@/assets/css/index.scss';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(BaiduMap,  {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'nuWah68S1WieW2AEwiT8T3Ro'
})
Vue.prototype.$message = message;
Vue.config.productionTip = false;

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const routerConfig = new VueRouter(routes);

const vue = new Vue({
  router: routerConfig,
  render: h => h(App),
  store
}).$mount('#app')
window.vue = vue;

