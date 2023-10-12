<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 17:45:20
 * @Des: 主入口
-->
<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
// import store from '@/store';

export default {
  data() {
    return {};
  },
  created() {
    this.getSystemLanguage();
    sessionStorage.pathArr = '';
  },
  computed: {},
  methods: {
    // 先获取localStorage语言，如果没有在获取系统语言
    getSystemLanguage() {
      const lang = localStorage.getItem('apiotLanguage');
      if (!lang) {
        let currentLang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
        currentLang = currentLang.replace(/-/, ''); // 截取lang前2位字符
        localStorage.setItem('apiotLanguage', currentLang);
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  //min-width: 1024px;
  overflow-x: auto;
  overflow-y: auto;
}
</style>
