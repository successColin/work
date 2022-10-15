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
        <div class="form-item-label">选择触发源</div>
        <div class="form-item-content trigger-source">
          <filterable-input
              placeholder="请选择触发源"
              title="关联表"
              :dialogType="1"
              :showInfo="{tableName: value}"
              @selectRes="selectTable"
          ></filterable-input>
<!--          <el-select-->
<!--            v-model="value"-->
<!--            placeholder="请选择触发源"-->
<!--            :class="{ prefixIcon: !value, showBg: value }"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item"-->
<!--              :label="item"-->
<!--              :value="item"-->
<!--            >-->
<!--              <div>-->
<!--                <span-->
<!--                  class="iconfont icon-shujubiao"-->
<!--                  style="-->
<!--                    font-size: 24px;-->
<!--                    margin-right: 4px;-->
<!--                    color: #5a80ed;-->
<!--                    vertical-align: sub;-->
<!--                    font-weight: 400;-->
<!--                  "-->
<!--                ></span>-->
<!--                <span>{{ item }}</span>-->
<!--              </div>-->
<!--            </el-option>-->
<!--            <template v-slot:prefix>-->
<!--              <span-->
<!--                v-show="value"-->
<!--                class="iconfont icon-shujubiao"-->
<!--                style="-->
<!--                  font-size: 18px;-->
<!--                  width: 24px;-->
<!--                  display: inline-block;-->
<!--                  height: 24px;-->
<!--                  line-height: 24px;-->
<!--                "-->
<!--              ></span>-->
<!--            </template>-->
<!--          </el-select>-->
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">触发方式</div>
        <div class="form-item-content">
          <apiot-radio v-model="radio" label="SAVEOREDIT"
            >当新增或更新记录时触发</apiot-radio
          ><br />
          <div class="select-field" v-if="radio === 'SAVEOREDIT'">
            <div class="form-item-label">
              触发字段
              <el-tooltip
                class="item"
                effect="dark"
                content="当以上指定的其中一个字段更新时将触发流程，如未指定则表示任何字段更新时都会触发"
                placement="top"
              >
                <span class="iconfont icon-bangzhu"></span>
              </el-tooltip>
            </div>
            <div>
              <el-select
                v-model="value1"
                multiple
                filterable
                placeholder="请选择触发字段"
              >
                <el-option
                  v-for="item in fieldOptions"
                  :key="item.columnName"
                  :label="`${item.columnName}(${item.memo})`"
                  :value="item.columnName"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <apiot-radio v-model="radio" label="ONLYSAVE"
            >仅新增记录时触发</apiot-radio
          >
          <br />
          <apiot-radio v-model="radio" label="ONLYEDIT"
            >仅更新记录时触发</apiot-radio
          >
          <br />
          <div class="select-field" v-if="radio === 'ONLYEDIT'">
            <div class="form-item-label">
              触发字段
              <el-tooltip
                class="item"
                effect="dark"
                content="当以上指定的其中一个字段更新时将触发流程，如未指定则表示任何字段更新时都会触发"
                placement="top"
              >
                <span class="iconfont icon-bangzhu"></span>
              </el-tooltip>
            </div>
            <div>
              <apiot-select
                v-model="value1"
                multiple
                filterable
                placeholder="请选择触发字段"
              >
                <el-option
                  v-for="item in fieldOptions"
                  :key="item.columnName"
                  :label="`${item.columnName}(${item.memo})`"
                  :value="item.columnName"
                >
                </el-option>
              </apiot-select>
            </div>
          </div>
          <apiot-radio v-model="radio" label="DELETE"
            >删除记录时触发</apiot-radio
          >
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
      <div>
        <apiot-button class="list-btn" @click="showDataFiltering">
          <i class="icon-shezhi iconfont"></i>
          设置筛选条件
        </apiot-button>
      </div>
