<!--
 * @Descripttion: 异常明细
 * @Author: ytx
 * @Date: 2022-06-10 14:28:32
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-10 14:28:32
-->
<template>
  <!-- v-if="tableData.length !== 0" -->
  <div class="excDetails">
    <header>
      <div>异常明细</div>
      <apiot-button
        class="excDetails__button"
        :disabled="isDisabeld"
        @click="handleExport"
      >
        <i class="iconfont icon-daochu"></i>
        错误信息导出
      </apiot-button>
    </header>
    <el-table :data="currentDate" height="425" style="width: 100%">
      <el-table-column
        prop="name"
        :label="$t('importAndExport.location')"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="msg"
        :label="$t('importAndExport.errormessage')"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
    </el-table>
    <ApiotPagination
      :total="total"
      :size.sync="size"
      :current-page.sync="current"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></ApiotPagination>
  </div>
</template>

<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // tableData: [], // 表格结果数据
      dropColumnData: [
        {
          label: '定位',
          prop: 'name',
          compName: 'ElTableColumn'
        },
        {
          label: '错误信息',
          prop: 'msg',
          compName: 'ElTableColumn'
        }
      ],
      tableData: [],
      total: 0,
      current: 1,
      size: 20,
      currentDate: [],
      isDisabeld: true
    };
  },
  components: {},
  computed: {},
  watch: {
    checkInfo: {
      handler() {
        this.init();
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.current = 1;
      this.tableData = [];
      this.currentDate = [];
      const { List = [], errorRow, isCheckFinish } = this.checkInfo;
      if (List.length === 0) {
        this.isDisabeld = true;
      }
      List.forEach((item) => {
        const index = item.indexOf(',');
        this.tableData.push({
          name: item.slice(0, index),
          msg: item.slice(index + 1)
        });
      });
      this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
        (this.current - 1) * this.size,
        this.size
      );
      if (errorRow && isCheckFinish) {
        this.isDisabeld = false;
      }
      this.total = this.tableData.length;
    },
    // 每页大小改变
    sizeChange(size) {
      console.log(size);
      this.current = 1;
      this.size = size;
      this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
        (this.current - 1) * this.size,
        this.size
      );
      console.log(this.tableData, this.currentDate);
    },
    // 改变页码
    currentChange(current) {
      this.current = current;
      this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
        (this.current - 1) * this.size,
        this.size
      );
      console.log(this.current, this.size);
      console.log(this.tableData, this.currentDate);
    },
    handleExport() {
      // 列标题
      let str = '<tr><td>定位</td><td>错误信息</td></tr>';
      this.tableData.forEach((item) => {
        str += `<tr><td>${`${item.name}\t`}</td><td>${`${item.msg}\t`}</td></tr>`;
      });
      // Worksheet名
      const worksheet = 'Sheet1';
      const uri = 'data:application/vnd.ms-excel;base64,';

      // 下载的表格模板数据
      const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table>${str}</table></body></html>`;
      // 下载模板
      const url = uri + window.btoa(unescape(encodeURIComponent(template)));

      const link = document.createElement('a');
      link.href = url;
      link.download = '错误信息明细.xls';
      link.click();
    }
  }
};
</script>
<style lang='scss' scoped>
.excDetails {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 13px 0 13px 1px;
    }
  }
  &__table {
    height: 200px;
  }
  &__button {
    font-size: 14px;
    i {
      font-size: 16px;
      color: #4689f5;
      margin-right: 4px;
    }
  }
  &__button.is-disabled {
    i {
      opacity: 0.4;
    }
  }
}
</style>
