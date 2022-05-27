<!--
 * @Author: sss
 * @Date: 2022-03-04 09:52:48
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-04 09:52:48
 * @Desc: 无数据控件
-->
<template>
  <view class="nodata">
    <image
      src="~@/static/img/common/nodata.svg"
      class="nodata__img"
      style="width: 200rpx; height: 200rpx"
    ></image>
    <span class="nodata__text">{{ $t('common.noData') }}</span>
  </view>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.nodata {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__text {
    display: inline-block;
    padding-top: 30rpx;
    font-size: 14px;
    color: #333333;
  }
}
</style>
