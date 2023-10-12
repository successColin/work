/**
* @name: index
* @author: DELL
* @date: 2021/9/14 10:23
* @description：index
* @update: 2021/9/14 10:23
*/
<!-- 页面 -->
<template>
  <div class="flowConfigWrap">
    <el-drawer
      :size="400"
      :show-close="false"
      :modal="false"
      :modal-append-to-body="true"
      :visible.sync="isVisible"
      direction="rtl"
      :wrapperClosable="false"
      @close="handleClose"
    >
      <div class="config-content" v-if="isVisible">
        <div class="config-title">
          {{ getName }}
        </div>
        <apiot-button class="config-global" @click="showGlobalConfig">
          <i class="icon-shezhi iconfont m-r-4"></i>
          全局属性
        </apiot-button>
        <div class="config-components">
          <component
            :is="activeData && activeData.type && activeData.type"
            :nodeInfo="nodeInfo"
            :params="{
              versionId: currentVersion.id,
              nodeId: activeData.nodeId,
            }"
            :ref="activeData && activeData.type && activeData.type"
          ></component>
        </div>
        <div class="content-footer">
          <apiot-button @click="handleClose">取消</apiot-button>
          <apiot-button type="primary" @click="handleOk">确定</apiot-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :size="340"
      :show-close="false"
      :modal-append-to-body="false"
      :visible.sync="globalVisible"
      direction="rtl"
      :wrapperClosable="false"
    >
      <div class="config-content">
        <div class="config-title">全局属性</div>
        <apiot-button class="config-global" @click="showGlobalConfig">
          <i class="icon-shezhi iconfont m-r-4"></i>
          流程配置
        </apiot-button>
        <div class="config-components">
          <GlobalConfig
            ref="globalConfig"
            v-if="globalVisible"
            :currentVersion="currentVersion"
            :flowData="flowData"
          />
        </div>
        <div class="content-footer">
          <apiot-button @click="handleCloseGlobalConfig">取消</apiot-button>
          <apiot-button
            type="primary"
            :loading="loading"
            @click="handleOk('globalConfig')"
            >确定
          </apiot-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { nodeToString } from '@/utils/utils';
import Approver from './ConfigComponents/FlowApproval/index';
import Condition from './ConfigComponents/FlowCondition/index';
import Fill from './ConfigComponents/FlowFillIn/index';
import GlobalConfig from './ConfigComponents/FlowGlobalConfig/index';
import Start from './ConfigComponents/FlowStart/index';
// eslint-disable-next-line camelcase
import Backend_data from './ConfigComponents/FlowBackgroundData/index';
import Notice from './ConfigComponents/FlowNotice/index';
import Procedure from './ConfigComponents/FlowProcedure/index';
import Webhook from './ConfigComponents/FlowWebHook/index';

