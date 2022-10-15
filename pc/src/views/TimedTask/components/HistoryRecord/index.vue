<!--
 * @Descripttion: 搜索弹出表格
 * @Author: ytx
 * @Date: 2021-08-11 08:43:53
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-11 08:43:53
-->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    class="tableDialog"
    @sure-click="handleSubmit"
    @submit.native.prevent
  >
    <!-- 搜索框 -->
    <header>
      <el-date-picker
        style="width: 400px"
        v-model="executeTimeRange"
        type="datetimerange"
        range-separator="~"
        :start-placeholder="$t('common.startDate')"
        :end-placeholder="$t('common.endDate')"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="searchTable"
      >
      </el-date-picker>
    </header>
    <!-- 表格 -->
    <apiot-table
      class="tableDialog__table"
      :tableData="tableData"
      row-key="id"
      :dropColumnData="dropColumnData"
      :showRadio="isShowRadio"
      :currentRadioObj.sync="curRadioObj"
      dropClass=".tableDialog__table"
      @row-click="handleRowClick"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="$t(item.label)"
        :prop="item.prop"
        :sort-orders="['ascending', 'descending']"
        :colorIndex="item.colorIndex"
        :width="item.width"
        :is="item.compName"
        :iconCon="item.iconCon"
        :nameValue="item.nameValue"
        :typesPropName="item.typesPropName"
        show-overflow-tooltip
      ></component>
    </apiot-table>
    <footer v-if="hasPagination" class="m-l-10">
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
export default {
  props: {
    currentRadioObj: {
      type: Object
    },
    // 有无分页
    hasPagination: {
      type: Boolean,
      default: true
    },
    // 当前的列表(必须)
    columnArr: {
      type: Array,
      default: () => []
    },
    // 获取表数据方法(必须)
    getList: {
      type: Function,
      default: () => {}
    },
    // 额外的参数(必须)
    paramsObj: {
      type: Object,
      default: () => {}
    },
    // 是否显示
    isShow: {
      type: Boolean,
      default: () => {}
    },
    // 是否显示单选框
    isShowRadio: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表数据
      tableData: [],
      // 表数据
      dropColumnData: [],
      total: 0, // 总数目
      curRadioObj: null,
      executeTimeRange: '',
      current: 1, // 当前页面
      size: 10 // 当前一页数目
    };
  },

  components: {},

  computed: {},

  watch: {
    isShow(v) {
      if (v) {
        this.executeTimeRange = '';
        this.current = 1;
        this.getDate();
      }
    }
  },

  mounted() {},

  methods: {
    async getDate() {
      this.curRadioObj = this.currentRadioObj;
      this.dropColumnData = this.columnArr;
      this.getParentList();
    },
    async getParentList() {
      const data = {
        current: this.current,
        size: this.size,
        executeTimeRange: this.executeTimeRange,
        ...this.paramsObj
      };
      const res = await this.getList(data);
      this.tableData = res.records;
      this.total = res.total;
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getParentList();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getParentList();
    },
    // 点击本行
    handleRowClick(row) {
      this.curRadioObj = row;
    },
    // 查询表数据
    searchTable() {
      this.current = 1;
      this.getParentList();
    },
    handleSubmit() {
      this.$emit('update:currentRadioObj', this.curRadioObj);
    }
  }
};
</script>

<style lang='scss' scoped>
.tableDialog {
  header {
    height: 42px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
  footer {
    height: 40px;
  }
  ::v-deep {
    .el-radio__label {
      display: none;
    }
  }
}
</style>
