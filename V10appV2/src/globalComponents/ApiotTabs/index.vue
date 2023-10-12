<template>
  <view class="tabs" :class="[tabsClass]">
    <u-tabs
      :list="list"
      :inactiveStyle="inactiveStyle"
      :itemStyle="{
        height: '88rpx',
        fontSize: '30rpx',
        fontFamily,
      }"
      :activeStyle="activeStyle"
      :lineColor="themeColor"
      lineWidth="60rpx"
      lineHeight="5rpx"
      :scrollable="scrollable"
      @change="handleChange"
      @click="handleClick"
    ></u-tabs>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    // tab样式：line=有下划线；cricle=圆角
    mode: {
      type: String,
      default: 'line'
    }
  },
  data() {
    return {
      fontFamily:
        'PingFangSC-Regular, PingFang SC, OPPOSans,DroidSansFallback, Microsoft YaHei, Helvetica, Roboto, Arial, sans-serif'
    };
  },
  components: {},
  computed: {
    // 是否可以滚动
    scrollable() {
      const { list } = this;
      if (list.length > 3) return true;
      return false;
    },
    tabsClass() {
      const { mode } = this;
      const str = `${mode}Tabs`;
      return str;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    getThemeColorRGB() {
      return this.$store.getters.getThemeColorRGB;
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    inactiveStyle() {
      const { mode } = this;

      const obj = {
        color: '#666666'
      };
      if (mode !== 'line') obj.color = '#333333';
      return obj;
    },
    activeStyle() {
      const { mode, themeColor, getThemeColorRGB } = this;

      const obj = {
        color: themeColor
      };
      console.log(this.getThemeColorRGB);
      if (mode !== 'line') obj.backgroundColor = `rgb(${getThemeColorRGB},0.2)`;
      else obj.fontWeight = '600';
      return obj;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleChange(item) {
      this.$emit('change', item);
    },
    handleClick(item) {
      this.$emit('click', item);
    }
  }
};
</script>
<style lang='scss' scoped>
.tabs {
  height: 88rpx;
  background: #ffffff;
  &.lineTabs {
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
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
  &.cricleTabs {
    ::v-deep {
      .u-tabs__wrapper__nav__item {
        padding: 0;
      }
      .u-tabs__wrapper__nav__item__text {
        height: 48rpx;
        line-height: 48rpx;
        background: #f6f6f8;
        border-radius: 33rpx;
        padding: 0 20rpx;
        margin-right: 23rpx;
        color: #333333;
      }
      .u-tabs__wrapper__nav__line {
        display: none;
      }
    }
  }
}
</style>
