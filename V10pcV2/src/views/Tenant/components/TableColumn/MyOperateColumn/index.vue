<!--
 * @Descripttion: 操作列
 * @Author: ytx
 * @Date: 2021-04-23 10:56:52
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:46:35
-->
<template>
  <el-table-column
    class="operateColumn"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :sortable="false"
  >
    <template slot-scope="scope">
      <!-- 普通按钮 -->
      <apiot-button
        @click="buttonClick(scope.row, item)"
        v-for="item in buttonArr"
        :key="item.name"
        type="text"
      >
        {{ $t(item.name) }}
      </apiot-button>
      <span v-for="item in buttonArr1" :key="item.name">
        <apiot-button
          @click="buttonClick(scope.row, item)"
          :class="`apiot__button apiot__${item.type}`"
          v-if="
            scope.row.tenantState === 1 && item.type === 'primary'
              ? true
              : (scope.row.tenantState === 2 && item.type === 'danger') ||
                (scope.row.tenantState === 2 && item.type === 'info')
              ? true
              : (scope.row.tenantState === 3 && item.type === 'warning') ||
                (scope.row.tenantState === 3 && item.type === 'info')
              ? true
              : false
          "
        >
          {{ $t(item.name) }}
        </apiot-button>
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    buttonArr: {
      type: Array,
      default: () => {}
    },
    buttonArr1: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    buttonClick(row, item) {
      this.$emit(item.funcName, row);
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-button.el-button--text {
    padding: 0 !important;
  }
}
</style>
