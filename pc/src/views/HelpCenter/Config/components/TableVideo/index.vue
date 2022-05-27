<!--
 * @Descripttion: 表格中播放视频
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
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <section
        class="tableVideo"
        @click="handleClick(scope.row)"
        v-if="scope.row.url !== ''"
      >
        <i class="iconfont icon-shangchuanshipin"></i>
      </section>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {},
  methods: {
    handleClick(v) {
      this.$emit('clickVideo', v);
    }
  }
};
</script>

<style lang='scss' scoped>
.tableVideo {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #e5f0ff;
  border-radius: 4px;
  text-align: center;
  color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
