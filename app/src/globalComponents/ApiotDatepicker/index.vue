<!--
 * @Author: sss
 * @Date: 2022-01-08 09:52:03
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-08 09:52:03
 * @Desc: 表单控件-时间控件
-->
<template>
  <view class="datePicker" :class="[disabled ? 'disabled' : '']">
    <!-- <uni-datetime-picker
      :type="type"
      :placeholder="placeholder"
      :border="false"
      :disabled="disabled || readonly"
    /> -->
    <view class="datePicker__value" @click.stop="showCal">
      <view class="datePicker__value--content">
        <view class="datePicker__placeholder" v-if="!value">{{
          placeholder
        }}</view>
        <span v-else>{{ showValue }}</span>
      </view>
      <i class="appIcon appIcon-riqi"></i>
    </view>
    <u-datetime-picker
      v-model="dateValue"
      :show="show"
      :mode="mode"
      :title="title"
      :confirmColor="confirmColor"
      @cancel="closeCal"
      @confirm="confirm"
    ></u-datetime-picker>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    title: String,
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
    mode: {
      type: String,
      default: 'datetime'
    },
    fmt: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      show: false,
      dateValue: ''
    };
  },

  computed: {
    // 是否显示表单
    showTitle() {
      return !!this.title;
    },
    showFmt() {
      const { fmt, mode } = this;
      return fmt || (mode === 'datetime' ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd');
    },
    // 格式化日期
    showValue() {
      const { value, showFmt } = this;
      if (!value) return '';
      return this.$apiot.dateFormat(value, showFmt);
    },
    confirmColor() {
      return this.$store.state.base.themeColor;
    }
  },

  watch: {
    value(newValue) {
      this.dateValue = this.value ? Number(new Date(newValue)) : Number(new Date());
    }
  },

  methods: {
    closeCal() {
      this.show = false;
    },
    // 弹出日期选择框
    showCal() {
      const { disabled, readonly } = this;
      if (disabled || readonly) return '';
      this.show = true;
    },
    // 日期改变
    confirm(e) {
      console.log(e);
      const { value } = e;
      this.$emit('input', value);
      this.$emit('change', value);
      this.show = false;
    }
  },

  mounted() {
    this.dateValue = this.value ? Number(new Date(this.value)) : Number(new Date());
  }
};
</script>

<style lang='scss' scoped>
.datePicker {
  width: 100%;
  font-size: $form-el-fontSize;
  font-family: PingFangSC-Regular, PingFang SC;
  color: $form-el-valueColor;
  &.disabled {
    background: $form-el-disabled;
  }
  &__value {
    padding: 10rpx 0;
    height: $form-el-height;
    line-height: $form-el-height;
    display: flex;
    align-items: center;
    &--content {
      flex: 1;
    }
    .appIcon-riqi {
      color: $form-el-placeholderColor;
      font-size: 20px;
    }
  }
  &__placeholder {
    color: $form-el-placeholderColor;
  }
}
</style>
