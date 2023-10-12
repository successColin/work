/** * @name: index * @author: DELL * @date: 2021/9/24 9:00 * @description：index
* @update: 2021/9/24 9:00 */
<!-- 页面 -->
<template>
  <div class="approverWrap" v-loading="isLoading">
    <div class="approverTitle">
      <!--      <span class="iconfont icon-shenpi"></span>-->
      <!--      <span class="approverSize">{{ approvalInfo.taskName }}</span>-->
    </div>

    <div class="btnWrap">
      <!--      <apiot-button-->
      <!--          type="success"-->
      <!--          class="warning"-->
      <!--          @click="dialogFlowVisible = true"-->
      <!--      >-->
      <!--        <i class="iconfont icon-chakan m-r-4"></i> 查看流程图谱-->
      <!--      </apiot-button>-->
      <apiot-button
        type="success"
        class="warning"
        v-if="nodeConfig.allowReferral && isShowBtn"
        :disabled="isNeedNoneEvent"
        @click="showUserModal(3)"
      >
        <i class="iconfont icon-zhuanshen m-r-4"></i> 转审
      </apiot-button>
      <apiot-button
        type="success"
        class="info"
        @click="showUserModal(4)"
        :disabled="isNeedNoneEvent"
        v-if="nodeConfig.allowAddCheck && isShowBtn"
      >
        <i class="iconfont icon-jiaqian m-r-4"></i> 加签
      </apiot-button>
      <apiot-button
        type="success"
        @click="showModal(1)"
        class="success"
        v-if="isShowBtn"
        :disabled="isNeedNoneEvent"
      >
        <i class="iconfont icon-tongguo m-r-4"></i>
        {{
          nodeConfig.buttonAttributes && nodeConfig.buttonAttributes.passText
        }}
      </apiot-button>
      <apiot-button
        type="danger"
        @click="showModal(2)"
        class="danger"
        v-if="isShowBtn"
        :disabled="isNeedNoneEvent"
      >
        <i class="iconfont icon-bohui m-r-4"></i>
        {{
          nodeConfig.buttonAttributes && nodeConfig.buttonAttributes.rejectText
        }}
      </apiot-button>
      <apiot-button
        type="primary"
        @click="doRevoke"
        v-if="isShowRevokeBtn"
        :disabled="isNeedNoneEvent"
      >
        撤回
      </apiot-button>
      <apiot-button
        v-if="isShowPasBtn"
        type="primary"
        @click="showModal(5)"
        :disabled="isNeedNoneEvent"
      >
        {{ nodeConfig.submitText && nodeConfig.submitText }}
      </apiot-button>
      <apiot-button
        type="primary"
        @click="doReset"
        :loading="loadingConfig"
        v-if="isShowRejectBtn"
        :disabled="isNeedNoneEvent"
      >
        提交流程
      </apiot-button>
    </div>

    <div class="approverContent">
      <div class="approverInfo" :class="{ noEvent: isNeedNoneEvent }">
        <ApiotMenu
          :showType="showType"
          :panelObj="getPanelObj"
          :nodeConfig="nodeConfig"
          :menuId="approvalInfo.menuId"
          ref="menu"
        />
      </div>
      <div class="approverInterflow">
        <!--        <el-tabs v-model="activeName" @tab-click="handleClick">-->
        <!--          <el-tab-pane label="日志" name="first">-->
        <!--            <div class="tabContent">日志</div>-->
        <!--          </el-tab-pane>-->
        <!--          <el-tab-pane label="流程" name="second">-->
        <div class="approverInterHead">
          <span class="header_name">流程日志</span>
          <div class="lookChart" @click="dialogFlowVisible = true">
            <span class="iconfont icon-zuzhi"></span>
            流程图谱
          </div>
        </div>
        <div class="approverInterMain">
          <Flow :approvalInfo="approvalInfo" :com="com"></Flow>
        </div>
        <!--          </el-tab-pane>-->
        <!--          <el-tab-pane label="讨论" name="third">-->
        <!--            <div class="tabContent">-->
        <!--              <DiscussionArea></DiscussionArea>-->
        <!--            </div>-->
        <!--          </el-tab-pane>-->
        <!--        </el-tabs>-->
      </div>
    </div>
    <apiot-dialog
      :title="getDialogName"
      :loading="loading"
      :visible.sync="visible"
      :isBigDialog="isShowPassMenu"
      @close="closeDialog"
      @sure-click="handleOk"
      class="approverDialog"
      @cancle-click="handleCancel"
    >
      <div class="form-content" v-if="visible">
        <el-form
          ref="valiForm"
          @submit.native.prevent
          :rules="rules"
          :model="info"
        >
          <el-row class="form_el_row_wrap" style="margin: 0 !important">
            <el-col :span="24">
              <el-form-item :label="getLabel" prop="memo">
                <apiot-input
                  v-forbid
                  v-model="info.memo"
                  type="textarea"
                  :placeholder="getPlaceholder"
                ></apiot-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="[1, 2].includes(operationType)">
              <el-form-item label="抄送人" prop="ccList">
                <div>
                  <CCUsers :value="ccList" @change="handleSelectCC" />
                </div>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="operationType === 2 && nodeConfig.allowRejectTo"
            >
              <el-form-item
                label="退回并重新进行审批"
                prop="rejectTargetNodeId"
              >
                <apiot-select v-model="info.rejectTargetNodeId">
                  <el-option
                    v-for="item in options"
                    :value="item.id"
                    :key="item.id"
                    :label="item.nodeTitle"
                  ></el-option>
                </apiot-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="passMenu" v-if="isShowPassMenu && [1, 2].includes(operationType)">
          <ApiotMenu
            :showType="{...showType, operationType: 'agree' }"
            :panelObj="getPanelObj"
            :nodeConfig="nodeConfig"
            :menuId="approvalInfo.menuId"
            ref="menu"
          />
        </div>
      </div>
    </apiot-dialog>
    <apiot-user-dialog
      :title="`${operationType === 3 ? '转审' : '加签'}`"
      class="Referral approveUser"
      :visible.sync="usersVisible"
      :isMult="operationType === 4"
      @handleSure="handleSelectUser"
    ></apiot-user-dialog>
    <!--    <apiot-dialog-->
    <!--        title="加签方式"-->
    <!--        class="signatureMethod"-->
    <!--        :isShowFooter="false"-->
    <!--        :visible.sync="dialogVisible"-->
    <!--        @cancle-click="handleCancel"-->
    <!--        width="30%"-->
    <!--        :before-close="handleClose"-->
    <!--    >-->
    <!--      <div class="signatureMethodWrap">-->
    <!--        <div @click="showUserModal(4, 'AFTER')">-->
    <!--          通过申请后增加一位审批人 <i class="el-icon-arrow-right"></i>-->
    <!--        </div>-->
    <!--        <div @click="showUserModal(4, 'BEFORE')">-->
    <!--          在我审批前增加一位审批人 <i class="el-icon-arrow-right"></i>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </apiot-dialog>-->
    <apiot-dialog
      title="流程图谱"
      class="aChat"
      :isBigDialog="true"
      :isShowFooter="false"
      :visible.sync="dialogFlowVisible"
    >
      <FlowChart
        :instanceId="approvalInfo.instanceId"
        :approvalInfo="approvalInfo"
      />
    </apiot-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import {
  agree,
  doEndorsement,
  doLaunch,
  doReferral,
  getNodeInfo,
  getRejectNodesArr,
  reject,
  revokeFlow,
  submitInfo,
} from '@/api/flow';
import ApiotMenu from '@/views/ApiotMenu/index';
// import DiscussionArea from '../DiscussionArea/index';
import Flow from '../Flow/index';
import FlowChart from '../FlowChart/index';

