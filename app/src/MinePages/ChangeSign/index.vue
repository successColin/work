<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 二维码页面
-->
<template>
  <view class="telephone">
    <apiot-navbar :title="$t('mine.changeSign')"></apiot-navbar>
    <view class="telephone__content">
      <view class="item">
        <apiot-input
          v-model="signature"
          border="none"
          :maxlength="20"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('mine.name'),
            })
          "
        ></apiot-input>
        <view class="count">{{signature.length || 0}}/20</view>
      </view>
    </view>
    <view class="telephone__foot">
      <button class="sure" @click="changeTelephone" :loading="isSubmit">
        <i class="appIcon appIcon-zhengchang"></i>
        确定修改
      </button>
    </view>
  </view>
</template>

<script>
import { editUserSignature } from '@/api/mine';
import { getPersonalCenterUser } from '@/api/userCenter';

export default {
  components: {},

  props: {},

  data() {
    return {
      signature: '',
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
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    async changeTelephone() {
      try {
        if (this.isSubmit) return;
        this.isSubmit = true;
        if (!this.signature) {
          uni.showToast({
            title: this.$t('placeholder.pleaseEnterAny', { any: this.$t('mine.name') }),
            duration: 500,
            icon: 'none'
          });
          return;
        }
        const param = {
          signature: this.signature
        };
        await editUserSignature(param);
        this.isSubmit = false;
        uni.showToast({
          title: this.$t('common.successfullyModified'),
          duration: 1000
        });
        this.getUserCenterInfo();
        setTimeout(() => {
          uni.navigateBack();
        }, 500);
        // uni.removeStorageSync('token');
        // uni.removeStorageSync('password');
        // uni.reLaunch({ url: '/pages/Login/index' });
      } catch (error) {
        this.isSubmit = false;
        if (error.name) {
          uni.showToast({
            title: error.name,
            duration: 1000
          });
        }
      }
    },
    switchPassword() {
      this.changeByPassword = !this.changeByPassword;
    }
  },
  mounted() {
    this.signature = this.userInfo.signature;
  },
  onLoad() {},

  onShow() {},

  onReady() {}
};
</script>

<style lang='scss' scoped>
.telephone {
  height: 100vh;
  background: #f6f6f8;
  &__content {
    width: 100%;
    padding: 0rpx 30rpx;
    background: #ffffff;
    box-sizing: border-box;
    padding-bottom: 0;
    .item{
      height: 110rpx;
      box-shadow: inset 0px -2rpx 0px 0px #E9E9E9;
      position: relative;
      .apiotInput{
        height: 100%;
        box-sizing: border-box;
      }
      .count{
        position: absolute;
        right: 0rpx;
        top: 0;
        height: 110rpx;
        line-height: 110rpx;
        width: 60rpx;
        text-align: right;
        color: #808080;
        font-size: 26rpx;
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
    .input-placeholder{
      font-size: 32rpx;
      color: #C1C1C1;
    }
  }
}
</style>
