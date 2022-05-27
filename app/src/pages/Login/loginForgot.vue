<!--
 * @Author: sss
 * @Date: 2021-09-08 12:07:57
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-08 12:07:57
 * @Desc: 忘记密码页面
-->
<template>
  <view class="forgot">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar
      :backLevel="resetType === 2 ? 100 : 1"
      :title="$t('loginForgot.forgot')"
    ></apiot-navbar>
    <!-- #endif -->
    <verification-code
      v-if="verificationResult.type && resetType === 0"
      :verificationResult="verificationResult"
      @gotoNext="gotoNext"
      @gotoPrev="gotoPrev"
    ></verification-code>
    <reset-password
      v-else-if="verificationResult.type && resetType === 1"
      :verificationResult="verificationResult"
      @gotoPrev="gotoPrev('verificationCode')"
      @gotoNext="gotoNext"
    ></reset-password>
    <verification-type @verificationType="gotoNext" v-else></verification-type>
    <reset-success v-if="resetType === 2"></reset-success>
  </view>
</template>

<script>
import VerificationType from './components/VerificationType';
import VerificationCode from './components/VerificationCode';
import ResetPassword from './components/ResetPassword';
import ResetSuccess from './components/ResetSuccess';

export default {
  components: { VerificationType, VerificationCode, ResetPassword, ResetSuccess },

  props: {},

  data() {
    return {
      verificationResult: {
        type: ''
      },
      resetType: 0 // 重置密码进度：0-验证阶段；1-进行重置；2-完成重置
    };
  },

  computed: {},

  methods: {
    // 返回上一步
    gotoPrev(type) {
      if (type === 'verificationCode') {
        this.resetType = 0;
      } else {
        this.resetType = 0;
        this.verificationResult = { type: '' };
      }
    },
    // 到下一步
    gotoNext(result = {}) {
      const { type } = result;
      console.log(result);
      if (type === 'resetPassword') {
        this.resetType = 1;
        this.verificationResult.verificationCode = result.verificationCode;
      } else if (type === 'finish') {
        this.resetType = 2;
        this.verificationResult = { type: '' };
      } else {
        this.resetType = 0;
        this.verificationResult = { ...result };
      }
    }
  },

  onLoad() {},
  onReady() {
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle('dark');
    // #endif
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.$t('loginForgot.forgot')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.forgot {
  height: 100vh;
  background: #ffffff;
}
</style>
