<!--
 * @Descripttion: 卡片式轮播风格
 * @Author: ytx
 * @Date: 2022-06-06 14:22:07
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-06 14:22:07
-->
<template>
  <div
    class="cardLogin"
    :style="{
      background: `url(${imgUrl}) no-repeat center`,
      backgroundSize: '100% 100%',
    }"
  >
    <!-- 多语言 -->
    <header class="cardLogin__lang">
      <my-lang></my-lang>
    </header>
    <!-- 登录方式 -->
    <section :style="{ width: boxWidth, height: styleHeight }">
      <!-- 轮播 -->
      <my-carousel
        :configs="configs"
        :height="styleHeight"
        width="20vw"
        :minWidth="carouselWidth"
        :type="type"
      ></my-carousel>
      <!-- 登录内容：账号密码 -->
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
    </section>
    <!-- 浙江公安备案 -->
    <footer>
      <a href="http://beian.miit.gov.cn" target="_black">{{
        configs.record
      }}</a>
    </footer>
  </div>
</template>

<script>
import MyLang from './components/MyLang';
import MyCarousel from './components/MyCarousel';
import ScanLogin from './components/ScanLogin';
import LoginForm from './components/LoginForm';
import indexMixin from './indexMixin';
import LoginScan from './components/LoginScan';

export default {
  mixins: [indexMixin],
  props: {
    styleWidthObj: {
      type: Object,
      default: () => {}
    },
    configs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: {
    MyLang,
    MyCarousel,
    ScanLogin,
    LoginForm,
    LoginScan
  },
  computed: {
    boxWidth() {
      return this.styleWidthObj.label;
    },
    carouselWidth() {
      if (this.styleWidthObj.value === 1) {
        return '420px';
      }
      if (this.styleWidthObj.value === 2) {
        return '380px';
      }
      if (this.styleWidthObj.value === 3) {
        return '300px';
      }
      return '';
    },
    styleHeight() {
      // if (this.styleWidthObj.value === 1) {
      //   return 'calc(100vh - 20rem)';
      // }
      // if (this.styleWidthObj.value === 2) {
      //   return 'calc(100vh - 22rem)';
      // }
      // if (this.styleWidthObj.value === 3) {
      //   return 'calc(100vh - 24rem)';
      // }
      return 'calc(100vh - 20rem)';
    },
    imgUrl() {
      const img = this.configs.backgroundImage;
      return img.substr(0, img.length - 1);
    },
    type() {
      return this.styleWidthObj && this.styleWidthObj.value;
    }
  }
};
</script>
<style lang='scss' scoped>
.cardLogin {
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: PingFangSC-Regular, PingFang SC;
  display: flex;
  justify-content: center;
  align-items: center;
  &__lang {
    position: absolute;
    top: $remto45px;
    right: $remto50px;
    ::v-deep {
      .myLang {
        margin-top: 0;
      }
    }
  }
  section {
    background: #ffffff;
    box-shadow: 0px 4px 20px 0px rgba(163, 176, 197, 0.3);
    display: flex;
  }
  footer {
    position: absolute;
    bottom: $remto40px;
    width: 100%;
    text-align: center;
    font-size: $remto12px;
    a {
      height: 100%;
      display: flex;
      flex-direction: column-reverse;
      color: #6b798d;
      text-decoration: none;
    }
  }
}
// 容器
.vessel {
  min-width: $remto330px;
  min-height: $remto450px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  // 标题
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $remto32px;
    // 登录名称
    &--name {
      font-size: $remto24px;
      color: #111111;
    }
    // 扫码登录图片
    &--scan_login {
      float: right;
      cursor: pointer;
    }
  }
  // 欢迎登录APIoT平台！
  &__info {
    margin-top: $remto6px;
    text-align: left;
    font-size: $remto13px;
    color: #6b798d;
  }
}
</style>
