<!--
 * @Author: sss
 * @Date: 2021-09-09 13:51:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-09 13:51:44
 * @Desc: 忘记密码-验证类型 电话/邮件
-->
<template>
  <view class="verificationType">
    <span class="verificationType__title">{{ $t('loginForgot.reset') }}</span>
    <span class="verificationType__subtitle">
      通过手机号/邮箱验证后，可重置密码
    </span>
    <view class="forgotForm form hasBorder">
      <u-form :model="forgotForm" ref="forgotForm" errorType="toast">
        <u-form-item class="form--item" prop="account">
          <apiot-input
            prefixIcon="appIcon-zhanghao"
            v-model="forgotForm.account"
            @input="handleInput"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('loginForgot.type'),
              })
            "
          ></apiot-input>
        </u-form-item>
      </u-form>
    </view>
    <div class="btn">
      <apiot-button
        type="primary"
        shape="circle"
        :disabled="
          !(checked && (messageType === '' || messageType === 'PHONE'))
        "
        :loading="showLoading && messageType === 'PHONE'"
        @click="verificationTel"
        >{{ $t('loginForgot.verificationTel') }}</apiot-button
      >
    </div>
    <apiot-button
      type="secondary"
      shape="circle"
      :disabled="!(checked && (messageType === '' || messageType === 'EMAIL'))"
      :loading="showLoading && messageType === 'EMAIL'"
      @click="verificationEmail"
      >{{ $t('loginForgot.verificationEmail') }}</apiot-button
    >
  </view>
</template>

<script>
import { getRestPwdAccountByType } from '@/api/login.js';

export default {
  components: {},

  props: {},

  data() {
    return {
      forgotForm: {
        account: ''
      },
      checked: false,
      showLoading: false,
      messageType: ''
    };
  },

  computed: {},

  // #ifdef MP
  options: { styleIsolation: 'apply-shared' },
  // #endif

  methods: {
    // 判断输入框是否有内容，有内容才能点击按钮
    handleInput(event) {
      if (event) this.checked = true;
      else this.checked = false;
    },
    // 开始验证
    async gotoVerification() {
      try {
        const { messageType } = this;
        const params = this.forgotForm;
        params.messageType = messageType;
        const result = await getRestPwdAccountByType(params);
        this.$emit('verificationType', {
          type: messageType,
          code: result
        });
        this.showLoading = false;
        this.messageType = '';
      } catch (e) {
        this.showLoading = false;
        this.messageType = '';
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    },
    // 验证手机号码
    async verificationTel() {
      this.showLoading = true;
      this.messageType = 'PHONE';
      try {
        await this.$refs.forgotForm.validate();
        this.gotoVerification();
      } catch (error) {
        this.showLoading = false;
        this.messageType = '';
      }
    },
    // 验证email
    async verificationEmail() {
      this.showLoading = true;
      this.messageType = 'EMAIL';

      try {
        await this.$refs.resetPasswordForm.validate();
        this.gotoVerification();
      } catch (error) {
        this.showLoading = false;
        this.messageType = '';
      }
    }
  },

  mounted() {
    const rules = {
      account: [
        {
          required: true,
          message: '请输入账号或者手机号'
        }
      ]
    };
    this.$refs.forgotForm.setRules(rules);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'verificationType';
$--formName: 'forgotForm';
@include setVerife($--name, $--formName);
</style>
