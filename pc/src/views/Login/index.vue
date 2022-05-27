<!--
 * @Descripttion: 登录总功能模块
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:22:21
-->
<template>
  <apiot-content :sideWidth="420" class="loginModule">
    <!-- 左侧轮播图 -->
    <template v-slot:sidebar>
      <div class="banner">
        <my-carousel :configs="configs"></my-carousel>
      </div>
    </template>
    <!-- 右侧登录页面 -->
    <template>
      <section class="content">
        <!-- 多语言 -->
        <header class="content__lang">
          <my-lang></my-lang>
        </header>
        <!-- 登录内容：账号密码 -->
        <div class="content__loginIn">
          <div class="vessel">
            <!-- 扫码登录 -->
            <div class="vessel__title">
              <div class="vessel__title--name">{{ $t('login.login') }}</div>
              <scan-login
                v-if="configs.enableAppLogin === '1'"
                class="vessel__title--scan_login"
                :showState="isShowLoginForm"
                @click="handleSwitchLogin"
                :configs="configs"
              ></scan-login>
            </div>
            <!-- info -->
            <div class="vessel__info">{{ $t('login.welcomeToAPIoT') }}</div>
            <!-- 账号密码form 和 扫码登录 -->
            <login-form
              class="vessel__loginForm"
              v-if="isShowLoginForm"
              :configs="configs"
            ></login-form>
            <login-scan v-else></login-scan>
          </div>
          <!--          <div @click="wxlogin">微信登录</div>-->
        </div>
        <!-- 浙江公安备案 -->
        <footer class="content__reference">
          <a href="http://beian.miit.gov.cn" target="_black">{{
            configs.record
          }}</a>
        </footer>
      </section>
    </template>
  </apiot-content>
</template>

<script>
// 组件
import { getLoginConfig } from '@/api/login';
import ScanLogin from './components/ScanLogin';
import MyLang from './components/MyLang';
import LoginForm from './components/LoginForm';
import MyCarousel from './components/MyCarousel';
import LoginScan from './components/LoginScan';

export default {
  data() {
    return {
      configs: {},
      // 是否显示表单：true：是；false：显示扫码
      isShowLoginForm: true
    };
  },
  components: {
    ScanLogin, // 扫码
    MyLang, // 多语言切换
    LoginForm, // 登录表单
    LoginScan, // 扫码登录
    MyCarousel // 轮播图
  },
  beforeMount() {
    this.fetchConfig();
  },
  mounted() {
    // const token = localStorage.getItem('token');
    // // console.log(token !== null);
    // if (token !== null && token !== 'undefined' && token !== '') this.$router.push('/');
    sessionStorage.removeItem('login__forgotpswd');
    sessionStorage.removeItem('login__register');
    // 如果切换用户时，得清除最近访问菜单
    sessionStorage.removeItem('recentlyTabArr');
    // sessionStorage.clear();
  },
  methods: {
    wxlogin() {
      window.open(
        'https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=wwbfb0ecbcefc3a8d4&redirect_uri=http://47.118.76.70/demo&usertype=member',
        '_blank'
      );
    },
    async fetchConfig() {
      const res = (await getLoginConfig()) || [];
      // console.log(res);
      const obj = {};
      res.forEach((item) => {
        const { attributeKey, attributeValue } = item;
        obj[attributeKey] = attributeValue;
        this.configs = obj;
      });
    },
    // form 和 扫码切换
    handleSwitchLogin() {
      this.isShowLoginForm = !this.isShowLoginForm;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
