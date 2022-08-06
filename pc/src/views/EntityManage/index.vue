<!-- 实体管理 -->
<template>
  <apiot-content
    class="entity"
    :asideLoading="asideLoading"
    :contentLoading="contentLoading"
  >
    <template v-slot:sidebar>
      <sidebar-list
        ref="sidebarList"
        @changeGroup="changeGroup"
        :asideLoading.sync="asideLoading"
      ></sidebar-list>
    </template>
    <template>
      <div class="entity__content">
        <header class="entity__header">
          <apiot-button type="primary" @click="addEntity" v-if="groupId !== 1">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{ $t('common.add', { name: $t('entity.entity') }) }}
          </apiot-button>
          <apiot-button @click="syncData">
            <i class="iconfont icon-tongbu m-r-4"></i
            >{{ $t('common.asyncData') }}
          </apiot-button>
          <apiot-button @click="deleteEntity" v-if="groupId !== 1">
            <i class="iconfont icon-shanchu m-r-4"></i
            >{{ $t('common.delete', { name: $t('entity.entity') }) }}
          </apiot-button>
          <!-- <apiot-button @click="testClick">
            <i class="iconfont icon-shanchu m-r-4"></i>测试按钮
          </apiot-button> -->
          <search-input
            @getList="getListSysEntityTables"
            v-model="keyWord"
          ></search-input>
        </header>
        <section class="entity__main">
          <apiot-table
            :tableData="tableData"
            row-key="tableName"
            :highlight-current-row="true"
            :current-row-key="currentRowkey"
            :dropColumnData="dropColumnData"
            @selection-change="handleSelectionChange"
            dropClass=".entity__main"
            ref="entityTable"
          >
            <component
              v-for="(item, index) in dropColumnData"
              :key="`${item.prop}_${index}`"
              :label="$t(item.label)"
              :prop="item.prop"
              sortable="custom"
              :sort-orders="['ascending', 'descending']"
              show-overflow-tooltip
              :typesPropArr="item.typesPropArr"
              :typesPropName="item.typesPropName"
              :colorIndex="item.colorIndex"
              :width="item.width"
              :is="dropColumnData[index].compName"
              :buttonArr="getButtonArr(item.buttonArr)"
              :fixed="item.fixed"
              @editEntity="editEntity"
              @editDetail="editDetail"
            ></component>
          </apiot-table>
        </section>
      </div>
      <add-entity
        ref="addEntity"
        :curDrawerType="curDrawerType"
        :visible.sync="drawer"
        :groupId="groupId"
        @addOrEditClick="sureClick"
        @resetGroup="resetGroup"
      ></add-entity>
      <entity-detail
        ref="editDetail"
        :showTabs.sync="showTabs"
        :tableName="currentTableName"
        :tableMemo="currentTableNameMemo"
      ></entity-detail>
    </template>
  </apiot-content>
</template>

<script>
import {
  delSysEntityTables,
  getListSysEntityTables,
  statisticsData,
  synchronizeEntities
} from '@/api/entityManage';
import bus from '@/utils/bus';
import AddEntity from './components/AddEntity';
import EntityDetail from './components/EntityDetail';
import SidebarList from './components/SidebarList';

