<!-- 页面 -->
<template>
  <div class="CInputWrap">
    <label v-if="!!lable">{{ lable }}</label>
    <div class="inputBox">
      <el-input
          v-on="$listeners"
          v-bind="$attrs"
          class="effect-3"
          :value="value"
          :disabled="disabled"
          v-if="type==='text' || type==='textarea'"
          :type="type"
          @input="changeValue"
      ></el-input>
      <el-input-number
          v-on="$listeners"
          v-bind="$attrs"
          class="effect-3"
          :value="numberValue"
          :type="type"
          :min="min"
          :max="max"
          :disabled="disabled"
          controls-position="right"
          v-if="type==='number'"
          @input="changeValue"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: { // 字符串输入框的值
      type: String,
      default: ''
    },
    numberValue: { // 数字输入框的值
      type: Number,
      default: 0
    },
    type: { // 输入框的类型
      type: String,
      default: 'text'
    },
    lable: { // 输入框前置文案
      type: String,
      default: ''
    },
    min: {
      type: [Number, String]
    },
    max: {
      type: [Number, String]
    }
  },
  data() {
    return {};
  },
  components: {},

  computed: {
  },

  mounted() {
  },

  methods: {
    changeValue(value) {
      this.$emit('Input-Change', value);
    }
  },
  name: 'CInput'
};
</script>

<style lang='scss' scoped>
.CInputWrap {
  width: 100%;
  & > label {
    margin-right: 5px;
    color: #ffffff;
    font-size: 14px;
    opacity: .7;
  }
  ::v-deep{
    .el-input__inner{
      height: 32px;
      color: #ffffff;
      line-height: 32px;
      text-align: left;
      background-color: #192757;
      border-color: $component-border-color;
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus{
      border-color: $component-borderFocus-color;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .el-input.is-active .el-input__inner, .el-input__inner:hover{
      border-color: $component-borderFocus-color;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
      border-color: $component-borderFocus-color;
    }
    .el-input-number__decrease, .el-input-number__increase{
      width: 20px;
      border-top: none;
      border-bottom: none;
      background: none;
    }
    .el-input-number__increase{
      top: 4px;
      border-left: 1px solid $component-border-color;
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
      bottom: 3px;
      border-left: 1px solid $component-border-color;
    }
    .el-input-number{
      width: 100%;
    }
  }
}

</style>
