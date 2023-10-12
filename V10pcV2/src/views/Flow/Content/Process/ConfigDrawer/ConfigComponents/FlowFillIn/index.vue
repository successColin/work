/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：index
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap" :key="key">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">指定填写对象</div>
        <div class="form-item-content">
          <SelectUsers
            nodeType="FillIn"
            v-bind="$attrs"
            :approverObj="sourceType"
            :flowData="flowData"
            @select-flow-approval="appendUsers"
          ></SelectUsers>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">审批事件设置</div>
        <div class="form-item-content">
          <div>
            <div style="margin-bottom: 10px;">
              <apiot-button class="list-btn" @click="eventVisible=true">
                <i class="icon-shezhi iconfont"></i>
                设置事件
              </apiot-button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-item">
        <div class="form-item-label">PC端填写界面配置</div>
        <div class="form-item-content">
          <apiot-button class="list-btn" @click="pageSet('pc')">
            <i class="icon-shezhi iconfont"></i>
            PC端填写界面配置
          </apiot-button>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">APP端填写界面配置</div>
        <div class="form-item-content">
          <apiot-button class="list-btn" @click="pageSet('app')">
            <i class="icon-shezhi iconfont"></i>
            APP端填写界面配置
          </apiot-button>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">按钮名称</div>
        <div class="form-item-content">
          <apiot-input v-model="submitText"></apiot-input>
        </div>
      </div>
      <MessageTemplate
          @change="changeMessageTemplate"
          :value="{ id: msgConf.templateId }"
      />

    </div>
    <ApprovalPanelConfig
      :configVisible.sync="configVisible"
      ref="approvalPanelConfig"
      :checkType="checkType"
      :appCheckFormConfigJSON="appCheckFormConfigJSON"
      :checkFormConfigJSON="checkFormConfigJSON"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
      :isNeedAbstract="true"
    />
    <EventConfigCom
        @submitChange="changeConfig"
        :visible.sync="eventVisible"
        :value="eventConfig"
        :tabArr="tabArr"
        :currentVersion="currentVersion"/>
  </div>
</template>

<script>
import MessageTemplate from '_v/Flow/Content/Process/ConfigDrawer/ConfigComponents/MessageTemplateSetting';
import ApprovalPanelConfig from '../ApprovalPanelConfig/index';
import SelectUsers from '../FlowApproval/SelectUsers';
import EventConfigCom from '../FlowApproval/EventConfig/index';

