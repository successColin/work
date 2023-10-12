<template>
  <view class="noData">
    <!-- <image src="@/static/images/nodata1.png" class="noDateImg" mode="widthFix"></image> -->
    <view class="name">暂无数据</view>
  </view>
</template>

<script>
</script>

<style lang="scss" scoped>
@charset "utf-8";
// @import "@/static/scss/common/_function.scss";
// @import "@/static/scss/common/_variable.scss";
.noData{
  width: 100%;
  height: calc(100% - 88rpx - var(--status-bar-height));
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // position: relative;
  // top: - pxToREM(80);
  .noDateImg {
    width: 290;
  }
  .name {
    font-size: 28rpx;
    color: #9B9B9B;
    width: 100%;
    text-align: center;
  }
  .name {
    position: relative;
    top: - 40rpx;
  }
}
</style>
