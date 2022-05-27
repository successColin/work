/*
 * @Description:多语言封装
 * @Author: sss
 * @Date: 2021-03-17 08:50:56
 * @LastEditTime: 2021-04-20 16:38:31
 * @LastEditors: ytx
 * @Reference:
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCN from './language/cn';
import enUS from './language/en';

Vue.use(VueI18n);
export default new VueI18n({
  // 默认中文
  locale: localStorage.getItem('apiotLanguage'),
  fallbackLocale: 'zhCN',
  silentFallbackWarn: true,
  messages: {
    zhCN,
    enUS,
  },
});
