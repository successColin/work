<!--
 * @Author: sss
 * @Date: 2021-08-30 15:24:31
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-30 15:24:31
 * @Desc: 登录界面
-->
<template>
  <view class="login" :class="{ tradition: globalLogin.style === '1' }">
    <view class="login_bg">
      <u-image
        :src="loginBgImg || '../static/img/login_images/bg.svg'"
        :lazyLoad="false"
        :fade="false"
        height="480rpx"
        loading-icon="false"
        width="100%"
      ></u-image>
    </view>
    <section class="login_content">
      <!-- #ifndef MP-ALIPAY -->
      <div class="status__bar1" :style="{ height: statusHeight }"></div>
      <!-- #endif -->
      <header class="login_header">
        <div class="login_header--opration">
          <div class="left">
            <picker
              v-if="platformConfig.enableMultilingual"
              @change="changeLang"
              :value="curLangIndex"
              range-key="name"
              :range="langData"
            >
              <view class="command">
                <i class="appIcon appIcon-yuyan m-r-6"></i>
                {{ langData[curLangIndex].name }}
              </view>
            </picker>
          </div>
          <div class="right">
            <apiot-button-font
              v-if="platformConfig.H5_SCAN"
              iconName="saoma"
              @click="gotoScan"
            ></apiot-button-font>
          </div>
        </div>
        <div class="login_header--icon">
          <image
            :src="loginImg || '../static/img/login_images/logo.svg'"
            class="login_header--logo"
            mode="heightFix"
            @click="showServers"
            :style="{ height: loginLogoWidth }"
          ></image>
          <!-- <img :src="loginImg" class="login_header--logo"> -->
          <span class="login_header--title">{{
            $t('login.welcomeMsg', {
              name: globalLogin.welcomeTitle || welcomeName,
            })
          }}</span>
        </div>
      </header>
      <view class="login_substance">
        <div class="login_substance--account">
          <mode-account></mode-account>
        </div>
      </view>
      <footer
        class="login_footer"
        v-if="globalLogin.enableRegistration === '1'"
      >
        <div class="login_footer--title">
          <span class="login_footer--line"></span>
          <span class="login_footer--name">{{ $t('login.modeTip') }}</span>
          <span class="login_footer--line"></span>
        </div>
        <div class="login_footer--mode">
          <!-- <span class="item item_wx"></span> -->
          <!-- <image
            class="item"
            src="~@/static/img/login_images/mode_wx.svg"
          ></image> -->
          <!-- <image
            class="item"
            src="~@/static/img/login_images/mode_dd.svg"
          ></image> -->
          <image
            class="item"
            src="~@/static/img/login_images/mode_tel.svg"
            @click="toLogin('univerify')"
          ></image>
        </div>
      </footer>
      <footer
        class="login_footer"
        v-if="globalLogin.enableRegistration !== '1' && globalLogin.bottomText"
      >
        <div class="login_footer--bottom">
          {{ globalLogin.bottomText }}
        </div>
      </footer>
    </section>
    <u-notify ref="uTips"></u-notify>
    <!-- <u-top-tips
      ref="uTips"
      :navbar-height="$store.state.base.statusBarHeight"
    ></u-top-tips> -->
  </view>
</template>

<script>
import univerifyLogin from '@/utils/univerify';
import ModeAccount from './components/ModeAccount';

