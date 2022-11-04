<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 二维码页面
-->
<template>
  <view class="telephone">
    <apiot-navbar :title="$t('mine.changeEmail')"
      v-if="!hasDing"></apiot-navbar>
    <view class="telephone__content">
      <view class="telephone__content__tip">
        <view class="tip-icon">
          <i class="appIcon appIcon-guanyubanben"></i>
        </view>
        <view class="tip-content">
          <p class="content">
            {{$t('mine.codeTip1')}}
            <view class="switch"
              @click="switchPassword">
              {{changeByPassword ? $t('mine.checkEmail') : $t('mine.checkPassword')}}</view>
              {{$t('mine.codeTip2')}}
          </p>
        </view>
      </view>
      <view class="telephone__content__item form hasBorder">
        <u-form
          labelPosition="top"
          :model="telephoneForm"
          ref="telephoneForm"
          labelWidth="100%"
        >
          <u-form-item
            class="form--item"
            prop="oldEmail"
            :label="$t('mine.currentEmail')"
          >
            <apiot-input
              v-model="telephoneForm.oldEmail"
              border="none"
              :disabled="true"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('mine.currentEmail'),
                })
              "
            ></apiot-input>
          </u-form-item>
          <!-- 密码 -->
          <u-form-item
            class="form--item"
            prop="password"
            :label="$t('login.password')"
            v-if="changeByPassword"
          >
            <form-item-password
              v-model="telephoneForm.password"
              :placeholder="
                $t('placeholder.pleaseEnterAny', { any: $t('login.password') })
              "
            ></form-item-password>
          </u-form-item>
          <!-- 验证码 -->
          <u-form-item
            class="form--item"
            prop="oldMessageVerifyCode"
            :label="$t('mine.verificationCode')"
            v-else
          >
            <input-getcode
              v-model.number="telephoneForm.oldMessageVerifyCode"
              prependWidth="0"
              slotType="suffix"
              :account="telephoneForm.oldEmail"
              verifyType="REPLACE_EMAIL"
              messageType="EMAIL"
            ></input-getcode>
          </u-form-item>
          <!-- 新手机号 -->
          <u-form-item
            class="form--item"
            prop="email"
            :label="$t('mine.newEmail')"
          >
            <apiot-input
              v-model="telephoneForm.email"
              border="none"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('mine.newEmail'),
                })
              "
            ></apiot-input>
          </u-form-item>
          <!-- 验证码 -->
          <u-form-item
            class="form--item"
            prop="messageVerifyCode"
            :label="$t('mine.verificationCode')"
          >
            <input-getcode
              v-model.number="telephoneForm.messageVerifyCode"
              prependWidth="0"
              slotType="suffix"
              :account="telephoneForm.email"
              verifyType="REPLACE_EMAIL"
              messageType="EMAIL"
            ></input-getcode>
          </u-form-item>
        </u-form>
      </view>
    </view>
    <view class="telephone__foot">
      <apiot-button
        class="sure"
        type="primary"
        shape="circle"
        :loading="isSubmit"
        @click="changeTelephone"
        >
        <i class="appIcon appIcon-zhengchang"></i>
        {{$t('mine.confirmModification')}}</apiot-button
      >
    </view>
  </view>
</template>

<script>
import FormItemPassword from './FormItemPassword';
import { editUserEmail } from '@/api/mine';
import { getPersonalCenterUser } from '@/api/userCenter';
import { Encrypt } from '@/utils';
import InputGetcode from './InputGetcode';

export default {
  components: { FormItemPassword, InputGetcode },

  props: {},

  data() {
    return {
      telephoneForm: {
        oldEmail: '',
        email: '',
        oldMessageVerifyCode: '',
        messageVerifyCode: '',
        password: '',
      },
      isSubmit: false,
      changeByPassword: true,
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
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    async changeTelephone() {
      try {
        if (this.isSubmit) return;
        this.isSubmit = true;
        if (
          !this.telephoneForm.email ||
          !this.telephoneForm.messageVerifyCode ||
          (!this.telephoneForm.password && !this.telephoneForm.oldMessageVerifyCode)
        ) {
          uni.showToast({
            title: this.$t('placeholder.pleaseEnterAny', { any: this.$t('mine.fullInformation') }),
            duration: 500,
            icon: 'none'
          });
          return;
        }
        const param = {
          ...this.telephoneForm,
          password: Encrypt(this.telephoneForm.password)
        };
        await editUserEmail(param);
        uni.showToast({
          title: this.$t('common.successfullyModified'),
          duration: 1000
        });
        this.getUserCenterInfo();
        setTimeout(() => {
          uni.navigateBack();
          this.isSubmit = false;
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
    switchPassword() {
      this.changeByPassword = !this.changeByPassword;
    }
  },
  mounted() {
    this.telephoneForm.oldEmail = this.userInfo.email;
  },
  onLoad() {
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
  },

  onShow() {},

  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('mine.changeEmail')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.telephone {
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
      padding: 0 30rpx;
      height: 88rpx;
      background: #f6f6f8;
      border-radius: 14rpx;
      box-sizing: border-box;
      display: flex;
      .tip-icon {
        width: 94rpx;
        height: 100%;
        flex-shrink: 0;
        padding: 10rpx 0;
        .appIcon {
          font-size: 68rpx;
          color: #34c7be;
        }
      }
      .tip-content {
        flex: 1;
        line-height: 88rpx;
        .content {
          font-size: 24rpx;
          color: #9b9b9b;
          .switch {
            color: #4689F5;
            display: inline-block;
          }
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
  ::v-deep{
    .u-form-item__body__left__content__label{
      font-size: 28rpx;
      color: #555555;
    }
  }
}
</style>
