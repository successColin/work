/**
* @name: index
* @author: DELL
* @date: 2021/9/14 10:23
* @description：index
* @update: 2021/9/14 10:23
*/
<!-- 页面 -->
<template>
  <div class="flowConfigWrap" @click="handleStop">
    <div class="config-content" v-if="isVisible">
      <div class="config-title">
        {{ getName }}
      </div>
      <div class="config-components">
        <component
            :is="activeData && activeData.type && activeData.type"
            :nodeInfo="nodeInfo"
            :currentVersion="currentVersion"
            :flowData="flowData"
            :params="{versionId: currentVersion.id, nodeId: activeData.nodeId}"
            :ref="activeData && activeData.type && activeData.type"
        ></component>
      </div>
      <div class="content-footer">
        <apiot-button @click="handleClose">取消</apiot-button>
        <apiot-button type="primary" @click="handleOk">确定</apiot-button>
      </div>
    </div>
    <div class="config-content" v-if="!isVisible">
      <div class="config-title">全局属性</div>
      <div class="config-components">
        <GlobalConfig
            ref="globalConfig"
            :currentVersion="currentVersion"
            :flowData="flowData"
        />
      </div>
      <div class="content-footer">
        <!--        <apiot-button @click="handleCloseGlobalConfig">取消</apiot-button>-->
        <apiot-button
            type="primary"
            :loading="loading"
            @click="handleOk('globalConfig')"
        >确定
        </apiot-button>
      </div>
    </div>

    <!--    <el-drawer-->
    <!--      :size="340"-->
    <!--      :show-close="false"-->
    <!--      :modal="false"-->
    <!--      :modal-append-to-body="true"-->
    <!--      :visible.sync="isVisible"-->
    <!--      direction="rtl"-->
    <!--      :wrapperClosable="true"-->
    <!--      @close="handleClose"-->
    <!--    >-->
    <!--      <div class="config-content" v-if="isVisible">-->
    <!--        <div class="config-title">-->
    <!--          {{ getName }}-->
    <!--        </div>-->
    <!--        <apiot-button class="config-global" @click="showGlobalConfig">-->
    <!--          <i class="icon-shezhi iconfont m-r-4"></i>-->
    <!--          全局属性-->
    <!--        </apiot-button>-->
    <!--        <div class="config-components">-->
    <!--          <component-->
    <!--            :is="activeData && activeData.type && activeData.type"-->
    <!--            :nodeInfo="nodeInfo"-->
    <!--            :params="{versionId: currentVersion.id, nodeId: activeData.nodeId}"-->
    <!--            :ref="activeData && activeData.type && activeData.type"-->
    <!--          ></component>-->
    <!--        </div>-->
    <!--        <div class="content-footer">-->
    <!--          <apiot-button @click="handleClose">取消</apiot-button>-->
    <!--          <apiot-button type="primary" @click="handleOk">确定</apiot-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </el-drawer>-->
    <!--    <el-drawer-->
    <!--      :size="340"-->
    <!--      :show-close="false"-->
    <!--      :modal-append-to-body="false"-->
    <!--      :visible.sync="globalVisible"-->
    <!--      direction="rtl"-->
    <!--      :wrapperClosable="false"-->
    <!--    >-->
    <!--      <div class="config-content">-->
    <!--        <div class="config-title">全局属性</div>-->
    <!--        <apiot-button class="config-global" @click="showGlobalConfig">-->
    <!--          <i class="icon-shezhi iconfont m-r-4"></i>-->
    <!--          流程配置-->
    <!--        </apiot-button>-->
    <!--        <div class="config-components">-->
    <!--          <GlobalConfig-->
    <!--            ref="globalConfig"-->
    <!--            v-if="globalVisible"-->
    <!--            :currentVersion="currentVersion"-->
    <!--            :flowData="flowData"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div class="content-footer">-->
    <!--          <apiot-button @click="handleCloseGlobalConfig">取消</apiot-button>-->
    <!--          <apiot-button-->
    <!--            type="primary"-->
    <!--            :loading="loading"-->
    <!--            @click="handleOk('globalConfig')"-->
    <!--            >确定-->
    <!--          </apiot-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </el-drawer>-->
  </div>
</template>

<script>
import { nodeToString } from '@/utils/utils';
import Start from './ConfigComponents/FlowStart';
import Approver from './ConfigComponents/FlowApproval';
import Condition from './ConfigComponents/FlowCondition';
import GlobalConfig from './ConfigComponents/FlowGlobalConfig';
import Fill from './ConfigComponents/FlowFillIn';
// eslint-disable-next-line camelcase
import Backend_data from './ConfigComponents/FlowBackgroundData';
import Webhook from './ConfigComponents/FlowWebHook';
import Procedure from './ConfigComponents/FlowProcedure';
import Notice from './ConfigComponents/FlowNotice';

