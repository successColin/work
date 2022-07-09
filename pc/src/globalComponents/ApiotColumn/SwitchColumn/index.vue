<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-16 17:02:36
 * @Des: 表格 switch开关列
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <template slot-scope="scope">
      <el-switch
        v-model="scope.row[prop]"
        :active-text="activeText || $t('common.is')"
        :inactive-text="inactiveText || $t('common.no')"
        :active-value="activeValue"
        :inactive-value="inactivevalue"
        :width="switchWidth"
        :disabled="isNood(scope.row)"
        @change="change(scope.row)"
      >
      </el-switch>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    //   定义当前作用字段名
    prop: {
      type: String,
      default: 'enabled'
    },
    activeText: String, // 打开时的文字描述
    inactiveText: String, // 关闭时的文字描述
    activeValue: {
      type: [String, Number, Boolean],
      default: 1
    },
    inactivevalue: {
      type: [String, Number, Boolean],
      default: 2
    },
    switchWidth: {
      type: Number,
      default: 40
    },
    // 是否需要必填
    isNoodDisabled: {
      type: Boolean,
      default: false
    },
    // 是否需要修改
    judgeName: {
      type: String,
      default: ''
    },
    // 不能修改
    noUpdateName: {
      type: String,
      default: 'noUpdate'
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    isNood() {
      return function (v) {
        if (this.isNoodDisabled && this.judgeName) {
          if (v[this.noUpdateName]) {
            return true;
          }
          if (this.activeValue === v[this.judgeName]) {
            return true;
          }
          return false;
        }
        return false;
      };
    }
  },

  mounted() {
    //  后期有其他值相应更改 正确值 错误值
  },

  methods: {
    change(row) {
      this.$emit('switchChange', row);
    }
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
