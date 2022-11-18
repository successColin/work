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
      class="u-input__icon u-input__icon--prefix"
      :class="[
        prefixClass,
        prefixIcon,
        isTheme || isFocus ? getThemeColorFont : '',
      ]"
      :prefixIconStyle="prefixIconStyle"
    ></i>
    <span v-if="prefixText" class="fixName">{{ prefixText }}</span>
    <template v-if="showThousandth">
      <div class="apiotInput__showValue" @click="gotoWrite">
        {{ showValue }}
      </div>
    </template>
    <template v-else>
      <u-input
        ref="input"
        :value="defaultValue"
        :type="type"
        class="apiotInput__input"
        disabledColor="#F6F6F8"
        :password-icon="false"
        :clearable="clearable"
        :placeholder="placeholder || ''"
        placeholderClass="apiotInput__placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :focus="focus || isFocus"
        :trim="trim"
        :border="borderStyle"
        :password="password"
        @input="handleInput"
        @confirm="handleConfirm"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="change"
      >
      </u-input>
    </template>
    <span v-if="suffixText" class="fixName">{{ suffixText }}</span>
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
import mpMixin from '@/mixin/mpMixin';

export default {
  mixins: [mpMixin],

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
    // 类型 text,integer=数字,digit=小数
    type: {
      type: String,
      default: 'text'
    },
    password: {
      type: Boolean,
      default: false
    },
    prefixClass: {
      type: String,
      default: 'appIcon'
    },
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
    // 是否自动聚焦1
    focus: {
      type: Boolean,
      default: false
    },
    // 是否去除两端空格
    trim: {
      type: Boolean,
      default: true
    },
    // 只有type为digit生效
    digitNumber: Number,
    // 是否显示千分位
    thousandth: {
      type: Boolean,
      default: false
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
    // 是否显示千分位，只有是数字才能显示千分位
    showThousandth() {
      const { type, thousandth, isFocus, value } = this;
      return ['integer', 'digit'].indexOf(type) !== -1 && thousandth && !isFocus && value;
    },
    showValue() {
      const { showThousandth, defaultValue } = this;
      if (showThousandth) {
        let V = defaultValue;
        V = this.$apiot.fomatFloat.getThousandth(V);
        return V;
      }
      return defaultValue;
    },
    valueType() {
      const { type, showThousandth } = this;
      if (showThousandth) return 'text';
      return type;
    },
    borderStyle() {
      let { border } = this;
      const { prefixIcon, suffixIcon } = this;
      if (prefixIcon || suffixIcon) border = 'none';
      return border;
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },

  watch: {
    value: {
      handler(newValue) {
        if (this.type === 'digit' && this.digitNumber && newValue) this.defaultValue = this.$apiot.fomatFloat.polishNum(newValue, this.digitNumber);
        else this.defaultValue = newValue;
      },
      immediate: true
    }
  },

  methods: {
    gotoWrite() {
      this.isFocus = true;
    },
    suffixIconClick() {
      this.$emit('suffixClick');
    },
    handleInput(value) {
      // 判断是否去除空格
      if (this.type === 'digit' && this.digitNumber && value) value = this.$apiot.fomatFloat.polishNum(value, this.digitNumber);
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
  .fixName {
    font-size: $form-el-fontSize;
    color: #c1c1c1;
  }
  &__placeholder {
    font-size: $form-el-fontSize;
    font-family: $--font-family;
    color: $form-el-placeholderColor !important;
    text-align: left;
  }
  &.disabled &__showValue {
    color: $form-el-disabled-valueColor;
  }
  &__showValue {
    width: 100%;
    height: $form-el-height !important;
    line-height: $form-el-height !important;
    font-size: $form-el-fontSize;
    color: $form-el-valueColor;
    text-align: left;
    overflow: hidden;
  }
  ::v-deep {
    .u-input__content__field-wrapper__field {
      height: $form-el-height !important;
      line-height: 36px !important;
      padding: 0 !important;
    }
    input {
      height: $form-el-height !important;
      line-height: 36px !important;
      padding: 0 !important;
      font-size: $form-el-fontSize !important;
    }
  }
  .u-input__icon--prefix {
    padding: 0 21rpx 0 0;
  }
}
.disabled {
  ::v-deep {
    .u-input {
      padding: $form-el-disabled-padding !important;
    }
  }
}
.u-input {
  // padding-right: 20rpx !important;
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
</style>
