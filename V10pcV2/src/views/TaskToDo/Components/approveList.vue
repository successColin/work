/**
* @name: main
* @author: DELL
* @date: 2023/7/3 17:23
* @description：main
* @update: 2023/7/3 17:23
*/
<!-- 页面 -->
<template>
  <div class="approveMain" v-loading="loading">
    <div class="header">
      <div class="conditionWrap">
        <div class="leftCondition">
          <el-checkbox
              v-if="isShowBatch"
              :indeterminate="isIndeterminate"
              class="allSelect"
              :value="isCheckAll"
              @change="chooseAll"
          >全选
          </el-checkbox
          >
          <div class="batchBtnWrap" v-if="list.length && isShowBatch">
            <apiot-button type="primary" @click="doBatch(1)">
              <span class="iconfont icon-tongguo m-r-4"></span>
              批量同意
            </apiot-button>
            <apiot-button type="danger" @click="doBatch(2)">
              <span class="iconfont icon-bohui m-r-4"></span>
              批量驳回
            </apiot-button>
          </div>
        </div>
        <div></div>
        <div class="rightCondition">
          <apiot-button class="highFilter m-r-8" @click="clickHighFilter">
            <i class="iconfont icon-shaixuan m-r-4"></i>
            <span>高级筛选</span>
          </apiot-button>

          <el-cascader
              clearable
              class="m-r-8 cascader"
              popper-class="cascaderPropsPopper"
              :props="cascaderProps"
              v-model="allflow"
              :collapse-tags="true"
              :show-all-levels="false"
              @change="changeCascader"
          />
          <!--          <apiot-select-->
          <!--              class="m-r-8"-->
          <!--              style="width: 160px"-->
          <!--              v-model="selectValue"-->
          <!--          >-->
          <!--            <el-option-->
          <!--                v-for="item in options"-->
          <!--                :key="item.value"-->
          <!--                :label="item.name"-->
          <!--                :value="item.value"-->
          <!--            >-->
          <!--            </el-option>-->
          <!--          </apiot-select>-->
          <search-input
              class="m-r-8"
              placeholder="请输入关键字查询"
              @getList="doSearch"
              v-model="input"
          />
          <div class="paginationBox">
            <smallPagination
                @prev-click="prevClick"
                @next-click="nextClick"
                :current="current"
                :total="total"
                :rowNum="size"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            />
          </div>
        </div>
      </div>
      <HighFilter
          :flowNames="flowNames"
          ref="HighFilter"
          @doHighFilter="doHighFilter"
      />
    </div>
    <div class="listBox">
      <div class="listItem" v-for="item in list" :key="item.id">
        <div class="check" v-if="isShowBatch">
          <apiot-checkbox
              class="check-hook"
              :hookId="item.taskId"
              @change="choose(item)"
              :value="checkValue(item)"
              v-if="item.taskType === 3 && com === 'LeaveItToMe'"
          ></apiot-checkbox>
          <div
              v-if="!(item.taskType === 3 && com === 'LeaveItToMe')"
              style="width: 14px; height: 16px"
          ></div>
        </div>
        <div class="listItemRight" :class="!isShowBatch?'cwrap':''" @click="handleClick(item)">
          <div class="listInfo">
            <div>
                <span
                    class="iconfont icon-danju"
                    :style="`color: ${getStatus(item).color};`"
                ></span>
            </div>
            <div class="listInfoWrap">
              <p
                  class="listTitle"
                  :title="`${item.instanceName}`"
              >
                  <span
                      v-if="
                      item.instanceStatus === 'REJECTED' &&
                      com === 'LeaveItToMe'
                    "
                      class="listStatus"
                      :style="`color: ${getStatus(item).color};background: ${
                      getStatus(item).bgColor
                    }`"
                  >
                    {{ getStatus(item).name }}</span
                  >
                {{ item.instanceName }}
              </p>
              <div class="listDes" style="color: #333333">
                <!--                  <div v-if="item.timeLeft >= 0">-->
                <!--                    剩余<span style="color: rgba(224, 32, 32, 1)">{{-->
                <!--                      item.timeLeft-->
                <!--                    }}</span-->
                <!--                    >天-->
                <!--                  </div>-->
              </div>
              <p class="listDes" v-if="com !== 'CC'">
                当前节点:
                <span style="color: #333333">{{ item.taskName }}</span>
              </p>
            </div>
          </div>
          <div class="listKeycode" v-html="renderHtml(item.taskDesc)"></div>
          <div class="listTag">
            <div class="user">
              <div class="userTitle">发起人</div>
              <Users
                  :row="item"
                  :userid="String(item.createuserid)"
                  prop="triggerUserName"
              ></Users>
            </div>
            <p class="textWrap versionWrap">
              <!--                版本：<span class="version">v{{item.version}}</span>-->
            </p>
            <p class="textWrap">发起时间: {{ item.triggerTime }}</p>
          </div>
        </div>
      </div>
      <apiot-nodata v-if="!total"></apiot-nodata>
    </div>
    <apiot-dialog
        :title="getDialogName"
        :loading="loading"
        :visible.sync="visible1"
        @close="handleCancel"
        @sure-click="handleOk"
        @cancle-click="handleCancel"
    >
      <div class="form-content" v-if="visible1">
        <el-form ref="valiForm" @submit.native.prevent :model="info">
          <el-row class="form_el_row_wrap" style="margin: 0 !important">
            <el-col :span="24">
              <el-form-item label="备注" prop="memo">
                <apiot-input
                    v-forbid
                    v-model="info.memo"
                    type="textarea"
                    placeholder="请输入描述内容"
                ></apiot-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="抄送人" prop="ccList">
                <CCUsers
                    :value="ccList"
                    @select-flow-approval="handleSelectCC"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </apiot-dialog>
    <Approve
        class="ApproveBox"
        :showTabs.sync="visible"
        :com="com"
        v-model="activeName1"
        :approvalInfo="approvalInfo"
        :nodeConfig="nodeConfig"
    ></Approve>
  </div>
</template>

<script>
import moment from 'moment';
import {
  batchApproval,
  batchReject,
  getCCTasks,
  getCompletedTasks,
  getIInitiatedList,
  getFlowGroup,
  getFlowList,
  getMyTodoList,
  getNodeInfo
} from '@/api/flow';
import debounce from 'lodash/debounce';

const HighFilter = () => import('./HighFilter/index');
const Approve = () => import('_v/TaskToDo/Components/Approve');

const Users = () =>
    import('@/views/Users/Main/UserColumn/Users/index');
const CCUsers = () =>
    import('@/views/Flow/Content/Process/ConfigDrawer/ConfigComponents/FlowApproval/CCUsers');

export default {
  data() {
    return {
      allflow: [],
      flowOptions: [],
      cascaderProps: {
        expandTrigger: 'hover',
        lazy: true,
        label: 'name',
        multiple: true,
        value: 'id',
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const {
            level,
            data
          } = node;
          if (level === 0) {
            getFlowGroup()
                .then((res) => {
                  const arr = res.map((item) => ({
                    ...item,
                    level: 1,
                    leaf: false
                  }));
                  resolve(arr);
                });
            return;
          }
          if (level === 1) {
            getFlowList({ groupId: data.id })
                .then((res) => {
                  const arr = res.map((item) => ({
                    ...item,
                    level: 2,
                    leaf: true,
                    name: item.workflowName,
                  }));
                  resolve(arr);
                });
            return;
          }
          resolve(node);
        }
      },
      flowNames: [], // 流程的名稱
      highFilter: [], // 高级筛选条件
      input: '', // 关键字
      info: {},
      approvalArr: [], // 批量审批数据集合
      nodeConfig: {},
      selectValue: 6,
      list: [],
      approvalInfo: {}, // 流程信息
      visible: false, //  审批界面弹框
      activeName1: 'Approve',
      size: 10,
      current: 1,
      total: 0,
      loading: false,
      operationType: 1,
      visible1: false,
      com: '',
      ccList: [] // 抄送人
    };
  },

  components: {
    HighFilter,
    Users,
    CCUsers,
    Approve
  },

  computed: {
    getDialogName() {
      if (this.operationType === 1) {
        return '批量同意';
      }
      if (this.operationType === 2) {
        return '批量驳回';
      }
      return '';
    },
    isCheckAll() {
      if (!this.approvalArr.length) return false;
      return this.list.every((item) => this.approvalArr.includes(item.taskId));
    },
    checkValue() {
      return function ({ taskId }) {
        return this.approvalArr.includes(taskId);
      };
    },
    renderHtml() {
      return function (value = '[]') {
        // eslint-disable-next-line no-unreachable
        let params = null;
        try {
          const arr = JSON.parse(value);
          params = arr.slice(0, 3);
        } catch (e) {
          params = [];
        }
        return params.map((item) => `<p style="height: 26px;
                                  font-size: 13px;
                                  line-height: 26px;
                                  font-family: PingFangSC-Regular, PingFang SC;
                                  font-weight: 400;
                                  color: #808080;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                  white-space: nowrap;
                                  ">${item.key}： <span style="color: #333333;">${item.value || ''}</span></p>`)
            .join('');
      };
    },

    getStatus() {
      return function (params) {
        const { instanceStatus } = params;

        const IN_PROGRESS = {
          name: '进行中',
          color: '#34C7BE',
          bgColor: '#34C7BE'
        };
        if (instanceStatus === 'REJECTED') {
          return {
            name: '被驳回',
            color: '#EE5E5E',
            bgColor: '#FFEAEB'
          };
        }
        if (instanceStatus === 'DRAFT') {
          return {
            name: '草稿',
            color: '#708DB7',
            bgColor: '#10B98A'
          };
        }
        if (instanceStatus === 'IN_PROGRESS') {
          return IN_PROGRESS;
        }
        if (instanceStatus === 'COMPLETED') {
          return {
            name: '已完成',
            color: '#4689F5',
            bgColor: '#E5F0FF'
          };
        }
        if (instanceStatus === 'REVOKED') {
          return {
            name: '已完成',
            color: '#F5B034',
            bgColor: '#bd892c'
          };
        }
        return IN_PROGRESS;
      };
    },

    isShowBatch() {
      return this.$store.state.globalConfig.themeConfig.enableBatchApproval === '1' && this.com === 'LeaveItToMe';
    },
    options() {
      return [
        {
          value: 1,
          name: '一周以内'
        },
        {
          value: 2,
          name: '一个月以内'
        },
        {
          value: 3,
          name: '三个月以内'
        },
        {
          value: 4,
          name: '六个月以内'
        },
        {
          value: 5,
          name: '今年以内'
        },
        {
          value: 6,
          name: '全部'
        }
      ];
    },
    isIndeterminate() {
      if (!this.approvalArr.length) return false;
      const isFlag = this.list.every((item) => this.approvalArr.includes(item.taskId));
      if (isFlag) {
        return false;
      }
      const isFlag2 = this.list.some((item) => this.approvalArr.includes(item.taskId));
      if (isFlag2) {
        return true;
      }
      return false;
    },
  },

  mounted() {
    this.$bus.$on('switching_process_types', (message) => {
      this.com = message;
      this.current = 1;
      this.highFilter = [];
      this.init(this.selectValue);
    });
    this.$nextTick(() => {
      const eventName = 'flow_End_of_operation';
      this.$bus.$off(eventName)
          .$on(eventName, () => {
            this.visible = false;
            this.init(this.selectValue);
          });
    });
  },
  beforeDestroy() {
    this.$bus.$off('switching_process_types');
    const eventName = 'flow_End_of_operation';
    this.$bus.$off(eventName);
  },
  created() {
    this.changeCascader = debounce(this.dchangeCascader, 200);
  },
  watch: {
    visible(v) {
      if (!v) {
        this.$emit('closeApproval');
      }
    }
  },

  methods: {
    dchangeCascader() {
      this.highFilter = [];
      this.current = 1;
      this.init(this.selectValue);
    },
    doSearch() {
      this.highFilter = [];
      this.current = 1;
      this.init(this.selectValue);
    },
    async fetchNodeInfo(nodeId) {
      const data = await getNodeInfo({ nodeId });
      const config = data.attributes ? JSON.parse(data.attributes) : {};
      this.nodeConfig = config;
      this.visible = true; //  审批界面弹框
    },
    handleClick(item) {
      this.approvalInfo = item; // 流程信息
      const {
        taskType,
        nodeId,
        pcPanelId,
        instanceStatus
      } = this.approvalInfo;
      if (!pcPanelId) return;
      if ([3, 5].includes(taskType) || instanceStatus === 'REJECTED') {
        // 该节点属于审批节点，需要去获取配置
        this.fetchNodeInfo(nodeId);
        return;
      }
      this.visible = true; //  审批界面弹框
    },
    async doSubmit() {
      if (!this.approvalArr.length) {
        this.$message.warning('请选择任务！');
        return;
      }
      this.loading = true;
      const api = this.operationType === 1 ? batchApproval : batchReject;
      const params = {
        ccuserids: this.ccList.map((item) => item.id)
            .join(','),
        memo: this.info.memo || '',
        taskIds: this.approvalArr.join(',')
      };
      try {
        await api(params);
        this.loading = false;
        this.hideModal();
        this.$emit('closeApproval');
        this.$message.success('操作成功!');
        await this.init(this.selectValue);
      } catch (e) {
        this.loading = false;
      }
    },
    hideModal() {
      this.visible1 = false;
      this.info = {};
      this.ccList = [];
      this.operationType = '';
      this.approvalArr = [];
    },
    handleSelectCC(list) {
      this.ccList = list;
    },
    handleCancel() {
      this.visible1 = false;
      this.info = {};
      this.ccList = [];
      this.operationType = '';
    },
    handleOk() {
      this.doSubmit();
    },
    chooseAll(e) {
      if (e) {
        this.list.forEach((item) => {
          const { taskId } = item;
          if (!this.approvalArr.includes(taskId)) {
            this.approvalArr.push(taskId);
          }
        });
      } else {
        this.list.forEach((item) => {
          const { taskId } = item;
          const i = this.approvalArr.findIndex((li) => li === taskId);
          if (i !== -1) {
            this.approvalArr.splice(i, 1);
          }
        });
      }
    },
    prevClick() {
      this.current -= 1;
      this.init(this.selectValue);
    },
    nextClick() {
      this.current += 1;
      this.init(this.selectValue);
    },
    pageChange(v) {
      this.current = v;
      this.init(this.selectValue);
    },
    sizeChange(v) {
      this.size = v;
      this.current = 1;
      this.init(this.selectValue);
    },
    choose({ taskId }) {
      const index = this.approvalArr.findIndex((item) => item === taskId);
      if (index === -1) {
        this.approvalArr.push(taskId);
      } else {
        this.approvalArr.splice(index, 1);
      }
    },
    getApi() {
      // 获取api接口
      if (['DRAFT', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'REVOKED'].includes(this.com)) {
        return getIInitiatedList;
      }
      if (this.com === 'LeaveItToMe') {
        return getMyTodoList;
      }
      if (this.com === 'Completed') {
        return getCompletedTasks;
      }
      if (this.com === 'CC') {
        return getCCTasks;
      }
      return '';
    },
    getFlowIds() {
      if (!this.allflow.length) return {};
      const gIds = [];
      const wIds = [];
      this.allflow.forEach((item) => {
        const n = item.length;
        if (n === 1) {
          const id = item[0];
          if (!gIds.includes(id)) {
            gIds.push(id);
          }
        }
        if (n === 2) {
          const f = item[0]; // 组
          const l = item[1]; // 明细
          const i = gIds.findIndex((g) => g === f);
          const li = wIds.findIndex((w) => w === l);
          if (i === -1 && li === -1) { // 不存在
            wIds.push(l);
          } else if (i !== -1 && li !== -1) {
            gIds.splice(i, 1);
          } else if (i !== -1 && li === -1) {
            gIds.splice(i, 1);
            wIds.push(l);
          }
        }
      });
      return {
        gIds: gIds.join(','),
        wIds: wIds.join(',')
      };
    },
    async init(v) {
      this.getFlowIds();
      const startDate = moment(new Date())
          .format('YYYY-MM-DD HH:mm:ss');
      const searchParams = this.highFilter.length ? {
        columnsInfos: this.highFilter
      } : {
        keywords: this.input,
        workflowsFilter: this.getFlowIds()
      };
      const params = {
        endDate: startDate,
        current: this.current,
        size: this.size,
        ...searchParams
      };
      if (v === 1) {
        params.beginDate = moment(startDate)
            .subtract(7, 'd')
            .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 2) {
        params.beginDate = moment(startDate)
            .subtract(1, 'months')
            .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 3) {
        params.beginDate = moment(startDate)
            .subtract(3, 'months')
            .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 4) {
        params.beginDate = moment(startDate)
            .subtract(6, 'months')
            .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 5) {
        params.beginDate = moment(startDate)
            .subtract(1, 'years')
            .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 6) {
        delete params.beginDate;
        delete params.endDate;
      }
      if (['DRAFT', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'REVOKED'].includes(this.com)) {
        params.instanceStatus = this.com;
      }
      this.loading = true;
      const api = this.getApi();
      const data = await api({ ...params, ...this.otherParams });
      const {
        records = [],
        total = 0,
        extendedMap: {
          flowNames = []
        }
      } = data;
      this.list = records;
      this.total = total;
      this.flowNames = flowNames;
      // eslint-disable-next-line no-empty
      // if (['LeaveItToMe', 'Completed'].includes(this.com)) {
      //   const arr = [...this.tabsCount];
      //   const obj = arr.find((item) => item.key === this.com);
      //   if (obj) {
      //     obj.total = total;
      //     this.$emit('changeTabsTitle', arr);
      //   }
      // }
      this.loading = false;
    },

    doBatch(type) {
      if (!this.approvalArr.length) {
        this.$message.warning('请选择任务！');
        return;
      }
      this.operationType = type;
      this.visible1 = true;
    },
    clickHighFilter() {
      this.$refs.HighFilter.show();
    },
    doHighFilter(value = []) {
      this.selectValue = 6;
      this.input = '';
      this.current = 1;
      this.highFilter = value;
      this.allflow = [];
      this.init(this.selectValue);
    },
  },
  name: 'ApproveList',
};
</script>

