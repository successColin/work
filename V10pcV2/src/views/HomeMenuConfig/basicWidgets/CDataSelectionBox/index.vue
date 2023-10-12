/**
* @name: index
* @author: DELL
* @date: 2022/1/11 9:43
* @description：index
* @update: 2022/1/11 9:43
*/
<!-- 页面 -->
<template>
  <div class="CDataSelectionBox">
    <div class="dataInner">{{ renderHtml }}</div>
    <div class="dataAdd" @click="visible=true">
      <span class="icon-bianji iconfont"></span>
    </div>
    <apiot-dialog
        :visible.sync="visible"
        :title="getTitleName"
        :isBigDialog="true"
        :isNeedBtn="false"
        @cancle-click="handleCancel"
        @sure-click="handleOk"
    >
      <div class="tableWrap" v-loading="loading">
        <div class="searchWrap">
          <el-input
              @input.native="searchInput"
              @keyup.enter.native="searchBlur"
              @blur.native="inputBlur"
              placeholder="请输入内容"
              v-model="keywords">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchBlur"></i>
          </el-input>
        </div>
        <div class="tableContentWrap">
          <apiot-table
              :height="472"
              :tableData="tableData"
              :border="false"
              :showRadio="true"
              :currentRadioObj.sync="curRadioObj"
              :selectName="getSelectName"
              @row-click="handleRowClick"
              style="width: 100%">
            <el-table-column
                :prop="item.key"
                :label="item.label"
                v-for="item in getColumnArr"
                :key="item.key"
            >
            </el-table-column>
          </apiot-table>
        </div>
        <div class="footerWrap">
          <div class="paginationWrap">
            <el-pagination
                :total="total"
                background
                :current-page="current"
                :pager-count="5"
                :layout="layout"
                :page-sizes="pageSizes"
                :page-size="size"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
          </div>
<!--          <div class="btnWrap">-->
<!--            <apiot-button @click="handleCancel">取消</apiot-button>-->
<!--            <apiot-button type="primary" @click="handleOk">确定</apiot-button>-->
<!--          </div>-->
        </div>
      </div>
    </apiot-dialog>
  </div>

</template>

<script>
// import { getTableList, getObvious, getFiledsByPage } from '@/api/design';
import { getObvious } from '@/api/design';

