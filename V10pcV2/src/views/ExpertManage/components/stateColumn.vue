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
      :sortable="false"
  >
    <template slot-scope="scope">

      <div class="box">
        <span class="labelStatus" :class="{ [`c${scope.row.stateid}`]: true}"></span>
        <span class="labelName">{{ getName(scope.row) }}</span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {},
  computed: {
    getName() {
      return function (row) {
        const { stateid } = row;
        if (!stateid) return '';
        const obj = {
          1: '在线',
          3: '离线',
          2: '占用'
        };
        return obj[stateid];
      };
    }
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.labelStatus {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
  &.c {
    background: #ffffff;
  }
  &.c1 {
    background: #4689F5;
  }
  &.c3 {
    background: #AAAAAA;
  }
  &.c2 {
    background: #4689F5;
  }
}

.labelName {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #111111;
}
</style>
