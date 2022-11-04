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
      >{{ textValue.length }}/{{ maxlength }}</span
    >
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    placeholder: {
      type: String,
      default: ''
    },
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
    return {
      textValue: ''
    };
  },

  computed: {},

  watch: {
    value: {
      handler(newValue) {
        this.textValue = newValue;
      },
      immediate: true
    }
  },

  methods: {
    handleInput(e) {
      const { detail } = e;
      const { value } = detail;
      this.textValue = value;
      this.$emit('input', value);
    },
    handleBlur(e) {
      const { detail } = e;
      const { value } = detail;
      this.textValue = value;
      this.$emit('blur', value);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotTextarea {
  width: 100%;
  padding: 24rpx 20rpx;
  border: 1px solid #e9e9e9;
  border-radius: 12rpx;
  box-sizing: border-box;
  &__num {
    display: block;
    text-align: right;
    font-size: 12px;
    font-family: $--font-family;
    color: #808080;
    line-height: 32rpx;
  }
  textarea {
    text-align: left;
  }
}
</style>
