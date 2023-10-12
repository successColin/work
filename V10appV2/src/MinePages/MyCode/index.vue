<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 二维码页面
-->
<template>
  <view class="code">
    <apiot-navbar :title="$t('mine.basicInfo')" v-if="!hasDing"></apiot-navbar>
    <view class="code__content">
      <view class="code__content__info">
        <user-icon class="user_image" :userInfo="userInfo"></user-icon>
        <view class="name">{{ userInfo.username }}</view>
        <view class="signature">{{ userInfo.signature }}</view>
        <view class="code">
          <i class="horn1"></i>
          <i class="horn2"></i>
          <tki-qrcode
            class="tki"
            cid="myQR"
            ref="myQR"
            :val="userInfo.account"
            :onval="true"
            :loadMake="true"
            :usingComponents="true"
            :size="260"
            @result="qrR"
          />
        </view>
        <view class="tip">{{ $t('mine.userScan') }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode';
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';

export default {
  components: { UserIcon, tkiQrcode },

  props: {},

  data() {
    return {
      src: '',
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
    qrR(res) {
      this.src = res;
    }
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
      title: this.$t('mine.basicInfo')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.code {
  height: 100vh;
  background: #f6f6f8;
  &__content {
    width: 100%;
    padding: 170rpx 50rpx;
    &__info {
      width: 650rpx;
      padding: 80rpx 0rpx 110rpx 0;
      background: #ffffff;
      position: relative;
      box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
      border-radius: 14rpx;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      .user_image {
        transform: translate(-50%, -50%);
        background: transparent;
        text-align: center;
        display: flex;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 50%;
      }
      .name {
        color: #222222;
        font-size: 36rpx;
        line-height: 50rpx;
        @include fontBlob(500);
      }
      .signature {
        font-size: 26rpx;
        color: #888888;
        line-height: 44rpx;
      }
      .code {
        width: 320rpx;
        height: 320rpx;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        margin-top: 50rpx;
        border: 1rpx solid #e9e9e9;
        position: relative;
        .tki {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .horn1 {
          &::before {
            content: '';
            display: inline-block;
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            top: 18rpx;
            left: 18rpx;
            border-left: 6rpx solid #4689f5;
            border-top: 6rpx solid #4689f5;
            box-sizing: border-box;
          }
          &::after {
            content: '';
            display: inline-block;
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            bottom: 18rpx;
            left: 18rpx;
            border-left: 6rpx solid #4689f5;
            border-bottom: 6rpx solid #4689f5;
            box-sizing: border-box;
          }
        }
        .horn2 {
          &::before {
            content: '';
            display: inline-block;
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            right: 18rpx;
            top: 18rpx;
            border-right: 6rpx solid #4689f5;
            border-top: 6rpx solid #4689f5;
            box-sizing: border-box;
          }
          &::after {
            content: '';
            display: inline-block;
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            bottom: 18rpx;
            right: 18rpx;
            border-right: 6rpx solid #4689f5;
            border-bottom: 6rpx solid #4689f5;
            box-sizing: border-box;
          }
        }
      }
      .tip {
        color: #888888;
        font-size: 26rpx;
        line-height: 38rpx;
        margin-top: 30rpx;
      }
    }
  }
}
</style>
