<template>
  <view class="infoStyleb">
    <view class="infoStyleb__box">
      <view class="infoStyleb__title infoStyleb__title--lineB">
        {{ valObj.title }}
      </view>
      <view class="infoStyleb__info">
        <div
          class="infoStyleb__info--placedTop"
          v-if="valObj.isPlacedTop === 1 && isShowTop"
        >
          置顶
        </div>
        <view>{{ timeago(valObj.createTime) }}</view>
        <view style="margin-left: 20rpx">浏览{{ valObj.views || 0 }}次</view>
      </view>
    </view>
    <image :src="valObj.articleCover" alt="" />
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
  mixins: [mixin]
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
  &__box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  &__info {
    margin-top: 20rpx;
    // display: flex;
  }
  &__title {
    flex: 1;
  }
}
</style>
