<!--
 * @Author: sss
 * @Date: 2021-09-08 15:17:11
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-08 15:17:11
 * @Desc: 顶部导航栏
-->
<template>
  <view>
    <view
      class="apiotNavbar"
      :class="[
        showBackbtn ? '' : 'hasNoBack',
        navStyle === 'theme'
          ? `hasTheme themeColor__bg-${getThemeIndex} `
          : 'bottomLine',
      ]"
    >
      <!-- #ifndef MP-ALIPAY -->
      <status-bar></status-bar>
      <!-- #endif -->
      <div class="apiotNavbar__inner">
        <div class="apiotNavbar__left">
          <div
            class="apiotNavbar__back"
            @click="navbarBack()"
            v-if="showBackbtn"
          >
            <i class="appIcon appIcon-fanhuijiantou"></i>
          </div>
          <slot name="left"></slot>
        </div>
        <div class="apiotNavbar__content"><slot name="content"></slot></div>
        <div class="apiotNavbar__content--title" v-if="title">{{ title }}</div>
        <div class="apiotNavbar__right">
          <slot name="right"></slot>
        </div>
      </div>
    </view>
    <!-- #ifndef MP-ALIPAY -->
    <status-bar></status-bar>
    <!-- #endif -->
    <view class="apiotNavbar--placeholder"></view>
  </view>
</template>

<script>
import StatusBar from './StatusBar.vue';

export default {
  components: { StatusBar },

  props: {
    // 顶部导航栏样式;normal-正常样式,theme-主题色颜色
    navStyle: {
      type: String,
      default: 'normal'
    },
    // 是否有返回按钮
    showBackbtn: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    titlePosition: {
      type: String,
      default: ''
    },
    // 顶部导航栏是否有下划线
    hasBottomLine: {
      type: Boolean,
      default: true
    },
    // 返回等级 1:返回上一页
    backLevel: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {};
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    // 按钮返回
    navbarBack() {
      uni.navigateBack({
        delta: this.backLevel
      });

      this.$emit('navBack');
    }
  },

  mounted() {
    const { navStyle } = this;
    if (navStyle === 'normal') {
      // #ifdef APP
      plus.navigator.setStatusBarStyle('dark');
      // #endif
    }
  }
};
</script>

<style lang='scss' scoped>
.apiotNavbar--placeholder {
  width: 100%;
  height: $navbar-height;
}
.apiotNavbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  color: #333333;
  font-size: 18px;
  @include fontBlob(500);
  background: #ffffff;
  z-index: 100;

  &.bottomLine {
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  }
  &.hasNoBack {
    padding-left: 30rpx;
    .apiotNavbar__content--title {
      justify-content: space-between;
      padding: 0;
    }
  }
  &.hasTheme {
    color: #ffffff;
  }
  &__inner {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: $navbar-height;
    line-height: $navbar-height;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    &--title {
      padding: 0 30rpx;
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: absolute;
      left: 0;
      right: 0;
      height: 21px;
      text-align: center;
      font-size: 36rpx;
      @include fontBlob(500);
    }
  }
  &__left {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    flex-grow: 0;
    z-index: 10;
  }
  &__right {
    box-sizing: border-box;
    z-index: 10;
  }

  &__back {
    padding: 0 10rpx 0 30rpx;
    font-size: 30rpx;
    @include fontBlob(500);
  }
}
</style>
