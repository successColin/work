<!--
 * @Descripttion: 转换类型
 * @Author: ytx
 * @Date: 2022-08-15 16:21:33
 * @Last Modified by: ytx
 * @Last Modified time: 2022-08-15 16:21:33
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
      <div>
        {{ showVal(scope.row[prop]) }}
      </div>
    </template>
  </el-table-column>
</template>

<script>
import { typeArr } from '../../config';

export default {
  props: {
    prop: {
      type: String,
      default: ''
    }
  },

  computed: {
    showVal() {
      return function (v) {
        const obj = this.typeArr.find((item) => item.value === v);
        return (obj && obj.name) || '无';
      };
    },
    typeArr() {
      return typeArr;
    }
  }
};
</script>
