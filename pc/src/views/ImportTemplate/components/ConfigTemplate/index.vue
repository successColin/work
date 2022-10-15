<!--
 * @Descripttion: 设备导入模板
 * @Author: ytx
 * @Date: 2021-07-05 14:37:39
 * @Last Modified by: ytx
 * @Last Modified time: 2021-07-05 14:37:39
-->
<template>
  <section class="configTemplate">
    <!-- 头部按钮 -->
    <header>
      <apiot-button type="primary" @click="handleAddField">
        <i class="iconfont icon-xinzeng m-r-4"></i>
        {{ $t('common.add', { name: $t('importTemplate.field') }) }}
      </apiot-button>
      <apiot-button @click="handleBulkLoad">
        <i class="iconfont icon-piliangcaozuo m-r-4"></i>
        {{ $t('importTemplate.batchLoadField') }}
      </apiot-button>
      <apiot-button @click="handleDeleteField">
        <i class="iconfont icon-shanchu m-r-4"></i>
        {{ $t('common.delete', { name: $t('importTemplate.field') }) }}
      </apiot-button>
      <search-input @getList="getList" v-model="params.keywords"></search-input>
    </header>
    <!-- 表格 -->
    <section class="configTemplate__main">
      <apiot-table
        :tableData="tableData"
        row-key="id"
        :highlight-current-row="true"
        :dropColumnData="dropColumnData"
        @selection-change="handleSelectionChange"
        @row-drop-end="handleRowDropEnd"
        :isNeedRowDrop="true"
        :isNeedColumnDrop="false"
        dropClass=".configTemplate__main"
        ref="configTemplateTable"
      >
        <el-table-column :width="40" align="center" key="1"
          ><i class="iconfont icon-zongxiangtuodong"></i
        ></el-table-column>
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          show-overflow-tooltip
          :buttonArr="item.buttonArr"
          :typesPropName="item.typesPropName"
          :colorIndex="item.colorIndex"
          :width="item.width"
          :is="item.compName"
          :fixed="item.fixed"
          :isNoodDisabled="item.isNoodDisabled"
          :judgeName="item.judgeName"
          @editFun="editFun"
          @switchChange="switchChange"
        ></component>
      </apiot-table>
    </section>
    <!-- 编辑和新增 -->
    <edit-page
      :title="drawerTitle"
      :visible.sync="showEditorDrawer"
      :visibleState="showEditorDrawer"
      :currentObj.sync="currentObj"
      :isAddDrawerState="isAddDrawerState"
      :giveChildValue="giveChildValue"
      :expressionList="expressionList"
      @getList="getList"
    ></edit-page>
    <!-- 单表导入 -->
    <singleload-dialog
      ref="singleloadDialog"
      :title="$t('importTemplate.batchLoadField')"
      :visible.sync="singleloadDialogVisible"
      :giveChildValue="giveChildValue"
      :fieldTableData="tableData"
      @getListFather="getList"
    ></singleload-dialog>
    <!-- 多表导入 -->
    <moreload-dialog
      ref="moreloadDialog"
      :title="$t('importTemplate.batchLoadField')"
      :visible.sync="moreloadDialogVisible"
      :giveChildValue="giveChildValue"
      :fieldTableData="tableData"
      @getListFather="getList"
    ></moreload-dialog>
  </section>
</template>

<script>
import {
  deleteCodeRule,
  deleteColoumns,
  getExpressionList,
  getListColoumns,
  updateModifyColoumnNotNull,
  updateModifyColoumnSno
} from '@/api/importTemplate';
import EditPage from './components/EditPage';
import MoreloadDialog from './components/MoreloadDialog';
import SingleloadDialog from './components/SingleloadDialog';
import ConversionType from './components/ConversionType';

