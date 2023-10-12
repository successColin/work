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
      background: `url(${$parseImgUrl(imgUrl)}) no-repeat center`,
      backgroundSize: '100% 100%',
    }"
  >
    <!-- 多语言 -->
    <header class="cardLogin__lang" v-if="+configs.enableMultilingual === 1">
      <my-lang></my-lang>
    </header>
    <!-- 登录方式 -->
    <!-- w: 860px; h: 520px -->
    <section
      :style="{ width: '860px', height: styleHeight, transform: scaleValue }"
    >
      <!-- 轮播 -->
      <my-carousel
        :configs="configs"
        :height="styleHeight"
        :type="type"
      ></my-carousel>
      <!-- 登录内容：账号密码 -->
      <div class="vessel">
        <!-- 扫码登录 -->
        <div class="vessel__title">
          <div class="vessel__title--name">
            {{ configs.welcomeTitle || 'Login' }}
          </div>
          <scan-login
            v-if="+configs.scanType !== 1"
            class="vessel__title--scan_login"
            :showState="isShowLoginForm"
            @click="handleSwitchLogin"
            :configs="configs"
          ></scan-login>
        </div>
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
    </section>
    <!-- 浙江公安备案 -->
    <footer>
      <!-- <a href="http://beian.miit.gov.cn" target="_black">{{
        configs.record
      }}</a> -->
      {{ configs.record }}
    </footer>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm';
import LoginScan from './components/LoginScan';
import MyCarousel from './components/MyCarousel';
import MyLang from './components/MyLang';
import ScanLogin from './components/ScanLogin';
import indexMixin from './indexMixin';

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
    scaleValue() {
      if (this.styleWidthObj.value === 1) {
        return 'scale(1.15)';
      }
      if (this.styleWidthObj.value === 2) {
        return 'scale(1)';
      }
      if (this.styleWidthObj.value === 3) {
        return 'scale(0.85)';
      }
      return 'scale(1)';
    },
    styleHeight() {
      return '520px';
    },
    imgUrl() {
      const img = this.configs.backgroundImage;
      return (img && img.substr(0, img.length - 1)) || require('@/assets/img/loginBg.png');
    },
    type() {
      return this.styleWidthObj && this.styleWidthObj.value;
    }
  }
};
</script>
<style lang="scss" scoped>
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
    top: 45px;
    right: 50px;
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
    bottom: 40px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    a {
      color: #6b798d;
      text-decoration: none;
    }
  }
}
// 容器
.vessel {
  min-width: 330px;
  min-height: 450px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  user-select: none;
  // 标题
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 33px;
    // 登录名称
    &--name {
      font-size: 24px;
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
    margin-top: 6px;
    text-align: left;
    font-size: 13px;
    color: #6b798d;
  }
}
</style>
