<!--
 * @Descripttion: input 获取验证码
 * @Author: ytx
 * @Date: 2021-04-14 17:43:39
 * @LastEditors: tjf
 * @LastEditTime: 2021-08-11 10:35:19
-->
<template>
  <apiot-input
    v-bind="$attrs"
    v-on="$listeners"
    class="inputGetcode__input"
    ref="name"
    :slotType="inputDate.slotType"
    :placeholder="inputDate.placeholder"
  >
    <!-- 左侧验证码文字 -->
    <div :style="styleWidth" v-if="prependWidth !== '0'" slot="prepend">
      {{ inputDate.label }}
    </div>
    <!-- 右侧获取验证码文字 -->
    <div
      class="inputGetcode__input--suffix loginFontHover"
      slot="suffix"
      :class="{ 'inputGetcode__input--disabled': !canClick }"
      @click="handleSuffix"
    >
      {{ inputDate.verificationContent }}
    </div>
  </apiot-input>
</template>

<script>
import { getSendMessageVerifyCode } from '@/api/login';

export default {
  props: {
    // 验证业务类型,接口中使用
    verifyType: {
      type: String,
      default: 'REST_PASSWORD'
    },
    // 手机或邮箱的值
    receiver: {
      type: String,
      default: ''
    },
    // 左侧文字宽度
    prependWidth: {
      type: String,
      default: ''
    },
    // 账号
    account: {
      type: String,
      default: ''
    },
    // 账号
    slotType: {
      type: String,
      default: 'prepend,suffix'
    },
    // 账号
    messageType: {
      type: String,
      default: 'PHONE'
    }
  },
  data() {
    return {
      // 记录具体倒计时时间
      totalTime: 60,
      // 验证码发送方式
      comeType: this.$route.query.type || this.messageType || '',
      // canClick：true 未执行点击事件；false已执行
      canClick: true,
      inputDate: {
        slotType: this.slotType,
        label: this.$t('login.verificationCode'), // 验证码-文字
        verificationContent: this.$t('login.getVerificationCode'), // 验证码右侧内容
        placeholder: this.$t('placeholder.pleaseEnterVerificationCode')
      }
    };
  },
  computed: {
    // input 中内容
    // inputDate() {
    //   return {
    //     slotType: this.slotType,
    //     label: this.$t('login.verificationCode'), // 验证码-文字
    //     verificationContent: this.$t('login.getVerificationCode'), // 验证码右侧内容
    //     placeholder: this.$t('placeholder.pleaseEnterVerificationCode')
    //   };
    // },
    // props 传过来值
    styleWidth() {
      return `min-width: ${this.prependWidth}`;
    }
  },
  methods: {
    // 获取验证码 按钮
    handleSuffix() {
      if (!this.canClick) return; // 如果在执行就返回
      if (!this.account) {
        this.$message({
          type: 'error',
          message: this.$t('login.helloPleaseEnterYourMobilePhoneNumber')
        });
        return;
      }
      this.$refs.name.$el.querySelector('input').focus();
      this.getSendMessageVerifyCodeFun();
    },
    // 获取验证码接口
    async getSendMessageVerifyCodeFun() {
      this.canClick = false;
      const query = {
        messageType: this.comeType || 'PHONE',
        receiver: this.account,
        verifyType: this.verifyType
      };
      try {
        // 获取验证码接口
        await getSendMessageVerifyCode(query);
        this.inputDate.verificationContent = `${this.totalTime}${this.$t('login.SResendLater')}`;
        const clock = window.setInterval(() => {
          this.totalTime -= 1;
          this.inputDate.verificationContent = `${this.totalTime}${this.$t('login.SResendLater')}`;
          if (this.totalTime < 0) {
            // 当倒计时小于0时清除定时器
            window.clearInterval(clock);
            this.inputDate.verificationContent = this.$t('login.getVerificationCode');
            this.totalTime = 60;
            this.canClick = true; // 这里重新开启
          }
        }, 1000);
      } catch (error) {
        // console.log(error);
        this.canClick = true; // 这里重新开启
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.inputGetcode__input {
  &--suffix {
    color: #4689f5;
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: 15px;
  }
  &--disabled {
    cursor: not-allowed !important; // 鼠标变化
  }
}
</style>
