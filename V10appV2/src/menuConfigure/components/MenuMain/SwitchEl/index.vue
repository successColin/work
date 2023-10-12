<template>
  <view
    class="switch"
    :class="[disabled && 'switch--disabled']"
    :style="[switchStyle, customStyle]"
    @tap="clickHandler"
  >
    <view class="switch__bg" :style="[bgStyle]"> </view>
    <view
      class="switch__node"
      :class="[value && 'switch__node--on']"
      :style="[nodeStyle]"
      ref="switch__node"
    >
      <!-- <u-loading-icon
        :show="loading"
        mode="circle"
        timingFunction="linear"
        :color="value ? showActiveColor : '#AAABAD'"
        :size="size * 0.6"
      /> -->
    </view>
    <view v-if="showContent" class="switch__text" :style="[textStyle]">{{
      isActive ? '是' : '否'
    }}</view>
  </view>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  name: 'SwitchEl',
  mixins: [mpMixin],
  props: {
    // 是否显示提示文字
    showContent: {
      type: Boolean,
      default: true
    },
    // 通过v-model双向绑定的值
    value: {
      type: [Boolean, String, Number],
      default: true
    },
    // 是否为加载中状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否为禁用装填
    disabled: {
      type: Boolean,
      default: false
    },
    // 开关尺寸，单位px
    size: {
      type: [String, Number],
      default: 36
    },
    // 打开时的背景颜色
    activeColor: {
      type: String,
      default: ''
    },
    // 关闭时的背景颜色
    inactiveColor: {
      type: String,
      default: '#DCDFE6'
    },
    // switch打开时的值
    activeValue: {
      type: [String, Number, Boolean],
      default: true
    },
    // switch关闭时的值
    inactiveValue: {
      type: [String, Number, Boolean],
      default: false
    },
    // 是否开启异步变更，开启后需要手动控制输入值
    asyncChange: {
      type: Boolean,
      default: false
    },
    // 圆点与外边框的距离
    space: {
      type: [String, Number],
      default: 9
    },
    customStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(n) {
        if (n !== this.inactiveValue && n !== this.activeValue) {
          console.error('v-model绑定的值必须为inactiveValue、activeValue二者之一');
        }
      }
    }
  },
  data() {
    return {
      bgColor: '#ffffff'
    };
  },
  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    showActiveColor() {
      const { themeColor, activeColor } = this;
      return activeColor || themeColor;
    },
    isActive() {
      return this.value === this.activeValue;
    },
    switchStyle() {
      const style = {};
      // 这里需要加2，是为了腾出边框的距离，否则圆点node会和外边框紧贴在一起
      style.width = this.$apiot.addUnit(this.size * 2 + 8);
      style.height = this.$apiot.addUnit(Number(this.size) + 2);
      // style.borderColor = this.value ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.12)'
      // 如果自定义了“非激活”演示，name边框颜色设置为透明(跟非激活颜色一致)
      // 这里不能简单的设置为非激活的颜色，否则打开状态时，会有边框，所以需要透明
      if (this.customInactiveColor) {
        style.borderColor = 'rgba(0, 0, 0, 0)';
      }
      style.backgroundColor = this.isActive ? this.showActiveColor : this.inactiveColor;
      return style;
    },
    textStyle() {
      const style = {};
      const space = this.$apiot.addUnit(this.space + 2);
      return this.isActive ? { left: space } : { right: space };
    },
    nodeStyle() {
      const style = {};
      // 如果自定义非激活颜色，将node圆点的尺寸减少两个像素，让其与外边框距离更大一点
      style.width = this.$apiot.addUnit(this.size - this.space);
      style.height = this.$apiot.addUnit(this.size - this.space);
      const translateX = this.isActive
        ? this.$apiot.addUnit(this.space)
        : this.$apiot.addUnit(this.size + this.space);
      style.transform = `translateX(-${translateX})`;
      return style;
    },
    bgStyle() {
      const style = {};
      // 这里配置一个多余的元素在HTML中，是为了让switch切换时，有更良好的背景色扩充体验(见实际效果)
      style.width = this.$apiot.addUnit(Number(this.size) * 2 - this.size / 2);
      style.height = this.$apiot.addUnit(this.size);
      style.backgroundColor = this.inactiveColor;
      // 打开时，让此元素收缩，否则反之
      style.transform = `scale(${this.isActive ? 0 : 1})`;
      return style;
    },
    customInactiveColor() {
      // 之所以需要判断是否自定义了“非激活”颜色，是为了让node圆点离外边框更宽一点的距离
      return this.inactiveColor !== '#fff' && this.inactiveColor !== '#ffffff';
    }
  },
  methods: {
    clickHandler() {
      if (!this.disabled && !this.loading) {
        const oldValue = this.isActive ? this.inactiveValue : this.activeValue;
        if (!this.asyncChange) {
          this.$emit('input', oldValue);
        }
        // 放到下一个生命周期，因为双向绑定的value修改父组件状态需要时间，且是异步的
        this.$nextTick(() => {
          this.$emit('change', oldValue);
        });
      }
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  flex-direction: row;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  position: relative;
  background-color: #fff;
  border-width: 1px;
  border-radius: 100px;
  transition: background-color 0.4s;
  border-color: rgba(0, 0, 0, 0.12);
  border-style: solid;
  justify-content: flex-end;
  align-items: center;
  // 由于weex为阿里逗着玩的KPI项目，导致bug奇多，这必须要写这一行，
  // 否则在iOS上，点击页面任意地方，都会触发switch的点击事件
  overflow: hidden;

  &__node {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    background-color: #fff;
    border-radius: 100px;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.25);
    transition-property: transform;
    transition-duration: 0.4s;
    transition-timing-function: cubic-bezier(0.3, 1.05, 0.4, 1.05);
  }

  &__text {
    font-size: 26rpx;
    color: #fff;
    position: absolute;
  }

  &__bg {
    position: absolute;
    border-radius: 100px;
    background-color: #ffffff;
    transition-property: transform;
    transition-duration: 0.4s;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    transition-timing-function: ease;
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
