<template>
  <view class="tabs">
    <u-tabs
      :list="list"
      :inactiveStyle="inactiveStyle"
      :itemStyle="itemStyle"
      :lineColor="themeColor"
      :activeStyle="{
        color: themeColor,
        lineHeight: '80rpx',
        padding: '0 10rpx',
      }"
      @change="change"
    ></u-tabs>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    inactiveStyle() {
      return {
        // fontSize: '28rpx',
        color: '#333333',
        lineHeight: '40px',
        padding: '0 10rpx'
      };
    },
    itemStyle() {
      return {
        fontFamily: 'PingFangSC-Medium, PingFang SC',
        fontWeight: '600'
      };
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    change(item) {
      this.$emit('change', item);
    }
  }
};
</script>
<style lang='scss' scoped>
.tabs {
  border-bottom: 1px solid #e9e9e9;
  height: 82rpx;
  ::v-deep {
    .u-tabs__wrapper__nav__line {
      bottom: 0px;
    }
    .uni-scroll-view {
      overflow-x: auto !important;
      overflow-y: hidden !important;
    }
  }
}
</style>
