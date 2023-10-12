<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable :prop="prop">
    <template slot-scope="scope">
      <apiot-input v-model="tableData[scope.row.index].valueType">
      </apiot-input>
      <!-- [scope.row.index].valueType -->
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
    },
    tableData: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped></style>