// const CCUsers = () =>
//   import('@/views/Flow/Content/Process/ConfigDrawer/ConfigComponents/FlowApproval/CCUsers');
const CCUsers = () => import('../UserSelect/index');
export default {
  props: {
    approvalInfo: {
      // 当前任务信息
      type: Object,
      default: () => {},
    },
    nodeConfig: {
      // 流程节点配置
      type: Object,
      default() {
        return {};
      },
    },
    com: {
      // 区别是哪个列表
      type: String,
      default: '',
    },
    isMessage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isNeedNoneEvent: false, // 是否禁用点击事件
      dialogFlowVisible: false, // 流程图谱弹框
      dialogVisible: false,
      loading: false,
      isLoading: false,
      activeName: 'second',
      visible: false,
      info: { rejectTargetNodeId: null },
      operationType: '', // 操作类型
      options: [],
      usersVisible: false,
      userArr: [],
      ccList: [], // 抄送人
      opeType: '', // 加签类型
      loadingConfig: false,
    };
  },

  components: {
    // DiscussionArea,
    ApiotMenu,
    Flow,
    CCUsers,
    FlowChart,
  },

  computed: {
    isShowPassMenu() {
      // 是否显示通过面板
      const { checkAgreeFormConfig } = this.nodeConfig;
      if (!checkAgreeFormConfig) return false;
      if (Array.isArray(checkAgreeFormConfig) && !checkAgreeFormConfig.length) {
        return false;
      }
      if (
          Array.isArray(checkAgreeFormConfig) && checkAgreeFormConfig.length
          &&
          checkAgreeFormConfig.some((item) => !!item.isRelationPass)
          && this.operationType === 1
      ) {
        return true;
      }
      return false;
    },
    getLabel() {
      if (this.operationType === 3) {
        return '转审描述';
      }
      if (this.operationType === 5) {
        return '描述';
      }
      return '审批意见';
    },
    getPlaceholder() {
      if ([1, 4].includes(this.operationType)) {
        return '填写审批意见';
      }
      if (this.operationType === 3) {
        return '请填写转审描述';
      }
      if (this.operationType === 5) {
        return '请填写描述';
      }
      return '填写审批意见';
    },
    getPanelObj() {
      return {
        id: this.approvalInfo.pcPanelId,
        panelFixData: {},
        panelVarObj: {},
      };
    },
    showType() {
      const { dataId, menuId, taskType, instanceStatus } = this.approvalInfo;
      const params = {
        type: 'flow',
        dataId,
        menuId,
        aaa: 1111,
        isDisabled: this.checkIsCC,
      };
      if (this.com === 'LeaveItToMe' && [3, 5].includes(taskType)) {
        // 如果是待我处理同时是审批节点和填写节点显示按钮
        params.isShowBtn = true;
      }
      if (this.com === 'Completed') {
        params.isShowBtn = false;
      }
      // 我发起的而且是已经撤回的
      // todo 逻辑调整
      if (
        this.com === 'IInitiatedIt' &&
        ['REJECTED', 'REVOKED'].includes(instanceStatus)
      ) {
        params.isShowBtn = true;
      }
      return params;
    },
    checkIsCC() {
      // 已经完成
      // 抄送给我
      // 我发起的 -- 已完成
      // 我发起的 -- 已撤回
      if (['Completed', 'CC'].includes(this.com)) return true;
      const { instanceStatus } = this.approvalInfo;
      if (
        this.com === 'IInitiatedIt' &&
        ['COMPLETED', 'REVOKED'].includes(instanceStatus)
      ) {
        return true;
      }
      return false;
    },
    isShowBtn() {
      if (this.checkIsCC) {
        // 如果是抄送人列表，直接返回false
        return false;
      }
      const { executorUserId, taskType, taskStatus } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return executorUserId === userId && taskType === 3 && taskStatus === 1;
    },
    isShowRejectBtn() {
      // 是否显示再次提交按钮
      // if (this.checkIsCC) {
      //   // 如果是抄送人列表，直接返回false
      //   return false;
      // }
      const { instanceStatus, executorUserId } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return (
        executorUserId === userId &&
        ['REJECTED', 'REVOKED', 'DRAFT'].includes(instanceStatus)
      );
    },
    isShowRevokeBtn() {
      // 撤回按钮
      if (this.checkIsCC) {
        // 如果是抄送人列表，直接返回false
        return false;
      }
      const { instanceStatus, triggerUserId } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return triggerUserId === userId && instanceStatus === 'IN_PROGRESS';
    },
    isShowPasBtn() {
      if (this.checkIsCC) {
        // 如果是抄送人列表，直接返回false
        return false;
      }
      const { checkFormConfig = [] } = this.nodeConfig;
      const currentObj = checkFormConfig.find((item) => !!item.isRelation);
      const { executorUserId, taskType, taskStatus } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      if (taskType !== 5) return false;
      if (executorUserId === userId && taskType === 5 && taskStatus === 1) {
        if (currentObj) {
          return false;
        }
        return true;
      }
      return false;
    },
    isShowPasBtnCopy() {
      if (this.checkIsCC) {
        // 如果是抄送人列表，直接返回false
        return false;
      }
      const { checkFormConfig = [] } = this.nodeConfig;
      const currentObj = checkFormConfig.find((item) => !!item.isRelation);
      const { executorUserId, taskType, taskStatus } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      if (taskType !== 5) return false;
      return (
        executorUserId === userId &&
        taskType === 5 &&
        taskStatus === 1 &&
        currentObj
      );
    },
    getDialogName() {
      if (this.operationType === 1 || this.operationType === 5) {
        return `将通过${this.approvalInfo.taskName}`;
      }
      if (this.operationType === 2) {
        return `将否决${this.approvalInfo.taskName}`;
      }
      if (this.userArr.length && this.operationType === 3) {
        return '转审描述';
      }
      if (this.operationType === 4 && this.userArr.length && this.opeType) {
        if (this.opeType === 'BEFORE') {
          return `${this.userArr[0].username}将在你审批前加签`;
        }
        if (this.opeType === 'AFTER') {
          return `${this.userArr[0].username}将在你审批后加签`;
        }
      }
      return '';
    },
    rules() {
      const { buttonAttributes } = this.nodeConfig;
      if (
        this.operationType === 2 &&
        buttonAttributes &&
        buttonAttributes.reasonForRejectionRequired
      ) {
        return {
          memo: [
            {
              required: true,
              message: '请输入驳回信息',
              trigger: 'blur',
            },
          ],
          rejectTargetNodeId: [
            {
              required: true,
              message: '请选择驳回节点',
              trigger: 'blur',
            },
          ],
        };
      }
      return {};
    },
  },
  watch: {
    operationType: {
      handler(v) {
        if (v === 2 && this.nodeConfig.allowRejectTo) {
          this.fetchRejectNodes();
        }
      },
    },
  },
  created() {
    // const { taskType, nodeId } = this.approvalInfo;
    // if (taskType === 3) {
    //   // 该节点属于审批节点，需要去获取配置
    //   this.isLoading = true;
    //   this.fetchNodeInfo(nodeId);
    // }
  },
  mounted() {
    this.$bus.$off('do_flow_submit').$on('do_flow_submit', () => {
      if (this.isShowPasBtnCopy) {
        Message.closeAll();
        this.showModal(5);
      }
    });
    // 触发通过/驳回按钮
    this.$bus.$off('do_flow_pass').$on('do_flow_pass', (type) => {
      Message.closeAll();
      this.visible = true;
      this.operationType = type;
    });
    this.ccList = this.nodeConfig.ccList || [];
  },

  methods: {
    handleSelectCC(list) {
      this.ccList = list;
    },
    handleSelectUser(list) {
      // console.log(list);
      if (!list.length) {
        this.$message.warning('请选择人员');
        return;
      }
      if (this.operationType === 4) {
        // 加签
        this.userArr = list;
        this.doSubmit();
        return;
      }
      this.visible = true;
      this.userArr = list;
      this.usersVisible = false;
    },
    async fetchRejectNodes() {
      const { nodeId, workflowVersionId, instanceId } = this.approvalInfo;
      const data = await getRejectNodesArr({
        nodeId,
        instanceId,
        workflowVersionId,
      });
      const { rejectNodeConf = {} } = this.nodeConfig;
      const { defaultNodeId, allowNodeIds = [] } = rejectNodeConf;
      this.info.rejectTargetNodeId = defaultNodeId || null;
      if (!allowNodeIds.length) {
        this.options = data;
      } else {
        this.options = data.filter((item) => allowNodeIds.includes(item.id));
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    async handleOk() {
      if (this.operationType === 2) {
        this.$refs.valiForm.validate(async (valid) => {
          if (valid) {
            await this.doSubmit();
          } else {
            return false;
          }
        });
      } else if (this.operationType === 1) {
        if (this.isShowPassMenu) {
          await this.$bus.$emit('do_check_form_pass');
          setTimeout(async () => {
            if (await this.$store.state.base.flag) {
              await this.$bus.$emit('do_check_form_pass_click');
              await this.doSubmit();
            }
          }, 0);
        } else {
          await this.doSubmit();
        }
      } else {
        await this.doSubmit();
      }
    },
    closeDialog() {
      this.ccList = this.nodeConfig.ccList || [];
      this.operationType = '';
    },
    handleCancel() {
      this.dialogVisible = false;
      this.info = {};
    },
    async fetchNodeInfo(nodeId) {
      const data = await getNodeInfo({ nodeId });
      const config = data.attributes ? JSON.parse(data.attributes) : {};
      this.nodeConfig = config;
      this.$nextTick(() => {
        this.isLoading = false;
      });
    },
    async doRevoke() {
      this.$confirm('是否撤回该流程任务？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '撤回',
        cancelButtonText: '放弃撤回',
      })
        .then(async () => {
          // 流程撤回
          const { instanceId, nodeId, taskId } = this.approvalInfo;
          await revokeFlow({
            instanceId,
            memo: '',
            nodeId,
            taskId,
          });
          this.$message.success('操作成功!');
          this.$bus.$emit(`${this.com}_End_of_operation`);
          this.$bus.$emit('flow_End_of_operation');
          this.$emit('closeModel');
          if (this.isMessage) {
            this.$emit('hideMessage', false);
          }
        })
        .catch(() => {});
    },
    async doReset() {
      const { instanceId } = this.approvalInfo;
      this.loadingConfig = true;
      await doLaunch({ instanceId });
      this.$message.success('操作成功!');
      this.$bus.$emit(`${this.com}_End_of_operation`);
      this.$bus.$emit('flow_End_of_operation');
      this.$emit('closeModel');
      this.loadingConfig = false;
      if (this.isMessage) {
        this.$emit('hideMessage', false);
      }
    },
    handleClick({ name }) {
      this.activeName = name;
    },
    showModal(type) {
      const { checkFormConfig = [] } = this.nodeConfig;
      // 绑定通过
      const isRelationPass = checkFormConfig.some(
        (item) => item.isRelationPass,
      );
      // 绑定驳回
      const isRelationReject = checkFormConfig.some(
        (item) => item.isRelationReject,
      );
      if (type === 1 && isRelationPass) {
        this.$bus.$emit('do_check_form_info');
      } else if (type === 2 && isRelationReject) {
        this.$bus.$emit('do_check_form_info');
      } else {
        this.visible = true;
        this.operationType = type;
      }
    },
    showUserModal(type, opeType) {
      this.usersVisible = true;
      this.operationType = type;
      this.opeType = opeType;
    },
    hideModal() {
      this.visible = false;
      this.info = {};
      this.userArr = [];
      this.opeType = '';
      const { name } = this.$route;
      if (name === 'approvalPage') {
        // 如果是泸州老窖审批页面
        this.isNeedNoneEvent = true;
      } else if (name !== 'approvalPage') {
        if (this.operationType !== 4) {
          console.log(111);
          this.$bus.$emit(`${this.com}_End_of_operation`);
          this.$bus.$emit('flow_End_of_operation');
          this.$emit('closeModel');
          if (this.isMessage) {
            this.$emit('hideMessage', false);
          }
        } else {
          this.$bus.$emit(`${this.com}_reset_flow`);
        }
      }
      this.usersVisible = false;
      this.operationType = '';
    },
    async doSubmit() {
      this.loading = true;
      const api = this.getQueryApi();
      const params = this.getQueryParams();
      try {
        await api(params);
        this.loading = false;
        this.hideModal();
        this.$message.success('操作成功!');
      } catch (e) {
        this.loading = false;
        // console.log(e);
      }
    },
    getQueryApi() {
      if (this.operationType === 1) {
        return agree;
      }
      if (this.operationType === 2) {
        return reject;
      }
      if (this.operationType === 3) {
        return doReferral;
      }
      if (this.operationType === 4) {
        return doEndorsement;
      }
      if (this.operationType === 5) {
        return submitInfo;
      }
      return agree;
    },
    getQueryParams() {
      const { nodeId, instanceId, taskId } = this.approvalInfo;
      const compMap = (this.$refs.menu && this.$refs.menu.getCompMap) || {};
      const params = {
        nodeId,
        instanceId,
        taskId,
        compMap: JSON.stringify(compMap),
      };
      if (this.operationType === 1 || this.operationType === 5) {
        const ccObj =
          this.operationType === 1
            ? {
                ccUserIds: this.ccList.map((item) => item.id).join(','),
              }
            : {};
        return {
          ...params,
          ...ccObj,
          memo: this.info.memo,
        };
      }
      if (this.operationType === 2) {
        return {
          ...params,
          ccUserIds: this.ccList.map((item) => item.id).join(','),
          rejectTargetNodeId: this.info.rejectTargetNodeId,
          memo: this.info.memo,
        };
      }
      if (this.operationType === 3) {
        return {
          ...params,
          memo: this.info.memo,
          referralUserId: this.userArr[0].id,
        };
      }
      if (this.operationType === 4) {
        return {
          taskId,
          endorsementUserIds: this.userArr.map((item) => item.id).join(','),
        };
      }
      return {};
    },
  },
  beforeDestroy() {
    this.$bus.$off();
  },
  name: 'index',
};
</script>

