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
          <CCUsers
              :value="ccList"
              @select-flow-approval="selectCC"
          />
        </div>
      </div>

      <div class="form-item">
        <div class="form-item-label">PC端审批人界面配置</div>
        <div class="form-item-content">
          <apiot-button class="list-btn" @click="pageSet('pc')">
            <i class="icon-shezhi iconfont"></i>
            PC端审批人界面配置
          </apiot-button>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">APP端审批人界面配置</div>
        <div class="form-item-content">
          <apiot-button class="list-btn" @click="pageSet('app')">
            <i class="icon-shezhi iconfont"></i>
            APP端审批人界面配置
          </apiot-button>
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
    </div>
    <ApprovalPanelConfig
        :configVisible.sync="configVisible"
        ref="approvalPanelConfig"
        :checkType="checkType"
        :appCheckFormConfigJSON="appCheckFormConfigJSON"
        :checkFormConfigJSON="checkFormConfigJSON"
        @handleOk="handleOk"
        @handleCancel="handleCancel"
    />
  </div>
</template>

<script>
import { approvalType } from '@/config/index';
import SelectUsers from './SelectUsers';
import CCUsers from './CCUsers';
import ApprovalPanelConfig from '../ApprovalPanelConfig/index';
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
      type: Object,
    },
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

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
      // nodeAbstractConfig: [], // 审批人摘要配置
      // nodeAbstractConfigOrigin: [], // 审批人摘要配置源数据
      configVisible: false, // 审批人页面配置弹框
      options: approvalType,
      effectiveApprovalDays: '', // 审批有效天数
      ccList: [], // 抄送人列表
      buttonAttributes: {
        passText: '通过', // 通过按钮属性
        rejectText: '驳回', // 驳回按钮属性
        reasonForRejectionRequired: true //  驳回理由是否必填
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
      checkType: '', // 用于表示app还是pc端审批界面
    };
  },

  components: {
    SelectUsers,
    CCUsers,
    ApprovalPanelConfig
  },

  computed: {
  },

  mounted() {
  },
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
    init() {
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
        const {
          multiPersonApproval,
          buttonAttributes,
          rejectConfig,
          checkFormConfig,
          appCheckFormConfig,
          // nodeAbstractConfig,
          effectiveApprovalDays,
          ccList = []
        } = this.nodeInfo;
        this.multiPersonApproval = multiPersonApproval;
        this.buttonAttributes = buttonAttributes;
        this.ccList = ccList;
        this.afterProcess = rejectConfig;
        // eslint-disable-next-line max-len
        this.checkFormConfigJSONOrigin = checkFormConfig
          ? JSON.parse(JSON.stringify(checkFormConfig))
          : [];
        // eslint-disable-next-line max-len
        this.checkFormConfigJSON = checkFormConfig ? JSON.parse(JSON.stringify(checkFormConfig)) : [];
        // eslint-disable-next-line max-len
        this.appCheckFormConfigJSONOrigin = appCheckFormConfig
          ? JSON.parse(JSON.stringify(appCheckFormConfig))
          : [];
        // eslint-disable-next-line max-len
        this.appCheckFormConfigJSON = appCheckFormConfig
          ? JSON.parse(JSON.stringify(appCheckFormConfig))
          : [];
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
      }
    },
    handleOk(data) {
      // 点击保存的时候，以修改的数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc') {
        this.checkFormConfigJSONOrigin = JSON.parse(JSON.stringify(data));
        this.checkFormConfigJSON = JSON.parse(JSON.stringify(data));
      } else {
        this.appCheckFormConfigJSONOrigin = JSON.parse(JSON.stringify(data));
        this.appCheckFormConfigJSON = JSON.parse(JSON.stringify(data));
      }
      // this.nodeAbstractConfigOrigin = [...this.nodeAbstractConfig];
      this.configVisible = false;
      this.checkType = '';
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
      this.checkType = '';
    },
    async pageSet(key) {
      if (!key) return;
      const { globalAttributes: {
        pcPanelId, appPanelId, appPanelName, pcPanelName } } = this.currentVersion;
      if (key === 'app' && !appPanelId) {
        this.$message.error('请在全局属性中配置app面板!');
        return;
      }
      if (key === 'pc' && !pcPanelId) {
        this.$message.error('请在全局属性中配置PC面板!');
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
    },
    selectCC(list) {
      this.ccList = list;
    },
    appendUsers({ value, key }) {
      this.sourceType[key] = value;
    },
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
