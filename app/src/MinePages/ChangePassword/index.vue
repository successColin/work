<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 二维码页面
-->
<template>
  <view class="password">
    <apiot-navbar :title="$t('mine.changePassword')"></apiot-navbar>
    <view class="password__content">
      <view class="password__content__tip">
        <view class="tip-icon">
          <i class="appIcon appIcon-xiugaimimatishi"></i>
        </view>
        <view class="tip-content">
          <p class="title">账户密码修改提示</p>
          <p class="content">
            密码6～18位数，为保证更高的安全性，至少由数字、大小写字母、标点符号三种组成！
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
      <button class="sure" @click="changePassword" :loading="isSubmit">
        <i class="appIcon appIcon-zhengchang"></i>
        确定修改
      </button>
    </view>
  </view>
</template>

<script>
import FormItemPassword from './FormItemPassword';
import { editUserPassword } from '@/api/mine';
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
        this.isSubmit = true;
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
        const param = {
          oldPassword: Encrypt(this.passwordForm.oldPassword),
          password: Encrypt(this.passwordForm.password),
          confirmPassword: Encrypt(this.passwordForm.confirmPassword)
        };
        // const str = `${this.$t('userCenter.changePassword')}`;
        // param.logData = str;
        console.log(param);
        await editUserPassword(param);
        this.isSubmit = false;
        uni.showToast({
          title: this.$t('common.successfullyModified'),
          duration: 1000
        });
        setTimeout(() => {
          uni.removeStorageSync('token');
          uni.removeStorageSync('password');
          uni.reLaunch({ url: '/pages/Login/index' });
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
  },
  mounted() {
  },
  onLoad() {},

  onShow() {},

  onReady() {}
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
