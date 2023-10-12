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
        <div class="form-item-label">添加审批人</div>
        <div class="form-item-content">
          <SelectUsers
            :nodeList="nodeList"
            v-bind="$attrs"
            nodeType="approverObj"
            :params="params"
            :flowData="flowData"
            :approverObj="sourceType"
            @select-flow-approval="appendUsers"
          ></SelectUsers>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">审批设置</div>
        <div class="form-item-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox key="allowReferral" label="allowReferral"
              >允许审批人转审</el-checkbox
            >
            <br />
            <el-checkbox key="allowAddCheck" label="allowAddCheck"
              >允许审批人加签</el-checkbox
            >
            <br />
            <el-checkbox key="allowRejectTo" label="allowRejectTo"
              >否决后，允许退回</el-checkbox
            >
            <br />
            <br />
          </el-checkbox-group>
          <div class="select-field" v-if="checkList.includes('allowRejectTo')">
            <div class="form-item-label">设置允许驳回节点</div>
            <div>
              <apiot-select
                  v-model="rejectNodeConf.allowNodeIds"
                  filterable
                  multiple
                  collapse-tags
                  placeholder="请选择节点"
              >
                <el-option
                    v-for="item in nodeList"
                    :value="item.id"
                    :key="item.id"
                    :label="item.nodeTitle"
                ></el-option>
              </apiot-select>
            </div>
            <div class="form-item-label">设置默认驳回节点</div>
            <div>
              <apiot-select
                  v-model="rejectNodeConf.defaultNodeId"
                  filterable
                  placeholder="请选择节点"
              >
                <el-option
                    v-for="item in nodeList"
                    :value="item.id"
                    :key="item.id"
                    :label="item.nodeTitle"
                ></el-option>
              </apiot-select>
            </div>
            <div class="form-item-label">处理完成后</div>
            <div>
              <apiot-select
                v-model="afterProcess"
                filterable
                placeholder="请选择节点"
              >
                <el-option
                  label="直接返回审批节点"
                  value="returnHere"
                ></el-option>
                <el-option label="重新执行流程" value="returnRun"></el-option>
              </apiot-select>
            </div>
            <div class="memo">允许退回的节点<span>无可退回节点</span></div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">多人审批方式</div>
        <div class="form-item-content">
          <apiot-select v-model="multiPersonApproval">
            <el-option
              v-for="item in options"
              :value="item.value"
              :key="item.value"
              :label="item.name"
            ></el-option>
          </apiot-select>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">审批有效天数(天)</div>
        <div class="form-item-content">
          <el-input-number
            style="width: 100%; text-align: left"
            v-model="effectiveApprovalDays"
            :controls="false"
          >
          </el-input-number>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">抄送人设置</div>
        <div class="form-item-content">
          <CCUsers :value="ccList" @select-flow-approval="selectCC" />
        </div>
      </div>

      <div class="form-item">
        <div class="form-item-label">审批详情界面</div>
        <div class="form-item-content">
          <div>
            <div style="margin-bottom: 10px;">
              <apiot-button class="list-btn" @click="pageSet('pc', 'panel')">
                <i class="icon-shezhi iconfont"></i>
                PC端审批界面配置
              </apiot-button>
            </div>
            <div>
              <apiot-button class="list-btn" @click="pageSet('app', 'panel')">
                <i class="icon-shezhi iconfont"></i>
                APP端审批界面配置
              </apiot-button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">审批通过驳回界面</div>
        <div class="form-item-content">
          <div>
            <div style="margin-bottom: 10px;">
              <apiot-button class="list-btn" @click="pageSet('pc', 'agree')">
                <i class="icon-shezhi iconfont"></i>
                PC端审批通过界面配置
              </apiot-button>
            </div>
            <div>
              <apiot-button class="list-btn" @click="pageSet('app', 'agree')">
                <i class="icon-shezhi iconfont"></i>
                APP端审批通过界面配置
              </apiot-button>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="form-item">-->
      <!--        <div class="form-item-label">通过按钮属性</div>-->
      <!--        <div class="form-item-content">-->
      <!--          <apiot-input v-model="buttonAttributes.passText"></apiot-input>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="form-item">-->
      <!--        <div class="form-item-label">驳回按钮属性</div>-->
      <!--        <div class="form-item-content">-->
      <!--          <apiot-input v-model="buttonAttributes.rejectText"></apiot-input>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="form-item">
        <div class="form-item-content">
          <div class="item-content-box">
            <div class="box-left">驳回理由是否必填</div>
            <div class="box-right">
              <el-switch
                v-model="buttonAttributes.reasonForRejectionRequired"
                active-color="#4689F5"
                inactive-color="#E0E0E0"
              >
              </el-switch>
            </div>
          </div>
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
      :title="title"
      :checkType="checkType"
      :isNeedPassAndRejectBtn="isNeedPassAndRejectBtn"
      :appCheckFormConfigJSON="appCheckFormConfigJSON"
      :checkFormConfigJSON="checkFormConfigJSON"
      :appCheckAgreeFormConfig="appCheckAgreeFormConfig"
      :checkAgreeFormConfig="checkAgreeFormConfig"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
    />
  </div>
