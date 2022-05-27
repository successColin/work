<!--
 * @Descripttion: 表格__(左边为姓名末尾2位数，转英文大写。右边为姓名)
 * @Author: ytx
 * @Date: 2021-04-25 15:58:17
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 16:58:08
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
      {{ changePassword(scope.row[prop]) }}
    </template>
  </el-table-column>
</template>

<script>
import { Decrypt } from '@/utils/utils';

export default {
  props: {
    // 当前作用的字段名
    prop: {
      type: String,
      default: ''
    }
  },
  computed: {
    changePassword() {
      return function(val) {
        return Decrypt(val);
      };
    }
  }
};
</script>
