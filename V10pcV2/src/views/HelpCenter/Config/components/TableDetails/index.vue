<!--
 * @Descripttion: 表格__用户角色（左边人icon图标，右边人名）
 * @Author: ytx
 * @Date: 2021-04-25 15:17:14
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 16:10:48
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="prop"
  >
    <template slot-scope="scope">
      {{ tableValue(scope) }}
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    // 当前作用的字段名
    prop: {
      type: String,
      default: ''
    }
  },
  computed: {
    tableValue() {
      return function(scope) {
        return scope.row[this.prop] && scope.row[this.prop].replace(/&nbsp;/g, '');
      };
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
