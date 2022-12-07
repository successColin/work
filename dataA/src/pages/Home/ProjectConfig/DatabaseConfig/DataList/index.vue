/**
* @name: index
* @author: DELL
* @date: 2021/10/30 15:28
* @description：index
* @update: 2021/10/30 15:28
*/
<!-- 页面 -->
<template>
  <div class="dataListWrap">
    <div class="dataListHeader">
      <CButton type="primary" @click="doAdd"><i class="el-icon-edit"></i> 新增</CButton>
      <CButton @click="doDel"><i class="el-icon-delete"></i> 删除</CButton>
    </div>
    <div class="dataListContent">
      <CTable
          :height="472"
          :tableData="tableData"
          @selection-change="selectRows"
          :border="false"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="数据库名"
        >
        </el-table-column>
        <el-table-column
            prop="ip"
            label="主机名/IP"
            width="280">
        </el-table-column>
        <el-table-column
            prop="port"
            label="端口"
            width="100">
        </el-table-column>
        <el-table-column
            prop="username"
            label="用户名">
        </el-table-column>
        <el-table-column
            prop="datasourceType"
            label="数据库">
          <template slot-scope="scope">
            <span>{{ renderName(scope.row.datasourceType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <span @click="doEdit(scope.row)" class="editWrap">编辑</span>
          </template>
        </el-table-column>
      </CTable>
    </div>
    <CDialog
        :visible.sync="visible"
        :isNeedCancelBtn="false"
        classStyle="normalDialog"
        :title="title"
        @handleOk="handleOk"
    >
      <ServeConfig ref="serveConfig" :info="infoObj" v-if="visible"/>
    </CDialog>
  </div>
</template>

<script>
import {addDatasource, delDatasource, updateDatasource} from '@/services/home';

const ServeConfig = () => import('./ServerConfig/index');

export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    init: {
      type: Function
    }
  },
  data() {
    return {
      visible: false,
      infoObj: {},
      title: '新增数据库',
      selectedKeys: []
    };
  },

  components: {
    ServeConfig
  },

  computed: {
    renderName() {
      return function (type) {
        if (type === 1) {return 'MYSQL';}
        if (type === 2) {return 'ORACLE';}
        if (type === 3) {return 'SQLSERVER';}
        return '';
      }
    }
  },

  mounted() {
  },
  watch: {},

  methods: {
    selectRows(rows) {
      this.selectedKeys = rows;
    },
    doEdit(obj) {
      this.visible = true;
      const info = {
        ...obj,
        datasourceName: obj.name
      }
      this.title = '编辑数据库';
      this.infoObj = info;
    },
    doAdd() {
      this.visible = true;
      this.infoObj = {};
      this.title = '新增数据库';
    },
    doDel() {
      if (!this.selectedKeys.length) {
        this.$message.error('请选择要删除的数据！');
        return
      }
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.selectedKeys.map((item) => item.id).join(',');
        try {
          await delDatasource({ids})
          await this.init();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleOk() {
      this.$refs.serveConfig.$refs.numberValidateForm.validate((valid) => {
        if (valid) {
          const {obj} = this.$refs.serveConfig;
          const params = {
            ...obj
          }
          this.handleSave(params);
        } else {
          return false;
        }
        return false;
      });
    },
    async handleSave(param) {
      try {
        const api = this.infoObj.id ? updateDatasource : addDatasource;
        const params = this.infoObj.id ? {
          ...param,
          id: this.infoObj.id
        } : param;
        await api(params);
        await this.init();
        this.visible = false;
      } catch (e) {
        console.log(e);
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.dataListWrap {
  width: 100%;
  height: 100%;

  ::v-deep {
    .normalDialog {
      .el-dialog {
        width: 640px;
      }

      .el-dialog__body {
        height: 462px;
      }
    }
  }

  .dataListHeader {
    height: 50px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    box-sizing: border-box;
  }

  .dataListContent {
    width: 100%;
    height: calc(100% - 50px);
    padding: 0 20px;
    box-sizing: border-box;

    ::v-deep {
      .el-table__header .has-gutter .el-table__cell {
        padding: 0 !important;
      }

      .el-table th.el-table__cell {
        height: 40px;
        padding: 0;
        background: #192757;
        box-shadow: 0px 1px 0px 0px #2F437F, 0px -1px 0px 0px #2F437F;
      }

      .el-table, .el-table__expanded-cell {
        background: #131E45;
      }

      .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
        padding: 6px 0;
        border-bottom: 1px solid #2F437F;
      }

      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
        background-color: #4689F5;
      }

      .el-table__body tr.hover-row.current-row > td.el-table__cell, .el-table__body tr.hover-row.el-table__row--striped.current-row > td.el-table__cell, .el-table__body tr.hover-row.el-table__row--striped > td.el-table__cell, .el-table__body tr.hover-row > td.el-table__cell {
        background-color: #4689F5;
      }

      .el-table th.el-table__cell > .cell {
        padding-left: 14px;
      }

      .el-table--border::after, .el-table--group::after, .el-table::before {
        display: none;
      }

      .el-table-column--selection .cell {
        padding-right: 0;
      }

      .el-table__fixed-right::before, .el-table__fixed::before {
        background-color: unset;
      }

      .el-table .cell, .el-table--border .el-table__cell:first-child .cell {
        padding-left: 14px
      }
    }

    .editWrap {
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
