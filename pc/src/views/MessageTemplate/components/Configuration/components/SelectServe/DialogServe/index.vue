<!--
 * @Author: sss
 * @Date: 2021-08-02 10:41:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-02 10:41:09
 * @Desc: 服务弹出框
-->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="serveDialog"
    :title="drawerTitle"
    :loading.sync="showLoading"
    :isBigDialog="true"
    :isShowFooter="false"
    @sure-click="handleSure"
  >
    <header class="serveDialog__header">
      <apiot-button @click="addServe">
        <i class="iconfont icon-xinzeng m-r-4 isTheme"></i
        >{{ $t('common.add', { name: '' }) }}
      </apiot-button>
    </header>
    <section class="serveDialog__main">
      <apiot-table
        ref="dicyionaryTable"
        :showSelection="false"
        :isAnimate="isAnimate"
        :tableData="tableData"
        :dropColumnData="columnData"
        highlight-current-row
        rowKey="id"
        dropClass=".serveDialog__main"
        @selection-change="handleSelectionChange"
      >
        <template slot="custom">
          <el-table-column :width="40" align="center" key="1" fixed="left">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <component
            v-for="(item, index) in columnData"
            :ref="`${item.prop}_${index}`"
            :is="item.compName"
            :key="`${item.prop}_${index}_${new Date().getTime()}`"
            :prop="item.prop"
            :label="`${$t(item.label)}`"
            :width="item.width"
            :align="item.align"
            :typesPropName="item.dictName"
            :rules="item.rules"
            :errorCell.sync="errorRow"
            @handleEdit="handleColumnEdit"
            @del="deleteServe"
          ></component>
          <el-table-column
            :sortable="false"
            :label="$t('common.operate')"
            fixed="right"
            resizable
            show-overflow-tooltip
            :width="100"
          >
            <template slot-scope="scope">
              <apiot-button
                v-if="scope.row.edit"
                @click.stop="save(scope.row, scope.$index)"
                type="text"
                >{{ $t('common.save') }}</apiot-button
              >
              <apiot-button
                v-else
                @click.stop="handleEdit(scope.row, scope.$index)"
                type="text"
                >{{ $t('common.edit1') }}</apiot-button
              >
              <apiot-button
                @click.stop="deleteServe(scope.row, scope.$index)"
                type="text"
                >{{ $t('common.delete1') }}</apiot-button
              >
            </template>
          </el-table-column>
        </template>
      </apiot-table>
    </section>
  </apiot-dialog>
</template>

<script>
import { getServeList, serveEdit, serveAdd, serveDel } from '@/api/messageTemplate';
import EditInputColumn from '../EditInputColumn';
import EditSelectColumn from '../EditSelectColumn';
import serveColumn from './column';

