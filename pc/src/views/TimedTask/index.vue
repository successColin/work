<!--
 * @Descripttion: 定时任务
 * @Author: ytx
 * @Date: 2021-08-09 17:15:02
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-09 17:15:02
-->
<template>
  <section class="task" v-loading="contentLoading">
    <div class="task__content">
      <header class="task__header">
        <apiot-button type="primary" @click="handleAdd">
          <i class="iconfont icon-xinzeng m-r-4"></i>
          {{ $t('common.add', { name: this.$t('timedTask.timedTask') }) }}
        </apiot-button>
        <search-input
          @getList="handleSearch"
          v-model="params.keywords"
        ></search-input>
      </header>
      <section class="task__main">
        <apiot-table
          ref="taskMain"
          :tableData="tableData"
          :dropColumnData="columnData"
          highlight-current-row
          dropClass=".task__main"
          :hasBigButton="true"
          :isNeedAsync="true"
          @selection-change="handleSelectionChange"
          @sortChangeColumn="sortChange"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="$t(item.label)"
            :width="item.width"
            :switchWidth="58"
            :buttonArr="item.buttonArr"
            :buttonArr1="item.buttonArr1"
            :fixed="item.fixed"
            :typesPropName="item.typesPropName"
            :activeValue="1"
            :inactivevalue="3"
            :activeText="$t('common.enable')"
            :inactiveText="$t('common.disable')"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            @editFun="editFun"
            @switchChange="handleTempStatus"
            @performFun="performFun"
            @deleteFun="deleteFun"
            @historyFun="historyFun"
          ></component>
        </apiot-table>
        <!--  -->
      </section>
      <footer class="task__footer">
        <apiot-pagination
          v-show="tableData.length"
          ref="pagination"
          :total="total"
          :size.sync="params.size"
          :selectedNum="multiExpressionArr.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @handle-cancel="handleCancle"
        ></apiot-pagination>
      </footer>
    </div>
    <!-- 编辑、抽屉 -->
    <task-detail
      ref="detail"
      :title="drawerTitle"
      :visible.sync="showDetail"
      :isShow="showDetail"
      :currentObj.sync="currentObj"
      :isAdd="isAdd"
      @getList="getList"
      @close="handleClose"
    ></task-detail>
    <!-- 查看历史(公共弹窗) -->
    <history-record
      :title="$t('timedTask.taskHistory')"
      :visible.sync="dialogVisible"
      :isShow="dialogVisible"
      :columnArr="historyColumnArr"
      :getList="getHistoryList"
      :paramsObj="paramsObj"
      :isShowRadio="false"
      :isShowSure="false"
    ></history-record>
  </section>
</template>

<script>
import {
  getListPage,
  updateDisableJobConfig,
  updateEnableJobConfig,
  postDoJobConfig,
  deleteLogicDel,
  getPageHistory
} from '@/api/timedTask';
import TaskDetail from './components/TaskDetail/index.vue';
import OperationColumn from './components/OperationColumn';
import HistoryRecord from './components/HistoryRecord';

