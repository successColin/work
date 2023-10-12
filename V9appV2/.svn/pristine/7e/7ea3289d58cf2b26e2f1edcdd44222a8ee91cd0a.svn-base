<template>
  <view class="tabClass">
    <view
      class="tabClass__item"
      v-for="(item, index) in list"
      :class="{ 'tabClass__item--active': index === current }"
      :key="index"
      @click="switchTab(index)"
    >
      {{ item }}

      <!-- 线 -->
      <div :class="{ 'tabClass__item--line': index === current }"></div>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      list: ['科技', '会议', '生产'],
      current: 0,
    };
  },
  methods: {
    switchTab(index) {
      this.current = index;
      // 向父页面回传tab索引
      this.$emit('change', index);
    },
  },
};
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import '@/static/scss/common/_function.scss';
@import '@/static/scss/common/_variable.scss';
.tabClass {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: $page-tab-height;
  line-height: $page-tab-height;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px #e0e0e0;
  display: flex;
  &__item {
    width: 50%;
    text-align: center;
    transition: all 0.3s ease-in-out;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #222222;
    position: relative;
    &--line {
      width: 20rpx;
      height: 6rpx;
      background: #cc3534;
      border-radius: 2rpx;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -10rpx;
    }
  }
  &__item--active {
    color: #cc3534;
    font-size: 36rpx;
  }
}
</style>