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
        </view>
      </swiper-item>
    </swiper>
    <view class="swiper-bottom">
      <view v-if="currentIndex === 2" class="experience" @tap="launchFlag()">{{
        $t(experience)
      }}</view>
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
        '../../static/guide/guide1.jpg',
        '../../static/guide/guide2.jpg',
        '../../static/guide/guide3.jpg',
      ],
      // swiperData:["../../static/guide/guide1.png","../../static/guide/guide2.png","../../static/guide/guide3.png"],
      autoplay: false,
      duration: 500,
      experience: 'lang-guide-experience-immediately', // 中文:'立即体验',
      currentIndex: 0, //当前页
      show: false,
    };
  },
  methods: {
    launchFlag: function () {
      /**
       * 向本地存储中设置launchFlag的值，即启动标识；
       */
      // #ifdef APP-PLUS || H5
      uni.setStorage({
        key: 'launchFlag',
        data: true,
      });
      uni.redirectTo({
        url: '/pages/login/login',
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
    },
  },
};
</script>
<style>
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
