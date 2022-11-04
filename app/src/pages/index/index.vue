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
    <apiot-modal ref="apiotModal"></apiot-modal
  ></view>
</template>

<script>
import { postLoginForm, getGlobalAppLogin, ssoLogin, verifyToken } from '@/api/login.js';
import { logout } from '@/api/mine';
import { Decrypt, Encrypt } from '@/utils';
// #ifdef H5
// 要有钉钉功能时使用，没有钉钉功能可以注销
// import { getDingDingCode } from '@/utils/dingding';
// import { zwdingtalkLogin } from '@/api/login';
// #endif
// #ifdef MP-WEIXIN
import { wxLoginByOpenId } from '@/api/login.js';
// #endif

export default {
  data() {
    return {
      show: false,
      mode: 'date',
      title: 'Hello',
      configs: {},
      source: null,
      pageConfig: {
        isLink: null, // 是否为外联
        flag: null, // 外联为菜单还是面板
        id: null // 外联的唯一标识
      }
    };
  },
  onLoad(option = {}) {
    if (option.source) {
      this.source = option.source;
    }
    this.pageConfig = { ...this.pageConfig, ...option };
    this.$store.commit('setMenuHomePageConfig', this.pageConfig);
    this.getConfig();
  },
  async mounted() {
    const res = await verifyToken();
    console.log(res);
  },
  methods: {
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

        // #ifdef H5
        // 单点登录
        console.log(this.configs.ssoType);
        if (+this.configs.ssoType === 3) {
          const path = window.location.href;
          const rsaToken = path.split('?uid=')[1];
          if (rsaToken) {
            try {
              const token = await ssoLogin({ rsaToken });
              uni.setStorageSync('token', Encrypt(token));
              this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
            } catch (error) {
              this.login();
            }
          } else {
            this.login();
          }
          // 如果时h5，需要判断是否进行钉钉登录 ssoType:1=正常 2=需要钉钉登录
        } else if (+this.configs.ssoType === 2) this.ddLogin();
        else this.login();
        // #endif

        // #ifndef H5
        // 如果不是h5的不考虑钉钉登录问题
        this.login();
        // #endif
      } catch (error) {
        this.login();
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
          console.log(`wxLogin:${code}`);
          try {
            await wxLoginByOpenId({
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

    // #ifndef MP-WEIXIN
    // 正常登录-H5/APP
    async loginNormal() {
      console.log('==============================login');
      if (this.configs.enableDefaultLogin === '1' || this.source === 'logout') {
        uni.reLaunch({ url: '/Login/index' });
        return;
      }
      try {
        const username = uni.getStorageSync('username');
        const password = uni.getStorageSync('password');
        await postLoginForm({
          username: Decrypt(username),
          password,
          enableLoginFirstPc: this.configs.enableLoginFirstApp
        });
        this.$store.dispatch('jumpHomePage', { setConfig: true, config: this.pageConfig });
      } catch (e) {
        if (e.data) {
          const res = e.data;
          if (res.deploymentMode === 'single' && res.state === '1') {
            // 密码失效重置
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
              console.log(error);
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
              console.log(error);
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
    // #endif
    // 外联地址显示
    outLinkshow() {}
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
