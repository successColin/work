<template>
  <view class="apiotMessageInput">
    <view class="apiotMessageInput__continor">
      <text
        v-for="(item, index) in latticeNum"
        :key="index"
        :style="[
          isActive &&
          (inputValues.length === index ||
            (inputValues.length === latticeNum && index === latticeNum - 1))
            ? activeStyle
            : inactiveStyle,
        ]"
      >
        <block v-if="inputValues[index]">{{ inputValues[index] }}</block>
      </text>
    </view>
    <input
      :type="inputType"
      :maxlength="latticeNum"
      class="input_info"
      :focus="isFocus"
      @input="inputVal"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </view>
</template>

<script>
export default {
  props: {
    // 可选类型box：框，bottomLine:下划线
    mode: {
      type: String,
      default: 'box;'
    },
    // 输入框框框的个数
    latticeNum: {
      type: Number,
      default: 4
    },
    // 未选中样式
    activeColor: String,
    // 选中的样式
    inactiveColor: {
      type: String,
      default: '#E9E9E9'
    },
    // 默认是否聚焦
    isFocus: {
      type: Boolean,
      default: true
    },
    // input类型
    inputType: {
      type: String,
      default: 'number'
    }
  },
  computed: {
    activeStyle() {
      const { mode, activeColor } = this;
      const msgStyle = {};
      // 没有活动颜色则默认主题色
      if (mode === 'bottomLine') msgStyle.borderBottom = `2px solid ${activeColor || this.$store.state.base.themeColor}`;
      else msgStyle.border = `2px solid ${activeColor || this.$store.state.base.themeColor}`;
      return msgStyle;
    },
    inactiveStyle() {
      const { mode, inactiveColor } = this;
      const msgStyle = {};
      // 没有活动颜色则默认主题色
      if (mode === 'bottomLine') msgStyle.borderBottom = `2px solid ${inactiveColor}`;
      else msgStyle.border = `2px solid ${inactiveColor}`;
      return msgStyle;
    }
  },
  data() {
    return {
      inputValues: [], // 输入的值
      isActive: true
    };
  },
  methods: {
    // 聚焦
    handleFocus() {
      this.isActive = true;
    },
    // 失焦
    handleBlur() {
      this.isActive = false;
    },
    /**
     * 输入框的值
     */
    inputVal(e) {
      this.inputValues = e.detail.value;
      this.$emit('changValue', this.inputValues);
    },
    // 设置验证码的值
    /**
     * verificationCodeValue  数组
     */
    setVerificationCode(verificationCodeValue = []) {
      this.inputValues = verificationCodeValue;
    }
  }
};
</script>

<style lang="scss">
.apiotMessageInput {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 400rpx;

  &__continor {
    display: flex;
    text-align: center;

    text {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90rpx;
      height: 90rpx;
      font-size: 48rpx;
      font-family: $--font-family;
      font-weight: 400;
      color: #222222;
      letter-spacing: 1px;
    }

    text:not(:first-child) {
      margin-left: 10rpx;
    }
  }

  .input_info {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
  }
}
</style>
