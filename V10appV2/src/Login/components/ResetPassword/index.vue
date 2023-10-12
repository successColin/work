<!--
 * @Author: sss
 * @Date: 2021-09-09 13:51:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-09 13:51:44
 * @Desc: 忘记密码-重置密码
-->
<template>
  <view class="resetPassword">
    <span class="resetPassword__title">{{ $t('loginForgot.reset') }}</span>
    <span class="resetPassword__subtitle">
      {{ passwordLevelRule.placeholder }}
    </span>
    <view class="resetPasswordForm form hasBorder">
      <u-form
        :model="resetPasswordForm"
        ref="resetPasswordForm"
        :errorType="showLoading ? 'toast' : 'message'"
      >
        <u-form-item class="form--item" prop="account">
          <apiot-input
            prefixIcon="appIcon-zhanghao"
            :value="verificationResult.code"
            disabled
          ></apiot-input>
        </u-form-item>
        <u-form-item class="form--item" prop="password">
          <form-item-password
            v-model="resetPasswordForm.password"
            :placeholder="$t('placeholder.pleaseSetANewPassword')"
          ></form-item-password>
        </u-form-item>
        <u-form-item class="form--item" prop="confirmPassword">
          <form-item-password
            v-model="resetPasswordForm.confirmPassword"
            :placeholder="$t('placeholder.PleaseConfirmTheNewPasswordAgain')"
          ></form-item-password>
        </u-form-item>
      </u-form>
    </view>
    <div class="btn">
      <apiot-button
        type="primary"
        shape="circle"
        :loading="showLoading"
        @click="resetPassword"
        >{{ $t('common.sure') }}</apiot-button
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
import { Encrypt } from '@/utils';
import { postResetPassword } from '@/api/login.js';
import FormItemPassword from '../FormItemPassword';

export default {
  components: { FormItemPassword },

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
      resetPasswordForm: {
        confirmPassword: '',
        password: ''
      },
      checked: false,
      showLoading: false,
      messageType: '',
      passwordLevel: '2', // 密码等级
      errorType: 'message'
    };
  },

  computed: {
    passwordLevelRule() {
      const baseRules = {
        minLen: 6,
        maxLen: 18,
        rule: ['.*[0-9]{1,}.*', '.*[a-z]{1,}.*', '.*[A-Z]{1,}.*', '.*[~!@#%_*]{1,}.*']
      };
      const { passwordLevel } = this;
      if (passwordLevel === '3') baseRules.placeholder = `密码${baseRules.minLen}~${baseRules.maxLen}位数，为保证安全，必须包含数字、大小字母、~!@#%_*组成！`;
      else if (passwordLevel === '2') baseRules.placeholder = `密码${baseRules.minLen}~${baseRules.maxLen}位数，为保证安全，至少由数字、大小字母、~!@#%_*任意2种组成！`;
      else baseRules.placeholder = `密码${baseRules.minLen}~${baseRules.maxLen}位数，为保证安全，至少由数字、大小字母、~!@#%_*任意1种组成！`;
      return baseRules;
    }
  },

  methods: {
    // 上一步
    gotoPrev() {
      this.$emit('gotoPrev');
    },
    // 修改密码
    async gotoReset() {
      try {
        const { resetPasswordForm, verificationResult } = this;
        const params = {
          password: Encrypt(resetPasswordForm.password),
          confirmPassword: Encrypt(resetPasswordForm.confirmPassword)
        };
        params.account = verificationResult.code;
        params.messageType = verificationResult.type;
        params.messageVerifyCode = verificationResult.verificationCode;
        await postResetPassword(params);
        this.$emit('gotoNext', { type: 'finish' });
        this.showLoading = false;
      } catch (e) {
        this.showLoading = false;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    },
    // 修改密码
    async resetPassword() {
      this.showLoading = true;
      try {
        await this.$refs.resetPasswordForm.validate();
        this.gotoReset();
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 设置表单校验规则
    setFormRules() {
      const { passwordLevelRule, passwordLevel } = this;
      const rules = {
        password: [
          {
            required: true,
            message: '密码不符合规范',
            // 可以单个或者同时写两个触发验证方式
            trigger: 'change',
            validator: (rule, value) => {
              if (value.length < passwordLevelRule.minLen) {
                this.Strength = 0;
                return false;
              }
              let modes = 0;
              passwordLevelRule.rule.forEach((item) => {
                const patt = new RegExp(item, 'g');
                if (patt.test(value)) modes += 1;
              });

              return passwordLevel !== '0' && modes >= Number(passwordLevel);
            }
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '2次密码不一致',
            trigger: 'change',
            validator: (rule, value) => value === this.resetPasswordForm.password
          }
        ]
      };
      this.$refs.resetPasswordForm.setRules(rules);
    }
  },

  mounted() {
    this.setFormRules();
  }
};
</script>

<style lang='scss' scoped>
@import '../VerificationType/index.scss';

$--name: 'resetPassword';
$--formName: 'resetPasswordForm';
@include setVerife($--name, $--formName);
.resetPassword {
  .resetPasswordForm {
    margin-top: 60rpx;
  }
}
</style>
