<!--
 * @Author: sss
 * @Date: 2022-08-09 11:12:59
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-09 11:12:59
 * @Desc: 轮播图
-->
<template>
  <u-swiper
    :keyName="keyName"
    :list="list"
    :height="height"
    :imgMode="imgMode"
    :indicator="indicator"
    :indicatorMode="indicatorMode"
    :indicatorStyle="indicatorStyle"
    :radius="radius"
    :previousMargin="previousMargin"
    :nextMargin="nextMargin"
    indicatorActiveColor="rgba(0, 0, 0, 0.6)"
    indicatorInactiveColor="rgba(0, 0, 0, 0.3)"
    circular
    @change="(e) => (currentNum = e.current)"
    @click="handleClick"
  >
    <template v-if="indicatorMode === 'custom'">
      <view slot="indicator" class="indicator__custom">
        {{ currentNum + 1 }}/{{ list.length }}
      </view>
    </template>
  </u-swiper>
</template>

<script>
export default {
  components: {},

  props: {
    list: Array,
    keyName: {
      type: String,
      default: 'image'
    },
    openUrlKeyName: {
      type: String,
      default: 'targetUrl'
    },
    height: Number,
    imgMode: {
      type: String,
      default: 'scaleToFill'
    },
    // 指示器样式1=线；2=点；3=自定义
    indicatorType: {
      type: Number
    },
    radius: {
      type: Number,
      default: 0
    },
    // 展示类型，card，支付宝小程序不支持
    showType: String
  },

  data() {
    return {
      currentNum: null
    };
  },

  computed: {
    previousMargin() {
      if (this.showType === 'card' && this.list.length > 2) return 30;
      return 0;
    },
    nextMargin() {
      if (this.showType === 'card' && this.list.length > 2) return 30;
      return 0;
    },
    indicatorMode() {
      const { indicatorType } = this;

      // eslint-disable-next-line no-nested-ternary
      return indicatorType === 1 ? 'line' : indicatorType === 2 ? 'dot' : 'custom';
    },
    indicator() {
      if (this.indicatorMode === 'custom') return false;
      return true;
    },
    indicatorStyle() {
      const { indicatorMode, nextMargin } = this;
      if (indicatorMode === 'custom') return { right: `${30 + nextMargin}rpx` };

      return {};
    }
  },

  methods: {
    // 点击
    handleClick(index) {
      console.log(this.list[index]);
      const { list, openUrlKeyName } = this;
      const obj = list[index];
      const openUrl = obj[openUrlKeyName];
      if (!openUrl) return;
      uni.navigateTo({
        url: `/interfaceCommon/webView?url=${openUrl}`
      });
    }
  },

  mounted() {
  }
};
</script>

<style lang='scss' scoped>
.indicator__custom {
  padding: 0 10rpx;
  font-size: 24rpx;
  line-height: 29rpx;
  font-family: HelveticaNeue;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 14rpx;
}
</style>
