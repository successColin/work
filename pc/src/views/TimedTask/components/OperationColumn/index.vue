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
      <span v-if="scope.row.jobStatus !== 3">
        <span v-for="item in buttonArr1" :key="item.name" class="m-l-10">
          <apiot-button @click="buttonClick(scope.row, item)" type="primary">
            {{ $t(item.name) }}
          </apiot-button>
        </span>
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
