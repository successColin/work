<template>
  <view class="infoStyleb">
    <view style="flex: 1">
      <view class="infoStyleb__title infoStyleb__title--lineB">
        {{ valObj.title }}
      </view>
      <view class="infoStyleb__info">
        <view>{{ valObj.createTime && valObj.createTime.slice(0, 10) }}</view>
        <view style="margin-left: 20rpx">浏览{{ valObj.views || 0 }}次</view>
      </view>
    </view>
    <image :src="valObj.articleCover" alt="" />
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

$--name: 'infoStyleb';
@include setStyle($--name);

.infoStyleb {
  display: flex;
  padding: 30rpx 0;
  image {
    width: 228rpx;
    height: 139rpx;
    margin-left: 30rpx;
  }
  &__info {
    margin-top: 20rpx;
  }
}
</style>