// import FilterableInput from '../FilterableInput';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    },
    currentVersion: {
      type: Object,
      default() {
        return {};
      }
    },
    flowData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      eventVisible: false,
      tabArr: [
        {
          key: '6',
          eventType: 'SUBMIT',
          com: 'CommonConfig',
          name: '提交'
        }
      ],
      eventConfig: {},
      isShowTitle: false, // 显示表头全选
      isShowCheckAll: false, // 显示表头全选
      isEditTitle: false, // 编辑全选
      isEditCheckAll: false, // 编辑表头全选
      isRequireTitle: false, // 必填全选
      isRequireCheckAll: false, // 必填全选
      panelOptions: [], // 面板下拉
      panelActive: '', // 选中的面板
      key: 0,
      key1: 0,
      curPaneObj: {},
      visibleType: null, // 弹框类型
      tabOptions: [],
      configData: [], // 页面配置
      appCheckFormConfigJSON: [], // 审批人页面配置
      appCheckFormConfigJSONOrigin: [], // 审批人页面配置源数据
      checkFormConfigJSON: [], // 审批人页面配置
      checkFormConfigJSONOrigin: [], // 审批人页面配置源数据
      configVisible: false, // 审批人页面配置弹框
      submitText: '保存', // 通过按钮属性
      sourceType: {
        // 审批人集合
        ROLE: [], // 角色
        ORG: [], // 组织
        USER: [], // 固定人员
        POST: [] // 职位
      },
      msgConf: {},
      checkType: '' // 用于表示app还是pc端审批界面
    };
  },

  components: {
    EventConfigCom,
    SelectUsers,
    ApprovalPanelConfig,
    MessageTemplate
    // FilterableInput
  },

  computed: {},

  mounted() {},
  watch: {
    nodeInfo: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    }
  },

  methods: {
    changeConfig(c) {
      this.eventConfig = c;
    },
    setEventConfig() {
      const obj = this.nodeInfo.eventConfig || {};
      const arr = Object.keys(obj);
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        const target = obj[item];
        if (['SUBMIT', 'AGREE', 'REVOKE', 'REFERRAL', 'ENDORSEMENT'].includes(item)) {
          target.nodeEvents.forEach((node) => {
            const { nodeAttributes } = node;
            node.attribute = JSON.parse(nodeAttributes);
          });
        }
        if (item === 'REJECT' && JSON.stringify(target) !== '{}') {
          const { rejectEvents } = target;
          const jArr = Object.keys(rejectEvents);
          for (let j = 0; j < jArr.length; j += 1) {
            const currentKey = jArr[j];
            const current = rejectEvents[currentKey] || [];
            current.forEach((currentNode) => {
              const { nodeAttributes: cAttribute } = currentNode;
              currentNode.attribute = JSON.parse(cAttribute);
            });
          }
        }
      }
      this.eventConfig = obj;
    },
    changeMessageTemplate(res = {}) {
      this.msgConf = {
        templateId: res.id || ''
      };
    },
    init() {
      if (JSON.stringify(this.nodeInfo) !== '{}' && this.nodeInfo) {
        const { fillUsers = {
          // 审批人集合
          ROLE: [], // 角色
          ORG: [], // 组织
          USER: [], // 固定人员
          POST: [] // 职位
        },
          submitText = '保存',
          checkFormConfig = [],
          appCheckFormConfig = [], msgConf = {} } = this.nodeInfo;
        this.sourceType = fillUsers;
        this.submitText = submitText;
        this.setEventConfig(this.nodeInfo.eventConfig);
        // eslint-disable-next-line max-len
        this.checkFormConfigJSONOrigin = checkFormConfig
          ? JSON.parse(JSON.stringify(checkFormConfig))
          : [];
        // eslint-disable-next-line max-len
        this.checkFormConfigJSON = checkFormConfig
          ? JSON.parse(JSON.stringify(checkFormConfig))
          : [];
        // eslint-disable-next-line max-len
        this.appCheckFormConfigJSONOrigin = appCheckFormConfig
          ? JSON.parse(JSON.stringify(appCheckFormConfig))
          : [];
        // eslint-disable-next-line max-len
        this.appCheckFormConfigJSON = appCheckFormConfig
          ? JSON.parse(JSON.stringify(appCheckFormConfig))
          : [];
        this.msgConf = msgConf;
      } else {
        this.sourceType = {
          // 审批人集合
          ROLE: [], // 角色
          ORG: [], // 组织
          USER: [], // 固定人员
          POST: [] // 职位
        };
        this.submitText = '保存';
        this.checkFormConfigJSONOrigin = [];
        this.checkFormConfigJSON = [];
        this.appCheckFormConfigJSONOrigin = [];
        this.appCheckFormConfigJSON = [];
        this.msgConf = {};
      }
      this.key += 1;
    },
    // 选择面板
    async selectPane(pane) {
      this.curPaneObj = pane || {};
    },
    handleOk(data) {
      // 点击保存的时候，以修改的数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc') {
        this.checkFormConfigJSONOrigin = JSON.parse(JSON.stringify(data));
        this.checkFormConfigJSON = JSON.parse(JSON.stringify(data));
      } else {
        this.appCheckFormConfigJSON = JSON.parse(JSON.stringify(data));
      }
      // this.nodeAbstractConfigOrigin = [...this.nodeAbstractConfig];
      this.configVisible = false;
      this.resetCheckType();
    },
    resetCheckType() {
      this.$nextTick(() => {
        this.checkType = '';
      });
    },
    handleCancel() {
      // 点击取消的时候，以源数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc') {
        this.checkFormConfigJSON = [...this.checkFormConfigJSONOrigin];
      } else {
        this.appCheckFormConfigJSON = [...this.appCheckFormConfigJSONOrigin];
      }
      // this.nodeAbstractConfig = [...this.nodeAbstractConfigOrigin];
      this.configVisible = false;
      this.resetCheckType();
    },
    async pageSet(key) {
      if (!key) return;
      console.log(this.currentVersion);
      const {
        globalAttributes: { pcPanelId, appPanelId, appPanelName, pcPanelName }
      } = this.currentVersion;
      if (key === 'app' && !appPanelId) {
        this.$message.warning('请在全局属性中配置app面板!');
        return;
      }
      if (key === 'pc' && !pcPanelId) {
        this.$message.warning('请在全局属性中配置PC面板!');
        return;
      }
      this.$refs.approvalPanelConfig.init({
        key,
        appPanelName,
        pcPanelName,
        pcPanelId,
        appPanelId
      });
      this.checkType = key;
      this.configVisible = true;
      // this.$nextTick(() => {
      //   this.initThead();
      // });
    },
    appendUsers({ value, key }) {
      this.sourceType[key] = value;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  .config-property {
    padding: 10px 20px;
    box-sizing: border-box;

    .form-item {
      margin-bottom: 10px;

      .form-item-label {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: left;
      }

      .form-item-content {
        text-align: left;

        .select-field {
          .icon-bangzhu {
            font-size: 13px;
            color: #aaaaaa;
            font-weight: normal;
            cursor: pointer;

            &:hover {
              color: #4689f5;
            }
          }

          .memo {
            width: 100%;
            height: 40px;
            margin-top: 10px;
            padding-left: 10px;
            line-height: 40px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            background: #f1f3f6;
            border-radius: 4px;
            box-sizing: border-box;

            & > span {
              color: #362f2f;
            }
          }

          ::v-deep {
            .el-select {
              width: 100%;
            }

            .el-input__inner {
              border: 1px solid #e9e9e9;
            }

            .el-select {
              .el-input__inner:hover {
                border-color: #c0c4cc;
              }
            }

            .el-input__suffix {
              display: none;
            }

            .el-input {
              height: auto;
            }

            .el-icon-close {
              background: none;
              color: #78a7e5;

              &:hover {
                color: #4689f5;
              }
            }
          }
        }

        .item-content-box {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          width: 100%;
          height: 46px;
          line-height: 46px;

          .box-left {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }

        .list-btn {
          width: 100%;

          .iconfont {
            margin-right: 5px;
            color: #4689f5;
          }
        }

        ::v-deep {
          .el-checkbox {
            height: 30px;
            line-height: 30px;

            .el-checkbox__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
    }
  }

  .user-appover-content {
    width: 100%;
    height: 100%;
    .user-appover-tabs {
      height: 46px;
      display: flex;
      align-items: center;
      .form-item-label {
        margin-right: 10px;
      }
    }
    .name-component {
      & > img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
        vertical-align: sub;
      }
    }

    ::v-deep {
      .el-icon-arrow-right {
        font-family: 'iconfont' !important;
        font-size: 13px;
        color: #333;
      }

      .el-icon-arrow-right:before {
        content: '\ea22';
      }
    }
  }

  ::v-deep {
    .el-dialog__header {
      text-align: left;
    }

    .formula__box--header {
      text-align: left;
    }

    .formula__box--main {
      text-align: left;
    }
  }
}
</style>
