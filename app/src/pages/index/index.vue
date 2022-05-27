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
import { postLoginForm } from '@/api/login.js';
import { Decrypt } from '@/utils';

export default {
  data() {
    return {
      show: false,
      mode: 'date',
      title: 'Hello'
    };
  },
  onLoad() {
    console.log('onLoad');
    // 是否需要自动登录
    const automatic = uni.getStorageSync('automatic');
    if (automatic) this.login();
    else uni.reLaunch({ url: '/pages/Login/index' });
    // uni.reLaunch({ url: '/pages/Login/index' });
  },
  onReady() {
    console.log('onReady');
  },
  methods: {
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
