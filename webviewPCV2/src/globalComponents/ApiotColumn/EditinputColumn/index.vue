<!--
 * @Descripttion: 表格__用户角色（左边人icon图标，右边人名）
 * @Author: ytx
 * @Date: 2021-04-25 15:17:14
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 16:10:48
-->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <apiot-input
        size="small"
        v-model="scope.row[prop]"
        @blur="blurInput(scope)"
        v-bind="inputAttr"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: '',
          })
        "
      ></apiot-input>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      default: ''
    },
    inputAttr: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    blurInput(scope) {
      console.log(scope);
      this.$emit('handleEdit', scope.row, scope.row.index, this.prop);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
