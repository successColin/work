<template>
  <view class="infoStylea">
    <view class="infoStylea__title infoStylea__title--lineB">
      {{ valObj.title }}
    </view>
    <view class="infoStylea__img">
      <image v-for="(v, i) in imgArr" :key="i" :src="v" alt="" />
    </view>
    <view class="infoStylea__info">
      <div
        class="infoStylea__info--placedTop"
        v-if="valObj.isPlacedTop === 1 && isShowTop"
      >
        置顶
      </div>
      <view>{{ timeago(valObj.createTime) }}</view>
      <view class="infoStylea__info--left">浏览{{ valObj.views || 0 }}次</view>
    </view>
  </view>
</template>

<script>
import mixin from '../mixin';

export default {
  props: {
    valObj: {
      type: Object,
      default: () => {}
    },
    isShowTop: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    imgArr() {
      const arr = this.valObj.articleCover.split(',');
      return arr;
    }
  },
  mixins: [mixin]
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
