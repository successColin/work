<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:26
 * @Des: 表格 操作列 | 按钮类型
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    :label="$t('knowledge.bus_create')"
    resizable
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <span>
        {{
          scope.row.uploadUserName ||
          (scope.row.sysKlTree && scope.row.sysKlTree.uploadUserName)
        }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
