<!--
 * @Author: sss
 * @Date: 2021-12-27 13:52:16
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-27 13:52:16
 * @Desc: 配置-tab区按钮
-->
<template>
  <view
    class="tabBtns"
    :class="[
      btnSort !== 2 ? 'row' : 'column',
      funcConfig.labelPosition,
      btnRadiusClass !== 'oval' ? '' : 'hasPadding',
    ]"
    v-if="tabBtnList.length > 0"
  >
    <template v-if="!canDesign">
      <div v-if="btnSort === 2" class="tabBtns__column">
        <btns-column
          :list="tabBtnList"
          :type="btnsProp.appStyle"
          @click="handleClick"
        ></btns-column>
      </div>
      <div
        v-else
        class="tabBtns__row"
        :class="[
          isTabBtn ? 'btn_bottom' : '',
          btnRadiusClass !== 'oval' ? '' : 'hasPadding',
        ]"
      >
        <tab-btns-row
          ref="btnsRow"
          :list="isSeparate ? tabConfigBtns : tabBtnList"
          :processBtns="processBtns"
          :btnRadiusClass="btnRadiusClass"
          :btnRadius="btnRadius"
          :type="btnsProp.appStyle"
          :isProcess="htmlConfig.isProcess"
          :isCcTom="!!htmlConfig.isCcTom"
          :isNullConfigBtn="isNullConfigBtn"
          @click="handleClick"
          @verifyFun="handleVerifyFun"
        ></tab-btns-row>
      </div>
    </template>
    <template v-else>
      <div class="btn_bottom" :class="[btnRadiusClass ? '' : 'hasPadding']">
        <div class="batchSure">
          <div class="batchSure__item">
            <check-box
              class="batchSure__item"
              @checked="checked"
              @unchecked="unchecked"
              >全选</check-box
            >
          </div>
          <div class="batchSure__item batchSure__btn">
            <apiot-button
              btnClass="nosys"
              size="medium"
              :shape="btnRadius"
              :hair-line="false"
              :custom-style="{
                background: '#F1F3F6',
              }"
              @click="batchCancel"
            >
              取消
            </apiot-button>
          </div>
          <div class="batchSure__item batchSure__btn">
            <apiot-button
              btnClass="nosys"
              type="primary"
              size="medium"
              :shape="btnRadius"
              :hair-line="false"
              :custom-style="{
                background: '#F1F3F6',
              }"
              @click="batchSure"
            >
              确定
            </apiot-button>
          </div>
        </div>
      </div>
    </template>
    <apiot-modal ref="apiotModal"></apiot-modal>
    <u-toast ref="uToast"></u-toast>
    <process-op
      v-if="htmlConfig.isProcess && showProcessOp"
      :htmlConfig="htmlConfig"
      :oprationInfo="btnInfo"
      :config="processOpConfig"
      :referralUserId="referralUserId"
      :menuConfig="menuConfig"
      :getProcessBtn="getProcessBtn"
      @cancel="cancelProcessOP"
    ></process-op>
  </view>
</template>

<script>
import { endorsement, processRevoke, processAcehlnru } from '@/api/pagesProcess.js';

import ProcessOp from './ProcessOP';
import TabBtnsRow from './BtnsRow/TabBtnsRow.vue';
import BtnsColumn from './BtnsColumn';
import CheckBox from './Common/Checkbox.vue';
import btnMixin from './btnMixin';

import compMixin from '../compMixin';

