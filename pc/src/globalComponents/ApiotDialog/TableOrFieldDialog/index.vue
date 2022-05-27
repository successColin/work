<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="headerTitle"
    class="filterableInput__dialog"
    @sure-click="handleSubmit"
  >
    <header>
      <div class="header__title">{{ headerTitle }}</div>
      <search-input
        v-if="dialogType !== 3 && dialogType !== 4"
        @getList="searchTable"
        v-model="dictKeywords"
      ></search-input>
      <condition-input
        v-if="dialogType === 3 || dialogType === 4"
        @getList="searchTable"
        v-model="dictKeywords"
        :selectValue.sync="selectValue"
        :selectArr="selectArr"
      ></condition-input>
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
        :sortable="dialogType !== 3 ? 'custom' : false"
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
import { getListSysEntityTables, listSysEntityColumns } from '@/api/entityManage';
import { listDictByType, listDict } from '@/api/dictManage';
import { pagePanel, getPageSysImportTemplateList } from '@/api/menuConfig';

export default {
  props: {
    currentRadioObj: {
      type: Object
    },
    dialogType: {
      type: Number
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
    },
    // 字段不展示系统字段
    notShowSys: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    isSelPanel: {
      type: Boolean,
      default: false
    },
    tableArr: {
      type: Array,
      default: () => []
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
    headerTitle() {
      if (this.dialogType === 1) {
        return '实体表';
      }
      if (this.dialogType === 2) {
        return this.tableName;
      }
      if (this.dialogType === 3) {
        return '字典';
      }
      if (this.dialogType === 4) {
        return '面板';
      }
      return this.title || '';
    },
    getLable() {
      switch (this.dialogType) {
        case 1:
          return 'tableName';
        case 2:
          return 'columnName';
        case 3:
          return 'dictKey';
        case 4:
          return 'id';
        case 5:
          return 'id';
        default:
          return 'id';
      }
    }
  },

  mounted() {
    this.curRadioObj = this.currentRadioObj;
    this.$store.dispatch('getCurrentDict', 'TABLES_TYPE,COLUMNS_TYPE,TEMPLATE_TYPE');
    if (this.dialogType === 3) {
      this.setSelectDictArr();
    }
    if (this.dialogType === 4) {
      this.setSelectPanelArr();
    }
    this.getList();
    this.getDropColumnData();
  },

  methods: {
    getDropColumnData() {
      if (this.dialogType === 1) {
        this.dropColumnData.push(
          {
            label: 'entity.entityTable.tableNameLabel',
            prop: 'tableName',
            compName: 'RoleColumn',
            iconCon: 'icon-shujubiao',
            colorIndex: 2,
            nameValue: ['tableName']
          },
          {
            label: 'entity.entityTable.memoLabel',
            prop: 'memo',
            colorIndex: 4,
            compName: 'ElTableColumn'
          },
          {
            label: 'entity.entityTable.typeDictLabel',
            prop: 'typeDict',
            typesPropName: 'TABLES_TYPE',
            colorIndex: 3,
            compName: 'TypesColumn'
          }
        ); // 表格列数据;
      } else if (this.dialogType === 2) {
        this.dropColumnData.push(
          {
            label: 'entity.fieldTable.columnName',
            prop: 'columnName',
            compName: 'ElTableColumn'
          },
          {
            label: 'entity.fieldTable.memo',
            prop: 'memo',
            colorIndex: 4,
            compName: 'ElTableColumn'
          },
          {
            label: 'entity.fieldTable.columnTypeDict',
            prop: 'columnTypeDict',
            typesPropName: 'COLUMNS_TYPE',
            colorIndex: 3,
            compName: 'TypesColumn'
          }
        ); // 表格列数据;
      } else if (this.dialogType === 3) {
        this.dropColumnData.push(
          // 编码
          {
            label: 'dictionary.kecode',
            prop: 'dictKey',
            compName: 'ElTableColumn',
            width: 100
          },
          {
            label: 'dictionary.dictionaryEntry',
            prop: 'dictName',
            compName: 'RoleColumn',
            iconCon: 'icon-zidian',
            colorIndex: 3,
            nameValue: ['dictName'],
            width: 150
          },
          // 枚举值
          {
            label: 'dictionary.enumValue',
            prop: 'dictValueFormat',
            compName: 'TypesColumn'
          }
        );
      } else if (this.dialogType === 4) {
        this.dropColumnData.push(
          {
            label: 'menuConfig.paneTable.paneName',
            prop: 'panelName',
            compName: 'ElTableColumn'
          },
          // 类型
          {
            label: 'menuConfig.paneTable.paneType',
            prop: 'panelType',
            colorIndex: [1, 2],
            typesPropName: 'PANEL_TYPE',
            compName: 'TypesColumn'
          },
          // 备注
          {
            label: 'menuConfig.paneTable.memo',
            prop: 'memo',
            compName: 'ElTableColumn'
          }
        );
      } else if (this.dialogType === 5) {
        this.dropColumnData.push(
          {
            label: '模板名称',
            prop: 'templateName',
            compName: 'ElTableColumn'
          },
          // 类型
          {
            label: '类型',
            prop: 'templateTpye',
            typesPropName: 'TEMPLATE_TYPE',
            compName: 'TypesColumn'
          },
          // 备注
          {
            label: '备注说明',
            prop: 'remarks',
            compName: 'ElTableColumn'
          }
        );
      }
    },
    // 获取列表数据
    async getList() {
      if (this.tableArr.length) {
        this.tableData = this.tableArr;
        this.rowKey = 'tableName';
        return;
      }
      if (this.dialogType === 1) {
        const params = {
          keywords: this.dictKeywords
        };
        if (this.isTree) {
          params.treeDict = 1;
        }
        const res = await getListSysEntityTables(params);
        this.tableData = res;
        this.rowKey = 'tableName';
      } else if (this.dialogType === 2 && this.tableName !== '') {
        const params = {
          keywords: this.dictKeywords,
          columnTypes: this.columnTypes,
          tableName: this.tableName
        };
        if (this.notShowSys) {
          params.allowApplication = 2;
        }
        let res = await listSysEntityColumns(params);
        if (this.notShowSys) {
          res = res.filter((item) => {
            if (item.columnName === 'root_path' || item.columnName === 'parent_id') {
              return false;
            }
            // 设备位置表 需要排除position_id
            // if (this.tableName === 'sys_device' || this.tableName === 'sys_position') {
            //   if (item.columnName === 'position_id') {
            //     return false;
            //   }
            // }
            return true;
          });
        }
        if (this.idNeedId) {
          this.tableData = res;
        } else {
          const arr = [];
          res.forEach((item) => {
            if (item.columnName !== 'id') {
              arr.push(item);
            }
          });
          this.tableData = arr;
        }
      } else if (this.dialogType === 3) {
        const params = {
          keywords: this.dictKeywords,
          dictType: this.selectValue,
          current: this.current,
          size: this.size
        };
        const res = await listDictByType(params);
        const dictList = res.records.map((item) => {
          const dictValueFormatArry = item.dictValue.map((value) => value.zhCN);
          item.dictValueFormat = dictValueFormatArry.join(',');
          return item;
        });
        this.tableData = dictList;
        this.total = res.total;
      } else if (this.dialogType === 4) {
        const params = {
          current: this.current,
          keywords: this.dictKeywords,
          panelType: this.selectValue,
          size: this.size,
          relationMenuDesignId: this.$route.query.id,
          unDesign: 1,
          panelClassify: this.isSelPanel ? 2 : 1,
          clientType: this.$route.query.isApp === '1' ? 2 : 1
        };
        // console.log(params);
        const res = await pagePanel(params);
        this.tableData = res.records;
        this.total = res.total;
      } else if (this.dialogType === 5) {
        const params = {
          keywords: this.dictKeywords
        };
        const res = await getPageSysImportTemplateList(params);
        this.tableData = res.records;
        this.total = res.total;
      }
    },
    // 设置字典选择值
    async setSelectDictArr() {
      if (!this.$store.state.dictManage.DICT_TYPE) {
        const { DICT_TYPE } = await listDict({ dictKeys: 'DICT_TYPE' });
        DICT_TYPE.forEach((item) => {
          if (item[`${localStorage.apiotLanguage}`]) {
            item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
          }
        });
        this.selectArr = DICT_TYPE;
      } else {
        this.selectArr = this.$store.state.dictManage.DICT_TYPE;
      }
    },
    // 设置面板
    async setSelectPanelArr() {
      if (!this.$store.state.dictManage.PANEL_TYPE) {
        const { PANEL_TYPE } = await listDict({ dictKeys: 'PANEL_TYPE' });
        PANEL_TYPE.forEach((item) => {
          if (item[`${localStorage.apiotLanguage}`]) {
            item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
          }
        });
        this.selectArr = PANEL_TYPE;
      } else {
        this.selectArr = this.$store.state.dictManage.PANEL_TYPE;
      }
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
