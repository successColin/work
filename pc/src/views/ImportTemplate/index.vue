<!--
 * @Descripttion: 导入模板配置
 * @Author: ytx
 * @Date: 2021-06-29 17:09:47
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 17:09:47
-->
<template>
  <apiot-content
    class="importTemplate"
    :asideLoading="asideLoading"
    :contentLoading="contentLoading"
  >
    <!-- 左侧内容 -->
    <template v-slot:sidebar>
      <sidebar-list
        ref="sidebarList"
        @changeGroup="changeGroup"
        :asideLoading.sync="asideLoading"
      ></sidebar-list>
    </template>
    <template>
      <!-- 右侧内容 -->
      <div class="importTemplate__content">
        <!-- 按钮 -->
        <header class="importTemplate__header">
          <apiot-button
            type="primary"
            @click="addimportTemplate"
            v-if="!isSystem"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>
            {{ $t('common.add', { name: $t('importTemplate.template') }) }}
          </apiot-button>
          <apiot-button @click="deleteimportTemplate" v-if="!isSystem">
            <i class="iconfont icon-shanchu m-r-4"></i>
            {{ $t('common.delete', { name: $t('importTemplate.template') }) }}
          </apiot-button>
          <search-input
            @getList="resetPages"
            v-model="params.keywords"
          ></search-input>
        </header>
        <!-- 表格 -->
        <section class="importTemplate__main">
          <apiot-table
            :tableData="tableData"
            row-key="tableName"
            :highlight-current-row="true"
            :current-row-key="currentRowkey"
            :dropColumnData="dropColumnData"
            @selection-change="handleSelectionChange"
            dropClass=".importTemplate__main"
            ref="importTemplateTable"
          >
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
              :iconCon="item.iconCon"
              :nameValue="item.nameValue"
              :width="item.width"
              :is="item.compName"
              :fixed="item.fixed"
              :objName="item.objName"
              @editFun="editFun"
              @configFun="configFun"
              @downloadFun="downloadFun"
            ></component>
          </apiot-table>
        </section>
        <!-- 分页 -->
        <footer v-show="total !== 0">
          <apiot-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @handle-cancel="doUnSelect"
            :current-page="params.current"
            :page-size="params.size"
            :total="total"
            :selectedNum="multiEntityArr.length"
          ></apiot-pagination>
        </footer>
        <!-- 编辑和新增 -->
        <edit-page
          :title="drawerTitle"
          :visible.sync="showEditorDrawer"
          :visibleState="showEditorDrawer"
          :currentTableObj.sync="currentTableObj"
          :isAddDrawerState="isAddDrawerState"
          :groupId="groupId"
          :isSystem="isSystem"
          @getList="getList"
        ></edit-page>
        <!-- 配置 -->
        <apiot-tabs
          class="importTemplate__tabs"
          :showTabs.sync="showTabs"
          :tabsArr="tabsArr"
          value="ConfigTemplate"
        >
          <template slot="ConfigTemplate">
            <config-template
              :currentTableObj="currentTableObj"
            ></config-template>
          </template>
        </apiot-tabs>
      </div>
    </template>
  </apiot-content>
</template>

<script>
import { Decrypt, getBlob, saveAs } from '_u/utils';
import { getPageTemplate, deleteTemplate } from '@/api/importTemplate';
import query from '@/api/query';
import SidebarList from './components/SidebarList';
import EditPage from './components/EditPage';
import ConfigTemplate from './components/ConfigTemplate';