export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    type: { // 显示类型
      type: String,
      default: 'tableName'
    },
    otherParams: { // 其他参数
      type: Object,
      default() {
        return {};
      }
    },
    columnArr: { // 表头
      type: Array,
      default() {
        return [];
      }
    },
    selectName: { // 主键字段
      type: String,
      default: 'id'
    },
    inverseField: { // 反显字段
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      keywords: '',
      layout: 'total,  prev, pager, next, sizes',
      pageSizes: [10, 20, 30, 40],
      size: 10,
      current: 1,
      total: 0,
      tableData: [],
      initValue: [], // 初始数据
      curRadioObj: {}
    };
  },

  components: {},

  computed: {
    renderHtml() {
      if (this.type === 'tableName') {
        return this.value.tableName || '';
      }
      if (this.type === 'dataSource') {
        console.log(this.initValue[this.inverseField], this.initValue, this.inverseField);
        return this.inverseField ? this.initValue[this.inverseField] || '' : this.initValue.name || '';
      }
      if (this.type === 'filedName') {
        return this.value.name || '';
      }
      return '';
    },
    getSelectName() {
      if (this.type === 'tableName') {
        return 'tableName';
      }
      if (this.type === 'dataSource') {
        return this.selectName || 'id';
      }
      if (this.type === 'filedName') {
        return 'name';
      }
      return 'id';
    },
    getTitleName() {
      if (this.type === 'tableName') {
        return '请选择数据源';
      }
      if (this.type === 'dataSource') {
        return '请选择明细';
      }
      if (this.type === 'filedName') {
        return '请选择字段';
      }
      return '';
    },
    getColumnArr() {
      if (this.columnArr.length) {
        return this.columnArr;
      }
      if (this.type === 'tableName') {
        return [{
          label: '数据源',
          key: 'tableName'
        }, {
          label: '描述',
          key: 'memo'
        }];
      }
      if (this.type === 'filedName') {
        return [{
          label: '名称',
          key: 'name'
        }, {
          label: '描述',
          key: 'memo'
        }];
      }
      return [];
    }
  },

  mounted() {
    this.curRadioObj = JSON.parse(JSON.stringify(this.value));
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        this.initValue = JSON.parse(JSON.stringify(v));
        this.curRadioObj = JSON.parse(JSON.stringify(this.value));
      }
    },
    visible: {
      deep: true,
      handler(v) {
        if (v) {
          this.current = 1;
          this.init();
        }
      }
    }
  },

  methods: {
    getApi() {
      // if (this.type === 'tableName') {
      //   return getTableList;
      // }
      if (this.type === 'dataSource' && this.otherParams.columns) {
        return getObvious;
      }
      // if (this.type === 'filedName') {
      //   return getFiledsByPage;
      // }

      return '';
    },
    getQueryParams() {
      if (this.type === 'tableName') {
        return {
          current: this.current,
          size: this.size,
          keywords: this.keywords,
          dataSourceId: window.atob(this.$route.query.dataId)
        };
      }
      if (this.type === 'dataSource') {
        return {
          current: this.current,
          size: this.size,
          keywords: this.keywords,
          ...this.otherParams,
          // dataSourceId: window.atob(this.$route.query.dataId)
        };
      }
      if (this.type === 'filedName') {
        return {
          current: this.current,
          size: this.size,
          keywords: this.keywords,
          ...this.otherParams,
          dataSourceId: window.atob(this.$route.query.dataId)
        };
      }
      return {};
    },
    async init() {
      const api = this.getApi();
      if (!api) { return; }
      const params = this.getQueryParams();
      this.loading = true;
      try {
        const res = await api(params);
        const { records = [], total = 0 } = res;
        this.tableData = records;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    sizeChange(pageSize) {
      this.size = pageSize;
      this.init();
    },
    currentChange(current) {
      this.current = current;
      this.init();
    },
    handleOk() {
      this.visible = false;
      this.$emit('handleSelect', this.curRadioObj);
    },
    handleCancel() {
      this.visible = false;
      this.curRadioObj = this.initValue;
    },
    searchBlur() {
      this.current = 1;
      this.init();
    },
    searchInput(e) {
      if (!e.target.value) {
        this.current = 1;
        this.init();
      }
    },
    inputBlur() {
      this.current = 1;
      this.init();
    },
    // 点击本行
    handleRowClick(row) {
      this.curRadioObj = row;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.CDataSelectionBox {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  background: #ffffff;
  cursor: pointer;
  box-sizing: border-box;

  .dataInner {
    flex: 1;
    height: 32px;
    padding-left: 5px;
    color: #333333;
    line-height: 30px;
    border-bottom: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .dataAdd {
    width: 32px;
    height: 32px;
    display: flex;
    background: #ffffff;
    align-items: center;
    justify-content: center;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;

    & > span {
      color: #e9e9e9;
    }
  }

  &:hover .dataInner {
    border-bottom: 1px solid #C0C4CC;
    border-left: 1px solid #C0C4CC;
    border-top: 1px solid #C0C4CC;
  }

  &:hover .dataAdd {
    border: 1px solid #C0C4CC;
  }

  &:hover .dataAdd > span {
    color: #C0C4CC;
  }

  .tableWrap {
    width: 100%;
    height: 100%;

    .searchWrap {
      width: 100%;
      height: 40px;
      padding-right: 10px;
      display: flex;
      //align-items: center;
      justify-content: right;
      box-sizing: border-box;

      .el-input--suffix {
        width: 250px;

        //::v-deep {
        //  .el-input__inner {
        //    height: 30px;
        //    line-height: 30px;
        //    background-color: #192757;
        //    border-color: #2F437F;
        //    color: #ffffff;
        //
        //    &:focus {
        //      border-color: #4689F5;
        //      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        //    }
        //  }
        //
        //  .el-input__icon {
        //    line-height: 30px;
        //  }
        //}
      }
    }

    .tableContentWrap {
      height: calc(100% - 80px);
    }

    .footerWrap {
      width: 100%;
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e9e9e9;
      box-sizing: border-box;

      //.paginationWrap {
      //  ::v-deep {
      //    .el-pagination__total {
      //      color: #fff;
      //    }
      //
      //    .el-pager li {
      //      font-weight: normal;
      //      background-color: #233366;
      //      color: #fff;
      //    }
      //
      //    .el-pager li.active {
      //      background-color: unset;
      //      border: 1px solid #409EFF;
      //      line-height: 26px;
      //      box-sizing: border-box;
      //    }
      //
      //    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      //      color: #409EFF;
      //    }
      //
      //    .el-input__inner {
      //      background-color: #233366;
      //      color: #fff;
      //      border: none;
      //    }
      //
      //    .el-pagination__sizes .el-input .el-input__inner:hover {
      //      color: #409EFF;
      //    }
      //  }
      //}

      .btnWrap {
        margin-right: 10px;
      }
    }
  }
}
</style>
