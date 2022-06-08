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
            :params="params"
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
      <div class="form-item">
        <div class="form-item-label">通过按钮属性</div>
        <div class="form-item-content">
          <apiot-input v-model="buttonAttributes.passText"></apiot-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">驳回按钮属性</div>
        <div class="form-item-content">
          <apiot-input v-model="buttonAttributes.rejectText"></apiot-input>
        </div>
      </div>
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
    <apiot-dialog
      title="审批人界面配置"
      :isBigDialog="true"
      :visible.sync="configVisible"
      @sure-click="handleOk"
      @cancle-click="handleCancel"
    >
      <div class="user-appover-content">
        <el-table
          :height="513"
          :data="configData"
          style="width: 100%; margin-bottom: 20px"
          row-key="compId"
          border
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="组件名称" sortable width="250">
            <template slot-scope="scope">
              <span class="name-component"
                ><img
                  v-if="scope.row.compType"
                  :src="require(`@/assets/img/menu_images/${scope.row.imgUrl}`)"
                />{{ scope.row.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="显示">
            <template slot-scope="scope">
              <apiot-checkbox
                v-if="isShowCheckbox(scope.row, 'canShow')"
                :value="getIsHide(scope.row, 'canShow')"
                @change="(value) => changeCheck(value, scope.row, 'canShow')"
              >
              </apiot-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="编辑">
            <template slot-scope="scope">
              <apiot-checkbox
                v-if="isShowCheckbox(scope.row, 'canReadonly')"
                :value="getIsEdit(scope.row, 'canEdit')"
                @change="(value) => changeCheck(value, scope.row, 'canEdit')"
              >
              </apiot-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="必填">
            <template slot-scope="scope">
              <apiot-checkbox
                :value="getIsCheck(scope.row, 'shouldRequired')"
                v-if="isShowCheckbox(scope.row, 'shouldRequired')"
                @change="
                  (value) => changeCheck(value, scope.row, 'shouldRequired')
                "
              >
              </apiot-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </apiot-dialog>
  </div>
</template>

<script>
import { approvalType } from '@/config/index';
import { getDesignMenu } from '@/api/menuConfig';
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
      key: 0,
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
      buttonAttributes: {
        passText: '通过', // 通过按钮属性
        rejectText: '驳回', // 驳回按钮属性
        reasonForRejectionRequired: true //  驳回理由是否必填
      },
      multiPersonApproval: '',
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
    // FilterableInput
  },

  computed: {
    isShowCheckbox() {
      return function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      };
    },
    getIsHide() {
      return function(obj, key) {
        const isTrue = this.checkType === 'app';
        const arr = isTrue ? this.appCheckFormConfigJSON : this.checkFormConfigJSON;
        const index = arr.findIndex((item) => item.compId === obj.compId);
        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key] || false;
          }
          const { singleStatus } = obj;
          return singleStatus !== 4;
        }
        const { singleStatus } = obj;
        return singleStatus !== 4;
      };
    },
    getIsEdit() {
      return function(obj, key) {
        const isTrue = this.checkType === 'app';
        const arr = isTrue ? this.appCheckFormConfigJSON : this.checkFormConfigJSON;
        const index = arr.findIndex((item) => item.compId === obj.compId);
        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key] || false;
          }
          const { singleStatus } = obj;
          return ![2, 3].includes(singleStatus);
        }
        const { singleStatus } = obj;
        return ![2, 3].includes(singleStatus);
      };
    },
    getIsCheck() {
      // 根据组件id获取配置的显示隐藏
      return function(obj, key) {
        const isTrue = this.checkType === 'app';
        const arr = isTrue ? this.appCheckFormConfigJSON : this.checkFormConfigJSON;
        const index = arr.findIndex((item) => item.compId === obj.compId);
        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key] || false;
          }
          return obj[key];
        }
        return obj[key];
      };
    },
    // getAbstractIsCheck() {
    //   return function(obj) {
    //     const index = this.nodeAbstractConfig.findIndex((item) => item.compId === obj.compId);
    //     if (index !== -1) {
    //       return true;
    //     }
    //     return false;
    //   };
    // }
  },

  mounted() {
  },
  watch: {
    nodeInfo: {
      immediate: true,
      deep: true,
      handler() {
        this.init();
        this.key += 1;
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
          effectiveApprovalDays
        } = this.nodeInfo;
        this.multiPersonApproval = multiPersonApproval;
        console.log(buttonAttributes, 'buttonAttributes', this.nodeInfo);
        this.buttonAttributes = buttonAttributes;
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
        this.multiPersonApproval = '';
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
      }
    },
    handleOk() {
      // 点击保存的时候，以修改的数据为主
      if (!this.checkType) return;
      if (this.checkType === 'pc') {
        this.checkFormConfigJSONOrigin = [...this.checkFormConfigJSON];
      } else {
        this.appCheckFormConfigJSONOrigin = [...this.appCheckFormConfigJSON];
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
    changeCheck(value, obj, key) {
      // 修改属性
      const isTrue = this.checkType === 'app';
      const arr = isTrue ? this.appCheckFormConfigJSON : this.checkFormConfigJSON;
      const index = arr.findIndex((item) => item.compId === obj.compId);
      if (index !== -1) {
        const currentObj = {
          ...arr[index],
          [key]: value
        };
        this.$set(arr, index, currentObj);
        // console.log(this.checkFormConfigJSON, 'this.checkFormConfigJSON');
        return;
      }
      if (isTrue) {
        this.appCheckFormConfigJSON.push({ [key]: value, compId: obj.compId });
      } else {
        this.checkFormConfigJSON.push({ [key]: value, compId: obj.compId });
      }
    },
    // changeAbstractCheck(value, { compId, name, compType, dataSource }) {
    //   const dictKey = dataSource.dictObj ? dataSource.dictObj.dictKey : null;
    //   const index = this.nodeAbstractConfig.findIndex((item) => item.compId === compId);
    //   const obj = {
    //     compId,
    //     name,
    //     compType,
    //     dictKey,
    //     columnName: dataSource.columnName,
    //     tableName: dataSource.tableName
    //   };
    //   if (this.nodeAbstractConfig.length >= 3) {
    //     if (index !== -1) {
    //       this.nodeAbstractConfig.splice(index, 1);
    //       return;
    //     }
    //     this.nodeAbstractConfig.splice(2, 1, obj);
    //   } else {
    //     if (index !== -1) {
    //       this.nodeAbstractConfig.splice(index, 1);
    //       return;
    //     }
    //     this.nodeAbstractConfig.push(obj);
    //   }
    // },
    async pageSet(key) {
      if (!key) return;
      const { globalAttributes: { pcPanelId, appPanelId } } = this.currentVersion;
      const res = await getDesignMenu({ panelId: key === 'pc' ? pcPanelId : appPanelId });
      this.configData = res[0].designOverallLayout || [];
      this.checkType = key;
      this.configVisible = true;
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

  .user-appover-content {
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
