<!--
 * @Descripttion: 所属应用
 * @Author: sss
 * @Date: 2021-04-25 15:17:14
 * @LastEditors: sss
 * @LastEditTime: 2021-04-25 16:10:48
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
      <section class="application">
        <i
          class="iconfont"
          :class="scope.row[prop] === 'APP' ? 'icon-yidongduan' : 'icon-PCduan'"
        ></i>
        <span class="application__font--color m-l-2">
          {{ scope.row[prop] }}
        </span>
      </section>
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
  computed: {}
};
</script>

<style lang='scss' scoped>
.application {
  padding: 0 8px;
  line-height: 24px;
  font-size: 13px;
  text-align: center;
  width: min-content;
  border-radius: 4px;
  display: flex;
  background: #e5f0ff;
  color: #4689f5;

  &__font--color {
    color: #333333 !important;
  }
}
</style>
