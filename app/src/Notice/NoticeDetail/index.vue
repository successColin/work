<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 基本信息页面
-->
<template>
  <view class="notice">
    <apiot-navbar
      v-if="!hasDing"
      :title="$t('message.announceDetail')"
    ></apiot-navbar>
    <view class="notice__content">
      <view class="notice__content__title">
        {{ notice.title }}
      </view>
      <view class="notice__content__info">
        <span>{{ notice.createTime }}</span>
      </view>
      <view class="notice__content__article">
        <rich-text :nodes="notice.html"></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
import { getAnnounceDetail } from '@/api/menuConfig';

export default {
  components: {},

  props: {},

  data() {
    return {
      noticeId: '',
      notice: {},
      uploading: false,
      hasDing: false
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  methods: {
    async getAnnounceDetail() {
      try {
        this.uploading = true;
        const res = await getAnnounceDetail({ id: this.noticeId, userId: this.userInfo.id });
        this.notice = res;
        this.uploading = false;
      } catch (e) {
        this.uploading = false;
        console.error(e);
      }
    }
  },

  onLoad(option) {
    this.noticeId = option.id;
    this.getAnnounceDetail();
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
  },

  onShow() {},

  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('message.announceDetail')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.notice {
  height: 100vh;
  background: #f6f6f8;
  display: flex;
  flex-direction: column;
  &__content {
    width: 100%;
    box-sizing: border-box;
    padding: 10rpx 30rpx;
    flex: 1;
    background: #ffffff;
    padding-top: 20rpx;
    &__title {
      font-size: 36rpx;
      line-height: 50rpx;
      color: #222222;
      @include fontBlob(500);
    }
    &__info {
      font-size: 24rpx;
      color: #aaaaaa;
      line-height: 33rpx;
      margin: 20rpx 0;
    }
    &__info {
      font-size: 24rpx;
      color: #aaaaaa;
      line-height: 33rpx;
      margin: 20rpx 0;
    }
    &__article {
      color: #222222;
      line-height: 40rpx;
      font-size: 28rpx;
      ::v-deep {
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
