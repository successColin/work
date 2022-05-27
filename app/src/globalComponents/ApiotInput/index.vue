<!--
 * @Author: sss
 * @Date: 2021-08-31 19:14:23
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-31 19:14:23
 * @Desc: 输入框控件
-->
<template>
  <view class="apiotInput" :class="[disabled ? 'disabled' : '']">
    <i
      v-if="prefixIcon"
      class="appIcon u-input__icon u-input__icon--prefix"
      :class="[prefixIcon, isTheme || isFocus ? getThemeColorFont : '']"
      :prefixIconStyle="prefixIconStyle"
    ></i>
    <u-input
      :value="defaultValue"
      :type="type"
      class="apiotInput__input"
      disabledColor="#fafafa"
      :password-icon="false"
      :clearable="clearable"
      :placeholder="getPlaceholder"
      placeholderClass="apiotInput__placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :focus="focus"
      :trim="trim"
      :border="borderStyle"
      :prefixIcon="prefixText"
      :suffixIcon="suffixText"
      :password="password"
      fontSize="16px"
      @input="handleInput"
      @confirm="handleConfirm"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="change"
    >
    </u-input>
    <i
      v-if="suffixIcon"
      class="appIcon u-input__icon u-input__icon--suffix"
      :class="[suffixIcon]"
      :suffixIconStyle="suffixIconStyle"
      @click="suffixIconClick"
    ></i>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    // 是否默认主题色
    isTheme: {
      type: Boolean,
      default: true
    },
    // 边框类型 surround-四周边框，bottom-底部边框，none-无边框
    border: {
      type: String,
      default: 'surround'
    },
    // 类型
    type: {
      type: String,
      default: 'text'
    },
    password: Boolean,
    // 前缀icon
    prefixIcon: String,
    prefixIconStyle: Object,
    // 后缀icon
    suffixIcon: String,
    suffixIconStyle: Object,
    prefixText: String,
    suffixText: String,
    // 是否需要清除图标
    clearable: {
      type: Boolean,
      default: false
    },
    // 提示文字
    placeholder: {
      type: String
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 最长可输入长度
    maxlength: {
      type: Number,
      default: 140
    },
    // 是否自动聚焦
    focus: {
      type: Boolean,
      default: false
    },
    // 是否去除两端空格
    trim: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isFocus: false,
      // 值
      defaultValue: ''
    };
  },

  computed: {
    borderStyle() {
      let { border } = this;
      const { prefixIcon, suffixIcon } = this;
      if (prefixIcon || suffixIcon) border = 'none';
      return border;
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    getPlaceholder() {
      return this.placeholder || this.$t('placeholder.pleaseEnterAny', { any: '' });
    }
  },

  watch: {
    value(newValue) {
      this.defaultValue = newValue;
    }
  },

  methods: {
    suffixIconClick() {
      this.$emit('suffixClick');
    },
    handleInput(value) {
      // 判断是否去除空格
      this.defaultValue = value;
      this.$emit('input', value);
      if (!value) {
        this.$emit('getList');
      }
    },
    handleConfirm() {
      this.$emit('getList');
    },
    handleFocus() {
      this.isFocus = true;
      this.$emit('focus');
    },
    handleBlur(e) {
      this.isFocus = false;
      this.$emit('blur', e);
      this.$emit('getList');
    },
    change(e) {
      this.$emit('change', e);
    }
  },

  mounted() {
    this.defaultValue = this.value;
  }
};
</script>

<style lang='scss' scoped>
.apiotInput {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx 0;
  &.hasBorder {
    border-bottom: 1px solid #e9e9e9;
  }
  &__placeholder {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: $form-el-placeholderColor !important;
    text-align: left;
  }
  ::v-deep {
    .u-input__content__field-wrapper__field {
      height: 34px !important;
      line-height: 36px !important;
      padding: 0 !important;
    }
    input {
      height: 34px !important;
      line-height: 36px !important;
      padding: 0 !important;
    }
  }
  .u-input__icon--prefix {
    padding: 0 21rpx 0 0;
  }
}
.disabled {
  .u-input {
    padding: 0 10rpx !important;
  }
}
.u-input {
  padding-right: 20rpx !important;
  &__icon {
    text-align: center;
    font-size: 24px;
    &::after {
      content: '';
      height: 100%;
      width: 0;
      display: inline-block;
      vertical-align: middle;
    }
    &--prefix {
      padding: 0 30rpx 0 34rpx;
      color: #bbc3cd;
    }
    &--suffix {
      padding-left: 8rpx;
      color: #aaaaaa;
    }
  }
}
// .u-input:focus-within + .u-input__icon {
//   background: red !important;
// }
</style>