export default {
  data() {
    return {
      asideLoading: true,
      contentLoading: true,
      // 抽屉__是否显示抽屉
      showEditorDrawer: false,
      // 抽屉__是否新增
      isAddDrawerState: false,
      // 抽屉__编辑表格当前对象
      currentTableObj: {},
      // 所属组的id
      groupId: -10,
      // 分页数据
      params: {
        current: 1,
        size: 10,
        parentid: '',
        keywords: ''
        // orders: [{ asc: false, column: 'id' }]
      },
      total: 0,
      tableData: [], // 表格结果数据
      multiEntityArr: [], // 选中的数据
      currentRowkey: '', // 当前行的key
      // 是否显示设备导入模板
      showTabs: false,
      dropColumnData: [
        // 模板名称
        {
          label: 'importTemplate.templateName',
          prop: 'templateName',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'common.type',
          prop: 'templateTpye',
          compName: 'TypesColumn',
          typesPropName: 'TEMPLATE_TYPE'
        },
        // 实体表
        {
          label: 'importTemplate.entityTable',
          compName: 'RoleColumn',
          iconCon: 'icon-shujubiao',
          colorIndex: 2,
          nameValue: 'relationsList',
          objName: 'tableName'
        },
        // 备注
        {
          label: 'importTemplate.descr',
          prop: 'remarks',
          compName: 'ElTableColumn'
        },
        // 编辑
        {
          buttonArr: [
            { name: 'common.edit1', funcName: 'editFun' },
            {
              name: 'importTemplate.config',
              funcName: 'configFun'
            },
            {
              name: 'common.download',
              funcName: 'downloadFun'
            }
          ],
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ] // 表格列数据
    };
  },
  components: {
    SidebarList,
    EditPage,
    ConfigTemplate
  },
  computed: {
    // 抽屉标题
    drawerTitle() {
      return this.isAddDrawerState
        ? this.$t('common.add', { name: this.$t('importTemplate.template') })
        : this.$t('common.edit', { name: this.$t('importTemplate.template') });
    },
    // tabs标题
    tabsArr() {
      return [
        {
          label: this.currentTableObj.templateName,
          compName: 'ConfigTemplate',
          key: 'ConfigTemplate'
        }
      ];
    },
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiEntityArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    },
    isSystem() {
      return this.groupId === -10;
    }
    // 多选数据List的集合
    // multiListArr() {
    //   const temp = [];
    //   this.multiEntityArr.forEach((item) => {
    //     temp.push({ groupId: item.groupId, tableName: item.tableName });
    //   });
    //   return temp;
    // }
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('getCurrentDict', 'REQUEST_TYPE,COLUMNS_TYPE,TEMPLATE_TYPE');
    },
    // 按钮控制
    getButtonArr(arr) {
      if (this.isSystem && Array.isArray(arr)) {
        const item = JSON.parse(JSON.stringify(arr));
        item.shift();
        return item;
      }
      return arr;
    },
    // 改变分组
    changeGroup(item) {
      this.groupId = item.id;
      this.params.parentid = item.id;
      // this.$refs.addimportTemplate.initFormData({ groupId: this.groupId });
      this.resetPages();
    },
    // 获取数据
    async getList() {
      const res = await getPageTemplate(this.params);
      this.contentLoading = false;
      this.total = res.total;
      this.tableData = res.records;
      this.$nextTick(() => {
        this.$refs.sidebarList.changeTableTotal(res.total);
      });
    },
    // 按钮__添加模板
    addimportTemplate() {
      this.showEditorDrawer = true;
      this.isAddDrawerState = true;
      this.currentTableObj = {};
    },
    // 按钮__删除模板
    async deleteimportTemplate() {
      if (!this.multiIdsString) {
        // 枚举值不能为空
        return this.$message({
          type: 'error',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('helpCenter.deleteData') })
        });
      }
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('importTemplate.template') }),
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        await deleteTemplate({
          ids: this.multiIdsString
        });
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.resetPages();
      });
    },
    // 按钮__点击编辑
    editFun(arr) {
      this.currentTableObj = arr;
      this.showEditorDrawer = true;
      this.isAddDrawerState = false;
    },
    // 按钮__配置
    configFun(v) {
      this.showTabs = true;
      this.currentTableObj = v;
    },
    // 按钮__下载
    async downloadFun(v) {
      const url = `${query.DO_Import_Config}?id=${v.id}`;
      getBlob(
        {
          url,
          token: Decrypt(localStorage.getItem('token') || ''),
          method: 'GET',
          contentType: 'application/vnd.ms-excel; charset=UTF-8'
        },
        (blob) => {
          // console.log(blob);
          saveAs(blob, `${v.templateName}.xls`);
          this.loading = false;
        }
      );
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    },
    // 重置页数
    resetPages() {
      this.params.current = 1;
      this.getList();
    },
    // 分页__分页大小
    handleSizeChange(val) {
      this.params.size = val;
      this.resetPages();
    },
    // 分页__当前也
    handleCurrentChange(val) {
      this.params.current = val;
      this.getList();
    },
    // 分页__清除勾选
    doUnSelect() {
      this.multiEntityArr = [];
      this.$refs.importTemplateTable.clearSelection();
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'importTemplate';
// 头部的高度
$--headHeight: 42px;

@include setLayout($--name, $--headHeight);

.importTemplate {
  &__tabs {
    ::v-deep {
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__item.is-active {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333 !important;
      }
      .el-tabs__nav-scroll {
        height: 46px;
      }
      .el-tabs__nav {
        position: absolute;
        top: 0;
        left: 120px;
      }
    }
  }
}
</style>
