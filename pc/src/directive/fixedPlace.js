/*
 * @Author: cmk
 * @Date: 2021-04-19 10:53:52
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-21 10:03:47
 * @Des: 禁止特殊字符
 */
import Vue from 'vue';

Vue.directive('fixedPlace', {
  inserted(el, binding) {
    // binding.value 1 是整数 2是小数
    const targetEl = el.getElementsByTagName('input')[0];
    function special() {
      // console.log(binding);
      if (binding.value) {
        // console.log(binding.value);
        targetEl.value = +(targetEl.value * 1).toFixed(binding.value);
        targetEl.dispatchEvent(new Event('input'));
      }
    }

    el.__special__ = special;
    if (targetEl) targetEl.addEventListener('blur', special);
  },
  unbind(el) {
    const targetEl = el.getElementsByTagName('input')[0];
    if (targetEl) targetEl.removeEventListener('blur', el.__special__);
    delete el.__special__;
  },
});
