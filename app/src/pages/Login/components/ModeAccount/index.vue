<!--
 * @Author: sss
 * @Date: 2021-08-31 19:23:37
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-31 19:23:37
 * @Desc: 账号登录
-->
<template>
  <view class="accountLogin form hasBorder">
    <u-form labelPosition="top" :model="accountForm" ref="loginAccountForm">
      <u-form-item class="form--item" prop="username">
        <apiot-input
          prefixIcon="appIcon-zhanghao"
          v-model="accountForm.username"
          border="none"
          :placeholder="
            $t('placeholder.pleaseEnterAny', { any: $t('login.account') })
          "
        ></apiot-input>
      </u-form-item>
      <u-form-item class="form--item" prop="password">
        <form-item-password
          v-model="accountForm.password"
          :placeholder="
            $t('placeholder.pleaseEnterAny', { any: $t('login.password') })
          "
        ></form-item-password>
      </u-form-item>
    </u-form>
    <div class="accountLogin__forget" @click="goToForgot()">
      {{ $t('login.forgot') }}
    </div>
    <footer class="accountLogin__footer">
      <apiot-button
        type="primary"
        shape="circle"
        :disabled="!checked"
        :loading="showLoading"
        @click="goToLogin"
        >{{ $t('login.login') }}</apiot-button
      >
      <span class="loginRule">
        <apiot-checkbox
          icon-size="26"
          v-model="checked"
          :active-color="themeColor"
        >
          <span class="loginRule--title"
            >我已阅读并同意《服务协议》和《隐私协议》</span
          >
        </apiot-checkbox>
      </span>
    </footer>
  </view>
</template>

<script>
import { Encrypt, Decrypt } from '@/utils';
import { postLoginForm } from '@/api/login.js';
import FormItemPassword from '../FormItemPassword';

export default {
  components: { FormItemPassword },

  props: {},

  data() {
    return {
      accountForm: {
        username: '',
        password: ''
      },
      showLoading: false,
      checked: false,
      isShowPassword: false,
      errorType: 'message'
    };
  },

  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    }
  },

  methods: {
    // 忘记密码
    goToForgot() {
      uni.navigateTo({
        url: '/pages/Login/loginForgot'
      });
    },
    // 登录
    async goToLogin() {
      this.showLoading = true;
      try {
        await this.$refs.loginAccountForm.validate();
        this.login();
      } catch (error) {
        this.showLoading = false;
      }
    },
    async login() {
      try {
        const params = {
          ...this.accountForm,
          password: Encrypt(this.accountForm.password)
        };
        await postLoginForm(params);
        uni.setStorageSync('username', Encrypt(params.username));
        uni.setStorageSync('password', params.password);
        // 是否自动登录
        uni.setStorageSync('automatic', true);
        this.showLoading = false;
        uni.reLaunch({ url: '/pages/MenuHome/index' });
      } catch (e) {
        this.showLoading = false;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    },
    // 设置表单校验规则
    setFormRules() {
      const rules = {
        username: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.$t('login.account') }),
            // 可以单个或者同时写两个触发验证方式
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.$t('login.password') }),
            trigger: ['change']
          }
        ]
      };
      this.$refs.loginAccountForm.setRules(rules);
    }
  },

  mounted() {
    const username = uni.getStorageSync('username');
    const password = uni.getStorageSync('password');
    this.accountForm = { username: Decrypt(username), password: Decrypt(password) };
    this.setFormRules();
  }
};
</script>

<style lang='scss' scoped>
.accountLogin {
  padding: 60rpx;
  &__forget {
    padding-top: 16rpx;
    text-align: right;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
    line-height: 38rpx;
  }

  &__footer {
    margin-top: 44rpx;
    text-align: center;
    .loginRule {
      margin-top: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      &--title {
        display: block;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #aaaaaa;
        line-height: 30rpx;
        text-align: left;
      }
      ::v-deep {
        .u-checkbox__label {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
