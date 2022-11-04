/*
 * @Description:多语言封装
 * @Author: sss
 * @Date: 2021-03-17 08:50:56
 * @LastEditTime: 2021-04-20 16:38:31
 * @LastEditors: sss
 * @Reference:
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
// eslint-disable-next-line import/no-named-default
import { default as zhCN, default as zhTW } from './language/cn';
import enUS from './language/en';

Vue.use(VueI18n);

let lang = uni.getStorageSync('apiotLanguage');
if (!lang) {
  lang = uni.getLocale();
  switch (lang) {
    case 'zh-Hans':
      lang = 'zhCN';
      break;
    case 'zh-Hant':
      lang = 'zhTW';
      break;
    default:
      lang = 'enUS';
      break;
  }
  uni.setStorageSync('apiotLanguage', lang);
}
export default new VueI18n({
  // 默认中文
  locale: lang,
  fallbackLocale: 'zhCN',
  silentFallbackWarn: true,
  messages: {
    zhCN,
    enUS,
    zhTW,
  },
});