export default {
  components: { EditInputColumn, EditSelectColumn },

  props: {
    drawerTitle: {
      type: String,
      default: ''
    },
    messageType: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      showLoading: false,
      tableData: [],
      addIndex: 0,
      isAnimate: true,
      multiExpressionArr: [],
      errorRow: []
    };
  },

  computed: {
    columnData() {
      return serveColumn[`Column_${this.messageType}`];
    },
    buttonArr() {
      return function(row) {
        if (row.edit) {
          return [
            { name: 'common.save', funcName: 'save' },
            { name: 'common.delete1', funcName: 'del' }
          ];
        }
        return [
          { name: 'common.edit1', funcName: 'edit' },
          { name: 'common.delete1', funcName: 'del' }
        ];
      };
    },
    // 私有属性
    serverProps() {
      const props = {};
      this.columnData.forEach((item) => {
        if (item.type === 'serverProps') props[item.prop] = '';
      });
      return props;
    },
    // 日志
    logData() {
      const log = {};
      this.columnData.forEach((item) => {
        const logItem = {
          name: this.$t(item.label)
        };
        if (item.dictName) logItem.transFormArr = this.$store.getters.getCurDict(item.dictName);
        log[item.prop] = logItem;
      });
      return log;
    }
  },

  methods: {
    init() {
      this.getList();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiExpressionArr = val;
    },
    // 添加一行
    addServe() {
      this.isAnimate = true;
      this.addIndex = +1;
      const data = [...this.tableData];
      data.push({
        id: new Date().getTime(),
        provider: 1,
        enabled: true,
        messageType: this.messageType,
        edit: true,
        opType: 'ADD'
      });
      this.tableData = [...data];
    },
    // 删除
    async deleteServe(row, index) {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });

      try {
        if (row.opType !== 'ADD') {
          this.showLoading = true;
          await serveDel({
            id: row.id,
            logData: {
              name: this.$t('messageTemplate.serveColumn.name'),
              value: 'serverName',
              deleteArr: [row]
            }
          });
          this.showLoading = false;
        }

        // 接口请求成功后进行删除实际数据
        const data = [...this.tableData];
        data.splice(index, 1);
        this.tableData = [...data];
        // 删除时如果删除的数据在错误日志中将对应的错误日志也删除
        const errorCell = [...this.errorRow];
        const newError = errorCell.filter((err) => err.index !== row.ID);
        this.errorRow = [...newError];
      } catch (error) {
        this.showLoading = false;
        let serverNameError = '';

        Object.keys(error).forEach((key) => {
          const column = this.columnData.find((item) => item.prop === key);
          serverNameError = `${this.$t(column.label)}${error[key]}`;
        });

        this.$message.error(serverNameError);
      }
    },
    // 校验整行
    verification(row) {
      const { columnData } = this;
      let flag = false;
      for (let i = 0, len = columnData.length; i < len; i += 1) {
        const element = columnData[i];
        const { prop, rules, label } = element;
        const isRequire = rules.find((item) => item.required === true) || '';
        let columnValue = row[prop];
        let errorCell = '';
        if (typeof columnValue !== 'number') columnValue = columnValue || '';
        if (isRequire && !columnValue) {
          const { message } = isRequire;

          // 不能为空
          errorCell = {
            index: row.id,
            prop,
            errorMsg: this.$t(message, { any: this.$t(label) })
          };
          flag = true;
        }

        // 寻找错误信息中是否有该错误
        const index = this.errorRow.findIndex((err) => err.index === row.id && err.prop === prop);
        // 如果有错误信息
        if (errorCell) {
          if (index === -1) this.errorRow.push(errorCell);
          else this.errorRow[index] = errorCell;
          break;
        } else if (!errorCell && index !== -1) this.errorRow.splice(index, 1);
      }
      return flag;
    },
    // 编辑或者新增
    save(row, index) {
      // 如果行编辑校验不通过，则不进行保存
      if (this.verification(row, index)) return;
      const serverProps = { ...this.serverProps };
      Object.keys(serverProps).forEach((item) => {
        serverProps[item] = row[item];
      });
      row.serverProps = JSON.stringify(serverProps);
      if (row.opType !== 'ADD') this.serveEdit(row, index);
      else this.serveAdd(row, index);
    },
    async serveAdd(formData, index) {
      delete formData.id;
      try {
        const { logData } = this;
        let data = await serveAdd({ ...formData, logData });
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        // 处理数据
        let { serverProps = '' } = data;
        serverProps = JSON.parse(serverProps);
        data = { ...data, ...serverProps };
        this.editStatus(data, index, false);
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.drawerTitle })
          })
        });
      } catch (error) {
        this.showLoading = false;
        let serverNameError = '';

        Object.keys(error).forEach((key) => {
          const column = this.columnData.find((item) => item.prop === key);
          serverNameError = `${this.$t(column.label)}${error[key]}`;
        });

        this.$message.error(serverNameError);
      }
    },
    async serveEdit(formData, index) {
      try {
        const { logData } = this;
        let data = await serveEdit({ ...formData, logData });
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        // 处理数据
        let { serverProps = '' } = data;
        serverProps = JSON.parse(serverProps);
        data = { ...data, ...serverProps };
        this.editStatus(data, index, false);
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.drawerTitle })
          })
        });
      } catch (error) {
        this.showLoading = false;
        let serverNameError = '';
        Object.keys(error).forEach((key) => {
          const column = this.columnData.find((item) => item.prop === key);
          serverNameError = `${this.$t(column.label)}${error[key]}`;
        });

        this.$message.error(serverNameError);
      }
    },
    handleColumnEdit(row, index) {
      this.handleEdit(row, index);
    },
    handleEdit(row, index) {
      this.isAnimate = false;
      this.editStatus(row, index, true);
    },
    editStatus(row, index, isEdit = true) {
      const data = [...this.tableData];
      row.edit = isEdit;
      data[index] = row;
      this.tableData = [...data];
    },
    handleSure() {},
    // 获取列表
    async getList() {
      this.errorRow = [];
      this.showLoading = true;
      const { messageType } = this;
      const list = await getServeList({
        messageType
      });
      const recode = [];
      list.forEach((item) => {
        let { serverProps = '' } = item;
        serverProps = JSON.parse(serverProps);
        recode.push({ ...item, ...serverProps });
      });
      this.tableData = [...recode];
      this.showLoading = false;
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '_v/MessageTemplate/index.scss';
$--name: 'serveDialog';
$--headerHeight: 30px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);
.serveDialog__header {
  margin-bottom: 10px;
}
</style>
