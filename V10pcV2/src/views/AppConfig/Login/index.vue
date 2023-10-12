<template>
  <div class="appBox">
    <div class="appBox__left"></div>
    <div class="appBox__center">
      <div class="appBox__phone">
        <div class="appBox__phone--wrapper">
          <div
            class="app__header"
            :style="`background-image: url(${
              $parseImgUrl(loginConfig.backgroundUrl) ||
              require('./images/bg.jpg')
            })`"
          >
            <span class="app__header--lang" v-show="loginConfig.enableLanguage"
              >中文</span
            >
            <img
              :src="
                loginConfig.logoUrl
                  ? $parseImgUrl(loginConfig.logoUrl)
                  : require('./images/logo.png')
              "
              alt=""
              class="app__header--logo"
            />
            <p class="app__header--title">Hi，欢迎登录APIoT！</p>
          </div>
          <div class="app__content">
            <img src="./images/account.png" alt="" />
            <p
              class="app__content--forgetPs"
              :class="[{ notShow: !loginConfig.enableForgetPassword }]"
            >
              忘记密码？
            </p>
            <div class="app__content--sure">登录</div>
            <div
              class="app__content--agreement"
              v-show="loginConfig.servicePrivacyUrl"
            >
              <el-checkbox disabled></el-checkbox>
              <span class="m-l-2">我已阅读并同意</span
              ><span class="addBlack">《服务隐私协议》</span>
            </div>
          </div>
          <div
            class="app__footer"
            v-show="
              loginConfig.enableWechatLogin ||
              loginConfig.enableDingLogin ||
              loginConfig.enableRegister
            "
          >
            <p class="app__footer--title">其他登录方式</p>
            <div class="app__footer--imgList">
              <img
                src="./images/wx.svg"
                class="img"
                v-show="loginConfig.enableWechatLogin"
              />
              <img
                src="./images/dd.svg"
                class="img"
                v-show="loginConfig.enableDingLogin"
              />
              <img
                src="./images/phone.svg"
                class="img"
                v-show="loginConfig.enableRegister"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="appBox__right">
      <LoginConfig :loginConfig="loginConfig" ref="loginConfig"></LoginConfig>
    </div>
  </div>
</template>

<script>
import LoginConfig from '../components/Config/LoginConfig';

export default {
  data() {
    return {
      loginConfig: {
        backgroundUrl: '',
        logoUrl: '',
        servicePrivacyUrl: '',
        enableRegister: 0,
        enableWechatLogin: 0,
        enableDingLogin: 0,
        enableForgetPassword: 0,
        enableDefaultLogin: 0,
        enableLanguage: 0,
        defaultPage: 0
      }
    };
  },

  components: {
    LoginConfig
  },

  computed: {},

  mounted() {},

  methods: {},

  async beforeRouteLeave(to, from, next) {
    try {
      await this.$refs.loginConfig.saveLogin(false);
      next();
    } catch (error) {
      await this.$confirm('当前页面配置自动保存失败，是否离开', {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      next();
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../app.scss';
.app {
  &__header {
    position: relative;
    height: 210px;
    background: url(./images/bg.jpg) no-repeat center;
    background-size: 100% 210px;
    border-radius: 0px 0px 15px 15px;
    padding-left: 44px;
    padding-top: 70px;
    box-sizing: border-box;
    &--lang {
      position: absolute;
      right: 16px;
      top: 32px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    &--logo {
      width: 84px;
      height: 24px;
    }
    &--title {
      margin-top: 6px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  &__content {
    position: relative;
    margin: -36px 15px 0;
    height: 300px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.18);
    border-radius: 12px;
    box-sizing: border-box;
    padding: 48px 30px 0;
    img {
      width: 100%;
    }
    &--forgetPs {
      text-align: right;
      margin-top: 6px;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      &.notShow {
        color: #fff;
      }
    }
    &--sure {
      background: #4689f5;
      border-radius: 25px;
      height: 44px;
      line-height: 44px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      margin-top: 20px;
    }
    &--agreement {
      margin-top: 10px;
      text-align: center;
      font-size: 12px;
      color: #aaaaaa;
      .addBlack {
        color: #333333;
      }
    }
  }
  &__footer {
    position: absolute;
    bottom: 0;
    left: 34px;
    right: 34px;
    height: 85px;
    border-top: 1px solid #e9e9e9;
    &--title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -7px;
      line-height: 14px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
      background-color: #fff;
      padding: 0 6px;
    }
    &--imgList {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .img {
        width: 30px;
        margin-right: 14px;
      }
    }
  }
}
</style>
