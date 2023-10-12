<!--
 * @Descripttion: 表格__状态列表（左边圆点，右边文字）
 * @Author: ytx
 * @Date: 2021-04-25 17:03:57
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 17:13:14
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
      <section class="state" key="state">
        <div
          :class="`state__circle state--${colorIndex}`"
          :style="`background: ${getObj(scope.row).color}`"
        ></div>
        <div class="m-l-4">{{ getObj(scope.row).name }}</div>
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
    },
    colorIndex: {
      type: Number,
      default: 1 // 指定单独颜色下标
    },
    typesPropName: {
      type: String,
      default: '' // 类型名称
    }
  },
  computed: {
    // 需要转换的值
    getArrData() {
      return this.$store.getters.getCurDict(this.typesPropName) || [];
    },
    getObj() {
      return function(row) {
        if (this.getArrData.length) {
          const temp = row[this.prop];
          const index = this.getArrData.findIndex((item) => item.value === temp);
          return this.getArrData[index] || {};
        }
        return {};
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.state {
  font-size: 13px;
  color: #333333;
  width: min-content;
  display: flex;
  align-items: center;
  div {
    display: inline-block;
  }
  &__circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  &--1 {
    background: #ee5e5e;
  }

  &--2 {
    background: #26c4bb;
  }

  &--3 {
    background: #fa9d0b;
  }

  &--4 {
    background: #fa6400;
  }

  &--5 {
    background: #e73c3c;
  }
  &__font--color {
    background: #333333 !important;
  }
}
</style>
