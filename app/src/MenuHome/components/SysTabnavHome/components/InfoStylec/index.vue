<template>
  <view class="infoStylea">
    <view class="infoStylea__title infoStylea__title--lineA">
      {{ valObj.title }}
    </view>
    <view class="infoStylea__img">
      <image v-for="(v, i) in imgArr" :key="i" :src="v" alt="" />
    </view>
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
  },
  computed: {
    imgArr() {
      const arr = this.valObj.articleCover.split(',');
      return arr;
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
  &__img {
    margin-top: 36rpx;
    display: flex;
    justify-content: space-between;
  }
  image {
    width: 30%;
    height: 139rpx;
  }
  &__info {
    margin: 22rpx 0 20rpx;
  }
}
</style>