export default {
  props: {
    currentTableObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      params: {
        parentid: '',
        // 模糊搜索
        keywords: ''
      },
      // 表数据
      tableData: [],
      // 抽屉__是否显示抽屉
      showEditorDrawer: false,
      // 抽屉__编辑表格当前对象
      currentObj: {},
      // 抽屉__是否新增
      isAddDrawerState: false,
      // 单选 是否显示批量载入
      singleloadDialogVisible: false,
      // 多选 是否显示批量载入
      moreloadDialogVisible: false,
      tableName: '',
      tableMemo: '',
      // 正则表达式
      expressionList: [],
      // 多选数组
      multiArr: [],
      dropColumnData: [
        // 所属表
        {
          label: 'importTemplate.owningTable',
          prop: 'tableName',
          compName: 'ElTableColumn'
        },
        // 字段名称
        {
          label: 'importTemplate.fieldName',
          prop: 'coloumnName',
          compName: 'ElTableColumn'
        },
        // 数据库字段
        {
          label: 'importTemplate.databaseField',
          prop: 'databaseColoumn',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'common.type',
          prop: 'coloumnType',
          compName: 'TypesColumn',
          typesPropName: 'COLUMNS_TYPE'
        },
        // 字段校验
        {
          label: 'importTemplate.fieldCheck',
          prop: 'check',
          compName: 'ElTableColumn'
        },
        // 数据转换
        {
          label: 'importTemplate.dataConversionType',
          prop: 'changeType',
          compName: 'ConversionType'
        },
        // 备注
        {
          label: 'importTemplate.remark',
          prop: 'remarks',
          compName: 'ElTableColumn'
        },
        // 必填
        {
          label: 'importTemplate.required',
          prop: 'isNotNull',
          compName: 'SwitchColumn',
          isNoodDisabled: true,
          judgeName: 'isCheckColoumn'
        },
        // 编辑
        {
          buttonArr: [{ name: 'common.edit1', funcName: 'editFun' }],
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ] // 表格列数据
    };
  },
  components: {
    EditPage,
    SingleloadDialog,
    MoreloadDialog,
    ConversionType
  },
  computed: {
    // 抽屉标题
    drawerTitle() {
      return this.isAddDrawerState
        ? this.$t('common.add', { name: this.$t('importTemplate.field') })
        : this.$t('common.edit', { name: this.$t('importTemplate.field') });
    },
    giveChildValue() {
      return {
        relationsList: this.currentTableObj.relationsList,
        id: this.currentTableObj.id
      };
    },
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    },
    // 多选数据ids的集合
    multiCodeIdsString() {
      let str = '';
      console.log(this.multiArr);
      this.multiArr.forEach((item) => {
        str += item.codeRuleId ? `${item.codeRuleId},` : '';
      });
      return str;
    }
  },
  watch: {},
  mounted() {
    this.getList();
    this.getExpression();
  },
  methods: {
    // 获取表达式
    async getExpression() {
      const res = await getExpressionList({
        expressionType: 'REGEX'
      });
      res.forEach((item) => {
        this.expressionList.push({
          value: item.id,
          name: item.description
        });
      });
    },
    // 按钮__新增字段
    handleAddField() {
      this.showEditorDrawer = true;
      this.isAddDrawerState = true;
    },
    // 按钮__批量载入字段
    handleBulkLoad() {
      const { relationsList } = this.currentTableObj;
      if (relationsList.length === 1) {
        // 单表
        const single = relationsList.find((item) => item.sno === 1);
        if (single) {
          // console.log(single);
          this.tableName = single.tableName;
          this.tableMemo = single.memo;
          this.singleloadDialogVisible = true;
          this.$nextTick(() => {
            this.$refs.singleloadDialog.getTableData(this.tableName, this.tableMemo);
          });
        }
      } else {
        this.moreloadDialogVisible = true;
        this.$refs.moreloadDialog.init(relationsList);
      }
    },
    // 按钮__删除字段
    async handleDeleteField() {
      if (!this.multiIdsString) {
        return this.$message({
          type: 'warning',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('helpCenter.deleteData') })
        });
      }
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('importTemplate.field') }),
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        // 删除字段数据
        await deleteColoumns({
          ids: this.multiIdsString
        });
        // 如果有自动编码将删除
        if (this.multiCodeIdsString) {
          await deleteCodeRule({
            ids: this.multiCodeIdsString
          });
        }
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.getList();
      });
    },
    // 获取列表
    async getList() {
      this.params.parentid = this.currentTableObj.id;
      const res = await getListColoumns(this.params);
      const arr = [];
      res.forEach((item) => {
        arr.push({
          ...item,
          isDisable: item.necessary === 1
        });
      });
      arr.forEach((item) => {
        if (item.databaseColoumn === 'level') {
          item.noUpdate = true;
        }
      });
      this.tableData = arr;
    },
    // 表格__编辑
    editFun(v) {
      this.showEditorDrawer = true;
      this.isAddDrawerState = false;
      this.currentObj = v;
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiArr = val.filter((v) => v.isDisable !== true);
    },
    // 是否必填
    async switchChange(v) {
      // 接口需要改
      await updateModifyColoumnNotNull({
        id: v.id,
        isNotNull: v.isNotNull
      });
      this.getList();
    },
    async handleRowDropEnd({ oldIndex, newIndex }) {
      // console.log(oldIndex, newIndex);
      const currentDictValue = this.tableData[oldIndex];
      this.tableData.splice(oldIndex, 1);
      this.tableData.splice(newIndex, 0, currentDictValue);
      // console.log(this.tableData);
      await updateModifyColoumnSno({
        id: this.tableData[newIndex].id,
        sno: newIndex + 1,
        templateId: this.currentTableObj.id
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.configTemplate {
  margin: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .icon-shanchu,
  .icon-piliangcaozuo {
    color: $--color-primary;
  }
  &__main {
    // flex: 1;
    margin-top: 9px;
    height: calc(100% - 50px);
  }
}
</style>
