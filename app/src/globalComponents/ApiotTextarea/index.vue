<!--
 * @Author: sss
 * @Date: 2022-01-11 10:49:37
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-11 10:49:37
 * @Desc: 单选框
-->
<template>
  <view class="apiotTextarea" :class="[disabled ? 'disabled' : '']">
    <textarea
      :value="value"
      placeholder-style="color:#C1C1C1"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled || readonly"
      @blur="handleBlur"
      @input="handleInput"
    />
    <span class="apiotTextarea__num" v-if="maxlength !== -1"
      >{{ value.length }}/{{ maxlength }}</span
    >
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    placeholder: String,
    maxlength: {
      type: Number,
      default: -1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    handleInput(e) {
      this.$emit('input', e);
    },
    handleBlur(e) {
      this.$emit('input', e);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotTextarea {
  padding: 24rpx 20rpx;
  border: 1px solid #e9e9e9;
  border-radius: 12rpx;
  &__num {
    display: block;
    text-align: right;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #808080;
    line-height: 32rpx;
  }
  textarea {
    text-align: left;
  }
}
</style>
