<template>
  <view class="infoStylea">
    <view class="infoStylea__title infoStylea__title--lineA">
      {{ valObj.title }}
    </view>
    <image :src="valObj.articleCover" alt="" />
    <view class="infoStylea__info">
      <view>{{ valObj.createTime && valObj.createTime.slice(0, 10) }}</view>
      <view class="infoStylea__info--left">浏览{{ valObj.views || 0 }}次</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    valObj: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../index.scss';

$--name: 'infoStylea';
@include setStyle($--name);

.infoStylea {
  &__title {
    margin-top: 26rpx;
  }
  image {
    margin-top: 25rpx;
    width: 100%;
    height: 228rpx;
  }
  &__info {
    margin: 22rpx 0 20rpx;
  }
}
</style>
