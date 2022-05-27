<!--
 * @Descripttion: input 获取验证码
 * @Author: ytx
 * @Date: 2021-04-14 17:43:39
 * @LastEditors: tjf
 * @LastEditTime: 2021-08-11 10:35:19
-->
<template>
  <view class="code-input">
    <apiot-input
      ref="name"
      class="code"
      type="number"
      border="none"
      :placeholder="inputDate.placeholder"
      @input="handleInput"
    ></apiot-input>
    <span
      class="code-button"
      @click="handleSuffix"
      :class="{ disabled: !canClick }"
      >{{ tips }}</span
    >
  </view>
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
      // canClick：true 未执行点击事件；false已执行
      canClick: true,
      inputDate: {
        slotType: this.slotType,
        label: this.$t('mine.verificationCode'), // 验证码-文字
        verificationContent: this.$t('mine.getVerificationCode'), // 验证码右侧内容
        placeholder: this.$t('placeholder.pleaseEnterVerificationCode')
      },
      tips: '获取验证码'
    };
  },
  methods: {
    codeChange(text) {
      this.tips = text;
    },
    // 获取验证码 按钮
    handleSuffix() {
      if (!this.canClick) return; // 如果在执行就返回
      if (!this.account) {
        uni.showToast({
          title: this.$t('mine.helloPleaseEnterYourMobilePhoneNumber'),
          duration: 500,
          icon: 'none'
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
        messageType: 'PHONE',
        receiver: this.account,
        verifyType: this.verifyType
      };
      try {
        // 获取验证码接口
        await getSendMessageVerifyCode(query);
        // this.$refs.uCode.start();
        const clock = window.setInterval(() => {
          this.totalTime -= 1;
          if (this.totalTime <= 0) {
            // 当倒计时小于0时清除定时器
            window.clearInterval(clock);
            this.totalTime = 60;
            this.canClick = true; // 这里重新开启
            this.tips = '重新获取';
          } else {
            this.tips = `${this.totalTime}秒后重新获取`;
          }
        }, 1000);
      } catch (error) {
        uni.showToast({
          title: error.message,
          duration: 500,
          icon: 'none'
        });
        // console.log(error);
        this.canClick = true; // 这里重新开启
      }
    },
    handleInput(value) {
      console.log(value);
      this.$emit('input', value);
    }
  }
};
</script>
<style lang='scss' scoped>
.code-input {
  width: 100%;
  height: 66rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx 0 !important;
  border: none;
  .code {
    flex: 1;
    height: 66rpx;
  }
  .code-button {
    width: 240rpx;
    height: 44rpx;
    line-height: 44rpx;
    font-size: 32rpx;
    border: none;
    color: #4689f5;
    text-align: center;
  }
  .disabled {
    cursor: not-allowed !important; // 鼠标变化
    color: #aaaaaa;
  }
}
</style>
