/**
* @name: index
* @author: DELL
* @date: 2023/9/1 8:51
* @description：index
* @update: 2023/9/1 8:51
*/
<!-- 页面 -->
<template>
  <div class="expert" v-loading="loading">
    <div class="header">
      <div>
        <apiot-button type="primary" @click="handleAdd" v-if="!isComponet">
          <i class="iconfont icon-xinzeng m-r-4"></i>
          新增
        </apiot-button>
        <!--        <apiot-button @click="handleEdit">-->
        <!--          <i class="iconfont icon-bianji m-r-4"></i>-->
        <!--          编辑-->
        <!--        </apiot-button>-->
      </div>
      <div>
        <search-input
            @getList="handleSearch"
            v-model="params.keyword"
        ></search-input>
      </div>
    </div>
    <div class="main">
      <apiot-table
          ref="taskMain"
          :tableData="tableData"
          highlight-current-row
          :hasBigButton="true"
          :isNeedColumnDrop="false"
          :isNeedAsync="true"
          @selection-change="handleSelectionChange"
      >
        <component
            v-for="(item, index) in getColumnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="$t(item.label)"
            :buttonArr="item.buttonArr"
            :fixed="item.fixed"
            @editFun="editFun"
            @deleteFun="deleteFun"
        ></component>
      </apiot-table>

    </div>
    <div class="footer">
      <apiot-pagination
          v-show="tableData.length"
          ref="pagination"
          :total="total"
          :size.sync="params.size"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @handle-cancel="handleCancle"
      ></apiot-pagination>
    </div>
    <Detials
        ref="Detials"
        :targetObj="targetUser"
        @refresh="init"
        :loading="loading"/>
  </div>
</template>

<script>
import { getList, delUser } from '@/api/expert';
import OperationColumn from './components/operationColumn';
import StateColumn from './components/stateColumn';
import Detials from './components/operationExpert';

export default {
  props: {
    isComponet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      targetUser: {},
      loading: false,
      params: {
        keyword: '',
        size: 20,
        current: 1,
        orders: [{
          asc: true,
          column: 'stateid'
        }]
      },
      tableData: [],
      total: 0,
      selectKeys: [],
      columnData: [
        // 任务名称
        {
          label: 'expert.account',
          prop: 'account',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'expert.name',
          prop: 'username',
          compName: 'UserColumn'
        },
        // 周期
        {
          label: 'expert.status',
          prop: 'stateid',
          compName: 'StateColumn'
        },
        // 上次执行时间
        {
          label: 'expert.memo',
          prop: 'domain',
          compName: 'ElTableColumn'
        },
        {
          width: 100,
          fixed: 'right',
          compName: 'OperationColumn',
          label: 'knowledge.list_opea',
          buttonArr: [
            {
              name: 'common.edit1',
              funcName: 'editFun'
            },
            {
              name: 'common.delete1',
              funcName: 'deleteFun'
            },
          ]
        }
      ],
    };
  },

  components: {
    OperationColumn,
    Detials,
    StateColumn
  },

  computed: {
    getColumnData() {
      if (this.isComponet) {
        return this.columnData.slice(0, 4);
      }
      return this.columnData;
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.loading = true;
      this.targetUser = {};
      try {
        const res = await getList(this.params);
        const {
          total = 0,
          records = []
        } = res;
        this.total = total;
        this.tableData = records;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    deleteFun(row) {
      this.$confirm(`确定要删除${row.username || ''}专家吗？`,
          {
            type: 'warning',
            title: '提示'
          },
      )
          .then(async () => {
            try {
              await delUser({ ids: row.id });
              this.handleCurrentChange(1);
              this.$message.success('操作成功!');
            } catch (e) {
              this.$message.error('删除失败!');
            }
          });
    },
    editFun(row) {
      this.$refs.Detials.setVisible();
      this.targetUser = row;
    },
    // 选中取消
    handleCancle() {
      this.selectKeys = [];
      // this.$refs.taskMain.clearSelection();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.selectKeys = val;
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.params.current = 1;
      this.params.size = size;
      this.init();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.params.current = page;
      this.init();
    },
    handleAdd() {
      this.targetUser = {};
      this.$refs.Detials.setVisible();
    },
    handleSearch() {
      this.params.current = 1;
      this.init();
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.expert {
  //width: 100%;
  //height: 100%;
  overflow: hidden;

  .header {
    height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    box-sizing: border-box;

    .icon-bianji {
      color: #4689F5;
    }
  }

  .main {
    width: 100%;
    height: calc(100% - 42px - 48px);
  }

  .footer {
    width: 100%;
    height: 42px;
    background: #FFFFFF;
    box-shadow: inset 0px 1px 0px 0px #E9E9E9;
  }
}
</style>
