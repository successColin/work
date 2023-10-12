<!--
 * @Descripttion: Popup 弹出层
 * @Author: ytx
 * @Date: 2022-02-21 09:29:10
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-21 09:29:10
-->
<template>
  <u-popup
    :mode="mode"
    :show="show"
    :round="10"
    @open="open"
    @close="close"
    class="apiotPopup"
  >
    <div v-show="title" class="apiotPopup__title">{{ title }}</div>
    <view>
      <slot />
    </view>
  </u-popup>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'bottom'
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    open() {
      this.$emit('open');
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>
<style lang='scss' scoped>
.apiotPopup {
  &__title {
    margin-top: 30rpx;
    margin-left: 30rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    @include fontBlob(500);
    color: #333333;
  }
}
</style>
