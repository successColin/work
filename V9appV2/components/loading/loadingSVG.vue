<template>
  <view class="animated fadeInDown loadingSVG">
    <image
      src="@/static/images/svg/tail-spin.svg"
      style="width: 25px; height: 25px"
      mode="aspectFill"
    ></image
    >{{ loadingTitle || $t('page-more')
    }}<!-- 中文：加载更多 -->
  </view>
</template>

<script>
export default {
  name: 'mLodingSvg',
  props: {
    loadingTitle: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped>
.loadingSVG {
  text-align: center;
  color: #808080;
  font-size: 20rpx;
}
</style>