<style lang='scss' scoped>
.approveMain {
  flex: 1;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;

  .header {
    height: 54px;
    width: calc(100% - 40px);
    margin: 0 auto;
    padding: 0 16px;
    background: #FAFAFA;
    border-radius: 8px;
    border: 1px solid #E9E9E9;
    box-sizing: border-box;

    .conditionWrap {
      height: 52px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;

      .allSelect {
        margin-right: 26px;
      }

      .leftCondition {
        display: flex;
        align-items: center;
      }

      .rightCondition {
        display: flex;

        .cascader {
          ::v-deep {
            .el-input__inner {
              height: 32px !important;
            }
            .el-cascader__tags{
              flex-wrap: inherit;
            }
          }
        }

        .batchBtnWrap {
          margin-right: 10px;
        }

        .m-r-8 {
          margin-right: 8px;
        }

        .highFilter {
          height: 32px;
          border-color: #e9e9e9;

          .icon-shaixuan {
            color: #4689F5;
          }
        }

        ::v-deep {
          .input__search .el-input__inner {
            height: 32px;
          }

          .el-cascader {
            line-height: 32px;
          }
        }
      }
    }

    .paginationBox {
      width: 200px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      //background: #FFFFFF;
      border-radius: 4px;

      ::v-deep {
        .pagination {
          border-top: none;
          height: 32px !important;

          & > span:nth-child(1) {
            background: #ffffff;
          }
        }

        :not(.disabled).icon-dingbugengduozhankai:hover {
          color: #4689F5;
        }

        .pagination__text {
          padding: 8.5px 10px;
          border: 1px solid #E9E9E9;
        }

        .iconfont {
          color: #BBC3CD;
        }

        .rotate1 {
          margin-left: 15px;
        }
      }
    }
  }

  .listBox {
    height: calc(100% - 54px);
    width: calc(100%);
    margin-top: 14px;
    padding: 0 20px;
    overflow-y: auto;
    box-sizing: border-box;

    .listItem {
      display: flex;
      position: relative;
      margin: 0 auto 14px auto;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      height: 109px;
      //width: 1090px;
      padding: 20px 0;
      background: #ffffff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      border: 1px solid #F1F1F1;
      cursor: pointer;
      box-sizing: border-box;

      .cwrap {
        padding-left: 32px;
      }

      &:hover {
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
      }

      .check {
        margin-left: 15px;
      }

      .listItemRight {
        display: flex;
        flex: 0 0 98%;
        justify-content: space-between;
        align-items: center;
      }

      .listTag {
        //height: 24px;
        width: 220px;
        height: 78px;
        margin-right: 20px;
        font-size: 13px;
        //line-height: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4689f5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;

        & > span {
          padding: 0 10px;
          display: inline-block;
          border-radius: 4px;
          background: #e5f0ff;
        }

        .user {
          height: 26px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          overflow: hidden;

          .userTitle {
            float: left;
            height: 18px;
            margin-right: 2px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            line-height: 18px;
          }

          .roleWrap__nameWrap {
            height: 24px;
          }
        }

        .textWrap {
          //margin-top: 7px;
          height: 26px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
          text-align: right;
          line-height: 26px;

          &.versionWrap {
            //margin-top: 8px;
          }

          .version {
            display: inline-block;
            height: 24px;
            padding: 0 10px;
            color: #4689f5;
            line-height: 24px;
            background: #e5f0ff;
            border-radius: 4px;
          }
        }
      }

      .listInfo {
        flex: 1;
        margin-left: 20px;
        display: flex;
        height: 78px;
        flex-flow: row nowrap;
        //justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .iconfont {
          margin-right: 18px;
          font-size: 32px;
          color: #ee5e5e;
        }

        .listInfoWrap {
          //width: 230px;
          height: 78px;
          overflow: hidden;
        }

        .listTitle {
          //width: 230px;
          height: 26px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .listStatus {
            display: inline-block;
            height: 24px;
            background: #ffeaeb;
            border-radius: 4px;
            padding: 0 10px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            box-sizing: border-box;
          }

          .iconfont {
            margin-right: 4px;
            font-size: 16px;
          }
        }

        .listDes {
          height: 26px;
          //margin-top: 7px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
          line-height: 26px;
        }
      }

      .listKeycode {
        flex: 1;
      }
    }
  }

}
</style>
