<!--
 * @Author: sss
 * @Date: 2022-08-09 11:12:59
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-09 11:12:59
 * @Desc: 公告
-->
<template>
  <view class="notice">
    <view class="notice__left">
      <!-- <i class="appIcon appIcon-gonggao"></i> -->
      <gradient-icon
        icon="appIcon-gonggao"
        iconfont="appIcon"
        :size="50"
        color="#4689f5"
        :enableGradient="1"
        :gradientObj="{ color1: '#7ce2fb', color2: '#4689f5' }"
      ></gradient-icon>
    </view>
    <view class="notice__content">
      <u-notice-bar
        :text="text"
        :direction="config.rotateType === 1 ? 'row' : 'column'"
        :step="config.rotateType === 1 ? true : false"
        :duration="config.rotateSpeed * 1000"
        @click="goToNoticeDetail"
        color="#333333"
        bgColor="#ffffff"
        icon=""
      ></u-notice-bar>
    </view>
    <view class="notice__right" @click="goToNoticeList">
      <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
    </view>
  </view>
</template>

<script>
import GradientIcon from '../GradientIcon';

export default {
  components: { GradientIcon },

  props: {
    list: Array,
    // 滚动速度
    rotateSpeed: {
      type: Number,
      default: 5
    },
    // 滚动类型1=横向；2=纵向
    rotateType: {
      type: Number,
      default: 1
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      currentNum: null
    };
  },

  computed: {
    text() {
      const list = this.list.map((item) => item.title);
      return list;
    }
  },

  methods: {
    // 点击
    goToNoticeDetail(index) {
      uni.navigateTo({
        url: `/Notice/NoticeDetail/index?id=${this.list[index].id}`
      });
    },
    goToNoticeList() {
      uni.navigateTo({
        url: '/Notice/NoticeList/index'
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.notice {
  width: 100%;
  height: 80rpx;
  background: #ffffff;
  box-shadow: 0px 0px 10rpx 0px rgba(0, 0, 0, 0.14);
  border-radius: 14rpx;
  display: flex;
  padding: 15rpx 12rpx;
  align-items: center;
  box-sizing: border-box;
  margin-top: 6rpx;
  margin-bottom: 10rpx;
  &__left {
    width: 50rpx;
    height: 50rpx;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    // .appIcon {
    //   font-size: 50rpx;
    //   -webkit-background-clip: text;
    //   -webkit-text-fill-color: transparent;
    //   background-image: linear-gradient(180deg, #7ce2fb 0%, #4689f5 100%);
    // }
  }
  &__right {
    width: 38rpx;
    height: 38rpx;
    flex-shrink: 0;
    .appIcon {
      font-size: 38rpx;
      color: #bbc3cd;
    }
  }
  &__content {
    flex: 1;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>
