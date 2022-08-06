/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：inndex
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">自动处理规则</div>
        <div class="form-item-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="isTriggerUserAutoPass"
            >流程触发者自动通过
            </el-checkbox
            >
            <br/>
            <el-checkbox label="isCheckUserNullAutoPass"
            >审批人为空时自动通过
            </el-checkbox
            >
            <br/>
            <el-checkbox label="isAlreadyCheckUserAutoPass"
            >已经审批过该对象的审批人自动通过
            </el-checkbox
            >
            <br/>
            <!--            <el-checkbox label="isSameCheckUserWithLastNodeAutoPass"-->
            <!--              >处理人与上一节点相同自动通过</el-checkbox-->
            <!--            >-->
            <!--            <br />-->
          </el-checkbox-group>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">工作流撤回</div>
        <div class="form-item-content">
          <el-checkbox
              label="允许触发者撤回"
              v-model="allowRevoke"
          ></el-checkbox>
          <div class="select-field" v-if="allowRevoke">
            <div class="form-item-label">选择节点</div>
            <div>
              <apiot-select
                  v-model="lastAllowRevokeNodeId"
                  filterable
                  placeholder="请选择撤回节点"
              >
                <el-option
                    v-for="item in approveNodeArr"
                    :key="item.nodeId"
                    :label="item.title"
                    :value="item.nodeId"
                >
                </el-option>
              </apiot-select>
            </div>
            <div class="memo">通过后不允许撤回</div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">关联pc端面板</div>
        <div class="form-item-content">
          <filterable-input
              ref="filterableInput"
              class="panelInput"
              placeholder="请选择面板"
              :hasPagination="true"
              :showInfo="{id: pcPanelId, panelName: pcPanelName}"
              :isSelPanel="false"
              :dialogType="4"
              :options="tabOptions"
              :otherParams="{
                 panelType: 5,
                 unDesign: 1,
                 enableWorkflow: 1,
                 panelClassify: 1,
                 clientType: 1}"
              @selectRes="selectPane($event, 'pcTab')"
          ></filterable-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">关联APP面板</div>
        <div class="form-item-content">
          <filterable-input
              ref="filterableInput"
              class="panelInput"
              placeholder="请选择面板"
              :hasPagination="true"
              :showInfo="{id: appPanelId, panelName: appPanelName}"
              :dialogType="4"
              :options="tabOptions"
              :isSelPanel="false"
              :otherParams="{
                 panelType: 5,
                 unDesign: 1,
                 panelClassify: 1,
                 clientType: 2,
                 enableWorkflow: 1
              }"
              @selectRes="selectPane($event, 'appTab')"
          ></filterable-input>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <apiot-button class="list-btn" @click="doClick">
          <i class="icon-xinzeng iconfont m-r-4"></i>
          摘要信息配置
        </apiot-button>
      </div>
      <div style="margin-top: 10px;">
        <apiot-button class="list-btn" @click="relateDialog=true">
          <i class="icon-xinzeng iconfont m-r-4"></i>
          设置关联表
        </apiot-button>
      </div>
      <apiot-dialog
          :visible.sync="visible1"
          title="设置摘要信息"
          @sure-click="handleSaveConfig"
      >
        <div class="summarySettings">
          <apiot-button @click="add">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{ $t('common.add', { name: '' }) }}
          </apiot-button>
        </div>
        <apiot-table
            class="summarySettingsWrap"
            :showSelection="false"
            :isNeedRowDrop="false"
            :isNeedColumnDrop="false"
            :showSort="true"
            :isAnimate="false"
            rowKey="index"
            :tableData="descConfigList"
            style="width: 100%">
          <el-table-column
              prop="key"
              label="字段"
          >
            <template slot-scope="scope">
              <el-select
                  v-model="scope.row.key"
                  filterable
                  placeholder="请选择字段"
                  @change="changeColumn($event, scope.row, scope.$index, 'key')"
              >
                <el-option
                    v-for="item in fieldOptions"
                    :key="item.columnName"
                    :label="`${item.columnName}(${item.memo})`"
                    :value="item.columnName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              prop="enumeration"
              label="枚举">
            <template slot-scope="scope">
              <filterable-input
                  v-show="visible1"
                  class="task__filterableInput"
                  placeholder="请选择字典"
                  :showInfo="{ dictKey: scope.row.dictKey, dictName: scope.row.dictName }"
                  :hasPagination="true"
                  :dialogType="3"
                  @selectRes="changeColumn1($event, scope.row, scope.$index, 'enumeration')"
              ></filterable-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="name"
              label="描述">
            <template slot-scope="scope">
              <apiot-input
                  v-model="scope.row.name"
                  @input="changeColumn($event, scope.row, scope.$index, 'name')"
              ></apiot-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="name1"
              width="50"
              label="操作">
            <template slot-scope="scope">
              <span @click="del(scope.$index)" class="iconfont icon-shanchu"></span>
            </template>
          </el-table-column>
        </apiot-table>
      </apiot-dialog>
      <!-- 配置关联表弹窗 -->
      <RelateTableDialog
          :visible.sync="relateDialog"
          :getCurrentTab="getCurrentTab"
      ></RelateTableDialog>
    </div>
  </div>
