<!--
 * @Descripttion: 注册和忘记密码公共页面
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:22:57
-->

<template>
  <apiot-container class="myRegister" :showNav="false">
    <template v-slot:header>
      <div class="myRegister__header">
        <div class="myRegister__header--left">
          <img src="@/assets/img/pcLoginLog1.svg" alt="" />
          <div class="myRegister__header--line"></div>
          <span>{{ titleName }}</span>
        </div>
        <apiot-button class="myRegister__header--right" @click="handleJump">
          <i class="iconfont icon-fanhui"></i>
          {{ $t('login.backToLogin') }}
        </apiot-button>
      </div>
    </template>
    <template>
      <div class="myRegister__content">
        <router-view />
      </div>
    </template>
  </apiot-container>
</template>

<script>
export default {
  computed: {
    titleName() {
      return this.$t(this.$route.matched[0].meta.title);
    }
  },
  methods: {
    handleJump() {
      this.$router.push('/login');
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.icon-fanhui {
  color: #aaaaaa;
}
.myRegister__header--right:hover {
  .icon-fanhui {
    color: $--hover-fontColor;
  }
}
</style>
