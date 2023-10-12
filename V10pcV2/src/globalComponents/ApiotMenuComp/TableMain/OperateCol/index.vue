<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
    v-show="false"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span> {{ configData.name }}</span>
      </span>
    </template>
    <div slot-scope="scope" class="notEditable">
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
  mounted() {
    console.log(this.areaData);
  },
  methods: {
    // 删除还未新增到数据库的列
    tableDelete(scope) {
      // console.log(12222222222222222);
      this.$emit('deleteTableRow', scope.row.index);
    },
  },
  watch: {
    'configData.name': function (v) {
      console.log(v);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
.notEditable {
  display: flex;
  align-items: center;
  .btnStyle {
    height: 100%;
    display: inline-flex;
    &:first-child {
      margin-left: 0;
    }
  }
  ::v-deep {
    .notShow:first-child + .show {
      margin-left: 0;
    }
  }
}
</style>