</template>

<script>
import RelateTableDialog from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/RelateTableDialog';
import { getFields } from '@/api/flow';

export default {
  props: {
    flowData: {
      type: Object,
      default: () => {
      }
    },
    currentVersion: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      getCurrentTab: {
        tableInfo: { tableName: '' },
        relateTableArr: [],
        relateTableIndex: 0
      },
      relateDialog: false,
      visible1: false,
      pcPanelId: null, // pc面板id
      pcPanelName: '', // pc面板名称
      appPanelId: null, // app面板id
      appPanelName: '', // app面板名称
      checkList: [],
      options: [],
      value: '',
      lastAllowRevokeNodeId: '',
      radio2: '',
      enabled: true,
      allowRevoke: '', // 触发方式
      termObj: {}, // 设置筛选条件的值
      approveNodeArr: [], // 流程中所有的审批节点
      approveNode: '', // 撤回的审批节点
      tabOptions: [], // 面板
      descConfigList: [], // 摘要信息配置
      descConfigListOrigin: [], // 初始数据
      tableName: '',
      fieldOptions: []
    };
  },

  components: {
    RelateTableDialog
  },

  computed: {},

  mounted() {
    this.getApproveNodeList();
  },
  watch: {
    radio: {
      immediate: true,
      deep: true,
      handler(v) {
        // console.log(v);
        if (!v) {
          this.value1 = '';
        }
      }
    },
    'currentVersion.globalAttributes': {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) {
          this.init();
        }
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler() {
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(this.radio) && this.value) {
          this.getFieldList();
        }
      }
    },
    visible1: {
      deep: true,
      immediate: false,
      handler(v) {
        console.log(v);
        if (!v) {
          this.descConfigList = JSON.parse(JSON.stringify(this.descConfigListOrigin));
        }
      }
    },
    descConfigList: {
      handler(v) {
        console.log(v, 'zzz');
      }
    }
  },

  methods: {
    async getFieldList() {
      // 获取字段列表
      this.fieldOptions = await getFields({
        columnTypes: '',
        tableName: this.tableName
      });

      // console.log('获取');
    },
    handleSaveConfig() {
      this.descConfigListOrigin = JSON.parse(JSON.stringify(this.descConfigList));
      if (this.descConfigList.length) {
        let isTrue = false;
        this.descConfigList.forEach((item) => {
          if (!item.key || !item.name) {
            isTrue = true;
          }
        });
        if (isTrue) {
          this.$message.error('摘要信息请填写完整!');
        } else {
          this.visible1 = false;
        }
      } else {
        this.visible1 = false;
      }
    },
    changeColumn1(value, row, i) {
      const obj = this.descConfigList[i];
      const newObj = { ...obj, dictKey: value.dictKey, dictName: value.dictName };
      this.descConfigList.splice(i, 1, newObj);
    },
    changeColumn(value, row, i, key) {
      const obj = this.descConfigList[i];
      const newObj = { ...obj, [key]: value };
      this.descConfigList.splice(i, 1, newObj);
    },
    doClick() {
      if (!this.tableName) {
        this.$message.error('请选择触发源!');
        return;
      }
      this.visible1 = true;
      this.getFieldList();
    },
    del(i) {
      this.descConfigList.splice(i, 1);
    },
    add() {
      const n = this.descConfigList.length;
      if (n >= 3) {
        this.$message.error('摘要信息最多允许配置3个字段');
        return;
      }
      this.descConfigList.push({
        key: '',
        name: ''
      });
    },
    init() {
      const { globalAttributes, workflowTree = {} } = this.currentVersion;
      const { type, properties } = workflowTree;
      if (type === 'start' && properties) {
        this.tableName = properties.tableName;
      }
      if (globalAttributes && JSON.stringify(globalAttributes) !== '{}') {
        const {
          descConfigList = [],
          lastAllowRevokeNodeId,
          allowRevoke,
          isAlreadyCheckUserAutoPass,
          isCheckUserNullAutoPass,
          isSameCheckUserWithLastNodeAutoPass,
          isTriggerUserAutoPass,
          pcPanelId = null, // pc面板id
          pcPanelName = '', // pc面板名称
          appPanelId = null, // app面板id
          appPanelName = '', // app面板名称
          tableRelation
        } = globalAttributes;
        this.lastAllowRevokeNodeId = lastAllowRevokeNodeId;
        this.descConfigList = descConfigList;
        this.descConfigListOrigin = JSON.parse(JSON.stringify(descConfigList));
        this.allowRevoke = allowRevoke;
        if (isAlreadyCheckUserAutoPass) {
          this.checkList.push('isAlreadyCheckUserAutoPass');
        }
        if (isCheckUserNullAutoPass) {
          this.checkList.push('isCheckUserNullAutoPass');
        }
        if (isSameCheckUserWithLastNodeAutoPass) {
          this.checkList.push('isSameCheckUserWithLastNodeAutoPass');
        }
        if (isTriggerUserAutoPass) {
          this.checkList.push('isTriggerUserAutoPass');
        }
        this.pcPanelId = pcPanelId; // pc面板id
        this.pcPanelName = pcPanelName; // pc面板名称
        this.appPanelId = appPanelId; // app面板id
        this.appPanelName = appPanelName; // app面板名称
        this.getCurrentTab = tableRelation ? JSON.parse(tableRelation) : {
          tableInfo: { tableName: this.tableName },
          relateTableArr: [],
          relateTableIndex: 0
        };
      }
    },
    selectPane(e, key) {
      if (!e) {
        e = {};
      }
      const {
        id = '',
        panelName = ''
      } = e;
      if (key === 'appTab') {
        this.appPanelId = id; // app面板id
        this.appPanelName = panelName; // app面板名称
      } else {
        this.pcPanelId = id; // app面板id
        this.pcPanelName = panelName; // app面板名称
      }
    },
    getApproveNodeList() {
      // 获取所有的审批节点
      const approveNodeArr = [];
      const approveLoop = (obj = {}, arr = []) => {
        // console.log(3232423, JSON.stringify(obj) === '{}');
        if (JSON.stringify(obj) === '{}') return;
        if (obj.type === 'approver') {
          arr.push({
            nodeId: obj.nodeId,
            title: obj.properties.title
          });
        }
        const { hasOwnProperty } = Object.prototype;
        if (hasOwnProperty.call(obj, 'childNode')) {
          approveLoop(obj.childNode, approveNodeArr);
        }
        if (
          hasOwnProperty.call(obj, 'conditionNodes') &&
            obj.conditionNodes &&
            Array.isArray(obj.conditionNodes)
        ) {
          obj.conditionNodes.forEach((item) => {
            approveLoop(item, approveNodeArr);
          });
        }
      };
      approveLoop(this.flowData, approveNodeArr);
      this.approveNodeArr = approveNodeArr;
      // console.log(this.approveNodeArr, 'approveNodeArr');
    }
  },
  name: 'inndex'
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

          .el-radio {
            height: 30px;
            line-height: 30px;

            .el-radio__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

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
      }
    }

    .list-btn {
      width: 100%;

      .iconfont {
        margin-right: 5px;
        color: #4689f5;
      }
    }

    .abstractDesc {
      .abstractHeader {
        display: flex;

        & > div {
          flex: 3;
          height: 36px;
          margin-left: 5px;
          font-size: 13px;
          line-height: 36px;
          color: grey;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          white-space: nowrap;
        }

        & > div:last-child {
          flex: 1;
          text-align: center;
        }

        & > div:first-child {
          flex: 1;
          text-align: center;
        }
      }

      .abstractTbody {
        min-height: 100px;

        .abstractTr {
          display: flex;
          margin-bottom: 5px;

          & > div {
            flex: 3;
            margin-left: 5px;
          }

          & > div:last-child {
            flex: 1;
            line-height: 30px;
            text-align: center;
          }

          & > div:first-child {
            flex: 1;
            line-height: 30px;
            text-align: center;
          }

          .icon-shanchu {
            color: #BBC3CD;
            cursor: pointer;
          }
          .icon-shanchu:hover {
            color: #4689f5;
          }
        }
      }
    }
  }
  .summarySettingsWrap{
    .icon-shanchu {
      color: #BBC3CD;
      cursor: pointer;
    }
    .icon-shanchu:hover {
      color: #4689f5;
    }
    ::v-deep{
      .filterableInput__result--table{
        top: 2px;
        right: 3px;
        bottom: 5px;
        left: 3px;
      }
      .filterableInput__con .icon-jiahao{
        bottom: 3px;
      }
    }
  }
  .summarySettings{
    margin-bottom: 10px;
    text-align: left;
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
