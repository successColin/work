import Vue from 'vue';
import { Decrypt } from '@/utils/utils';
import bus from './bus';

Vue.prototype.$dispatch = function (eventName, data) {
  let { $parent } = this;
  while ($parent) {
    $parent.$emit(eventName, data);
    $parent = $parent.$parent;
  }
};

Vue.prototype.$broadcast = function (eventName, data) {
  function broadcast() {
    this.$children.forEach((child) => {
      if (child[eventName]) {
        child[eventName](data);
      }
      // child.$emit(eventName, data);
      if (child.$children) {
        broadcast.call(child);
      }
    });
  }
  broadcast.call(this);
};
// 替换图片地址
Vue.prototype.$parseImgUrl = function (url, otherToken) {
  if (url) {
    if (url.startsWith('blob:')) {
      return url;
    }
    if (url.indexOf('?') !== -1) {
      return `${url}&token=${otherToken || Decrypt(localStorage.token)}`;
    }
    return `${url}?token=${otherToken || Decrypt(localStorage.token)}`;
  }
  return '';
};

Vue.prototype.$bus = bus;