export default {
  props: {
    currentVersion: {
      type: Object,
      default: () => {
      }
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
      default: () => {
      }
    },
    flowData: {
      // 流程所有节点数据
      type: Object,
      default: () => {
      }
    },
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      isVisible: false,
      globalVisible: true
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
    activeData: {
      handler(v) {
        console.log(v, this.flowData,);
      }
    },
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
    this.$bus.$off('flowNodeConfigIsClose')
      .$on('flowNodeConfigIsClose', () => {
        this.isVisible = false;
      });
  },

  methods: {
    handleStop(e) { // 阻止冒泡
      e.stopPropagation();
    },
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
    checkSummary(descConfigList) {
      if (descConfigList.length) {
        let isTrue = false;
        descConfigList.forEach((item) => {
          if (!item.key || !item.name) {
            isTrue = true;
          }
        });
        if (isTrue) {
          // this.$message.error('摘要信息请填写完整!');
          return false;
        }
        return true;
      }
      return true;
    },
    handleOk(submitGlobal) {
      // 获取配置信息
      if (submitGlobal === 'globalConfig') {
        // 提交全局信息
        const {
          lastAllowRevokeNodeId,
          checkList = [],
          descConfigList = [],
          allowRevoke,
          pcPanelId = null, // pc面板id
          pcPanelName = '', // pc面板名称
          appPanelId = null, // app面板id
          appPanelName = '', // app面板名称
          getCurrentTab,
          messageConfig = []
        } = this.$refs.globalConfig;
        const config = {
          lastAllowRevokeNodeId,
          allowRevoke,
          pcPanelId, // pc面板id
          pcPanelName, // pc面板名称
          appPanelId, // app面板id
          appPanelName, // app面板名称
          isTriggerUserAutoPass: checkList.includes('isTriggerUserAutoPass'),
          isCheckUserNullAutoPass: checkList.includes('isCheckUserNullAutoPass'),
          isAlreadyCheckUserAutoPass: checkList.includes('isAlreadyCheckUserAutoPass'),
          isSameCheckUserWithLastNodeAutoPass: checkList.includes('isSameCheckUserWithLastNodeAutoPass'),
          descConfigList,
          tableRelation: JSON.stringify(getCurrentTab),
          messageConfig
        };
        if (messageConfig.length) {
          const obj = messageConfig.find((item) => !item.serverId);
          if (obj) {
            const typeObj = {
              1: '短信',
              2: '邮件',
              3: '企业微信',
              5: '钉钉'
            };
            const { messageType } = obj;
            this.$message.error(`${typeObj[messageType]}的服务信息请配置完整!`);
            return;
          }
        }
        if (descConfigList.length) {
          let isTrue = false;
          descConfigList.forEach((item) => {
            if (!item.key || !item.name) {
              isTrue = true;
            }
          });
          if (isTrue) {
            this.$message.error('摘要信息请填写完整!');
            return;
          }
        }
        if (getCurrentTab && JSON.stringify(getCurrentTab) !== '{}') {
          const { relateTableArr } = getCurrentTab;
          if (relateTableArr.length) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < relateTableArr.length; i++) {
              const { conditionArr = [] } = relateTableArr[i];
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < conditionArr.length; j++) {
                // eslint-disable-next-line no-plusplus
                for (let z = 0; z < conditionArr[j].length; z++) {
                  // eslint-disable-next-line max-len
                  const { firstLineColumn = {}, secondLineColumn = {}, secondIsValue, secondLineValue } = conditionArr[j][z];
                  if (secondIsValue) {
                    if (!secondLineValue) {
                      this.$message.error('关系请配置完整!');
                      return false;
                    }
                  } else if ((!firstLineColumn.columnName || !secondLineColumn.columnName)) {
                    this.$message.error('关系请配置完整!');
                    return false;
                  }
                }
              }
            }
          }
        }
        this.$emit('submitGlobalConfig', config);
        return;
      }
      const { type } = this.activeData;
      if (type === 'start') {
        // 提交开始节点的数据
        const obj = this.$refs[type];
        if (!obj.value) {
          this.$message.error('请选择触发源！');
          return;
        }
        const config = {
          tableName: obj.value,
          triggerCond: {
            type: obj.radio,
            fieldNames: obj.value1
          },
          checkFormConfig: obj.checkFormConfigJSON,
          appCheckFormConfig: obj.appCheckFormConfigJSON,
          triggerPreCond: obj.termObj,
        };
        let others = '';
        if (this.activeData.properties.tableName !== obj.value) {
          this.activeData.properties.tableName = obj.value;
          others = JSON.stringify({
            tableInfo: { tableName: obj.value },
            relateTableArr: [],
            relateTableIndex: 0
          });
        }
        const newObj = {
          config,
          ...this.activeData.properties
        };
        const message = `触发源 “${obj.value}”`;
        const trggerMessage = this.getMessage(obj.radio);
        const newMessage = `${message}</br>${trggerMessage}`;
        this.$emit('handleCloseConfig', newObj, newMessage, others);
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
          appCheckFormConfigJSONOrigin,
          buttonAttributes,
          nodeAbstractConfig,
          effectiveApprovalDays,
          curPaneObj,
          ccList
        } = obj;
        if (JSON.stringify(sourceType) === '{}') {
          this.$message.error('请选择添加审批人！');
          return;
        }
        const {
          ROLE = [],
          ORG = [],
          USER = [],
          POST = [],
          NODE = [],
          FIELD = {}
        } = sourceType;
        if (!ROLE.length && !ORG.length && !USER.length && !POST.length && !NODE.length && JSON.stringify(FIELD) === '{}') {
          this.$message.error('请选择添加审批人！');
          return;
        }
        if (!multiPersonApproval) {
          this.$message.error('请选择多人审批方式！');
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
          appCheckFormConfig: appCheckFormConfigJSONOrigin,
          buttonAttributes,
          effectiveApprovalDays,
          abstractPanelId: JSON.stringify(curPaneObj),
          ccList
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
        const {
          termArr = [],
          termType
        } = termObj;
        if (!termArr.length) {
          this.$message.error('请选择添加控件！');
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
          this.$message.error('请选择添加控件！');
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
        console.log(newObj, 'newObj');
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
          appCheckFormConfigJSONOrigin,
          curPaneObj
        } = obj;
        if (JSON.stringify(sourceType) === '{}') {
          this.$message.error('请选择添加填写对象！');
          return;
        }
        const {
          ROLE = [],
          ORG = [],
          USER = [],
          POST = [],
          NODE = [],
          FIELD = {}
        } = sourceType;
        if (!ROLE.length && !ORG.length && !USER.length && !POST.length && !NODE.length && JSON.stringify(FIELD) === '{}') {
          this.$message.error('请选择添加填写对象！');
          return;
        }
        const config = {
          fillUsers: sourceType,
          submitText,
          nodeAbstractConfig,
          appCheckFormConfig: appCheckFormConfigJSONOrigin,
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
        const {
          apiCode,
          requestHeadersList,
          requestMethod,
          requestUrl,
          returnValue,
          requestParameter,
          params,
          name
        } = obj;
        // if (!requestUrl) {
        //   this.$message.error('请填写请求地址！');
        //   return;
        // }
        if (!apiCode) {
          this.$message.error('请填写代理接口编码！');
          return;
        }
        // if (requestMethod === 'GET' && !requestHeadersList.length) {
        //   this.$message.error('请填写Headers请求参数！');
        //   return;
        // }
        const newObj = {
          config: {
            requestHeadersList,
            requestMethod,
            requestUrl,
            returnValue,
            requestParameter,
            params,
            apiCode,
            name
          },
          ...this.activeData.properties
        };
        const message = `<div>代理接口编码:</div> <div>${apiCode}(${name})</div>`;
        this.$emit('handleCloseConfig', newObj, message);
      }
      if (type === 'procedure') {
        const obj = this.$refs[type];
        const {
          proceduresList,
          returnValue,
          sysProceduresObj
        } = obj;
        if (JSON.stringify(sysProceduresObj) === '{}' || !proceduresList.length) {
          this.$message.error('请选择存储过程');
          return;
        }
        const newObj = {
          config: {
            proceduresList,
            returnValue,
            sysProceduresObj
          },
          ...this.activeData.properties
        };
        this.$emit('handleCloseConfig', newObj, sysProceduresObj.sysProceduresName);
      }
      if (type === 'notice') {
        const obj = this.$refs[type];
        const {
          template = {},
          value1 = []
        } = obj;
        if (!template.id) {
          this.$message.error('请选择消息模板！');
          return;
        }
        if (!value1.length) {
          this.$message.error('请选择消息渠道！');
          return;
        }
        const newObj = {
          config: {
            messageTypes: value1,
            templateId: template.id,
            template
          },
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
                               <div class="el-divider__text is-center">
                                 ${termType === 1 ? '且' : '或'}
                               </div>
                           </div>`;
      const concatStr = (arr) => {
        let contentMessage = '';
        arr.forEach((item) => {
          const {
            lambda,
            valueType,
            content,
            columnObj
          } = item;
          console.log(item, 'item');
          contentMessage += `<div class="conditionContent">
                                <span>${columnObj.columnName}</span>
                                ${lambda} ${valueType === 1 ? '固定值' : '公式'}
                                <span>${content}</span>
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
  height: 100%;
  position: absolute;
  right: 0;
  width: 340px;
  top: 46px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgb(0 0 0 / 10%);

  .config-content {
    width: 100%;
    height: calc(100% - 46px);
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
      top: 46px;
      z-index: 0 !important;
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
