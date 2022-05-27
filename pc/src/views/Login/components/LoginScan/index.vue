<!--
 * @Descripttion: 扫码登录
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:43:43
-->
<template>
  <div class="loginScan">
    <section class="loginScan__area">
      <div class="loginScan__area--title">
        {{ $t('login.securityScanCodeLogin') }}
      </div>
      <div class="loginScan__border">
        <img class="loginScan__area--img" src="@/assets/img/androidCode.png" />
      </div>
      <div class="loginScan__dec">
        <i class="iconfont icon-saoma"></i>
        {{ $t('login.pleaseUse') }}
        <span style="color: #333333; padding: 0 6px">APIoT APP</span>
        {{ $t('login.scanCodeLogin') }}
      </div>
    </section>
    <sign-up :isScan="true"></sign-up>
  </div>
</template>

<script>
import SignUp from '../SignUp';

export default {
  data() {
    return {};
  },
  components: {
    SignUp
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.loginScan {
  margin-top: 19px;
  width: 100%;
  &__area {
    min-height: 282px;
    // height: calc(75vw / 10 * 3 - 30px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #e9e9e9;
    margin-bottom: 17px;
    box-sizing: border-box;
    &--title {
      flex: 1;
      font-size: 16px;
      color: #333333;
      display: flex;
      align-items: center;
    }
    .loginScan__border {
      // flex: 1;
      width: 135px;
      height: 135px;
      padding: 5px;
      border: 1px solid #e9e9e9;
      .loginScan__area--img {
        background-size: cover;
        width: 100%;
      }
    }
    .loginScan__dec {
      flex: 1;
      font-size: 13px;
      color: #808080;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 18px;
        color: #4689f5;
        margin-right: 6px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
