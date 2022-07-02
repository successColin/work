/**
* @name: index
* @author: DELL
* @date: 2021/9/24 9:00
* @description：index
* @update: 2021/9/24 9:00
*/
<!-- 页面 -->
<template>
  <div class="approverWrap" v-loading="isLoading">
    <div class="approverTitle">
      <!--      <span class="iconfont icon-shenpi"></span>-->
      <!--      <span class="approverSize">{{ approvalInfo.taskName }}</span>-->
    </div>

    <div class="btnWrap">
      <apiot-button
        type="success"
        class="warning"
        v-if="nodeConfig.allowReferral && isShowBtn"
        @click="showUserModal(3)"
      >
        <i class="iconfont icon-zhuanshen m-r-4"></i> 转审
      </apiot-button>
      <apiot-button
        type="success"
        class="info"
        @click="showUserModal(4)"
        v-if="nodeConfig.allowAddCheck && isShowBtn"
      >
        <i class="iconfont icon-jiaqian m-r-4"></i> 加签
      </apiot-button>
      <apiot-button
        type="success"
        @click="showModal(1)"
        class="success"
        v-if="isShowBtn"
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
      >
        <i class="iconfont icon-bohui m-r-4"></i>
        {{
          nodeConfig.buttonAttributes && nodeConfig.buttonAttributes.rejectText
        }}
      </apiot-button>
      <apiot-button type="primary" @click="doRevoke" v-if="isShowRevokeBtn">
        撤回
      </apiot-button>
    </div>
    <div class="btnWrap" v-if="isShowPasBtn">
      <apiot-button type="primary" @click="showModal(5)">
        {{ nodeConfig.submitText && nodeConfig.submitText }}
      </apiot-button>
    </div>
    <div class="btnWrap" v-if="isShowRejectBtn">
      <apiot-button type="primary" @click="doReset"> 重新发起 </apiot-button>
    </div>
    <div class="approverContent">
      <div class="approverInfo">
        <!--        <img :src="require('./text.png')" alt="">-->
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
        <Flow :approvalInfo="approvalInfo" :com="com"></Flow>
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
      @sure-click="handleOk"
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
              <el-form-item
                :label="getLabel"
                prop="memo"
              >
                <apiot-input
                  v-forbid
                  v-model="info.memo"
                  type="textarea"
                  :placeholder="getPlaceholder"
                ></apiot-input>
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
  </div>
</template>

<script>
import {
  agree,
  reject,
  getNodeInfo,
  getRejectNodesArr,
  doReferral,
  doEndorsement,
  submitInfo,
  doLaunch,
  revokeFlow
} from '@/api/flow';
import ApiotMenu from '@/views/ApiotMenu/index';
// import DiscussionArea from '../DiscussionArea/index';
import { Message } from 'element-ui';
import Flow from '../Flow/index';

