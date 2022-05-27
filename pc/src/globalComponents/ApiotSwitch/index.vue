<!--
 * @Descripttion: Switch 开关
 * @Author: ytx
 * @Date: 2021-05-12 10:30:56
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-12 10:30:56
-->
<template>
  <el-switch
    v-on="$listeners"
    v-bind="$attrs"
    :active-text="$t('common.is')"
    :inactive-text="$t('common.no')"
    :active-value="activeValue"
    :inactive-value="inactivevalue"
  >
  </el-switch>
</template>

<script>
export default {
  props: {
    activeText: String, // 打开时的文字描述1
    inactiveText: String, // 关闭时的文字描述
    activeValue: {
      type: [String, Number, Boolean],
      default: '1'
    },
    inactivevalue: {
      type: [String, Number, Boolean],
      default: '2'
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-switch__label {
    position: absolute;
    margin: 0;
    color: #ffffff !important;
  }
  .el-switch__label--left {
    display: none;
    left: 22px;
    &.is-active {
      display: block;
      z-index: 1;
    }
    span {
      font-size: 12px;
    }
  }
  .el-switch__label--right {
    display: none;
    left: 6px;
    &.is-active {
      display: block;
    }
    span {
      font-size: 12px;
    }
  }
}
</style>
