<!--
 * @Author: sss
 * @Date: 2021-08-31 19:23:37
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-31 19:23:37
 * @Desc: 账号登录
-->
<template>
  <view class="accountLogin form hasBorder">
    <u-form
      labelPosition="top"
      :model="accountForm"
      errorType="toast"
      ref="loginAccountForm"
    >
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
    <div
      class="accountLogin__forget"
      v-if="!isAssociatedUser && globalLogin.enableForgetPassword === '1'"
    >
      <span class="right" @click="goToForgot()">{{ $t('login.forgot') }}</span>
    </div>
    <footer class="accountLogin__footer">
      <apiot-button
        type="primary"
        :disabled="!canLogin"
        :loading="showLoading"
        @click="goToLogin"
        >{{
          !isAssociatedUser ? $t('login.login') : $t('login.associatedUser')
        }}</apiot-button
      >
      <span class="loginRule" v-if="!isAssociatedUser">
        <apiot-checkbox
          icon-size="26"
          v-model="checked"
          :active-color="themeColor"
          @change="clickAgree"
        >
          <span class="loginRule--title"
            >{{ $t('login.readAndAgree') }} <span>《服务协议》</span
            >{{ $t('login.and') }}<span>《隐私协议》</span></span
          >
        </apiot-checkbox>
      </span>
    </footer>
    <!-- 密码过期确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
  </view>
</template>

<script>
import { Encrypt, Decrypt } from '@/utils';
import { postLoginForm, exchangeTokenLogin } from '@/api/login.js';
import { logout } from '@/api/mine';
import FormItemPassword from '../FormItemPassword';

export default {
  components: { FormItemPassword },

  props: {
    isAssociatedUser: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      accountForm: {
        username: '',
        password: ''
      },
      showLoading: false,
      checked: true,
      params: {}
    };
  },

  computed: {
    // 是否能够登录
    canLogin() {
      const { accountForm } = this;
      const { username, password } = accountForm;
      if (username && password) return true;
      return false;
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    globalLogin() {
      return this.$store.state.base.globalLogin;
    },
    // 是否需要加水印
    isWatermark() {
      const { WATER_MASK } = this.$store.state.base.globalConfig;
      const waterMask = WATER_MASK.find((item) => item.attributeKey === 'enableWaterMask') || {};
      if (!waterMask.attributeValue) return false;
      return waterMask.attributeValue === '1';
    }
  },

  methods: {
    // 点击服务
    clickAgree(e) {
      const { value } = e;
      const { globalLogin } = this;
      if (value && globalLogin.agreementUrl) {
        const arry = globalLogin.agreementUrl.split(',');
        uni.navigateTo({
          url: `/interfaceCommon/webView?url=${arry[0]}`
        });
      }
    },
    // 忘记密码
    goToForgot() {
      uni.navigateTo({
        url: '/Login/loginForgot'
      });
    },
    // 登录
    async goToLogin() {
      const { checked } = this;
      if (!checked) {
        this.$apiot.toast(this.$t('login.agreement'));
        return;
      }
      try {
        this.showLoading = true;
        await this.$refs.loginAccountForm.validate();
        this.login();
      } catch (error) {
        this.showLoading = false;
      }
    },
    successFun() {
      uni.setStorageSync('username', Encrypt(this.params.username));
      uni.setStorageSync('password', this.params.password);
      this.showLoading = false;
      this.$store.dispatch('jumpHomePage', {});
    },
    async login() {
      try {
        const params = {
          ...this.accountForm,
          password: Encrypt(this.accountForm.password)
        };
        if (this.isAssociatedUser) {
          params.zwddBindCode = this.code;
        }
        this.params = params;
        await postLoginForm(this.params);
        this.successFun();
      } catch (e) {
        console.log(e);
        if (e.data) {
          const res = e.data;
          if (e.code === 'SS002') {
            await this.$refs.apiotModal.showAsyncModal({
              content: e.message,
              title: this.$t('common.tip')
            });
            await exchangeTokenLogin({ exchangeToken: res });
            // 登录成功
            this.successFun();
          } else if (res.deploymentMode === 'single' && res.state === '1') {
            // 密码失效重置
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.passwordExpirationPrompt', {
                  name: this.accountForm.username
                }),
                title: this.$t('common.tip'),
                sureTitle: this.$t('mine.changePassword')
              });
              uni.navigateTo({
                url: '/MinePages/ChangePassword/index?source=login'
              });
            } catch (error) {
              logout();
            }
          } else if (res.deploymentMode === 'single' && res.state === '2') {
            // 密码失效不允许登录
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.passwordExpirationPrompt', {
                  name: this.accountForm.username
                }),
                showCancel: false,
                title: this.$t('common.tip')
              });
              logout();
            } catch (error) {
              console.log(error);
            }
          } else if (res.deploymentMode === 'single' && res.state === '3') {
            // 首次登录
            try {
              await this.$refs.apiotModal.showAsyncModal({
                content: this.$t('login.firstLoginPrompt'),
                title: this.$t('common.tip'),
                sureTitle: this.$t('mine.changePassword')
              });
              uni.navigateTo({
                url: '/MinePages/ChangePassword/index?source=login'
              });
            } catch (error) {
              logout();
            }
          } else {
            uni.showToast({
              icon: 'none',
              title: e.message
            });
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: e.message
          });
        }
        this.showLoading = false;
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
    font-family: $--font-family;
    color: #333333;
    line-height: 38rpx;
    height: 38rpx;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }

  &__footer {
    margin-top: 44rpx;
    text-align: center;
    .loginRule {
      margin-top: 36rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      &--title {
        display: block;
        font-size: 24rpx;
        font-family: $--font-family;
        color: #aaaaaa;
        line-height: 30rpx;
        text-align: left;
        span {
          color: #333333;
        }
      }
      ::v-deep {
        .u-checkbox__label {
          margin-right: 0;
          text-align: left;
          line-height: 30rpx;
        }
      }
    }
  }
}
</style>
