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
    </div>
    <apiot-dialog
      title="填写人界面配置"
      :isBigDialog="true"
      :visible.sync="configVisible"
      @sure-click="handleOk"
      @cancle-click="handleCancel"
    >
      <div class="user-appover-content">
        <div class="user-appover-tabs">
          <div class="form-item-label">面板选择</div>
          <div class="form-item-content">
            <apiot-select
                v-model="panelActive"
                @change="changeConfig"
            >
              <el-option
                  v-for="item in panelOptions"
                  :value="item.value"
                  :key="item.index"
                  :label="item.name"
              ></el-option>
            </apiot-select>
          </div>
        </div>
        <el-table
          :height="466"
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
          <el-table-column
            prop="abstract"
            label="关联提交按钮"
          >
            <template slot-scope="scope">
              <apiot-checkbox
                :value="getIsCheck(scope.row, 'isRelation')"
                v-if="scope.row.compName === 'FormButton'"
                @change="(value) => changeCheck(value, scope.row, 'isRelation')"
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
import { getDesignMenu } from '@/api/menuConfig';
import SelectUsers from '../FlowApproval/SelectUsers';
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
      panelOptions: [], // 面板下拉
      panelActive: '', // 选中的面板
      key: 0,
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
  },

  mounted() {
  },
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
    init() {
      if (JSON.stringify(this.nodeInfo) !== '{}' && this.nodeInfo) {
        const {
          fillUsers,
          submitText,
          checkFormConfig,
          appCheckFormConfig,
        } = this.nodeInfo;
        this.sourceType = fillUsers;
        this.submitText = submitText;
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
      }
      this.key += 1;
    },
    // 选择面板
    async selectPane(pane) {
      this.curPaneObj = pane || {};
    },
    changeAbstractCheck(value, { compId, name, compType, dataSource }) {
      const dictKey = dataSource.dictObj ? dataSource.dictObj.dictKey : null;
      const index = this.nodeAbstractConfig.findIndex((item) => item.compId === compId);
      const obj = {
        compId,
        name,
        compType,
        dictKey,
        columnName: dataSource.columnName,
        tableName: dataSource.tableName
      };
      if (this.nodeAbstractConfig.length >= 3) {
        if (index !== -1) {
          this.nodeAbstractConfig.splice(index, 1);
          return;
        }
        this.nodeAbstractConfig.splice(2, 1, obj);
      } else {
        if (index !== -1) {
          this.nodeAbstractConfig.splice(index, 1);
          return;
        }
        this.nodeAbstractConfig.push(obj);
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
    async pageSet(key) {
      if (!key) return;
      console.log(this.currentVersion);
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
      const res = await getDesignMenu({ panelId: key === 'pc' ? pcPanelId : appPanelId });
      this.configData = res[0].designOverallLayout || [];
      this.panelActive = res[0].panelId;
      const paneObj = this.configData[0].paneObj || {};
      const options = [{
        name: key === 'app' ? appPanelName : pcPanelName,
        value: this.panelActive
      }];
      Object.keys(paneObj).forEach((item, i) => {
        const { panelName, id, panelClassify } = paneObj[item] || {};
        // eslint-disable-next-line no-shadow
        if (panelName && panelClassify !== 2 && !options.find((item) => item.value === id)) {
          options.push({
            value: id,
            name: panelName,
            key: i
          });
        }
      });
      this.panelOptions = options;
      this.checkType = key;
      this.configVisible = true;
    },
    async changeConfig(v) { // 获取其他面板的配置
      const res = await getDesignMenu({ panelId: v });
      this.configData = res[0].designOverallLayout || [];
      this.panelActive = res[0].panelId;
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
    .user-appover-tabs{
      height: 46px;
      display: flex;
      align-items: center;
      .form-item-label{
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