<!--      <div style="margin-top: 10px;">-->
<!--        <apiot-button class="list-btn" @click="doClick">-->
<!--          <i class="icon-xinzeng iconfont m-r-4"></i>-->
<!--          摘要信息配置-->
<!--        </apiot-button>-->
<!--      </div>-->
<!--      <div style="margin-top: 10px;">-->
<!--        <apiot-button class="list-btn" @click="relateDialog=true">-->
<!--          <i class="icon-xinzeng iconfont m-r-4"></i>-->
<!--          设置关联表-->
<!--        </apiot-button>-->
<!--      </div>-->
    </div>
    <apiot-dialog
      :visible.sync="visible"
      title="设置筛选条件"
      @sure-click="handleSaveDataFiltering"
    >
      <ActionTerm
        ref="dataFiltering"
        :configData="configData"
        businessType="flow"
        :needRelations="false"
        :lambdaArr="lambdaArr"
        :curTermObj="termObj"
        :flag="2"
        :tableInfo="{tableName: value}"
        :triggerCompMap="triggerCompMap"
      />
    </apiot-dialog>
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
                :showInfo="scope.row.enumeration"
                :hasPagination="true"
                :dialogType="3"
                @selectRes="changeColumn($event, scope.row, scope.$index, 'enumeration')"
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
import { getFields } from '@/api/flow';
import { lambdaArr } from '@/config/index';
import ActionTerm from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ActionTerm';
import RelateTableDialog from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/RelateTableDialog';
import ApprovalPanelConfig from '../ApprovalPanelConfig/index';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    },
    currentVersion: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      key1: 0,
      configVisible: false, // 审批人页面配置弹框
      isShowTitle: false, // 显示表头全选
      isShowCheckAll: false, // 显示表头全选
      isEditTitle: false, // 编辑全选
      isEditCheckAll: false, // 编辑表头全选
      isRequireTitle: false, // 必填全选
      isRequireCheckAll: false, // 必填全选
      panelOptions: [], // 面板下拉
      panelActive: '', // 选中的面板
      checkType: '', // 用于表示app还是pc端审批界面
      checkFormConfigJSON: [], // 审批人页面配置
      checkFormConfigJSONOrigin: [], // 审批人页面配置源数据
      appCheckFormConfigJSON: [], // 审批人页面配置
      appCheckFormConfigJSONOrigin: [], // 审批人页面配置源数据
      getCurrentTab: {
        tableInfo: { tableName: '' },
        relateTableArr: [],
        relateTableIndex: 0
      },
      relateDialog: false,
      visible1: false,
      tableInfo: {},
      options: [],
      value: '', // 表
      value1: '', // 请选择触发字段
      radio: 'ONLYSAVE', // 触发方式
      fieldOptions: [], // 表字段
      visible: false, // 条件筛选弹框显示隐藏
      configData: [], // 页面配置信息
      lambdaArr,
      descConfigList: [], // 摘要信息配置
      descConfigListOrigin: [], // 初始数据
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      } // 设置筛选条件的值
    };
  },

  components: {
    ActionTerm,
    RelateTableDialog,
    ApprovalPanelConfig
  },

  computed: {
    // 获取所有的校验单位
    getAllcheck() {
      const obj = {};
      if (this.configData[0] && this.configData[0].children.length) {
        const compPath = `${this.configData[0].name}`;
        this.configData[0].children.forEach((bigArea) => {
          const bigPath = `${compPath}/${bigArea.name}`;
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj[tab.compId] = JSON.parse(JSON.stringify(tab));
              obj[tab.compId].compType = 'TAB';
              const tabPath = `${bigPath}/${tab.compId}`;
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                        obj[comp.compId].compPath = areaPath;
                      });
                    }
                  } else {
                    obj[area.compId] = JSON.parse(JSON.stringify(area));
                    obj[area.compId].compType = 'AREA';
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj[comp.compId].compPath = areaPath;
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
        // console.log(obj, 2);
        return obj;
      }
      // console.log(obj, 1);
      return obj;
    },
    triggerCompMap() {
      const curInfo = {};
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        curInfo[key] = {};
        curInfo[key].compName = this.getAllcheck[key].name;
        curInfo[key].compType = this.getAllcheck[key].compType;
        curInfo[key].compPath = this.getAllcheck[key].compPath;
      });
      return curInfo;
    },
  },

  mounted() {
    const configData = sessionStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
      this.getDataSource(this.configData);
    }
    console.log(this.currentVersion);
  },
  watch: {
    nodeInfo: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    },
    radio: {
      immediate: true,
      deep: true,
      handler(v) {
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(v) && this.value) {
          this.getFieldList();
          return;
        }
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(v)) {
          if (!this.value) {
            this.$message.error('请选择触发源');
          }
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
        if (!v) {
          this.descConfigList = JSON.parse(JSON.stringify(this.descConfigListOrigin));
        }
      }
    }
  },

  methods: {
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
      // if (!this.checkType) return;
      if (this.checkType === 'pc') {
        this.checkFormConfigJSON = JSON.parse(JSON.stringify(this.checkFormConfigJSONOrigin));
      } else {
        this.appCheckFormConfigJSON = JSON.parse(JSON.stringify(this.appCheckFormConfigJSONOrigin));
      }
      // this.nodeAbstractConfig = [...this.nodeAbstractConfigOrigin];
      this.configVisible = false;
      this.checkType = '';
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
    changeColumn(value, row, i, key) {
      const obj = this.descConfigList[i];
      const newObj = { ...obj, [key]: value };
      this.descConfigList.splice(i, 1, newObj);
    },
    init() {
      if (this.nodeInfo && JSON.stringify(this.nodeInfo) !== '{}') {
        this.$nextTick(() => {
          const {
            descConfigList,
            tableName,
            triggerCond = {},
            triggerPreCond,
            checkFormConfig,
            appCheckFormConfig
          } = this.nodeInfo;
          this.descConfigList = descConfigList || [];
          // eslint-disable-next-line max-len
          this.descConfigListOrigin = JSON.parse(JSON.stringify(descConfigList || []));
          this.value = tableName || '';
          this.radio = triggerCond.type || 'ONLYSAVE';
          this.value1 = triggerCond.fieldNames;
          this.termObj = triggerPreCond || {
            termType: 1, // 1 代表外层and 内层 or
            termArr: [] // 条件数组
          };
          this.getCurrentTab = {
            tableInfo: { tableName },
            relateTableArr: [],
            relateTableIndex: 0
          };
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
        });
      }
    },
    selectTable(res) {
      const { tableName } = res;
      if (this.value !== tableName) {
        this.value = tableName;
      }
    },
    handleSaveDataFiltering() {
      const { termObj } = this.$refs.dataFiltering;
      this.visible = false;
      this.termObj = termObj;
    },
    showDataFiltering() {
      this.visible = true;
    },
    async getFieldList() {
      // 获取字段列表
      this.fieldOptions = await getFields({
        columnTypes: '',
        tableName: this.value
      });

      // console.log('获取');
    },
    getDataSource(obj) {
      // 获取页面配置的数据源
      const tableNameObj = []; // 表名集合
      const getTableName = (arr, targetObj) => {
        if (Array.isArray(arr) && arr.length) {
          arr.forEach((item) => {
            // eslint-disable-next-line no-prototype-builtins
            if (Object.prototype.hasOwnProperty.call(item, 'tableInfo')) {
              if (item.tableInfo.tableName) {
                const index = targetObj.findIndex((items) => items === item.tableInfo.tableName);
                if (index === -1) targetObj.push(item.tableInfo.tableName);
              }
            } else {
              getTableName(item.children, targetObj);
            }
          });
        }
      };
      getTableName(obj, tableNameObj);
      this.options = tableNameObj;
    },
    doClick() {
      if (!this.value) {
        this.$message.error('请选择触发源!');
        return;
      }
      this.visible1 = true;
      this.getFieldList();
    },
    add() {
      const n = this.descConfigList.length;
      if (n >= 3) {
        this.$message.error('摘要信息最多允许配置3个字段');
        return;
      }
      this.descConfigList.push({
        key: '',
        enumeration: null,
        name: ''
      });
    },
    del(i) {
      this.descConfigList.splice(i, 1);
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

        &.trigger-source {
          ::v-deep {
            .el-select {
              width: 100%;

              .el-input__suffix {
                display: none;
              }

              .el-input__prefix {
                box-sizing: border-box;
                background: #4689f5;
                color: #fff;
                position: absolute;
                height: calc(100% - 8px);
                left: 5px;
                top: 4px;
                text-align: center;
                transition: all 0.3s;
                bottom: 5px;
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }

              .el-input {
                display: block;
                position: relative;
                height: 32px;
              }

              .el-input__inner {
                border: 1px dashed #d9d9d9;

                &:hover {
                  border-color: #4689f5;
                }
              }
            }
          }

          .prefixIcon {
            ::v-deep {
              .el-input--prefix .el-input__inner {
                padding-left: 10px;
              }
            }
          }

          .showBg {
            ::v-deep {
              .el-input.el-input--prefix.el-input--suffix::after {
                content: '';
                position: absolute;
                background: #e5f0ff;
                width: calc(100% - 34px);
                height: 24px;
                left: 29px;
                top: 4px;
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
              }

              .el-input__inner {
                position: absolute;
                left: 0;
                padding-left: 34px;
                background: none;
                z-index: 1;
              }
            }
          }
        }

        ::v-deep {
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
