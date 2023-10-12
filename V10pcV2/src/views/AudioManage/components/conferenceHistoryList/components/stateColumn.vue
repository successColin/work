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
      <UserAvatar :value="scope.row.userList"
                        nameKey="username"
                        :isNeedMore="false"
                        :splitLen="999"/>
    </template>
  </el-table-column>
</template>

<script>
import UserAvatar from '@/views/TaskToDo/Components/UserAvatar';

export default {
  inheritAttrs: false,
  props: {},
  components: {
    UserAvatar,
  },

  computed: {
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