</template>

<script>
import { getBeforesNode } from '@/api/flow.js';
import { approvalType } from '@/config/index';
import ApprovalPanelConfig from '../ApprovalPanelConfig/index';
import MessageTemplate from '../MessageTemplateSetting';
import CCUsers from './CCUsers';
import SelectUsers from './SelectUsers';
// import FilterableInput from '../FilterableInput';

export default {
  props: {
    flowData: {
      type: Object,
      default() {
        return {};
      }
    },
    currentVersion: {
      type: Object,
      default() {
        return {};
      }
    },
    params: {
      type: Object
    },
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nodeList: [],
      title: '',
      isNeedPassAndRejectBtn: true,
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
      configData: [], // 页面配置
      checkFormConfigJSON: [], // 审批人页面配置
      checkFormConfigJSONOrigin: [], // 审批人页面配置源数据
      appCheckFormConfigJSON: [], // 审批人页面配置
      appCheckFormConfigJSONOrigin: [], // 审批人页面配置源数据

      checkAgreeFormConfig: [], // pc审批同意面板配置
      checkAgreeFormConfigOrigin: [], // pc审批同意面板配置
      appCheckAgreeFormConfig: [], // app审批同意面板配置
      appCheckAgreeFormConfigOrigin: [], // app审批同意面板配置

      configVisible: false, // 审批人页面配置弹框
      options: approvalType,
      effectiveApprovalDays: '', // 审批有效天数
      ccList: [], // 抄送人列表
      buttonAttributes: {
        passText: '通过', // 通过按钮属性
        rejectText: '驳回', // 驳回按钮属性
        reasonForRejectionRequired: true //  驳回理由是否必填
      },
      rejectNodeConf: { // 回退节点配置
        defaultNodeId: null,
        allowNodeIds: []
      },
      multiPersonApproval: 'ONE_PASS_OR_REJECT',
      afterProcess: '',
      checkList: [], //
      sourceType: {
        // 审批人集合
        ROLE: [], // 角色
        ORG: [], // 组织
        USER: [], // 固定人员
        POST: [] // 职位
      },
      tabOptions: [],
      msgConf: {}, // 消息模板id
      configType: '', // 审批面板还是通过面板
      checkType: '' // 用于表示app还是pc端审批界面
    };
  },

  components: {
    SelectUsers,
    CCUsers,
    ApprovalPanelConfig,
    MessageTemplate
  },

  computed: {},

  mounted() {},
  watch: {
    nodeInfo: {
      immediate: true,
      deep: true,
      handler() {
        this.init();
        console.log(111);
        // this.key += 1;
      }
    },
    'params.nodeId': {
      immediate: true,
      deep: true,
      handler(v, o) {
        // this.init();
        if (v !== o) {
          this.key += 1;
        }
      }
    }
  },

  methods: {
    changeMessageTemplate(res = {}) {
      this.msgConf = {
        templateId: res.id || ''
      };
    },
    async init() {
      if (this.nodeInfo && JSON.stringify(this.nodeInfo) !== '{}') {
        this.sourceType = this.nodeInfo.checkUsers;
        if (this.nodeInfo.allowAddCheck) {
          this.checkList.push('allowAddCheck');
        }
        if (this.nodeInfo.allowReferral) {
          this.checkList.push('allowReferral');
        }
        if (this.nodeInfo.allowRejectTo) {
          this.checkList.push('allowRejectTo');
        }
        const list = await getBeforesNode(this.params);
        this.nodeList = list;
        const {
          multiPersonApproval,
          buttonAttributes,
          rejectConfig,
          checkFormConfig,
          appCheckFormConfig,
          // nodeAbstractConfig,
          effectiveApprovalDays,
          ccList = [],
          checkAgreeFormConfig = [],
          appCheckAgreeFormConfig = [],
          msgConf = {},
          rejectNodeConf = {
            defaultNodeId: null,
            allowNodeIds: []
          }
        } = this.nodeInfo;
        this.msgConf = msgConf;
        this.multiPersonApproval = multiPersonApproval;
        this.buttonAttributes = buttonAttributes;
        this.ccList = ccList;
        this.rejectNodeConf = rejectNodeConf;
        this.afterProcess = rejectConfig;
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
        this.appCheckAgreeFormConfig = JSON.parse(JSON.stringify(appCheckAgreeFormConfig));
        this.appCheckAgreeFormConfigOrigin = appCheckAgreeFormConfig;
        this.checkAgreeFormConfig = JSON.parse(JSON.stringify(checkAgreeFormConfig));
        this.checkAgreeFormConfigOrigin = checkAgreeFormConfig;
        this.effectiveApprovalDays = effectiveApprovalDays || '';
      } else {
        this.sourceType = {
          // 审批人集合
          ROLE: [], // 角色
          ORG: [], // 组织
          USER: [], // 固定人员
          POST: [] // 职位
        };
        this.checkList = [];
        this.multiPersonApproval = 'ONE_PASS_OR_REJECT';
        this.buttonAttributes = {
          passText: '通过', // 通过按钮属性
          rejectText: '驳回', // 驳回按钮属性
          reasonForRejectionRequired: true //  驳回理由是否必填
        };
        this.afterProcess = '';
        this.checkFormConfigJSONOrigin = [];
        this.checkFormConfigJSON = [];
        this.appCheckFormConfigJSONOrigin = [];
        this.appCheckFormConfigJSON = [];
        this.effectiveApprovalDays = '';
        this.ccList = [];
        this.nodeList = [];
        this.rejectNodeConf = {
          defaultNodeId: null,
          allowNodeIds: []
        };
      }
    },
    handleOk(data) {
      // 点击保存的时候，以修改的数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc' && this.configType === 'panel') {
        this.checkFormConfigJSONOrigin = JSON.parse(JSON.stringify(data));
        this.checkFormConfigJSON = JSON.parse(JSON.stringify(data));
      } else if (this.checkType === 'app' && this.configType === 'panel') {
        this.appCheckFormConfigJSONOrigin = JSON.parse(JSON.stringify(data));
        this.appCheckFormConfigJSON = JSON.parse(JSON.stringify(data));
      } else if (this.checkType === 'app' && this.configType === 'agree') {
        this.appCheckAgreeFormConfigOrigin = JSON.parse(JSON.stringify(data));
        this.appCheckAgreeFormConfig = JSON.parse(JSON.stringify(data));
      } else if (this.checkType === 'pc' && this.configType === 'agree') {
        this.checkAgreeFormConfigOrigin = JSON.parse(JSON.stringify(data));
        this.checkAgreeFormConfig = JSON.parse(JSON.stringify(data));
      }
      // this.nodeAbstractConfigOrigin = [...this.nodeAbstractConfig];
      this.configVisible = false;
      this.checkType = '';
      this.configType = '';
    },
    handleCancel() {
      // 点击取消的时候，以源数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc' && this.configType === 'panel') {
        this.checkFormConfigJSON = [...this.checkFormConfigJSONOrigin];
      } else if (this.checkType === 'app' && this.configType === 'panel') {
        this.appCheckFormConfigJSON = [...this.appCheckFormConfigJSONOrigin];
      } else if (this.checkType === 'app' && this.configType === 'agree') {
        this.appCheckAgreeFormConfig = [...this.appCheckAgreeFormConfigOrigin];
      } else if (this.checkType === 'pc' && this.configType === 'agree') {
        this.checkAgreeFormConfig = [...this.checkAgreeFormConfigOrigin];
      }
      // this.nodeAbstractConfig = [...this.nodeAbstractConfigOrigin];
      this.configVisible = false;
      this.checkType = '';
    },
    async pageSet(key, key2) {
      if (key2 === 'panel') {
        this.isNeedPassAndRejectBtn = true;
      } else {
        this.isNeedPassAndRejectBtn = false;
      }
      if (!key) return;
      const config = {
        pcagree: 'PC端审批通过界面配置',
        appagree: 'APP端审批通过界面配置',
        pcpanel: 'PC端审批界面配置',
        apppanel: 'APP端审批界面配置'
      };
      this.title = config[`${key}${key2}`];
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
        key2,
        appPanelName,
        pcPanelName,
        pcPanelId,
        appPanelId
      });
      this.checkType = key;
      this.configType = key2;
      this.configVisible = true;
    },
    selectCC(list) {
      this.ccList = list;
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

        .panelInput {
          margin-bottom: 10px;
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
          .el-input-number .el-input__inner {
            text-align: left;
          }
        }
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