export default {
  name: 'tabBtns',
  components: { TabBtnsRow, BtnsColumn, CheckBox, ProcessOp },

  mixins: [compMixin, btnMixin],

  provide() {
    return {
      getProcessForm: this.getProcessForm
    };
  },

  props: {
    // 是否显示tab区按钮
    showTabBtn: {
      type: Boolean,
      default: true
    },
    menuConfig: {
      type: Object
    }
  },

  data() {
    return {
      showProcessOp: false,
      watchFlag: '',
      referralUserId: '' // 转审人id
    };
  },

  watch: {
    'htmlConfig.isProcess': {
      handler(v) {
        if (v) {
          this.btnsProp.appStyle = 3;
        }
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    appCheckAgreeFormConfig() {
      const { isProcess, processNodeId } = this.htmlConfig;
      const { processConfigs } = this.$store.state.process;
      const config = processConfigs[processNodeId] || {};
      const { appCheckAgreeFormConfig = [] } = config;
      return appCheckAgreeFormConfig;
    },
    getProcessBtn() {
      let obj = {};
      const { isProcess } = this.htmlConfig;
      if (isProcess) {
        this.appCheckAgreeFormConfig.forEach((item) => {
          const comp = this.getMenuPane().compObj[item.compId];
          if (item.isRelationPass) {
            obj = comp;
          }
          if (item.isRelationReject) {
            obj = comp;
          }
        });
      }
      return obj;
    },
    // tab区按钮样式
    tabBtnStyle() {
      const { isNullConfigBtn } = this;
      const { isProcess } = this.htmlConfig;
      if (isProcess && isNullConfigBtn) return 3;
      return this.btnsProp.appStyle;
    },
    // tab区按钮
    tabConfigBtns() {
      const { showTabBtn } = this;
      if (!showTabBtn) return [];
      return this.list;
    },
    // 流程操作基本配置信息
    processOpConfig() {
      const { instanceId, processNodeId, taskId } = this.htmlConfig;
      const { workflowVersionId } = this.processConfig;
      return { instanceId, nodeId: processNodeId, workflowVersionId, taskId };
    },
    // tab区按钮需要考虑流程按钮
    tabBtnList() {
      const { tabConfigBtns, processBtns = [] } = this;
      const { isProcess } = this.htmlConfig;
      if (tabConfigBtns.length === 0 && processBtns.length > 0 && isProcess) {
        return tabConfigBtns.concat(processBtns);
      }
      return tabConfigBtns;
    },
    // 按钮个数
    isSeparate() {
      const { isNullConfigBtn } = this;
      const { isProcess } = this.htmlConfig;
      if (isProcess && !isNullConfigBtn) return this.tabBtnList.length > 4;
      return false;
    },
    isNullConfigBtn() {
      return this.tabConfigBtns.length === 0;
    },
    userId() {
      return this.$store.state.userCenter.userInfo.id;
    }
  },

  methods: {
    async handleVerifyFun(obj) {
      console.log(obj);
      try {
        this.isError = false;
        this.isFromProcess = true;
        await this.handleClick(obj.btn);
      } finally {
        this.isFromProcess = false;
        if (!this.isError) {
          obj.callback(obj.btnOk);
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: '填先填写必填项'
          });
        }
      }
    },
    // 选择人员后返回
    async sure(users) {
      const { compId } = this.btnInfo;
      if (users.length === 0) return;
      if (compId === 'static_jiaqian') {
        const endorsementUserIdsArry = [];
        users.forEach((user) => {
          endorsementUserIdsArry.push(user.id);
        });
        await this.endorsement(endorsementUserIdsArry.join(','));
        this.$bus.$emit(`processNodesRefresh_${this.htmlConfig.instanceId}`);
      } else {
        this.referralUserId = users[0].id;
        this.showProcessOp = true;
      }
    },
    // 加签
    async endorsement(endorsementUserIds) {
      try {
        const { taskId } = this.htmlConfig;
        await endorsement({ taskId, endorsementUserIds });
      } catch (error) {
        console.error(error);
      }
    },
    // 审批按钮点击
    async processClick() {
      const { compId, name } = this.btnInfo;
      if (compId === 'static_jiaqian' || compId === 'static_zhuanshen') {
        let isMultiple = false;
        if (compId === 'static_jiaqian') isMultiple = true;
        if (!this.watchFlag) {
          this.watchFlag = `selectUser_${this._uid}`;
          this.$bus.$on(this.watchFlag, this.sure);
        }
        const params = {
          title: name,
          flag: this.watchFlag,
          isMultiple
        };
        uni.navigateTo({
          url: `/PagesSelectUser/index?config=${JSON.stringify(params)}`
        });
        return;
      }
      if (compId === 'static_chehui') {
        await this.$refs.apiotModal.showAsyncModal({
          content: '是否撤回该流程任务？'
        });

        const { instanceId, processNodeId, taskId, sno } = this.htmlConfig;
        try {
          await processRevoke({ instanceId, taskId, nodeId: processNodeId });
          this.$bus.$emit(`PROCESS_REFRESH_${sno}`, '撤回成功');
          uni.navigateBack();
        } catch (error) {
          return this.$refs.uToast.show({
            type: 'error',
            message: error.message
          });
        }
      }

      if (compId === 'static_tijiao') {
        const { instanceId, sno } = this.htmlConfig;
        await processAcehlnru({ instanceId });

        this.$bus.$emit(`PROCESS_REFRESH_${sno}`, '提交成功');
        uni.navigateBack();
      }
      this.showProcessOp = true;
    },
    cancelProcessOP() {
      this.showProcessOp = false;
    },
    getProcessForm() {
      return this.resolveBatchParams(this.getFuncAreas());
    }
  },

  mounted() {
    this.$bus.$off('processOP');
    this.$bus.$on('processOP', async (obj) => {
      await this.handleVerifyFun(obj);
      this.isProcessOP = true;
    });
  },

  beforeDestroy() {
    if (this.watchFlag) this.$bus.$off(this.watchFlag);
    this.$bus.$off('processOP');
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'tabBtns';
@include setBtnStyle($--name);
</style>
