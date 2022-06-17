<!--
 * @Author: sss
 * @Date: 2021-08-30 15:24:31
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-30 15:24:31
 * @Desc: 登录界面
-->
<template>
  <view class="login">
    <view class="login_bg">
      <u-image
        src="~@/static/img/login_images/bg.jpg"
        :lazyLoad="false"
        :fade="false"
        height="480rpx"
        loading-icon="false"
        width="100%"
      ></u-image>
    </view>
    <section class="login_content">
      <!-- #ifndef MP-ALIPAY -->
      <div class="status__bar"></div>
      <!-- #endif -->
      <header class="login_header">
        <div class="login_header--opration">
          <div class="left">
            <apiot-button-font
              v-if="platformConfig.H5_SCAN"
              iconName="saoma"
              @click="gotoScan"
            ></apiot-button-font>
          </div>
          <div class="right"></div>
        </div>
        <div class="login_header--icon">
          <image
            src="~@/static/img/login_images/logo.png"
            class="login_header--logo"
            @click="showServers"
          ></image>
          <span class="login_header--title">{{
            $t('login.welcomeMsg', { name: welcomeName })
          }}</span>
        </div>
      </header>
      <view class="login_substance">
        <div class="login_substance--account">
          <mode-account></mode-account>
        </div>
      </view>
      <footer class="login_footer">
        <div class="login_footer--title">
          <span class="login_footer--line"></span>
          <span class="login_footer--name">{{ $t('login.modeTip') }}</span>
          <span class="login_footer--line"></span>
        </div>
        <div class="login_footer--mode">
          <!-- <span class="item item_wx"></span> -->
          <image
            class="item"
            src="~@/static/img/login_images/mode_wx.svg"
          ></image>
          <image
            class="item"
            src="~@/static/img/login_images/mode_dd.svg"
          ></image>
          <image
            class="item"
            src="~@/static/img/login_images/mode_tel.svg"
            @click="toLogin('univerify')"
          ></image>
        </div>
      </footer>
    </section>
    <u-notify
      ref="uTips"
      message="Hi uView"
      :safeAreaInsetTop="true"
    ></u-notify>
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
      welcomeName: 'APIoT'
    };
  },

  computed: {
    platformConfig() {
      return this.$platformConfig;
    },
    servers() {
      return this.$store.state.serverInfo.serverAddress;
    }
  },

  methods: {
    // 扫描
    async gotoScan() {
      try {
        const qrResult = await this.$apiot.scanCode();
        const { result } = qrResult;
        // 如果是服务器默认地址二维码1
        if (result.indexOf('APIoT_STATIC_SERVERURL') !== -1) {
          // const regex = /(?<=APIoT_STATIC_SERVERURL).*?(?=SERVERURL_END)/gi;
          // const serveUrl = result.match(regex);
          // console.log(serveUrl);
          // if (serveUrl.length > 0) {
          //   let servers = {};
          //   serveUrl.forEach((item) => {
          //     const serve = JSON.parse(item);
          //     servers = { ...servers, ...serve };
          //   });
          //   this.$store.commit('setServerInfoAddress', servers);
          //   uni.reLaunch({ url: '/pages/index/index' });
          // }

          console.log(result);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 弹出服务器记录界面
    showServers() {
      // if (this.servers.length === 0) return;
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
    margin: var(--safe-area-inset-top) var(--safe-area-inset-right) 0
      var(--safe-area-inset-left);
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
    }

    &--icon {
      padding: 52rpx 0 80rpx 90rpx;
    }
    &--logo {
      width: 167rpx;
      height: 45rpx;
    }
    &--title {
      margin-top: 14rpx;
      display: block;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
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
      font-family: PingFangSC-Regular, PingFang SC;
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
  }
}
</style>
