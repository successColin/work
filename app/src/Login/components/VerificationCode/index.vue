<!--
 * @Author: sss
 * @Date: 2021-09-09 13:51:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-09 13:51:44
 * @Desc: 忘记密码-获取验证码
-->
<template>
  <view class="verificationCode">
    <span class="verificationCode__title">{{
      $t('loginForgot.verifycodeTitle')
    }}</span>
    <span class="verificationCode__subtitle">
      <span class="phone__title" v-if="verificationResult.type">+86</span>
      {{ verificationResult.code }}
    </span>
    <div class="verificationCode__tip">
      <span>{{
        $t('placeholder.pleaseEnterAny', {
          any: $t('loginForgot.code'),
        })
      }}</span>
      <span :class="[getThemeColorFont]">{{
        $t('loginForgot.receivedCode', {
          any: $t('loginForgot.code'),
        })
      }}</span>
    </div>
    <apiot-message-input
      :latticeNum="6"
      mode="bottomLine"
      @changValue="changCode"
    ></apiot-message-input>
    <div class="verificationCode__countdown">
      <apiot-countdown
        v-if="!isTimeup"
        ref="verificationCountdown"
        :showDay="false"
        :second="60"
        :mode="['second']"
        :showColon="false"
        :color="themeColor"
        :splitorColor="themeColor"
        @timeup="timeup"
      ></apiot-countdown>
      <p v-if="!isTimeup" class="verificationCode__countdown--text">
        后可重新获取
      </p>
      <p v-else class="verificationCode__countdown--text" @click="retrieveCode">
        获取验证码
      </p>
    </div>
    <div class="btn">
      <apiot-button
        type="primary"
        shape="circle"
        :disabled="!checked"
        :loading="showLoading"
        @click="gotoNext"
        >{{ $t('loginForgot.next') }}</apiot-button
      >
    </div>
    <apiot-button
      type="secondary"
      shape="circle"
      :disabled="showLoading"
      @click="gotoPrev"
      >{{ $t('loginForgot.prev') }}</apiot-button
    >
  </view>
</template>

<script>
import { getSendMessageVerifyCode, postDoMessageVerify } from '@/api/login.js';

export default {
  components: {},

  props: {
    verificationResult: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      isTimeup: true,
      checked: false,
      showLoading: false,
      messageType: '',
      code: ''
    };
  },

  computed: {
    // 获取主题色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    // 获取字体主题色
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    title() {
      const baseType = {
        PHONE: 'loginForgot.PHONE',
        EMAIL: 'loginForgot.EMAIL'
      };
      const { type } = this.verificationResult;
      return baseType[type];
    }
  },

  // #ifdef MP
  options: { styleIsolation: 'apply-shared' },
  // #endif

  methods: {
    // 重新验证码
    retrieveCode() {
      this.getVerificationCode();
    },
    // 倒计时结束
    timeup() {
      this.isTimeup = true;
    },
    // 输入验证码
    changCode(value) {
      if (value.length === 6) {
        console.log(value);
        this.code = value;
        this.checked = true;
      } else this.checked = false;
    },
    // 上一步
    gotoPrev() {
      this.$emit('gotoPrev');
    },
    // 判断输入框是否有内容，有内容才能点击按钮
    handleInput(event) {
      if (event) this.checked = true;
      else this.checked = false;
    },
    // 获取验证码
    async getVerificationCode() {
      if (this.showLoading) return;
      this.showLoading = true;
      try {
        const { type, code } = this.verificationResult;
        await getSendMessageVerifyCode({
          messageType: type,
          receiver: code,
          verifyType: 'REST_PASSWORD'
        });
        this.showLoading = false;
        this.isTimeup = false;
      } catch (e) {
        this.showLoading = false;
        this.isTimeup = true;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    },
    // 开始验证
    async gotoNext() {
      this.showLoading = true;
      try {
        const { type, code } = this.verificationResult;
        await postDoMessageVerify({
          messageType: type,
          receiver: code,
          verifyType: 'REST_PASSWORD',
          messageVerifyCode: this.code
        });
        this.$emit('gotoNext', { type: 'resetPassword', verificationCode: this.code });
        this.showLoading = false;
      } catch (e) {
        this.showLoading = false;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../VerificationType/index.scss';

$--name: 'verificationCode';
$--formName: 'forgotForm';
@include setVerife($--name, $--formName);
.phone__title {
  display: inline-block;
  margin-right: 10rpx;
}
.verificationCode {
  &__tip {
    margin: 60rpx 0 50rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    font-family: $--font-family;
    color: #aaaaaa;
  }
  &__countdown {
    padding-top: 20rpx;
    display: flex;
    align-items: center;
    &--text {
      font-size: 26rpx;
      font-family: $--font-family;
      color: #aaaaaa;
    }
  }
}
</style>
