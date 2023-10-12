<!--
 * @Author: sss
 * @Date: 2021-08-30 14:18:22
 * @Last Modified by:sss
 * @Last Modified time: 2021-08-30 14:18:22
 * @des: 初始化界面
-->

<template>
  <view class="content">
    <!-- 密码过期确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
    <GuideEl ref="guideEl"></GuideEl>
  </view>
</template>

<script>
import {
  postLoginForm,
  getGlobalAppLogin,
  ssoLogin,
  verifyToken,
  wxStandard
} from '@/api/login.js';
import { logout } from '@/api/mine';
import { Decrypt, Encrypt } from '@/utils';

import GuideEl from './components/GuideEl';
// #ifdef H5
// 要有钉钉功能时使用，没有钉钉功能可以注销
// import { getDingDingCode } from '@/utils/dingding';
// import { zwdingtalkLogin } from '@/api/login';
// #endif

export default {
  components: { GuideEl },
  data() {
    return {
      show: false,
      mode: 'date',
      title: 'Hello',
      canRequestConfig: 0, // 为了兼容没有网络的问题 0=原生状态，1=请求成功；2=请求失败
      configs: {},
      source: null,
      pageConfig: {
        isLink: null, // 是否为外联
        flag: null, // 外联为菜单还是面板
        id: null // 外联的唯一标识
      },
      isInit: false // 是否获取配置信息，为了兼容无网络授权的情况1
    };
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    }
  },
  watch: {
    isInit(status) {
      if (status) {
        // 如果isLink为999时，需要校验token是否失效1
        if (+this.pageConfig.isLink === 999) {
          this.verifyIsOnline();
        } else {
          this.getConfig();
        }
      }
    },
    canRequestConfig(status) {
      if (status === 1) {
        // 如果是需要外链进来的。例如直接跳转到公告，流程，或者配置界面
        if (this.pageConfig.showDetailPage) {
          this.outLinkshow();
          return;
        }
        console.log(this.pageConfig.enableDefaultLogin);
        if (this.pageConfig.enableDefaultLogin) this.configs.enableDefaultLogin = true;

        // #ifdef H5
        // 单点登录
        this.ssoLogin();
        // #endif
        // #ifndef H5
        this.login();
        // #endif
      }
    }
  },
  onLoad(option = {}) {
    uni.setStorageSync('curMenuId', '');
    if (option.source) {
      this.source = option.source;
    }

    const { canShowProcressDeatail, canShowNotification } = option;
    if (canShowProcressDeatail || canShowNotification) {
      // 是否直接展示详情界面，不走常规登录
      option.showDetailPage = true;
    }

    // 是否为预览功能
    if (option.isPreview) {
      uni.setStorageSync('username', option.username);
      uni.setStorageSync('password', option.password);
      option.enableDefaultLogin = true;
    }

    // 如果链接里带了账号密码，需要设置账号密码，并且默认登录
    if (option.name && option.pwd) {
      uni.setStorageSync('username', Encrypt(option.name));
      uni.setStorageSync('password', Encrypt(option.pwd));
      option.enableDefaultLogin = true;
    }
    this.pageConfig = { ...this.pageConfig, ...option };
    this.$store.commit('setMenuHomePageConfig', this.pageConfig);

    // 如果是ios手机，且是第一次登录，需要延迟几秒钟，为了兼容ios的网络授权
    const isOpenedApp = uni.getStorageSync('isOpenApp'); // 是否已经打开过app
    const { uniPlatform } = uni.getSystemInfoSync();
    console.log(uni.getSystemInfoSync());
    if (!isOpenedApp && uniPlatform === 'app') {
      uni.setStorageSync('isOpenApp', true);
    } else {
      this.isInit = true;
    }
  },
  mounted() {
    if (!this.isInit) {
      this.openGuide();
    }
  },
  methods: {
    // 打开引导页
    async openGuide() {
      await this.$refs.guideEl.showAsyncModal();
      this.isInit = true;
    },
    async verifyIsOnline() {
      const res = await verifyToken();
      if (res) {
        setTimeout(() => {
          this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
        }, 10);
      } else {
        this.getConfig();
      }
    },
    // 根据token获取用户信息并且调整地址
    async getUserInfoByUid(uid) {
      if (!uid) return;
      try {
        const token = await ssoLogin({ rsaToken: encodeURIComponent(uid) });
        uni.setStorageSync('token', Encrypt(token));
        this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
      } catch (error) {
        this.login();
      }
    },
    // h5登录逻辑
    async ssoLogin() {
      console.log('========================');
      // 如果强制默认登录，就不走单点登录逻辑
      if (this.pageConfig.enableDefaultLogin) {
        this.login();
        return;
      }
      // 是否需要单点登录
      // ssoType:1=正常 2=需要钉钉登录 3=标准单点登录
      if (+this.configs.ssoType === 3) {
        const { uid } = this.pageConfig;
        if (uid) {
          this.getUserInfoByUid(uid);
        } else {
          this.login();
        }
      } else if (+this.configs.ssoType === 2) this.ddLogin();
      else this.login();
    },
    async getConfig() {
      try {
        // 获取登录配置
        const res = await getGlobalAppLogin();

        const obj = {};
        res.forEach((item) => {
          const { attributeKey, attributeValue } = item;
          obj[attributeKey] = attributeValue;
        });
        this.configs = obj;
        this.$store.commit('setGlobalLogin', obj);
        uni.setStorageSync('globalLogin', obj);

        // 开始进行登录逻辑
        this.canRequestConfig = 1;
      } catch (error) {
        this.canRequestConfig = 2;
      }
    },
    // 钉钉登录
    async ddLogin() {
      // #ifdef H5
      // let code = '';
      // try {
      //   code = await getDingDingCode();
      //   if (code) {
      //     await zwdingtalkLogin({ code });
      //     uni.reLaunch({ url: '/MenuHome/index' });
      //   } else uni.reLaunch({ url: '/Login/index' });
      // } catch (error) {
      //   uni.reLaunch({ url: `/PagesDing/associatedUser/index?code=${code}` });
      // }
      // #endif
    },
    // 正常登录:需要分情况，如果是微信小程序-需要做微信小程序单点登录
    login() {
      // #ifdef MP-WEIXIN
      this.wxLogin();
      // this.loginNormal();
      // #endif
      // #ifndef MP-WEIXIN
      this.loginNormal();
      // #endif
    },

    // #ifdef MP-WEIXIN
    // 正常登录-微信登录
    wxLogin() {
      uni.login({
        provider: 'weixin',
        onlyAuthorize: true,
        success: async (loginRes) => {
          const { code } = loginRes;
          try {
            await wxStandard({
              code
            });
            if (this.source === 'logout') uni.reLaunch({ url: '/PagesWX/Login' });
            else this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
          } catch (error) {
            // 将返回的微信openid存储
            const { code: apiCode, message } = error || {};
            if (apiCode === 'B0002' && message) uni.setStorageSync('wxFlag', message);
            uni.reLaunch({ url: '/PagesWX/Login' });
          }
        }
      });
    },
    // #endif

    // 正常登录-H5/APP
    async loginNormal() {
      console.log('========================loginNormal');
      const username = uni.getStorageSync('username');
      const password = uni.getStorageSync('password');
      if (
        this.configs.enableDefaultLogin === '1' ||
        this.source === 'logout' ||
        !username ||
        !password
      ) {
        uni.reLaunch({ url: '/Login/index' });
        return;
      }

      try {
        await postLoginForm({
          username: Decrypt(username),
          password,
          enableLoginFirstApp: this.configs.enableLoginFirstApp,
          loginType: 'APP'
        });
        this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
      } catch (e) {
        if (e.data) {
          const res = e.data;
          if (res.deploymentMode === 'single' && res.state === '1') {
            // 密码失效重置1
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.passwordExpirationPrompt', {
                  name: Decrypt(uni.getStorageSync('username'))
                }),
                title: this.$t('common.tip'),
                sureTitle: this.$t('mine.changePassword')
              });
              uni.navigateTo({
                url: '/MinePages/ChangePassword/index?source=login'
              });
            } catch (error) {
              logout();
              uni.reLaunch({ url: '/Login/index' });
            }
          } else if (res.deploymentMode === 'single' && res.state === '2') {
            // 密码失效不允许登录
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.passwordExpirationPrompt', {
                  name: Decrypt(uni.getStorageSync('username'))
                }),
                showCancel: false,
                title: this.$t('common.tip')
              });
              logout();
              uni.reLaunch({ url: '/Login/index' });
            } catch (error) {
              uni.reLaunch({ url: '/Login/index' });
            }
          } else if (res.deploymentMode === 'single' && res.state === '3') {
            // 首次登录
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.firstLoginPrompt'),
                title: this.$t('common.tip'),
                sureTitle: this.$t('mine.changePassword')
              });
              uni.navigateTo({
                url: '/MinePages/ChangePassword/index?source=login'
              });
            } catch (error) {
              logout();
              uni.reLaunch({ url: '/Login/index' });
            }
          } else uni.reLaunch({ url: '/Login/index' });
        } else {
          uni.showToast({
            icon: 'none',
            title: e.message
          });
          uni.reLaunch({ url: '/Login/index' });
        }
        this.showLoading = false;
      }
    },
    // 外链进来的。例如直接跳转到公告，流程，或者配置界面
    outLinkshow() {
      const { uid, canShowProcressDeatail } = this.pageConfig;
      if (canShowProcressDeatail) {
        this.pageConfig.isLink = 5;
        this.getUserInfoByUid(uid);
      } else {
        const { token } = this.pageConfig;
        // 直接可以获取token的，例如分享地址
        uni.setStorageSync('token', token);
        this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
      }
    }
  }
};
</script>

<style lang="scss">
.bg {
  height: 100px;
  width: 100%;
  background-color: $u-primary;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
