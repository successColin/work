<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.dataSource.columnName"
    v-show="false"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span> {{ configData.name }} </span>
      </span>
    </template>
    <div slot-scope="scope">
      <div class="notEditable">
        <component
          class="btnStyle"
          v-for="(child, i) in configData.children"
          :key="child.compId"
          :is="child.compName"
          :parent="parent"
          :featureArr="parent"
          :i="i"
          :configData="child"
          :tableInfo="areaData"
          :fileDeleteIds="[]"
          :moreOperateArr="[]"
          :isTableBtn="true"
          :getIdCompId="getIdCompId"
          :multiEntityArr="multiEntityArr"
          :rowData="scope.row"
          :unique="scope.row[getIdCompId]"
          @tableDelete="tableDelete(scope)"
        ></component>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  name: '',
  mixins: [tableCol],
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {
    // 删除还未新增到数据库的列
    tableDelete(scope) {
      // console.log(12222222222222222);
      this.$emit('deleteTableRow', scope.$index);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';
.notEditable {
  .btnStyle {
    height: 100%;
    display: inline-flex;
    &:first-child {
      margin-left: 0;
    }
  }
  ::v-deep {
    .notShow + .show {
      margin-left: 0;
    }
  }
}
</style>