export default {
  name: 'entityManage',
  data() {
    return {
      asideLoading: true,
      contentLoading: true,
      keyWord: '', // 搜索数据
      tableData: [], // 表格结果数据
      dropColumnData: [
        // 实体名称
        {
          label: 'entity.entityTable.tableNameLabel',
          prop: 'tableName',
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
        // 备注
        {
          label: 'entity.entityTable.memoLabel',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        // 编辑
        {
          buttonArr: [
            { name: 'entity.entityTable.operateBtn1', funcName: 'editEntity' },
            {
              name: 'entity.entityTable.operateBtn2',
              funcName: 'editDetail'
            }
          ],
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ], // 表格列数据
      drawer: false, // 是否打开新增编辑弹窗
      curDrawerType: 1, // 1 是新增 2是修改
      currentTableName: '', // 当前表名
      currentTableNameMemo: '', // 当前表备注
      currentRowkey: '', // 当前行的key
      showTabs: false, // 是否展示字段，索引，管理弹窗
      groupId: 1, // 所属组的id
      multiEntityArr: [] // 多选的arr
    };
  },

  components: {
    SidebarList,
    AddEntity,
    EntityDetail
  },

  computed: {
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiEntityArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    },
    // 多选数据List的集合
    multiListArr() {
      const temp = [];
      this.multiEntityArr.forEach((item) => {
        temp.push({ groupId: item.groupId, tableName: item.tableName });
      });
      return temp;
    }
  },
  activated() {
    // 查询 表类型TABLES_TYPE，REQUISITE_TYPE 是否必填，字段类型，索引类型，索引方法的字典，每次进该管理分组，调用
    this.$store.dispatch(
      'getCurrentDict',
      'TABLES_TYPE,REQUISITE_TYPE,COLUMNS_TYPE,INDEXES_TYPE,INDEXES_METHOD'
    );
  },
  mounted() {
    bus.$on('updateTable', this.updateTable);
  },

  methods: {
    // 获取操作数组
    getButtonArr(arr) {
      if (this.groupId === 1 && Array.isArray(arr)) {
        return [arr[1]];
      }
      return arr;
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    },
    // 添加实体
    addEntity() {
      this.curDrawerType = 1;
      this.drawer = true;
    },
    // 删除实体
    async deleteEntity() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectDelData')
        });
      }

      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });

      this.contentLoading = true;
      try {
        await delSysEntityTables({
          ids: this.multiIdsString,
          logData: {
            operateType: 3,
            name: this.$t('entity.entityTable.tableNameLabel'),
            value: 'tableName',
            deleteArr: this.multiListArr
          }
        });
        if (this.$refs.sidebarList) {
          this.$refs.sidebarList.getEntityList();
        }
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('entity.entity') })
          })
        });
      } catch (error) {
        this.contentLoading = false;
      }
    },
    // 编辑实体
    editEntity(row) {
      if (/^sys_/.test(row.tableName)) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.notAllowOperate')
        });
      }
      this.$refs.addEntity.initFormData(row);
      this.curDrawerType = 2;
      this.drawer = true;
    },
    // 打开字段、索引
    editDetail(row) {
      this.currentTableName = row.tableName;
      this.currentTableNameMemo = row.memo;
      this.showTabs = true;
      this.$refs.editDetail.setActiveName('FieldManage');
    },
    // 添加编辑实体 确认的外抛事件
    sureClick(data) {
      if (this.curDrawerType === 1) {
        this.currentRowkey = data.tableName;
      }
      // this.currentRowkey = 'ct_bbbbb';
      this.contentLoading = true;
      this.$refs.sidebarList.getEntityList();
      // this.getListSysEntityTables();
    },
    // 分组不存在重置分组
    resetGroup() {
      this.$refs.sidebarList.resetGroup();
    },
    // 同步数据
    async syncData() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectTable')
        });
      }
      const params = {
        list: this.multiListArr
      };
      this.contentLoading = true;
      try {
        await synchronizeEntities(params);
        this.contentLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', { name: this.$t('common.asyncData') })
        });
        this.getListSysEntityTables();
      } catch (error) {
        this.contentLoading = false;
      }
    },
    changeGroup(item) {
      this.groupId = item.id;
      this.$refs.addEntity.initFormData({ groupId: this.groupId });
      this.getListSysEntityTables();
    },
    // 获取实体表列表
    async getListSysEntityTables() {
      const params = {
        groupId: this.groupId,
        keywords: this.keyWord
      };
      this.contentLoading = true;
      try {
        const data = await getListSysEntityTables(params);
        this.tableData = data;
        this.contentLoading = false;
        this.$nextTick(() => {
          if (this.currentRowkey) {
            const index = data.findIndex((item) => item.tableName === this.currentRowkey);
            this.$refs.entityTable.scrollToCur(index);
          }
          this.$refs.sidebarList.changeTableTotal(data.length);
        });
      } catch (error) {
        this.contentLoading = false;
      }
    },
    // 更新
    updateTable() {
      this.showTabs = false;
      this.getListSysEntityTables();
    },
    testClick() {
      statisticsData({});
    }
  },

  watch: {
    drawer(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.addEntity) {
        this.$refs.addEntity.resetForm();
      }
    }
  },

  beforeDestroy() {
    bus.$off('updateTable', this.updateTable);
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'entity';
// 头部的高度
$--headHeight: 42px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100% - 20px);
// 计算表格最短宽度
$--minWidth: calc(763px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
.icon-tongbu {
  color: $--color-primary;
}
</style>