<style lang="scss" scoped>
.approverWrap {
  width: 100%;
  height: 100%;

  .approverTitle {
    position: fixed;
    top: 50px;
    left: 100px;
    height: 46px;
    line-height: 46px;

    .iconfont {
      margin: 0 10px 0 20px;
      font-size: 30px;
      color: #ee5e5e;
    }

    .approverSize {
      margin-left: 15px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      vertical-align: text-bottom;
    }
  }

  .btnWrap {
    position: fixed;
    height: 46px;
    top: 50px;
    right: 0;
    padding-right: 15px;
    line-height: 46px;
    text-align: right;
    box-sizing: border-box;

    ::v-deep {
      .success {
        background-color: #4f9e66;
        border-color: #4f9e66;

        &:hover {
          background-color: #68b47e;
          border-color: #68b47e;
        }
      }

      .danger {
        background-color: #cd4e4e;
        border-color: #cd4e4e;

        &:hover {
          background-color: #d46363;
          border-color: #d46363;
        }
      }

      .info {
        background-color: #5467b3;
        border-color: #5467b3;

        &:hover {
          background-color: #7485ca;
          border-color: #7485ca;
        }
      }

      .warning {
        background-color: #38b9c6;
        border-color: #38b9c6;

        &:hover {
          background-color: #59ccd7;
          border-color: #59ccd7;
        }
      }
    }
  }

  .approverContent {
    width: 100%;
    height: calc(100%);
    display: flex;
    background: #ffffff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);

    .approverInfo {
      flex: 1;
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;
      overflow-y: auto;

      &.noEvent {
        ::v-deep {
          .el-button {
            pointer-events: none;
          }
        }
      }

      & > img {
        width: 100%;
      }

      ::v-deep {
        .menu {
          position: unset;
          width: 100%;
          height: 100%;
        }

        .tabMain__tabs {
          position: relative;
          left: unset;
          top: unset;
          bottom: unset;
          background: #ffffff;
          height: calc(100%) !important;
          box-shadow: unset;

          &.showTab {
            .el-tabs__content {
              height: calc(100% - 12px) !important;
            }
          }

          .el-tabs__content {
            height: calc(100% - 62px) !important;
          }

          .el-tabs__header {
            height: 42px;
            box-shadow: none;
          }
        }

        .el-tabs__item {
          padding: 0 20px;
        }

        .leftAndRight__right .el-tabs__content {
          margin: 0;
        }
      }
    }

    .approverInterflow {
      flex: 0 0 280px;
      margin-left: 10px;
      border-left: 1px solid #e9e9e9;
      box-sizing: border-box;

      .approverInterHead {
        width: 280px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 0 12px;
        background: #ffffff;
        box-shadow: -1px 0px 0px 0px #e9e9e9, inset 0px -1px 0px 0px #e9e9e9;
        box-sizing: border-box;

        .header_name {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }

        .lookChart {
          width: 100px;
          height: 28px;
          background: #f1f7ff;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          text-align: center;
          line-height: 28px;
          color: #333333;
          cursor: pointer;
          border-radius: 4px;

          .iconfont {
            vertical-align: bottom;
            color: #4689f5;
          }

          &:hover {
            background: #e5f0ff;
            color: #4689f5;
          }
        }
      }

      .approverInterMain {
        width: 280px;
        height: calc(100% - 42px);
      }

      ::v-deep {
        .el-tabs {
          position: unset;
          height: 100% !important;
          box-shadow: none;
          background: #fafafa;

          .el-tabs__item.is-active {
            color: #4689f5;
            font-family: PingFangSC-Medium;
            font-weight: 600;
          }

          .el-tabs__header {
            height: 42px;
            line-height: 42px;
            box-shadow: none;
            border-bottom: 1px solid #e9e9e9;
            box-sizing: border-box;
          }

          .el-tabs__content {
            margin: 0;
            height: calc(100% - 42px);
          }

          .el-tabs__item {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;

            &:hover {
              color: $--color-primary;
            }
          }
        }
      }

      .tabContent {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
    }
  }

  .Referral {
    ::v-deep {
      .el-tabs {
        height: calc(100%) !important;
        position: unset;
        background: #ffffff;
        box-shadow: none;

        .el-tabs__nav-scroll {
          display: block;
        }

        .el-tabs__header {
          box-shadow: none;
        }

        .el-tabs__item {
          padding: 0 20px;
          height: 40px;
          box-sizing: border-box;
          line-height: 40px;
          display: inline-block;
          list-style: none;
          font-size: 13px;
          font-weight: 600;
          color: #303133;
          position: relative;

          &.is-active {
            font-family: PingFangSC-Medium;
            font-weight: 600;
            color: #4689f5;
          }
        }

        .el-tabs__content {
          margin: 0;
        }
      }
    }
  }

  .signatureMethod {
    ::v-deep {
      .el-dialog__body {
        height: 180px;
        padding: 20px;
      }
    }

    .signatureMethodWrap {
      width: 100%;
      height: 100%;

      & > div {
        position: relative;
        height: 60px;
        padding-left: 20px;
        line-height: 60px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;

        .el-icon-arrow-right {
          position: absolute;
          right: 20px;
          top: 23px;
          font-size: 16px;
          font-weight: 400;
          color: #333333;
        }

        &:hover {
          background: #f1f3f6;
        }
      }

      & > div:last-child {
        margin-top: 20px;
      }
    }
  }

  .form-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .passMenu {
      flex: 1;
      position: relative;

      .menu {
        position: unset;

        ::v-deep {
          .el-tabs__content {
            margin: 0;
          }

          .el-form--label-top {
            .noHover {
              padding: 0px 15px 18px 0;
            }
          }

          .menuMain.p-t-5 {
            padding: 0;
          }

          .menuMain__content.p-t-10 {
            padding: 0;
          }
        }
      }
    }

    .form_el_row_wrap {
      ::v-deep {
        .el-form-item__label {
          padding-top: 6px;
          padding-bottom: 6px;
          line-height: 18px;
          font-size: 13px;
          font-weight: 600;
          color: #333333;
        }

        .el-col {
          padding-right: 15px;
        }

        .el-form-item {
          margin-bottom: 14px;
        }
      }
    }
  }

  .approverDialog {
    ::v-deep {
      .el-dialog__body {
        overflow: auto;
      }
    }
  }

  .aChat {
    ::v-deep {
      .el-dialog {
        width: 1220px;
        height: 700px;
      }

      .el-dialog__body {
        height: 646px;
      }
    }
  }
}
</style>
