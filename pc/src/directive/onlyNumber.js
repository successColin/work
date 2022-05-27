/*
 * @Author: cmk
 * @Date: 2021-04-19 10:53:52
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-21 10:03:47
 * @Des: 禁止特殊字符
 */
import Vue from 'vue';

Vue.directive('onlyNumber', {
  inserted(el, binding) {
    // binding.value 1 是整数 2是小数
    const targetEl = el.getElementsByTagName('input')[0];
    function special(e) {
      // 190 48-57 96-105
      const numberArr = [
        8,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
      ];
      if (binding.value === 2 && targetEl.value.indexOf('.') === -1) {
        numberArr.push(190);
      }
      if (!numberArr.includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    }

    el.__special__ = special;
    if (targetEl) targetEl.addEventListener('keydown', special);
  },
  unbind(el) {
    const targetEl = el.getElementsByTagName('input')[0];
    if (targetEl) targetEl.removeEventListener('keydown', el.__special__);
    delete el.__special__;
  },
});