export default {
  name: 'timedTask',
  components: { TaskDetail, OperationColumn, HistoryRecord },

  props: {},

  data() {
    return {
      contentLoading: false,
      // 参数
      total: 0,
      params: {
        current: 1,
        size: 10,
        keywords: '',
        orders: []
      },
      tableData: [], // 列表数据
      multiExpressionArr: [], // 列表选中的数据
      operateType: 'add',
      showDetail: false,
      isAdd: true,
      // 选中对象
      currentObj: {},
      columnData: [
        // 任务名称
        {
          label: 'timedTask.missionName',
          prop: 'jobName',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'timedTask.type',
          prop: 'jobType',
          typesPropName: 'JOB_TYPE',
          compName: 'TypesColumn'
        },
        // 周期
        {
          label: 'timedTask.cycle',
          prop: 'cronDescription',
          compName: 'ElTableColumn'
        },
        // 上次执行时间
        {
          label: 'timedTask.lastExecutionTime',
          prop: 'lastExecuteTime',
          compName: 'ElTableColumn'
        },
        // 执行状态
        {
          label: 'timedTask.executionStatus',
          prop: 'jobStatus',
          typesPropName: 'JOB_STATUS',
          compName: 'StateColumn'
        },
        // 是否启用
        {
          label: 'timedTask.whetherToEnable',
          prop: 'jobStatus',
          compName: 'SwitchColumn',
          width: 150
        },
        {
          width: 270,
          fixed: 'right',
          compName: 'OperationColumn',
          buttonArr: [
            { name: 'common.edit1', funcName: 'editFun' },
            { name: 'common.delete1', funcName: 'deleteFun' },
            { name: 'timedTask.historyRecord', funcName: 'historyFun' }
          ],
          buttonArr1: [
            {
              name: 'timedTask.executeImmediately',
              funcName: 'performFun',
              type: 'primary'
            }
          ]
        }
      ],
      // 查看历史
      dialogVisible: false, // 是否显示
      historyColumnArr: [
        {
          label: 'timedTask.missionName',
          prop: 'jobName',
          compName: 'ElTableColumn'
        },
        {
          label: 'timedTask.executionTime',
          prop: 'executeTime',
          width: 180,
          compName: 'ElTableColumn'
        },
        {
          label: 'timedTask.executionResult',
          prop: 'executeResult',
          typesPropName: 'JOB_EXECUTE_RESULT',
          compName: 'StateColumn'
        },
        {
          label: 'timedTask.failureDescription',
          prop: 'errorMsg',
          compName: 'ElTableColumn'
        }
      ],
      paramsObj: {}
    };
  },

  computed: {
    drawerTitle() {
      return this.$t(this.operateType, { name: this.$t('timedTask.timedTask') });
    },
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiExpressionArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    }
  },

  watch: {},

  activated() {
    this.getList();
  },

  methods: {
    // 获取列表
    async getList() {
      this.contentLoading = true;
      const list = await getListPage(this.params);
      this.contentLoading = false;
      this.total = list.total;
      this.tableData = list.records;
    },
    handleSearch() {
      this.params.current = 1;
      this.getList();
    },
    // 添加消息模板
    handleAdd() {
      this.currentObj = {};
      this.operateType = 'common.add';
      this.showDetail = true;
      this.isAdd = true;
    },
    // 编辑消息模板
    async editFun(row) {
      // console.log(row);
      this.currentObj = row;
      this.operateType = 'common.edit';
      this.showDetail = true;
      this.isAdd = false;
    },
    // 单个删除
    async deleteFun(row) {
      this.$confirm(this.$t('common.areYouSureToDelete', { name: '？' }), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      }).then(async () => {
        await deleteLogicDel({ id: row.id });
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.getList();
      });
    },
    // table__立即执行
    async performFun(row) {
      // console.log(row);
      const { id } = row;
      await postDoJobConfig({ id });
      this.$message({
        type: 'success',
        message: this.$t('timedTask.executionSucceed')
      });
    },
    // 查看历史
    historyFun(row) {
      this.dialogVisible = true;
      this.paramsObj.jobConfigId = row.id;
    },
    // 查看历史
    async getHistoryList(params) {
      const popupsList = await getPageHistory(params);
      // console.log(popupsList);
      return popupsList;
    },
    // 禁用或者启用模板
    async handleTempStatus(row) {
      // console.log(row);
      const { id, jobStatus } = row;
      // 1 已启用；2 执行中；3 已停止
      if (jobStatus === 1 || jobStatus === 2) {
        await updateEnableJobConfig({ id });
      } else if (jobStatus === 3) {
        await updateDisableJobConfig({ id });
      }
    },
    // 选中取消
    handleCancle() {
      this.multiExpressionArr = [];
      this.$refs.taskMain.clearSelection();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiExpressionArr = val;
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.params.current = 1;
      this.params.size = size;
      this.getList();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.params.current = page;
      this.getList();
    },
    // 关闭弹窗
    handleClose() {
      this.currentObj = {};
    },
    // 排序
    sortChange(sortInfo) {
      const { prop, order } = sortInfo;
      const orderObj = { column: prop };
      if (order === 'ascending') orderObj.asc = true;
      else if (order === 'descending') orderObj.asc = false;
      this.params.orders = [orderObj];
      this.getList();
    }
  },

  mounted() {
    // 查询 JOB_TYPE(定时任务类型)JOB_STATUS(定时任务状态)MESSAGE_TYPE(消息类型)JOB_EXECUTE_RESULT(任务历史状态)
    this.$store.dispatch('getCurrentDict', 'JOB_TYPE,JOB_STATUS,MESSAGE_TYPE,JOB_EXECUTE_RESULT');
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

//右边样式变量
$--name: 'task';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);

.task {
  padding: 0px 10px 0 10px;
  background: #fff;
}
</style>
