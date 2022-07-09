<!--
 * @Descripttion: 平铺式轮播风格
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
        <my-carousel
          :configs="configs"
          minWidth="420px"
          width="25vw"
          height="100vh"
        ></my-carousel>
      </div>
    </template>
    <!-- 右侧登录页面 -->
    <template>
      <section class="content">
        <!-- 多语言 -->
        <header class="content__lang" v-if="+configs.enableMultilingual === 1">
          <my-lang></my-lang>
        </header>
        <!-- 登录内容：账号密码 -->
        <div class="content__loginIn">
          <div class="vessel">
            <!-- 扫码登录 -->
            <div class="vessel__title">
              <div class="vessel__title--name">{{ $t('login.login') }}</div>
              <scan-login
                v-if="+configs.scanType !== 1"
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
            <!-- 微信扫码 / 浙政钉扫码 -->
            <!-- 1=无 2=APP扫码 3=浙政钉扫码 -->
            <login-scan
              v-else
              :scanType="+configs.scanType"
              :configs="configs"
            ></login-scan>
          </div>
          <!-- <div @click="wxlogin">微信登录</div>-->
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
import ScanLogin from './components/ScanLogin';
import MyLang from './components/MyLang';
import LoginForm from './components/LoginForm';
import MyCarousel from './components/MyCarousel';
import LoginScan from './components/LoginScan';
import indexMixin from './indexMixin';

export default {
  mixins: [indexMixin],
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ScanLogin, // 扫码
    MyLang, // 多语言切换
    LoginForm, // 登录表单
    LoginScan, // 扫码登录
    MyCarousel // 轮播图
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
