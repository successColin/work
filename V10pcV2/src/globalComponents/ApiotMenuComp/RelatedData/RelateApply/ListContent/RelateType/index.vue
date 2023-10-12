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
    :label="$t('knowledge.file_from')"
    resizable
    show-overflow-tooltip
    :width="100"
  >
    <template slot-scope="scope">
      <span :class="`type type__${getShowType(scope.row)}`">
        {{ types[getShowType(scope.row)] }}</span
      >
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {},
  data() {
    return {
      types: {
        1: '本地上传',
        2: '关联知识库',
        3: '业务关联',
      },
    };
  },

  components: {},

  computed: {
    getShowType() {
      return (item) => {
        const materialType = item.materialType || item.sysKlTree.materialType;
        return materialType;
      };
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.type {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  &__1 {
    color: #4689f6;
    background-color: #e5f0ff;
  }
  &__2 {
    color: #fa6400;
    background-color: #ffede1;
  }
  &__3 {
    color: #10b98a;
    background-color: #ebfcf7;
  }
}
</style>
