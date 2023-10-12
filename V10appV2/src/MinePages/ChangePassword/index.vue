<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 二维码页面
-->
<template>
  <view class="password">
    <apiot-navbar
      @navBack="navBack"
      v-if="!hasDing"
      :title="$t('mine.changePassword')"
    ></apiot-navbar>
    <view class="password__content">
      <view class="password__content__tip">
        <view class="tip-icon">
          <i class="appIcon appIcon-xiugaimimatishi"></i>
        </view>
        <view class="tip-content">
          <p class="title">{{ $t('mine.accountPasswordModificationTips') }}</p>
          <p class="content">
            {{ $t('mine.passwordTips') }}
          </p>
        </view>
      </view>
      <view class="password__content__item form hasBorder">
        <u-form
          labelPosition="top"
          :model="passwordForm"
          ref="passwordForm"
          labelWidth="100%"
        >
          <u-form-item
            class="form--item"
            prop="oldPassword"
            :label="$t('mine.oldPassword')"
          >
            <form-item-password
              v-model="passwordForm.oldPassword"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('mine.oldPassword'),
                })
              "
            ></form-item-password>
          </u-form-item>
          <u-form-item
            class="form--item"
            prop="password"
            :label="$t('mine.newPassword')"
          >
            <form-item-password
              v-model="passwordForm.password"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('mine.newPassword'),
                })
              "
            ></form-item-password>
          </u-form-item>
          <u-form-item
            class="form--item"
            prop="confirmPassword"
            :label="$t('mine.confirmPassword')"
          >
            <form-item-password
              v-model="passwordForm.confirmPassword"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('mine.newPassword'),
                })
              "
            ></form-item-password>
          </u-form-item>
        </u-form>
      </view>
    </view>
    <view class="password__foot">
      <apiot-button
        class="sure"
        type="primary"
        shape="circle"
        :loading="isSubmit"
        @click="changePassword"
      >
        <i class="appIcon appIcon-zhengchang"></i>
        {{ $t('mine.confirmModification') }}</apiot-button
      >
    </view>
  </view>
</template>

<script>
import FormItemPassword from './FormItemPassword';
import { editUserPassword, logout } from '@/api/mine';
import { Encrypt } from '@/utils';

export default {
  components: { FormItemPassword },

  props: {},

  data() {
    return {
      passwordForm: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      isSubmit: false,
      source: null,
      hasDing: false
      // userInfo: {}
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  methods: {
    async changePassword() {
      try {
        if (this.isSubmit) return;
        if (
          !this.passwordForm.oldPassword ||
          !this.passwordForm.password ||
          !this.passwordForm.confirmPassword
        ) {
          uni.showToast({
            title: this.$t('placeholder.pleaseEnterAny', { any: this.$t('common.password') }),
            duration: 500,
            icon: 'none'
          });
          return;
        }
        if (
          this.passwordForm.oldPassword === this.passwordForm.password ||
          this.passwordForm.oldPassword === this.passwordForm.confirmPassword
        ) {
          uni.showToast({
            title: '新密码跟原密码不能相同',
            duration: 500,
            icon: 'none'
          });
          return;
        }
        this.isSubmit = true;
        const param = {
          oldPassword: Encrypt(this.passwordForm.oldPassword),
          password: Encrypt(this.passwordForm.password),
          confirmPassword: Encrypt(this.passwordForm.confirmPassword)
        };
        // const str = `${this.$t('userCenter.changePassword')}`;
        // param.logData = str;
        await editUserPassword(param);
        this.isSubmit = false;
        uni.showToast({
          title: this.$t('common.successfullyModified'),
          duration: 1000,
          icon: 'none'
        });
        setTimeout(() => {
          uni.removeStorageSync('token');
          uni.removeStorageSync('password');
          logout();
          uni.reLaunch({ url: '/Login/index' });
        }, 500);
      } catch (error) {
        this.isSubmit = false;
        if (error.message) {
          uni.showToast({
            title: error.message,
            duration: 1000,
            icon: 'none'
          });
        }
      }
    },
    navBack() {
      if (this.source) {
        logout();
        setTimeout(() => {
          uni.reLaunch({ url: '/Login/index' });
        }, 50);
      }
    }
  },
  mounted() {},
  onLoad(option) {
    this.source = option.source;
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
  },

  onShow() {},

  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('mine.changePassword')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.password {
  height: 100vh;
  background: #f6f6f8;
  &__content {
    width: 100%;
    padding: 25rpx 30rpx;
    background: #ffffff;
    box-sizing: border-box;
    padding-bottom: 0;
    &__tip {
      width: 690rpx;
      padding: 30rpx;
      background: #f6f6f8;
      border-radius: 14rpx;
      box-sizing: border-box;
      display: flex;
      .tip-icon {
        width: 94rpx;
        height: 100%;
        flex-shrink: 0;
        .appIcon {
          font-size: 68rpx;
          color: #34c7be;
        }
      }
      .tip-content {
        flex: 1;
        .title {
          font-size: 34rpx;
          color: #333333;
          line-height: 52rpx;
        }
        .content {
          font-size: 24rpx;
          color: #9b9b9b;
          line-height: 38rpx;
        }
      }
    }
  }
  &__foot {
    width: 100%;
    height: 148rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    .sure {
      width: 100%;
      height: 100%;
      border-radius: 44rpx;
      border: none;
      line-height: 88rpx;
      font-size: 28rpx;
      background: #4689f5;
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
      color: #ffffff;
      .appIcon {
        margin-right: 14rpx;
        font-size: 34rpx;
        display: inline-block;
      }
    }
  }
}
</style>