export default {
  components: { ModeAccount },

  props: {},

  data() {
    return {
      modeType: 'telphone',
      welcomeName: 'APIoT',
      langData: [
        {
          name: '中文',
          val: 'zhCN'
        },
        {
          name: 'EN',
          val: 'enUS'
        }
      ],
      curLanguage: uni.getStorageSync('apiotLanguage') || 'zhCN'
    };
  },

  computed: {
    globalLogin() {
      return this.$store.state.base.globalLogin;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    statusHeight() {
      return `${this.systemInfo.statusBar}px`;
    },
    platformConfig() {
      return this.$platformConfig;
    },
    servers() {
      return this.$store.state.serverInfo.serverAddress;
    },
    curLangIndex() {
      const index = this.langData.findIndex((item) => item.val === this.curLanguage);
      return index;
    },
    loginImg() {
      let url = '';
      if (this.globalLogin.loginLogo) {
        url = this.globalLogin.loginLogo.substr(0, this.globalLogin.loginLogo.length - 1);
      }
      return url;
    },
    loginBgImg() {
      let url = '';
      if (this.globalLogin.backgroundUrl) {
        url = this.globalLogin.backgroundUrl.substr(0, this.globalLogin.backgroundUrl.length - 1);
      }
      return url;
    },
    loginLogoWidth() {
      return `${this.globalLogin.loginLogoWidth}px`;
    }
  },

  methods: {
    // 更改语言
    changeLang(e) {
      const { value } = e.detail;
      this.$i18n.locale = this.langData[value].val;
      this.curLanguage = this.langData[value].val;
      // this.curLangIndex = value;
      this.$store.commit('changeLanguage');
      uni.setStorageSync('setSystemLanguageIndex', value);
      uni.setStorageSync('apiotLanguage', this.langData[value].val);
    },
    // 扫描
    async gotoScan() {
      let result = '';
      try {
        const qrResult = await this.$apiot.scanCode();
        result = qrResult.result;
        // 如果是服务器默认地址二维码1
        if (result && result.indexOf('APIoT_STATIC_SERVERURL') !== -1) {
          const serveUrl = result.match(/APIoT_STATIC_SERVERURL(\S*)SERVERURL_END/);
          if (serveUrl.length > 1) {
            const str = serveUrl[1];
            const obj = JSON.parse(str);
            this.$refs.uTips.show({
              message: '服务器地址设置成功',
              type: 'success',
              safeAreaInsetTop: true,
              fontSize: 18
            });
            this.$store.commit('setServerInfoAddress', obj);
            uni.reLaunch({ url: '/pages/index/index' });
          }
        }
      } catch (error) {
        this.$refs.uTips.show({
          message: `二维码信息：${result}`,
          type: 'error',
          safeAreaInsetTop: true,
          fontSize: 18
        });
        console.error(error);
      }
    },
    // 弹出服务器记录界面
    showServers() {
      if (this.servers.length === 0) return;
      uni.navigateTo({
        url: '/PagesServer/index'
      });
    },
    async toLogin(mode) {
      if (mode === 'univerify') {
        // 通过运用商获取手机号进行登录
        try {
          const { themeColor } = this.$store.state.base; // 主题色
          // 授权按钮根据主题色变化
          await univerifyLogin({
            authButton: {
              normalColor: themeColor,
              highlightColor: themeColor,
              disabledColor: themeColor
            }
          });
          uni.closeAuthView(); // 关闭授权界面
          // this.$refs.uTips.show({
          //   title: tel,
          //   type: 'success'
          // });
        } catch (e) {
          uni.closeAuthView(); // 关闭授权界面
          console.error(e);
          // this.$refs.uTips.show({
          //   title: e,
          //   type: 'warning'
          // });
        }
      }
    }
  },

  onLoad() {}
};
</script>

<style lang='scss' scoped>
$layoutMargin: 30rpx;
.login {
  position: relative;
  height: 100vh;
  background: #ffffff;
  &_content {
    margin: 0 var(--safe-area-inset-right) 0 var(--safe-area-inset-left);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  &_bg {
    ::v-deep {
      .u-image__image {
        border-radius: 0 0 30rpx 30rpx !important;
        width: 100% !important;
      }
    }
  }

  &_header {
    flex-shrink: 0;

    &--opration {
      height: 88rpx;
      line-height: 88rpx;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      margin: 0 $layoutMargin;
      .left {
        width: 50%;
        font-size: 28rpx;
        color: #ffffff;
        .command {
          display: flex;
        }
      }
    }

    &--icon {
      padding: 52rpx 0 80rpx 90rpx;
    }
    &--logo {
      // width: auto;
      height: 45rpx;
      background-size: auto 100%;
    }
    &--title {
      margin-top: 14rpx;
      display: block;
      font-size: 32rpx;
      font-family: $--font-family;
      @include fontBlob(500);
      color: #ffffff;
      line-height: 45rpx;
    }
  }

  &_substance {
    flex: 1;
    &--account {
      box-sizing: border-box;
      margin: 0 $layoutMargin;
      height: 600rpx;
      background: #ffffff;
      box-shadow: 0 2rpx 16rpx 0 rgba(0, 0, 0, 0.18);
      border-radius: 24rpx;
    }
  }

  &_footer {
    flex-shrink: 0;
    justify-self: flex-end;
    &--title {
      padding: 0 90rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      font-family: $--font-family;
    }
    &--line {
      flex-grow: 3;
      height: 1px;
      background: #ebebeb;
    }
    &--name {
      flex-grow: 1;
      text-align: center;
      font-size: 24rpx;
      color: #aaaaaa;
      line-height: 32rpx;
    }
    &--mode {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      .item {
        margin: 50rpx 20rpx;
        width: 80rpx;
        height: 80rpx;
        &_wx {
          background: url(~@/static/img/login_images/mode_wx.svg) no-repeat;
          background-size: cover;
        }
        &_dd {
          background: url(~@/static/img/login_images/mode_dd.svg) no-repeat;
          background-size: cover;
        }
        &_tel {
          background: url(~@/static/img/login_images/mode_tel.svg) no-repeat;
          background-size: cover;
        }
      }
    }
    &--bottom {
      line-height: 80rpx;
      font-size: 24rpx;
      color: #aaaaaa;
      text-align: center;
      margin-bottom: var(--safe-area-inset-bottom);
    }
  }
}
.tradition {
  .login_substance {
    margin-top: 156rpx;
    .login_substance--account {
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      padding: 0 30rpx;
    }
  }
  ::v-deep {
    .u-image__image {
      border-radius: 0 !important;
    }
    .accountLogin {
      padding-top: 40rpx !important;
    }
  }
}
</style>
