<template>
  <apiot-dialog
    v-on="$listeners"
    v-bind="$attrs"
    title="选择初始值"
    @sure-click="handleSubmit"
  >
    <div
      class="dialog"
      :class="[{ apiotNoData1: dropColumnData.length === 0 }]"
    >
      <apiot-table
        class="filterableInput__table"
        :tableData="tableData"
        row-key="id"
        :dropColumnData="dropColumnData"
        v-if="dropColumnData.length"
        :showRadio="true"
        :currentRadioObj.sync="curRadioObj"
        dropClass=".filterableInput__table"
        @row-click="handleRowClick"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="item.label"
          :prop="item.prop"
          :colorIndex="item.colorIndex"
          :width="item.width"
          :is="dropColumnData[index].compName"
          :iconCon="item.iconCon"
          :nameValue="item.nameValue"
          :typesPropName="item.typesPropName"
        ></component>
      </apiot-table>
      <footer v-if="dropColumnData.length">
        <apiot-pagination
          :total="total"
          :pager-count="5"
          :current-page="current"
          :page-size="size"
          layout="total,  prev, pager, next, sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></apiot-pagination>
      </footer>
    </div>
  </apiot-dialog>
</template>

<script>
import { selectMulList } from '@/api/menuConfig';

export default {
  name: '',
  props: {
    tableInfo: {
      type: Object
    },
    selfLevelColumn: {
      type: Object
    }
  },
  data() {
    return {
      dropColumnData: [],
      tableData: [],
      curRadioObj: null,
      current: 1, // 当前页面
      size: 10, // 当前一页数目
      total: 0 // 总数目
    };
  },
  components: {},
  mounted() {
    if (this.selfLevelColumn.startId) {
      this.curRadioObj = {
        id: this.selfLevelColumn.startId
      };
      this.curRadioObj[this.selfLevelColumn.columnName] = this.selfLevelColumn.start;
    }
    this.getList();
  },
  methods: {
    async getList() {
      const params = {
        tableName: this.tableInfo.tableName,
        current: this.current,
        size: this.size
      };
      const data = await selectMulList(params);
      // console.log(data);
      if (data.records.length) {
        if (this.dropColumnData.length === 0) {
          Object.keys(data.records[0]).forEach((key) => {
            this.dropColumnData.push({
              label: key,
              prop: key,
              compName: 'ElTableColumn'
            });
          });
        }
        this.tableData = data.records;
        this.total = data.total;
      }
    },
    // 点击本行
    handleRowClick(row) {
      this.curRadioObj = row;
    },
    // 查询表数据
    searchTable() {
      this.current = 1;
      this.getList();
    },
    handleSubmit() {
      this.$emit('btnSure', this.curRadioObj);
      this.$emit('update:visible', false);
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getList();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getList();
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  width: 100%;
  height: 100%;
  .filterableInput__table {
    height: calc(100% - 42px) !important;
  }
}
</style>
