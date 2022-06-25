<!--
 * @Author: sss
 * @Date: 2021-08-30 14:18:22
 * @Last Modified by:sss
 * @Last Modified time: 2021-08-30 14:18:22
 * @des: 初始化界面
-->

<template>
  <view class="content"> </view>
</template>

<script>
import { postLoginForm, getGlobalAppLogin } from '@/api/login.js';
import { Decrypt } from '@/utils';
import { getDingDingCode } from '@/utils/dingding';
import { zwdingtalkLogin } from '@/api/login';

export default {
  data() {
    return {
      show: false,
      mode: 'date',
      title: 'Hello',
      configs: {}
    };
  },
  onLoad() {
    console.log('onLoad');
    this.getConfig();
  },
  onReady() {
    console.log('onReady');
  },
  mounted() {},
  methods: {
    async getConfig() {
      const res = await getGlobalAppLogin();
      const obj = {};
      res.forEach((item) => {
        const { attributeKey, attributeValue } = item;
        obj[attributeKey] = attributeValue;
      });
      this.configs = obj;

      let code = '';
      // #ifdef H5
      code = await getDingDingCode();
      // #endif

      const automatic = uni.getStorageSync('automatic');
      // ssoType： 1是请选择   2是浙政钉
      if (+this.configs.ssoType === 2 && code) {
        // 专有钉钉单点登录
        try {
          await zwdingtalkLogin({ code });
          uni.reLaunch({ url: '/pages/MenuHome/index' });
        } catch (error) {
          uni.reLaunch({ url: '/pages/Login/index' });
        }
      } else if (automatic) {
        // 是否需要自动登录
        this.login();
      } else {
        uni.reLaunch({ url: '/pages/Login/index' });
      }
    },
    async login() {
      try {
        const username = uni.getStorageSync('username');
        const password = uni.getStorageSync('password');
        await postLoginForm({ username: Decrypt(username), password });
        uni.reLaunch({ url: '/pages/MenuHome/index' });
      } catch (e) {
        console.log('error');
        this.showLoading = false;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
        uni.reLaunch({ url: '/pages/Login/index' });
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
