<!-- 索引管理 -->
<template>
  <section class="index__content" v-loading="showLoading">
    <header class="index__header">
      <apiot-button type="primary" @click="addIndex">
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: $t('entity.indexes') }) }}
      </apiot-button>
      <apiot-button @click="deleteIndex">
        <i class="iconfont icon-shanchu m-r-4"></i
        >{{ $t('common.delete', { name: $t('entity.indexes') }) }}
      </apiot-button>
      <search-input
        @getList="listSysEntityTablesIndexes"
        v-model.trim="keyWord"
      ></search-input>
    </header>
    <section class="index__main">
      <apiot-table
        :tableData="tableData"
        row-key="indexesName"
        :highlight-current-row="true"
        :current-row-key="currentRowkey"
        :dropColumnData="dropColumnData"
        @selection-change="handleSelectionChange"
        dropClass=".index__main"
        ref="indexTable"
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
          :typesPropName="item.typesPropName"
          :colorIndex="item.colorIndex"
          :isNeedBg="item.isNeedBg"
          :is="dropColumnData[index].compName"
          :fixed="item.fixed"
          @edit="indexEdit"
          @switchChange="modifyIndexes"
        ></component>
      </apiot-table>
    </section>
    <add-index
      :curDrawerType="curDrawerType"
      :visible.sync="drawer"
      :tableName="tableName"
      :tableMemo="tableMemo"
      @addOrEditClick="sureClick"
      ref="addIndex"
    ></add-index>
  </section>
</template>

<script>
import { batchDeleteIndexes, listSysEntityTablesIndexes, modifyIndexes } from '@/api/entityManage';
import bus from '@/utils/bus';
import AddIndex from './AddIndex';

export default {
  props: {
    tableName: {
      type: String,
      default: ''
    },
    tableMemo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyWord: '',
      tableData: [], // 表格结果数据
      dropColumnData: [
        // 索引名称
        {
          label: 'entity.indexesTable.indexesName',
          prop: 'indexesName',
          compName: 'ElTableColumn'
        },
        {
          label: 'entity.indexesTable.memo',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        {
          label: 'entity.indexesTable.columnName',
          prop: 'columnName',
          colorIndex: 4,
          compName: 'TypesColumn'
        },
        {
          label: 'entity.indexesTable.typeDict',
          prop: 'typeDict',
          // typesPropArr: this.$store.state.dictManage.INDEXES_TYPE,
          typesPropName: 'INDEXES_TYPE',
          colorIndex: 3,
          compName: 'TypesColumn'
        },
        {
          label: 'entity.indexesTable.methodDict',
          prop: 'methodDict',
          isNeedBg: true,
          // typesPropArr: this.$store.state.dictManage.INDEXES_METHOD,
          typesPropName: 'INDEXES_METHOD',
          compName: 'TypesColumn'
        },
        {
          label: 'entity.indexesTable.isExecuted',
          prop: 'enabled',
          compName: 'SwitchColumn'
        },
        {
          compName: 'OperateColumn',
          fixed: 'right'
        }
      ], // 表格列数据
      curDrawerType: 1, // 1 是新增 2是编辑
      drawer: false,
      showLoading: false,
      currentRowkey: '', // 当前行
      multiEntityArr: [] // 多选结果
    };
  },

  components: {
    AddIndex
  },

  computed: {
    // 多选数据ids的集合
    multiStringObj() {
      let ids = '';
      this.multiEntityArr.forEach((item) => {
        ids += `${item.id},`;
      });
      return { ids };
    }
  },

  mounted() {},

  methods: {
    init() {
      this.listSysEntityTablesIndexes();
    },
    // 添加操作
    addIndex() {
      this.curDrawerType = 1;
      this.drawer = true;
    },
    // 删除操作
    deleteIndex() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectDelData')
        });
      }
      this.batchDeleteIndexes();
    },
    async batchDeleteIndexes() {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.showLoading = true;
      try {
        await batchDeleteIndexes({
          ids: this.multiStringObj.ids,
          tableName: this.tableName,
          logData: {
            operateType: 3,
            name: this.$t('entity.indexesTable.indexesName'),
            value: 'indexesName',
            deleteArr: this.multiEntityArr
          }
        });
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('entity.indexes') })
          })
        });
        this.listSysEntityTablesIndexes();
      } catch (error) {
        this.showLoading = false;
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    indexEdit(row) {
      this.curDrawerType = 2;
      this.drawer = true;
      this.$refs.addIndex.initFormData(row);
    },
    // 查询索引列表
    async listSysEntityTablesIndexes() {
      try {
        this.showLoading = true;
        const params = {
          keywords: this.keyWord,
          tableName: this.tableName
        };
        const data = await listSysEntityTablesIndexes(params);
        this.tableData = data;
        // console.log(data);
        this.showLoading = false;
        this.$nextTick(() => {
          if (this.currentRowkey) {
            const index = data.findIndex((item) => item.indexesName === this.currentRowkey);
            this.$refs.indexTable.scrollToCur(index);
          }
        });
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 添加编辑实体 确认的外抛事件
    sureClick(data) {
      if (this.curDrawerType === 1) {
        this.currentRowkey = data.indexesName;
      }
      this.listSysEntityTablesIndexes();
    },
    // 多选更改
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    },
    async modifyIndexes(row) {
      row.logData = {
        operateType: 2,
        indexesName: {
          name: this.$t('entity.indexesTable.indexesName')
        },
        memo: {
          name: this.$t('entity.indexesTable.memo')
        },
        columnName: {
          name: this.$t('entity.indexesTable.columnName')
        },
        typeDict: {
          name: this.$t('entity.indexesTable.typeDict'),
          transFormArr: this.$store.getters.getCurDict('INDEXES_TYPE')
        },
        methodDict: {
          name: this.$t('entity.indexesTable.methodDict'),
          transFormArr: this.$store.getters.getCurDict('INDEXES_METHOD')
        },
        enabled: {
          name: this.$t('entity.indexesTable.isExecuted'),
          transFormArr: [
            { name: '是', value: 1 },
            { name: '否', value: 2 }
          ]
        }
      };
      try {
        await modifyIndexes(row);
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    }
  },
  watch: {
    drawer(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.addIndex) {
        this.$refs.addIndex.resetForm();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'index';
// 头部的高度
$--headHeight: 48px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100vw - 20px - 20px);
// 计算表格最短宽度
$--minWidth: calc(1024px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
.index__content {
  min-width: $--minWidth;
}
</style>