export default {
  props: {
    approvalInfo: {
      // 当前任务信息
      type: Object,
      default: () => {}
    },
    nodeConfig: {
      // 流程节点配置
      type: Object,
      default() {
        return {};
      }
    },
    com: {
      // 区别是哪个列表
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      isLoading: false,
      activeName: 'second',
      visible: false,
      info: {},
      operationType: '', // 操作类型
      options: [],
      usersVisible: false,
      userArr: [],
      opeType: '' // 加签类型
    };
  },

  components: {
    // DiscussionArea,
    ApiotMenu,
    Flow
  },

  computed: {
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
        panelVarObj: {}
      };
    },
    showType() {
      const { dataId, menuId, taskType, instanceStatus } = this.approvalInfo;
      const params = {
        type: 'flow',
        dataId,
        menuId
      };
      if (this.com === 'LeaveItToMe' && [3, 5].includes(taskType)) {
        // 如果是待我处理同时是审批节点和填写节点显示按钮
        params.isShowBtn = true;
      }
      if (this.com === 'Completed') {
        params.isShowBtn = false;
      }
      // 我发起的而且是已经撤回的
      if (this.com === 'IInitiatedIt' && ['REJECTED', 'REVOKED'].includes(instanceStatus)) {
        params.isShowBtn = true;
      }
      return params;
    },
    isShowBtn() {
      const { executorUserId, taskType, taskStatus } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return executorUserId === userId && taskType === 3 && taskStatus === 1;
    },
    isShowRejectBtn() {
      // 是否显示再次提交按钮
      const { instanceStatus, triggerUserId } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return triggerUserId === userId && instanceStatus === 'REJECTED';
    },
    isShowRevokeBtn() {
      // 撤回按钮
      const { instanceStatus, triggerUserId } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return triggerUserId === userId && instanceStatus === 'IN_PROGRESS';
    },
    isShowPasBtn() {
      const { executorUserId, taskType, taskStatus } = this.approvalInfo;
      const { id: userId } = this.$store.state.userCenter.userInfo;
      return executorUserId === userId && taskType === 5 && taskStatus === 1;
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
              trigger: 'blur'
            }
          ],
          rejectTargetNodeId: [
            {
              required: true,
              message: '请选择驳回节点',
              trigger: 'change'
            }
          ]
        };
      }
      return {};
    }
  },
  watch: {
    operationType: {
      handler(v) {
        if (v === 2 && this.nodeConfig.allowRejectTo) {
          this.fetchRejectNodes();
        }
      }
    }
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
      if (this.isShowPasBtn) {
        Message.closeAll();
        this.showModal(5);
      }
    });
  },

  methods: {
    handleSelectUser(list) {
      // console.log(list);
      if (!list.length) {
        this.$message.error('请选择人员');
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
        workflowVersionId
      });
      this.options = data;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleOk() {
      if (this.operationType === 2) {
        this.$refs.valiForm.validate((valid) => {
          if (valid) {
            this.doSubmit();
          } else {
            return false;
          }
        });
        return;
      }
      this.doSubmit();
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
      // 流程撤回
      const { instanceId, nodeId, taskId } = this.approvalInfo;
      await revokeFlow({ instanceId, memo: '', nodeId, taskId });
      this.$bus.$emit(`${this.com}_End_of_operation`);
    },
    async doReset() {
      const { instanceId } = this.approvalInfo;
      await doLaunch({ instanceId });
      this.$bus.$emit(`${this.com}_End_of_operation`);
    },
    handleClick({ name }) {
      this.activeName = name;
    },
    showModal(type) {
      this.visible = true;
      this.operationType = type;
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
      if (this.operationType !== 4) {
        this.$bus.$emit(`${this.com}_End_of_operation`);
      } else {
        console.log(1111, this.com);
        this.$bus.$emit(`${this.com}_reset_flow`);
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
        compMap: JSON.stringify(compMap)
      };
      if (this.operationType === 1 || this.operationType === 5) {
        return {
          ...params,
          memo: this.info.memo
        };
      }
      if (this.operationType === 2) {
        return {
          ...params,
          rejectTargetNodeId: this.info.rejectTargetNodeId,
          memo: this.info.memo
        };
      }
      if (this.operationType === 3) {
        return {
          ...params,
          memo: this.info.memo,
          referralUserId: this.userArr[0].id
        };
      }
      if (this.operationType === 4) {
        return {
          taskId,
          endorsementUserIds: this.userArr.map((item) => item.id).join(',')
        };
      }
      return {};
    }
  },
  beforeDestroy() {
    this.$bus.$off('do_flow_submit');
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
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

    .approverInfo {
      flex: 1;
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;
      overflow-y: auto;

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
          height: calc(100% - 10px) !important;
          box-shadow: unset;
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
    ::v-deep {
      .el-form-item__label {
        padding-top: 6px;
        padding-bottom: 6px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
      }
    }
  }
}
</style>