export default {
  props: {
    currentVersion: {
      type: Object,
      default: () => {}
    },
    drawer: {
      // 弹框显示隐藏
      type: Boolean,
      default() {
        return false;
      }
    },
    loading: {
      // 弹框显示隐藏
      type: Boolean,
      default() {
        return false;
      }
    },
    activeData: {
      // 节点流程信息
      type: Object,
      default: () => {}
    },
    flowData: {
      // 流程所有节点数据
      type: Object,
      default: () => {}
    },
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isVisible: false,
      globalVisible: false
    };
  },

  components: {
    Start,
    GlobalConfig,
    Approver,
    Condition,
    Fill,
    Backend_data,
    Webhook,
    Procedure,
    Notice
  },
  computed: {
    getName() {
      if (!this.activeData) return '';
      if (JSON.stringify(this.activeData) === '{}') return '';
      if (JSON.stringify(this.activeData.properties) === '{}') return '';
      return this.activeData.properties.title;
    }
  },
  watch: {
    drawer: {
      immediate: true,
      deep: true,
      handler() {
        this.isVisible = this.drawer;
      }
    },
    loading: {
      immediate: true,
      deep: true,
      handler(n, o) {
        if (!n && o) {
          this.globalVisible = false;
        }
      }
    }
  },
  mounted() {
    console.log(this.currentVersion, this.activeData, 3);
    this.$bus.$off('flowNodeConfigIsClose').$on('flowNodeConfigIsClose', () => {
      this.isVisible = false;
    });
  },

  methods: {
    getMessage(type) {
      if (type === 'SAVEOREDIT') {
        return '当新增或更新记录时触发';
      }
      if (type === 'ONLYSAVE') {
        return '仅新增记录时触发';
      }
      if (type === 'ONLYEDIT') {
        return '仅更新记录时触发';
      }
      if (type === 'DELETE') {
        return '删除记录时触发';
      }
      return '仅新增记录时触发';
    },
    showGlobalConfig() {
      this.globalVisible = !this.globalVisible;
    },
    handleCloseGlobalConfig() {
      this.globalVisible = false;
    },
    handleOk(submitGlobal) {
      // 获取配置信息
      if (submitGlobal === 'globalConfig') {
        // 提交全局信息
        const { lastAllowRevokeNodeId, checkList = [], allowRevoke } = this.$refs.globalConfig;
        const config = {
          lastAllowRevokeNodeId,
          allowRevoke,
          isTriggerUserAutoPass: checkList.includes('isTriggerUserAutoPass'),
          isCheckUserNullAutoPass: checkList.includes('isCheckUserNullAutoPass'),
          isAlreadyCheckUserAutoPass: checkList.includes('isAlreadyCheckUserAutoPass'),
          isSameCheckUserWithLastNodeAutoPass: checkList.includes(
            'isSameCheckUserWithLastNodeAutoPass'
          )
        };
        this.$emit('submitGlobalConfig', config);
        return;
      }
      const { type } = this.activeData;
      if (type === 'start') {
        // 提交开始节点的数据
        const obj = this.$refs[type];
        if (!obj.value) {
          this.$message.warning('请选择触发源！');
          return;
        }
        const config = {
          tableName: obj.value,
          triggerCond: {
            type: obj.radio,
            fieldNames: obj.value1
          },
          triggerPreCond: obj.termObj
        };
        const newObj = {
          config,
          ...this.activeData.properties
        };
        const message = `触发源 “${obj.value}”`;
        const trggerMessage = this.getMessage(obj.radio);
        const newMessage = `${message}</br>${trggerMessage}`;
        this.$emit('handleCloseConfig', newObj, newMessage);
      }
      if (type === 'approver') {
        // 提交审批节点的数据
        const obj = this.$refs[type];
        const {
          checkList = [],
          sourceType = {},
          afterProcess,
          multiPersonApproval,
          checkFormConfigJSONOrigin,
          buttonAttributes,
          nodeAbstractConfig,
          effectiveApprovalDays,
          curPaneObj
        } = obj;
        console.log(obj);
        if (JSON.stringify(sourceType) === '{}') {
          this.$message.warning('请选择添加审批人！');
          return;
        }
        const { ROLE, ORG, USER, POST, NODE } = sourceType;
        if (!ROLE.length && !ORG.length && !USER.length && !POST.length && !NODE.length) {
          this.$message.warning('请选择添加审批人！');
          return;
        }
        if (!multiPersonApproval) {
          this.$message.warning('请选择多人审批方式！');
          return;
        }
        const config = {
          checkUsers: sourceType,
          allowReferral: checkList.includes('allowReferral'),
          allowAddCheck: checkList.includes('allowAddCheck'),
          allowRejectTo: checkList.includes('allowRejectTo'),
          rejectConfig: afterProcess,
          multiPersonApproval,
          nodeAbstractConfig,
          checkFormConfig: checkFormConfigJSONOrigin,
          buttonAttributes,
          effectiveApprovalDays,
          abstractPanelId: JSON.stringify(curPaneObj)
        };
        const newObj = {
          config,
          ...this.activeData.properties
        };
        const domStr = nodeToString(document.querySelector('.userBox .selected-result'));
        const base64domStr = encodeURIComponent(domStr);
        // eslint-disable-next-line no-undef
        this.$emit('handleCloseConfig', newObj, base64domStr);
      }
      if (type === 'condition') {
        // 提交分支节点的数据
        const { termObj = {} } = this.$refs[type].$children[0];
        const { termArr = [], termType } = termObj;
        if (!termArr.length) {
          this.$message.warning('请选择添加控件！');
          return;
        }
        let isTrue = false;
        termArr.forEach((arr = []) => {
          arr.forEach((item) => {
            const { comp = {} } = item;
            if (JSON.stringify(comp) === '{}') {
              isTrue = true;
            }
          });
        });
        if (isTrue) {
          this.$message.warning('请选择添加控件！');
          return;
        }
        const config = {
          conditions: termArr || [],
          conditionDesc: termType
        };
        const newObj = {
          config,
          ...this.activeData.properties
        };
        const message = this.getConditionsMessage(termArr, termType);
        this.$emit('handleCloseConfig', newObj, message);
      }
      if (type === 'fill') {
        // 提交填写节点的数据
        const obj = this.$refs[type];
        const {
          sourceType = {},
          checkFormConfigJSONOrigin,
          submitText,
          nodeAbstractConfig,
          curPaneObj
        } = obj;
        if (JSON.stringify(sourceType) === '{}') {
          this.$message.warning('请选择添加填写对象！');
          return;
        }
        const { ROLE, ORG, USER, POST, NODE } = sourceType;
        if (!ROLE.length && !ORG.length && !USER.length && !POST.length && !NODE.length) {
          this.$message.warning('请选择添加填写对象！');
          return;
        }
        const config = {
          fillUsers: sourceType,
          submitText,
          nodeAbstractConfig,
          abstractPanelId: JSON.stringify(curPaneObj),
          checkFormConfig: checkFormConfigJSONOrigin
        };
        const newObj = {
          config,
          ...this.activeData.properties
        };
        const domStr = nodeToString(document.querySelector('.userBox .selected-result'));
        const base64domStr = encodeURIComponent(domStr);
        // eslint-disable-next-line no-undef
        this.$emit('handleCloseConfig', newObj, base64domStr);
      }
      if (type === 'backend_data') {
        const obj = this.$refs[type];
        const { ruleList = [] } = obj;
        const newObj = {
          config: { ruleList },
          ...this.activeData.properties
        };
        const message = `<div class="backendCardWrap">${this.getBackEndMessage(ruleList)}</div>`;
        this.$emit('handleCloseConfig', newObj, ruleList.length ? message : '');
      }
      if (type === 'webhook') {
        const obj = this.$refs[type];
        const { requestHeadersList, requestMethod, requestUrl, returnValue, requestParameter } =
          obj;
        if (!requestUrl) {
          this.$message.warning('请填写请求地址！');
          return;
        }
        // if (requestMethod === 'GET' && !requestHeadersList.length) {
        //   this.$message.warning('请填写Headers请求参数！');
        //   return;
        // }
        const newObj = {
          config: { requestHeadersList, requestMethod, requestUrl, returnValue, requestParameter },
          ...this.activeData.properties
        };
        const message = `<span class="el-tag el-tag--light">${requestMethod}</span><div>请求地址:</div> <div>${requestUrl}</div>`;
        this.$emit('handleCloseConfig', newObj, message);
      }
      if (type === 'procedure') {
        const obj = this.$refs[type];
        const { proceduresList, returnValue, sysProceduresObj } = obj;
        if (JSON.stringify(sysProceduresObj) === '{}' || !proceduresList.length) {
          this.$message.warning('请选择存储过程');
          return;
        }
        const newObj = {
          config: { proceduresList, returnValue, sysProceduresObj },
          ...this.activeData.properties
        };
        this.$emit('handleCloseConfig', newObj, sysProceduresObj.sysProceduresName);
      }
      if (type === 'notice') {
        const obj = this.$refs[type];
        const { template = {}, value1 = [] } = obj;
        if (!template.id) {
          this.$message.warning('请选择消息模板！');
          return;
        }
        if (!value1.length) {
          this.$message.warning('请选择消息渠道！');
          return;
        }
        const newObj = {
          config: { messageTypes: value1, templateId: template.id, template },
          ...this.activeData.properties
        };
        this.$emit('handleCloseConfig', newObj, template.templateName);
      }
    },
    getBackEndMessage(arr = []) {
      // 获取后台数据信息
      if (!arr.length) return '';
      let message = '';
      const typeName = (type) => {
        if (type === 'INSERT') {
          return '新增类型';
        }
        if (type === 'UPDATE') {
          return '编辑类型';
        }
        if (type === 'DELETE') {
          return '删除类型';
        }
        return '编辑类型';
      };
      arr.forEach((item) => {
        message += `<div class="backendBox">
                      <div class="backendType">${typeName(item.type)}</div>
                      <span class="des__label">触发表:</span>
                      <span class="des_table">
                        <span class="iconfont icon-shujubiao"></span>
                        <span class="des_tableName">${item.tableName}</span>
                      </span>
                    </div>`;
      });
      return message;
    },
    getConditionsMessage(termArr = [], termType) {
      // 条件展示信息
      const n = termArr.length;
      if (!n) return '';
      const SplitLine = `<div class="el-divider el-divider--horizontal">
                               <div class="el-divider__text is-center">${
  termType === 1 ? '且' : '或'
}</div>
                           </div>`;
      const concatStr = (arr) => {
        let contentMessage = '';
        arr.forEach((item) => {
          const { lambda, valueType, content, comp } = item;
          contentMessage += `<div class="conditionContent">
            <span>${comp.compName}</span> ${lambda} ${
  valueType === 1 ? '固定值' : '公式'
}<span>${content}</span>
          </div>`;
        });
        return `<div class="conditionBox">
          ${contentMessage}
        </div>`;
      };
      if (n === 1) {
        return concatStr(termArr[0] || []);
      }
      if (n > 1) {
        // eslint-disable-next-line no-unused-vars
        let message = '';
        termArr.forEach((item, index) => {
          const boxMessage = concatStr(item);
          message += boxMessage;
          if (index + 1 < n) {
            message += SplitLine;
          }
        });
        return message;
      }
    },
    handleClose() {
      // 关闭弹框
      this.$bus.$emit('handle-close-flowConfig');
    }
  },
  beforeDestroy() {
    this.$bus.$off('flowNodeConfigIsClose');
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.flowConfigWrap {
  width: 100%;
  height: 100%;

  .config-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .config-global {
    position: absolute;
    right: 0;
    top: 7px;
    width: 104px;
    height: 30px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 100px 0px 0px 100px;
    cursor: pointer;

    .icon-shezhi {
      color: #4689f5;
    }
  }

  .config-title {
    width: 100%;
    height: 46px;
    padding: 0 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 46px;
    border-bottom: 1px solid #e9e9e9;
    text-align: left;
    box-sizing: border-box;
  }

  .config-components {
    width: 100%;
    height: calc(100% - 56px - 46px);
  }

  .content-footer {
    position: absolute;
    height: 56px;
    padding: 0 20px;
    left: 0;
    right: 0;
    text-align: right;
    line-height: 56px;
    border-top: 1px solid #e9e9e9;
    box-sizing: border-box;
  }

  ::v-deep {
    .el-drawer__wrapper {
      top: 93px;
    }
    .el-drawer__body {
      height: 100%;
      overflow: hidden;
    }

    .el-drawer__header {
      display: none;
    }

    .v-modal {
      top: 94px;
      background: #ffffff;
      opacity: 0;
    }
  }
}
</style>
