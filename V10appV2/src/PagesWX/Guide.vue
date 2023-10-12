<template>
  <view class="content">
    <swiper
      class="swiper"
      :autoplay="autoplay"
      :duration="duration"
      @change="swiperChange"
    >
      <swiper-item v-for="(item, index) in swiperData" :key="index">
        <view class="swiper-item">
          <view class="swiper-item-img"
            ><image :src="item" mode="aspectFit"></image
          ></view>
          <view class="tips" v-if="currentIndex === 0">
            <view>先注册,再完善</view>
            <view class="other-tips">垃圾分类共筑美好家园</view>
          </view>
          <view class="tips" v-if="currentIndex === 1">
            <view>到站点,给评分</view>
            <view class="other-tips">二维码扫一扫</view>
          </view>
          <view class="tips" v-if="currentIndex === 2">
            <view>到商店,再换购</view>
            <view class="other-tips">积分换购</view>
          </view>
          <view class="tips" v-if="currentIndex === swiperData.length - 1">
            <view>垃圾分类,积分换购</view>
            <view>站点评分,到店换购</view>
            <view class="other-tips">仅公众需注册(监测员/商户请使用APP)</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="swiper-bottom">
      <block v-if="currentIndex === swiperData.length - 1">
        <view class="experience" @tap="launchFlag()">{{ experience }}</view>
      </block>
      <block v-else>
        <view
          class="swiper-index"
          :class="{ current: currentIndex === index }"
          v-for="(item, index) in swiperData"
          :key="index"
        ></view>
      </block>
    </view>
    <show-power v-if="show" @show="powerShow"></show-power>
  </view>
</template>

<script>
import showPower from './showPower.vue';

export default {
  components: { showPower },
  data() {
    return {
      background: ['color1', 'color2', 'color3'],
      swiperData: [
        './images/guide1.png',
        './images/guide2.png',
        './images/guide3.png',
        './images/guide4.png'
      ],
      autoplay: false,
      duration: 500,
      jumpover: '跳过',
      experience: '立即注册',
      currentIndex: 0, // 当前页
      show: false
    };
  },
  methods: {
    launchFlag() {
      /**
       * 向本地存储中设置launchFlag的值，即启动标识；
       */
      // #ifdef APP-PLUS || H5
      uni.setStorage({
        key: 'launchFlag',
        data: true
      });
      uni.redirectTo({
        url: '/pages/login/login'
      });
      // #endif
      // #ifdef MP-WEIXIN
      this.powerShow();
      // #endif
    },
    swiperChange(event) {
      this.currentIndex = event.detail.current;
    },
    powerShow() {
      this.show = !this.show;
    }
  }
};
</script>
<style>
.tips {
  position: absolute;
  bottom: 30upx;
  width: 100%;
  font-size: 32upx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(68, 68, 68, 1);
  letter-spacing: 2px;
}
.other-tips {
  font-size: 28upx;
  color: rgba(198, 33, 39, 1);
}
page,
.content {
  width: 100%;
  height: 100%;
  background: #fff;
  background-size: 100% auto;
  padding: 0;
}
.swiper-bottom {
  text-align: center;
}
.swiper-index {
  display: inline-block;
  width: 38upx;
  height: 6upx;
  background: rgba(235, 235, 235, 1);
}
.swiper-index.current {
  background: rgba(198, 33, 39, 1);
}
.swiper-index:nth-child(2) {
  margin: 0 12upx;
}
.swiper {
  width: 100%;
  height: 85%;
  background: #ffffff;
}
.swiper-item {
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  flex-direction: column-reverse;
}
.swiper-item-img {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.swiper-item-img image {
  width: 100%;
  height: 100%;
}
.uniapp-img {
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.uniapp-img image {
  width: 40%;
}

.experience {
  position: absolute;
  right: 50%;
  height: 88upx;
  line-height: 88upx;
  padding: 0 40upx;
  margin-right: -105upx;
  border-radius: 44upx;
  font-size: 30upx;
  color: rgba(198, 33, 39, 1);
  border: 1px solid rgba(198, 33, 39, 1);
  z-index: 999;
}
</style>
