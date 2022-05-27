<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    title="选择存储过程"
    class="filterableInput__dialog"
    @sure-click="handleSubmit"
  >
    <header>
      <div class="header__title">选择存储过程</div>
      <search-input
        @getList="searchTable"
        v-model="dictKeywords"
      ></search-input>
    </header>
    <apiot-table
      class="filterableInput__table"
      :tableData="tableData"
      :row-key="getLable"
      :dropColumnData="dropColumnData"
      :showRadio="true"
      :currentRadioObj.sync="curRadioObj"
      :selectName="getLable"
      dropClass=".filterableInput__table"
      @row-click="handleRowClick"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="$t(item.label)"
        :prop="item.prop"
        :sortable="false"
        :sort-orders="['ascending', 'descending']"
        :colorIndex="item.colorIndex"
        :width="item.width"
        :is="dropColumnData[index].compName"
        :iconCon="item.iconCon"
        :nameValue="item.nameValue"
        :typesPropName="item.typesPropName"
      ></component>
    </apiot-table>
    <footer v-if="hasPagination">
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
  </apiot-dialog>
</template>

<script>
import { listProcedures } from '@/api/menuConfig';

export default {
  props: {
    currentRadioObj: {
      type: Object
    },
    tableName: {
      type: String
    },
    // 有无分页
    hasPagination: {
      type: Boolean,
      default: false
    },
    // 字段类型集合
    columnTypes: {
      type: String,
      default: ''
    },
    idNeedId: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表数据
      tableData: [],
      // 弹出框的搜索词
      dictKeywords: '',
      // 表数据
      dropColumnData: [],
      current: 1, // 当前页面
      size: 10, // 当前一页数目
      total: 0, // 总数目
      curRadioObj: null,
      selectValue: '', // 分组选择结果
      selectArr: [] // 分组选择值
    };
  },

  components: {},

  computed: {
    getLable() {
      return 'id';
    }
  },

  mounted() {
    this.curRadioObj = this.currentRadioObj;
    this.getList();
    this.getDropColumnData();
  },

  methods: {
    getDropColumnData() {
      this.dropColumnData.push({
        label: '存储过程',
        prop: 'proceduresName',
        compName: 'ElTableColumn'
      }); // 表格列数据;
    },
    // 获取列表数据
    async getList() {
      const params = {
        keywords: this.dictKeywords
      };
      const res = await listProcedures(params);
      this.tableData = res;
      // console.log(this.tableData);
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
      this.$emit('update:currentRadioObj', this.curRadioObj);
    }
  }
};
</script>

<style lang='scss' scoped>
.filterableInput {
  &__dialog {
    header {
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__title {
        font-size: 13px;
        color: #333333;
      }
    }
    footer {
      height: 40px;
    }
  }
  // &__table {

  // }
  ::v-deep {
    .el-radio__label {
      display: none;
    }
  }
}
</style>
