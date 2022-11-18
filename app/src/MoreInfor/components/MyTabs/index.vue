<template>
  <view class="tabs">
    <u-tabs
      :list="list"
      :activeStyle="activeStyle"
      :inactiveStyle="inactiveStyle"
      :itemStyle="itemStyle"
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
    activeStyle() {
      return {
        // fontSize: '36rpx',
        color: '#4689F5',
        lineHeight: '50rpx',
        padding: '0 10rpx'
      };
    },
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
  box-shadow: 0px 1px 0px 0px #e0e0e0;
  height: 82rpx;
}
</style>
