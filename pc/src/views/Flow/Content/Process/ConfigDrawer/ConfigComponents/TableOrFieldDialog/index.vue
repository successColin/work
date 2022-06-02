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
  </apiot-dialog>
</template>

<script>
import { listDict } from '@/api/dictManage';

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
    title: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
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
    this.getDropColumnData();
  },

  methods: {
    getDropColumnData() {
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
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
    },
    // 点击本行
    handleRowClick(row) {
      this.curRadioObj = row;
    },
    // 查询表数据
    searchTable() {
      this.current = 1;
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
