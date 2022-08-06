import Vue from 'vue';
import Store from '../store';
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
Vue.prototype.$parseImgUrl = function (url) {
  if (typeof url !== 'string' || url === '') {
    return null;
  }
  const urlExp = /^(http:|https:|file:)(?:\/\/)([^/]*)([^?#]*)([^#]*)(.*)$/gi;
  let pathname = '';
  url.replace(urlExp, (...rest) => {
    [, , , pathname] = rest;
  });
  const arr = pathname.split('/');
  return `${Store.state.globalConfig.fileConfig.minioUrl}${arr
    .slice(2)
    .join('/')}`;
};

Vue.prototype.$bus = bus;
