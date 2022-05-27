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
    :label="$t('knowledge.bus_size')"
    resizable
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <span>{{ calculateSize(scope.row) }}</span>
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

  computed: {
    calculateSize() {
      // 计算文件大小
      return function (item) {
        const { size } = item.sysKlTree || item;
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;
        // eslint-disable-next-line no-unused-vars
        let ret = '';

        if (size >= gb) {
          ret = `${(size / (gb * 1.0)).toFixed(0)} GB`;
        } else if (size >= mb) {
          ret = `${(size / (mb * 1.0)).toFixed(0)} MB`;
        } else if (size >= kb) {
          ret = `${(size / (kb * 1.0)).toFixed(0)} KB`;
        } else if (size > 0) {
          ret = `${(size / 1.0).toFixed(0)} KB`;
        } else {
          ret = '0 KB';
        }
        return ret;
      };
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
