<!--
 * @Descripttion: 引导页
 * @Author: sss
 * @Date: 2022-01-05 14:20:13
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-05 14:20:13
-->
<template>
  <div class="guide" v-if="isShow" @touchmove.prevent>
    <div class="guide__swiper">
      <apiot-swiper
        keyName="image"
        :list="swiperData"
        :height="600"
        indicatorMode="none"
        :autoplay="false"
        imgMode="widthFix"
        @change="swiperChange"
      >
      </apiot-swiper>
    </div>
    <div class="guide__header">
      <p class="title" :class="[`themeColor__font-${getThemeIndex}`]">
        {{ titles[currentIndex].title }}
      </p>
      <p class="subtitle">{{ titles[currentIndex].sub }}</p>
    </div>
    <footer class="guide__footer">
      <div class="btn" v-if="currentIndex === swiperData.length - 1">
        <apiot-button
          type="primary"
          btnClass="primary"
          size="medium"
          shape="circle"
          @click="sure"
          >立即体验</apiot-button
        >
      </div>
      <div class="guide__footer--index" v-else>
        <view
          class="item"
          :class="[
            currentIndex === index ? `themeColor__bg-${getThemeIndex}` : '',
          ]"
          v-for="(item, index) in swiperData"
          :key="index"
        ></view>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      modalObj: {},
      swiperData: [
        '../../static/img/app/guide/guide1.png',
        '../../static/img/app/guide/guide2.png',
        '../../static/img/app/guide/guide3.png'
      ],
      titles: [
        {
          title: '信息化',
          sub: '持续提升平台信息化水平'
        },
        {
          title: '数字化',
          sub: '构建系统数字化科学体系'
        },
        {
          title: '智能化',
          sub: '实现人机智能化创新发展'
        }
      ],
      currentIndex: 0 // 当前页
    };
  },
  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },
  watch: {},
  methods: {
    swiperChange(index) {
      this.currentIndex = index;
    },
    sure() {
      this.isShow = false;
      this.modalObj.success();
    },
    // 显示
    showAsyncModal() {
      return new Promise((resolve) => {
        this.isShow = true;
        this.modalObj.success = function (res) {
          resolve(res);
        };
      });
    }
  },

  mounted() {}
};
</script>
<style lang='scss' scoped>
.guide {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
  &__swiper {
    margin-bottom: 112rpx;
  }
  &__header {
    position: absolute;
    top: 151rpx;
    left: 0;
    right: 0;
    text-align: center;
    font-family: $--font-family;
    .title {
      font-weight: 600;
      font-size: 48rpx;
    }
    .subtitle {
      color: #444444;
      font-size: 30rpx;
    }
  }
  &__footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 150rpx;
    .btn {
      margin: auto;
      width: 240rpx;
      height: 84rpx;
    }
    &--index {
      text-align: center;
      .item {
        margin-right: 12rpx;
        display: inline-block;
        width: 38rpx;
        height: 6rpx;
        background: #ebebeb;
        border-radius: 3rpx;
      }
    }
  }
  &.bottom {
    .prompt__wrap {
      padding: 0;
      align-items: flex-end;
      &__content {
        border-radius: 30rpx 30rpx 0 0;
      }
      &--button {
        box-sizing: border-box;
        padding: 0 30rpx;
        margin-bottom: 19rpx;
        box-shadow: none;
        font-size: 30rpx;
        font-family: $--font-family;
        font-weight: 400;
        color: #333333;
        letter-spacing: 1px;
        .button {
          height: 72rpx;
          line-height: 72rpx;
          border-radius: 12rpx;
          &.sure {
            margin-left: 24rpx;
          }
        }
      }
    }
  }
  &__layout {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    inset: 0px;
    z-index: 1170;
    background-color: rgba(0, 0, 0, 0.3);
  }
  &__wrap {
    width: 100%;
    height: 100vh;
    padding: 0 70rpx;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0px;
    z-index: 1175;
    box-sizing: border-box;
    &__content {
      width: 100%;
      padding-top: 18rpx;
      background: #ffffff;
      border-radius: 18rpx;
      overflow: hidden;
      transition-duration: 300ms;
      transition-timing-function: ease-out;
    }
    &--title {
      padding: 0 30rpx;
      flex-shrink: 0;
      margin-top: 42rpx;
      font-size: 34rpx;
      color: #333333;
      &--title {
        width: 100%;
        text-align: center;
      }
    }
    &--content {
      padding: 0 30rpx;
      margin-top: 20rpx;
      flex-shrink: 0;
      color: #808080;
      text-align: center;
      font-size: 28rpx;
    }
    &--button {
      flex-shrink: 0;
      width: 100%;
      margin-top: 60rpx;

      // border-top: 1px solid #e9e9e9;
      font-size: 30rpx;
      display: flex;
      .button {
        box-shadow: inset 0 1rpx 0 0 #e9e9e9;
        display: inline-block;
        flex: 1;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        color: #333333;
      }
      .sure {
        color: #ffffff;
      }
    }
  }
}
.prompt__wrap--content--title {
  word-break: break-all;
}
</style>
