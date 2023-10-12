<template>
  <view class="infoStylea">
    <view class="infoStylea__title infoStylea__title--lineB">
      {{ valObj.title }}
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
  computed: {},
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
  &__info {
    margin: 22rpx 0 20rpx;
  }
}
</style>
