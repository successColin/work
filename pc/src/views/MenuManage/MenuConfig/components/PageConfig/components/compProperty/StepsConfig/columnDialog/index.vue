<template>
  <apiot-dialog
    class="column__main"
    title="选择字段"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <apiot-table
      ref="dicyionaryTable"
      :tableData="tableData"
      :dropColumnData="dictionaryColumnData"
      @selection-change="handleSelectionChange"
      @cellMouseEnter="cellMouseEnter"
      :selectable="canSelectEd"
      rowKey="id"
      highlight-current-row
      dropClass=".column__main"
    >
      <component
        v-for="(item, index) in dictionaryColumnData"
        :is="item.compName"
        :key="`${item.prop}_${index}`"
        :prop="item.prop"
        :label="`${item.label}`"
        :width="item.width"
        :type="item.type"
        :align="item.align"
        :fixed="item.fixed"
      ></component>
    </apiot-table>
  </apiot-dialog>
</template>

<script>
import { selectList } from '@/api/menuConfig';

export default {
  name: '',
  props: {
    curSelectArr: {
      type: Array,
      default: () => []
    },
    multiTable: {
      type: Object
    }
  },
  data() {
    return {
      dictionaryColumnData: [
        {
          label: '显示值',
          prop: '',
          compName: 'ElTableColumn'
        }
      ],
      multiArr: [],
      tableData: []
    };
  },
  computed: {
    getSelectIdsArr() {
      const arr = [];
      this.curSelectArr.forEach((item) => {
        arr.push(item.value);
      });
      return arr;
    }
  },
  mounted() {
    this.selectList();
    this.dictionaryColumnData[0].prop = this.multiTable.column.columnName;
  },
  components: {},
  methods: {
    // 确认按钮
    sureClick() {
      this.$emit('sureColumn', this.multiArr);
      this.multiArr = [];
      this.$emit('update:visible', false);
    },
    // 多选值选择变化
    handleSelectionChange(val) {
      this.multiArr = val;
    },
    // 鼠标移入
    cellMouseEnter(row, timer) {
      if (this.getSelectIdsArr.includes(row.id)) {
        clearTimeout(timer);
      }
    },
    canSelectEd(row) {
      if (this.getSelectIdsArr.includes(row.id)) {
        return false;
      }
      return true;
    },
    // 获取表数据
    async selectList() {
      const params = {
        selectContent: `id,${this.multiTable.column.columnName}`,
        selectFrom: this.multiTable.table.tableName,
        selectWhere: 'tombstone = 1'
      };
      const data = await selectList(params);
      this.tableData = data;
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
