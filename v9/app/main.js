import graceChecker from '@/common/graceChecker/graceChecker.js';
import http from '@/common/utils/request/index.js';
import mBackBar from '@/components/bar/m-backbar.vue';
import mButton from '@/components/element/m-button.vue';
import mLoading from '@/components/loading/loading.vue';
import mLodingSvg from '@/components/loading/loadingSVG.vue';
// import animated from 'animate.css'
// Vue.use(animated)
//全局组件
import mFontIcon from '@/components/m-icon/m-fonticon.vue';
import mNormalIcon from '@/components/m-icon/m-normalIcon.vue';
import mPop from '@/components/m-pop/mPop.vue';
//全局过滤器
import dateFormat from '@/static/js/dateFormat.js';
//加密
import EncryptionPSW from '@/static/js/encryptionPSW.js';
//全局方法
import Static_GlobalFucs from '@/static/js/GlobalFunctions.js';
// h5浙政钉
import mixins from '@/utils/mixin.js';
import uView from 'uview-ui';
import Vue from 'vue';
import App from './App';
import i18n from './i18n';
import store from './store';
Vue.use(uView);
Vue.config.productionTip = false;

Vue.component('mFontIcon', mFontIcon);
Vue.component('mNormalIcon', mNormalIcon);
Vue.component('mButton', mButton);
Vue.component('mBackBar', mBackBar);
Vue.component('mLoading', mLoading);
Vue.component('mLodingSvg', mLodingSvg);
Vue.component('mPop', mPop);

Vue.mixin(mixins);

Vue.prototype.graceChecker = graceChecker;

Vue.prototype.$http = http;
Vue.prototype._i18n = i18n;

Vue.prototype.pxToREM = function (p) {
  //将px转化成rem
  return p + 'rpx';
};

Vue.prototype.Static_GlobalFucs = new Static_GlobalFucs();
// 在Vue的原型链上注册方法，控制组件
Vue.prototype.$Toast = {
  showLoading() {
    // 显示加载框
    store.commit('Toast/SET_TOAST_LOADING', true);
  },
  hideLoading() {
    // 隐藏方法
    store.commit('Toast/SET_TOAST_LOADING', false);
  },
};
Vue.prototype.$dateFormat = dateFormat;
Vue.filter('dateFormat', function (time) {
  if (!time) time = '';
  if (typeof time === 'number') {
    if (time.length < 13) {
      time = time * 1000;
    }
  } else {
    time = time.replace(/-/g, '/');
  }
  return time ? dateFormat.formatDate(time, 'yyyy-MM-dd') : '';
});
Vue.prototype.$EncryptionPSW = EncryptionPSW;

Vue.prototype.$store = store;
App.mpType = 'app';

const app = new Vue({
  i18n,
  store,
  ...App,
});
app.$mount();
