// 全局指令注册
import '@/directive';
// 全局组件注册
import '@/globalComponents/index';
// 全局方法注册
import '@/utils/globalFunc';
import ElementUI, { Message } from 'element-ui';
import ElementLocale from 'element-ui/lib/locale';
import Vue from 'vue';
import waterfall from 'vue-waterfall2';
// import BaiduMap from 'vue-baidu-map';
import HistoryKeepAlive from 'history-keep-alive';
import App from './App.vue';
import './assets/css/elementTheme.scss';
import './assets/iconfont/iconfont.css';
import i18n from './i18n';
import router from './router';
import store from './store';

Vue.use(HistoryKeepAlive, {
  router,
  useTimestamp: false,
  defaultTransitionName: 'slide-left1',
});
Vue.use(waterfall);
Vue.config.productionTip = false;
Vue.use(ElementUI);

// 只出现一个提示，同一时间
let messageInstance = null;

const resetMessage = (options) => {
  if (messageInstance && messageInstance.type !== 'error') {
    messageInstance.close();
  }
  messageInstance = Message({
    duration: 1500,
    showClose: true,
    offset: 50,
    ...options,
  });
  return messageInstance;
};

['error', 'success', 'info', 'warning'].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        duration: 1500,
        showClose: true,
        message: options,
      };
    }
    options.type = type;
    return resetMessage(options);
  };
});

// Array 上挂载方法
if (!Array.prototype.at) {
  // eslint-disable-next-line
  Array.prototype.at = function (int) {
    if (int && typeof int === 'number') {
      const len = this.length;
      return this[len + int];
    }
    return this;
  };
}

Vue.prototype.$message = resetMessage;
// 生产环境去除vue 警告
if (process.env.NODE_ENV !== 'development') {
  Vue.config.silent = true;
}
const vue = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
window.vue = vue;
ElementLocale.i18n((key, value) => i18n.t(key, value));
