<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <template slot-scope="scope"> {{ scope.row[prop] }} 分钟 </template>
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
  }
};
</script>
<style lang='scss' scoped>
</style>
