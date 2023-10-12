<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-分割线
-->
<template>
  <view
    class="divider"
    :class="[
      !!element.showLabelTitle ? 'title' : '',
      layout === 'row' ? 'hasRaduis' : 'hasPadding',
      lineTypeClass,
    ]"
  >
    <view class="divider__padding top" v-if="!isFirst"></view>
    <view class="divider_title">
      <template v-if="element.showLabelTitle">
        <span class="divider__before" :style="lineTypeStyle"></span>
        <span>{{ element.name }}</span>
      </template>
    </view>
    <view class="divider__padding bottom"></view>
  </view>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  props: {
    // 是否第一个，如果是第一个的时候顶上的圆角隐藏
    isFirst: {
      type: Boolean,
      default: true
    },
    element: Object,

    // 位置
    layout: {
      type: String,
      default: 'column'
    }
  },

  data() {
    return {};
  },

  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    // 类型
    lineType() {
      return this.element.dividingType;
    },
    lineTypeClass() {
      const { lineType } = this;
      if (lineType === 2) return 'dicider_two';
      if (lineType === 3) return 'dicider_three';
      return '';
    },
    lineTypeStyle() {
      const { lineType, themeColor } = this;
      const style = {};
      if (lineType === 2) style.background = themeColor;
      if (lineType === 3) style.background = `linear-gradient(270deg, rgba(70, 137, 245, 0), ${themeColor})`;
      return style;
    }
  },

  watch: {},

  methods: {},

  mounted() {
    console.log('el.compType============================');
  }
};
</script>

<style lang='scss' scoped>
.divider {
  background: #f6f6f8;
  font-size: 36rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  @include fontBlob(500);
  color: #333333;
  &.dicider_three {
    .divider__before {
      position: absolute;
      left: 0;
      top: 64rpx;
      width: 112rpx;
      height: 6rpx;
    }
  }
  &.dicider_two {
    .divider__before {
      display: inline-block;
      height: 30rpx;
      width: 6rpx;
      margin-right: 10rpx;
    }
  }
  .divider_title {
    position: relative;
    min-height: 20rpx;
  }
  &.title {
    .divider_title {
      padding: 25rpx 0;
    }
  }
  &.hasRaduis {
    .divider__padding {
      width: 100%;
      height: 20rpx;
      background: #fff;

      &.top {
        border-radius: 0 0 12rpx 12rpx;
        box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.05);
      }
      &.bottom {
        height: 12rpx;
        border-radius: 12rpx 12rpx 0 0;
        box-shadow: 0 -2rpx 4rpx 0 rgba(0, 0, 0, 0.05);
      }
    }
    .divider_title {
      min-height: 20rpx;
    }
  }
  &.hasPadding {
    padding-left: 30rpx;
    .divider_title {
      min-height: 10rpx;
    }
  }
}
</style>
