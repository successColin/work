<!-- 字段管理 -->
<template>
  <section class="field__content" v-loading="showLoading">
    <header class="field__header">
      <apiot-button type="primary" @click="addField">
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: $t('entity.column') }) }}
      </apiot-button>
      <apiot-button @click="deleteField">
        <i class="iconfont icon-shanchu m-r-4"></i
        >{{ $t('common.delete', { name: $t('entity.column') }) }}
      </apiot-button>
      <search-input @getList="getColumnList" v-model="keyWord"></search-input>
    </header>
    <section class="field__main">
      <apiot-table
        :tableData="tableData"
        row-key="columnName"
        :highlight-current-row="true"
        :current-row-key="currentRowkey"
        :dropColumnData="dropColumnData"
        @selection-change="handleSelectionChange"
        @cellMouseEnter="cellMouseEnter"
        :selectable="canSelectEd"
        ref="fieldTable"
        dropClass=".field__main"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          show-overflow-tooltip
          :width="item.width"
          :is="dropColumnData[index].compName"
          :typesPropName="item.typesPropName"
          :colorIndex="item.colorIndex"
          :showFunc="showFunc"
          :fixed="item.fixed"
          @edit="editField"
        ></component>
      </apiot-table>
    </section>
    <add-field
      :curDrawerType="curDrawerType"
      :visible.sync="drawer"
      :tableName="tableName"
      @addOrEditClick="sureClick"
      ref="addField"
    ></add-field>
  </section>
</template>

<script>
import { batchDeleteColumns, listSysEntityColumns } from '@/api/entityManage';
import bus from '@/utils/bus';
import AddField from './AddField';

export default {
  props: {
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showLoading: false,
      keyWord: '', // 搜索关键字
      tableData: [], // 表格结果数据
      dropColumnData: [
        // 字段名称
        {
          label: 'entity.fieldTable.columnName',
          prop: 'columnName',
          compName: 'ElTableColumn'
        },
        // 备注
        {
          label: 'entity.fieldTable.memo',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        // 是否必填
        {
          label: 'entity.fieldTable.requisiteDict',
          prop: 'requisiteDict',
          // typesPropArr: this.$store.state.dictManage.REQUISITE_TYPE,
          typesPropName: 'REQUISITE_TYPE',
          colorIndex: 103,
          compName: 'TypesColumn'
        },
        // 默认值
        {
          label: 'entity.fieldTable.defaultValue',
          prop: 'defaultValue',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'entity.fieldTable.columnTypeDict',
          prop: 'columnTypeDict',
          colorIndex: [1, 2, 3, 4, 5, 4, 4],
          // typesPropArr: this.$store.state.dictManage.COLUMNS_TYPE,
          typesPropName: 'COLUMNS_TYPE',
          compName: 'TypesColumn'
        },
        // 长度
        {
          label: 'entity.fieldTable.columnLength',
          prop: 'columnLength',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'entity.entityTable.typeDictLabel',
          prop: 'typeDict',
          typesPropName: 'TABLES_TYPE',
          colorIndex: 4,
          compName: 'TypesColumn'
        },
        // 操作
        {
          compName: 'OperateColumn',
          fixed: 'right'
        }
      ], // 表格列数据
      curDrawerType: 1, // 新增为 1 编辑为2
      drawer: false, // 是否展示新增、编辑
      currentRowkey: '', // 当前行
      multiEntityArr: []
    };
  },

  components: {
    AddField
  },

  computed: {
    // 多选数据ids的集合
    multiStringObj() {
      let ids = '';
      let columnNames = '';
      this.multiEntityArr.forEach((item) => {
        ids += `${item.id},`;
        columnNames += `${item.columnName},`;
      });
      return { ids, columnNames };
    }
  },

  mounted() {},

  methods: {
    showFunc(data) {
      return data.typeDict === 1;
    },
    cellMouseEnter(row, timer) {
      if (row.typeDict === 1) {
        clearTimeout(timer);
      }
    },
    canSelectEd(row) {
      if (row.typeDict === 1) {
        return false;
      }
      return true;
    },
    // 获取操作数组
    getDropColumnData() {
      if (/^sys_/.test(this.tableName)) {
        this.dropColumnData.pop();
      }
      // console.log(this.dropColumnData);
    },
    // 初始化操作
    init() {
      this.getColumnList();
      // this.getDropColumnData();
    },
    // 添加操作
    addField() {
      this.curDrawerType = 1;
      this.drawer = true;
    },
    // 删除操作
    deleteField() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectDelData')
        });
      }
      this.batchDeleteColumns();
    },
    async batchDeleteColumns() {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.showLoading = true;
      try {
        await batchDeleteColumns({
          ids: this.multiStringObj.ids,
          columnNames: this.multiStringObj.columnNames,
          tableName: this.tableName,
          logData: {
            operateType: 3,
            name: this.$t('entity.fieldTable.columnName'),
            value: 'columnName',
            deleteArr: this.multiEntityArr
          }
        });
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('entity.column') })
          })
        });
        this.getColumnList();
      } catch (error) {
        this.showLoading = false;
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    // 编辑
    editField(row) {
      // console.log('编辑', row);
      this.curDrawerType = 2;
      this.drawer = true;
      this.$refs.addField.initFormData(row);
    },
    async getColumnList() {
      try {
        this.showLoading = true;
        const params = {
          keywords: this.keyWord,
          tableName: this.tableName
        };
        const data = await listSysEntityColumns(params);
        const arr = data.filter((item) => {
          if (item.columnTypeDict === 4) {
            item.columnLength = `${item.columnLength},${item.decimalPlace}`;
          }
          return true;
        });

        this.tableData = arr;
        // this.$refs.fieldTable.clearSelection();
        this.showLoading = false;
        this.$nextTick(() => {
          if (this.currentRowkey) {
            const index = data.findIndex((item) => item.columnName === this.currentRowkey);
            this.$refs.fieldTable.scrollToCur(index);
          }
        });
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 添加编辑实体 确认的外抛事件
    sureClick(data) {
      // console.log('确认按钮2', data);
      if (this.curDrawerType === 1) {
        this.currentRowkey = data.columnName;
      }
      this.getColumnList();
    },
    // 多选更改
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    }
  },

  watch: {
    drawer(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.addField) {
        this.$refs.addField.resetForm();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'field';
// 头部的高度
$--headHeight: 48px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100vw - 20px - 20px);
// 计算表格最短宽度
$--minWidth: calc(1024px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
.field__content {
  min-width: $--minWidth;
}
</style>
