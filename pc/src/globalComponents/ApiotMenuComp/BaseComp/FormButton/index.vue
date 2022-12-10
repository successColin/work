<template>
  <!--   v-if="canShow && showInput" -->
  <div
    class="formButton"
    :canShow="canShow"
    :showInput="showInput"
    :class="[
      { notSidebar: !isSidebar },
      { notShow: !(canShow && showInput) },
      { show: canShow && showInput },
    ]"
  >
    <el-tooltip
      :content="configData.helpInfo"
      placement="top"
      :disabled="!configData.helpInfo.length"
    >
      <apiot-button
        v-if="!moreBtn"
        :class="[{ isTableBtn: isTableBtn }]"
        :type="configData.buttonStyle"
        :loading="isLoading"
        :style="getStyle"
        @mouseenter.native="mouseenter"
        @mouseleave.native="mouseleave"
        @click.stop.prevent="btnClick"
        :disabled="canReadonly ? true : configData.canReadonly"
        ><i
          v-if="configData.buttonForm !== 1"
          :class="`iconfont ${configData.iconFont} ${
            configData.buttonForm === 2 ? 'm-r-4' : ''
          }`"
          :style="`${configData.buttonStyle === 'primary' ? 'color:#fff' : ''}`"
        ></i
        ><span v-if="configData.buttonForm !== 3">{{
          configData.name
        }}</span></apiot-button
      >
      <apiot-button
        v-else
        type="text"
        style="border: 0 none"
        :loading="isLoading"
        @mouseenter.native="mouseenter"
        @mouseleave.native="mouseleave"
        @click.stop.prevent="btnClick"
        :disabled="canReadonly ? true : configData.canReadonly"
        ><i
          v-if="configData.buttonForm !== 1"
          :class="`iconfont ${configData.iconFont} ${
            configData.buttonForm === 2 ? 'm-r-4' : ''
          }`"
        ></i
        ><span v-if="configData.buttonForm !== 3">{{
          configData.name
        }}</span></apiot-button
      >
    </el-tooltip>

    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="selectButton"
      @delChild="delChild"
      :curCompType="curCompType"
    ></config-manage>
    <!-- <transition name="slide-bottom"> -->
    <component
      :is="configData.dialogName"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
      :showType="showType"
      :nodeConfig="nodeConfig"
      :append-to-body="true"
    ></component>
    <!-- </transition> -->

    <import-dialog
      v-if="configData.buttonType === 7"
      :importVisible.sync="importVisible"
      :extraColumnArr="configData.extraColumn"
      :templateId="templateId"
      :templateName="configData.templateInfo.templateName"
      :tableArr="tableArr"
      :isTree="configData.templateInfo.isTree"
      :sortId="configData.templateInfo.sortId"
      @importRefresh="importRefresh"
    ></import-dialog>

    <dialog-export
      :visible.sync="exportVisible"
      :tableData="tableData"
      :paramsObj="paramsObj"
      :exportVisible="exportVisible"
    ></dialog-export>

    <print-com :printParams="printParams"></print-com>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import { batchDelete, batchSave, selectList, singleSave } from '@/api/menuConfig';
import { getPrintDesign } from '@/api/printTemplate';
import { Decrypt, Encrypt, formatDate, getBlob, saveAs } from '@/utils/utils';
import { lighten } from '@/utils/varyColor';

import query from '@/api/query';

import PrintCom from './components/PrintCom';
import compMixin from '../../compMixin';
import DialogExport from './components/DialogExport';

export default {
  props: {
    featureArr: {
      type: [Object, Array]
    },
    tableInfo: {
      type: Object
    },
    fileDeleteIds: {
      type: Array
    },
    btnTypesArr: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6]
    },
    // 是不是侧边
    isSidebar: {
      type: Boolean,
      default: false
    },
    // 是不是表格里面的按钮
    isTableBtn: {
      type: Boolean,
      default: false
    },
    // 多选数组
    multiEntityArr: {
      type: Array
    },
    getIdCompId: {
      type: String
    },
    // 是否是tab按钮区的按钮
    isTabBtn: {
      type: Boolean,
      default: false
    },
    // 表格的每一行数据
    rowData: {
      type: Object
    },
    unique: {
      type: [String, Number]
    },
    showType: {
      type: Object,
      default() {
        return {};
      }
    },
    nodeConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    moreBtn: {
      type: Boolean,
      default: false
    },
    // 当前展示的表格列
    tableShowColumn: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      curCompType: 3,
      isHover: false,
      panelObj: null, // 面板相关信息
      showPanel: false,
      deleteShouldReload: true, // 删除是否需要刷新
      isLoading: false,
      canShow: true,
      canReadonly: false,
      importVisible: false, // 点击导入可见
      isAdd: false, // 保存操作是否是新增
      allFormStr: '',
      curSaveRes: null,
      initForm: {}, // 初始值
      exportVisible: false, // 导出选择列
      tableData: [],
      paramsObj: {},
      printParams: {}
    };
  },
  mixins: [compMixin],

  components: { DialogExport, PrintCom },

  computed: {
    templateId() {
      const { id } = this.configData.templateInfo;
      return id;
    },
    tableArr() {
      const { tableArr } = this.configData.templateInfo;
      return tableArr;
    },
    getCurColor() {
      if (this.configData.iconColor === '#4689f5') {
        return localStorage.theme_color || '#4689f5';
      }
      return this.configData.iconColor;
    },
    getBtnBg() {
      if (this.configData.buttonStyle) {
        return this.isHover ? lighten(this.getCurColor, 0.2) : this.getCurColor;
      }
      return '#fff';
    },
    getStyle() {
      if (this.configData.buttonStyle === 'text') {
        return 'border:0 none';
      }
      if (this.configData.buttonStyle) {
        if (this.canReadonly || this.configData.canReadonly) {
          return `background:${this.getCurColor};border-color:${this.getCurColor};opacity: 0.5;`;
        }
        return `background:${this.getBtnBg};border-color:${this.getBtnBg}`;
      }
      return '';
    },
    getText() {
      switch (this.configData.buttonType) {
        case 1:
          return '保存';
        case 2:
          return '删除';
        case 3:
          return '新增';
        case 4:
          return '编辑';
        default:
          return '操作';
      }
    },
    // tab 按钮保存的最终提交数组
    getResArr() {
      const saveArr = this.configData.saveAreaArr ? JSON.parse(this.configData.saveAreaArr) : [];
      let resArr = [];
      saveArr.forEach((comp) => {
        const index = this.featureArr.findIndex((child) => child.compId === comp.compId);
        if (index !== -1) {
          this.featureArr[index].relation = [];
          comp.relation.forEach((relate) => {
            this.featureArr[index].relation.push({
              columnName: relate.columnInfo.columnName,
              columnType: relate.columnInfo.columnTypeDict,
              relationTableName: relate.tableInfo.tableName
            });
          });
          resArr.push(this.featureArr[index]);
        }
      });
      // 执行顺序为空，则默认全部无参执行
      if (resArr.length === 0) {
        resArr = this.featureArr;
      }
      return resArr;
    }
  },

  mounted() {
    if (this.featureArr) {
      const { form } = this.featureArr;
      if (form) {
        this.initForm = JSON.parse(JSON.stringify(form));
      }
    }
  },

  inject: [
    'resolveFormula',
    'getAllForm',
    'getAllComp',
    'getPanel',
    'getMenu',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId',
    'getInitComp',
    'resolveTerm',
    'clickTrigger'
  ],

  methods: {
    // 校验表单区输入框唯一性
    checkFormUnique(arr) {
      return new Promise((resolve, reject) => {
        const len = arr.length;
        arr.forEach((comp, index) => {
          if (comp.compType === 1 && comp.notUnique && comp.shouldRepeat) {
            this.$message({
              type: 'warning',
              message: `${comp.name}已存在`
            });
            return reject();
          }
          if (index === len - 1) {
            return resolve();
          }
        });
      });
    },
    // tab按钮区保存的校验
    validateSave() {
      return new Promise((resolve, reject) => {
        const { length } = this.getResArr;
        // let res = true;
        this.getResArr.forEach(async (area, index) => {
          try {
            if (area.propertyCompName === 'MenuMainConfig') {
              // //  console.log(this.menuMain.$refs[area.compId]);
              const feature = area.pageType === 2 ? area.children[1] : area.children[0];
              await this.menuMain.$refs[area.compId][0].$refs.form.validate();
              await this.checkFormUnique(feature.children);
            }
            if (area.propertyCompName === 'TableMainConfig') {
              await this.menuMain.$refs[area.compId][0].tableValidate();
            }
            if (index === length - 1) {
              return resolve();
            }
          } catch (error) {
            //  console.log(error);
            this.resolveError(error);
            // res = false;
            if (error && typeof error !== 'object') {
              // this.$message.close();
              this.$message({
                type: 'warning',
                message: error
              });
            }
            return reject();
          }
        });
      });
    },
    // 处理错误，校验错误跳转到相应的表单
    resolveError(error) {
      const keys = Object.keys(error);
      // 取第一条
      const ele = document.getElementById(keys[0]);
      // 需要跳转
      if (ele) {
        let tab = this.$parent;
        while (!tab.specialParent) {
          tab = tab.$parent;
        }
        const tabEle = document.getElementById(tab.getCurTab);
        if (tabEle) {
          const scrollTop = ele.offsetTop;
          tabEle.scrollTop = scrollTop;
        }
      }
    },
    async btnClick() {
      // //  console.log('点击');
      // 表格里面的按钮点击触发行的点击
      if (this.isTableBtn) {
        this.$bus.$emit('selectTableLine', this.tableInfo.compId, this.rowData);
      }
      this.isLoading = true;
      try {
        // // //  console.log(this.menuMain);
        // //  console.log(this.configData);
        // 树结点的选择
        if (this.tableInfo.isTree) {
          // 选中当前删除的节点
          this.$emit('selectTreeNode');
        }
        if (this.tableInfo.compName === 'CardTable') {
          // 选中当前删除的节点
          this.$emit('selectCardNode');
        }
        // 卡片列表按钮点击
        const index = this.configData.ruleArr.findIndex((rule) => {
          const res = this.resolveFormula(true, rule.content);
          //  console.log(res);
          if (res) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          const msg = this.configData.ruleArr[index].ruleTip || `按钮第${index}条规则校验失败`;
          this.isLoading = false;
          return this.$message({
            type: 'warning',
            message: msg
          });
        }
        // 普通按钮不做校验
        if (this.configData.buttonType === 1) {
          if (this.tableInfo.propertyCompName === 'MenuMainConfig') {
            await this.menuMain.$refs.form.validate();
            await this.checkFormUnique(this.featureArr.children);
          }
          if (this.isTabBtn) {
            // //  console.log('tab按钮区的校验');
            await this.validateSave();
          }
          if (this.isTable) {
            // 表格校验
            await this.menuMain.tableValidate();
          }
        }

        if (this.configData.beforeSubmit.type === 2 && this.configData.buttonType !== 2) {
          await this.$confirm(`是否${this.getText}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        }
        if (this.configData.beforeSubmit.type === 3 && this.configData.buttonType !== 2) {
          await this.$confirm(this.resolveHtml(this.configData.beforeSubmit.html), '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        }
        if (this.configData.buttonType === 1) {
          await this.singleSave();
        }
        if (this.configData.buttonType === 2) {
          await this.batchDelete();
        }
        if (this.configData.buttonType === 3) {
          await this.singleInsert();
        }
        if (this.configData.buttonType === 4) {
          await this.singleUpdate();
        }
        if (this.configData.buttonType === 5) {
          this.normalClick();
        }
        if (this.configData.buttonType === 6) {
          await this.dataSelect();
        }
        // 导入
        if (this.configData.buttonType === 7) {
          this.handlerImportFun();
        }
        // 查询
        if (this.configData.buttonType === 11) {
          this.handleQuery();
        }
        // 重置
        if (this.configData.buttonType === 12) {
          this.handleReset();
        }
        // 查询区导出
        if (this.configData.buttonType === 13) {
          this.handleQueryExport();
        }
        // 下载资料按钮
        if (this.configData.buttonType === 14) {
          await this.doExportData();
        }
        // 打印
        if (this.configData.buttonType === 15) {
          this.handlePrintBtn();
        }
        // this.$bus.$emit('btnTrigger', this.configData, this.onlyFlag());
        await this.clickTrigger(this.configData, this.onlyFlag());
        if (this.configData.afterSubmit.type === 2) {
          this.$message({
            type: 'success',
            message: `${this.getText}成功`
          });
        }
        if (this.configData.afterSubmit.type === 3) {
          this.$confirm(this.resolveHtml(this.configData.afterSubmit.html), '提示', {
            dangerouslyUseHTMLString: true
          });
        }
        if (this.configData.buttonType === 2 && !this.deleteShouldReload) {
          return;
        }
        this.isLoading = false;
        // 导出
        if (this.configData.buttonType === 8) {
          this.isLoading = true;
          this.handleExport();
        }
        if (this.configData.refreshType === 1) {
          // 刷新当前页
          this.$bus.$emit('reloadArea', 'all', this.onlyFlag());
        } else if (this.configData.refreshType === 8) {
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          //  console.log(isAdd, this.curSaveRes);
          // 为true的时候，对当前第一个表单
          if (isAdd && this.curSaveRes) {
            this.curSaveRes.batchInfo.forEach((info) => {
              if (info.saveInfo && info.saveInfo.listInfo) {
                const obj = info.saveInfo.listInfo[0].find((item) => {
                  if (item.columnName === 'id' && item.columnValue !== 'null') {
                    return true;
                  }
                  return false;
                });
                //  console.log(obj);
                if (obj) {
                  this.$bus.$emit(
                    'reloadArea',
                    'setId',
                    this.onlyFlag(),
                    info.compId,
                    obj.columnValue
                  );
                }
              }
            });
          }
          // 刷新上一页
          this.$bus.$emit('reloadArea', 'all', this.getValueFromFather('onlyFlag'));
        } else if (this.configData.refreshType === 9) {
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          // 为true的时候，对当前第一个表单
          if (isAdd && this.curSaveRes) {
            this.curSaveRes.batchInfo.forEach((info) => {
              if (info.saveInfo && info.saveInfo.listInfo) {
                const obj = info.saveInfo.listInfo[0].find((item) => {
                  if (item.columnName === 'id' && item.columnValue !== 'null') {
                    return true;
                  }
                  return false;
                });
                if (obj) {
                  this.$bus.$emit(
                    'reloadArea',
                    'setId',
                    this.onlyFlag(),
                    info.compId,
                    obj.columnValue
                  );
                }
              }
            });
          }
          // 更新上一页树
          this.$bus.$emit(
            'reloadArea',
            'treeUpdate',
            this.getValueFromFather('onlyFlag'),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd
          );
        } else if (this.configData.refreshType === 2) {
          // 关闭当前页
          this.$bus.$emit('closePanel', this.onlyFlag());
        } else if (this.configData.refreshType === 3) {
          // 关闭当前页
          this.$bus.$emit('closePanel', this.onlyFlag());
          // 关闭当前页，并刷新上一页
          this.$bus.$emit('reloadArea', 'all', this.getValueFromFather('onlyFlag'));
        } else if (this.configData.refreshType === 4) {
          // 刷新菜单
          // window.location.reload();
          this.$bus.$emit('refresh');
        } else if (this.configData.refreshType === 5) {
          this.$bus.$emit('reloadArea', 'current', this.onlyFlag(), this.tableInfo.compId);
        } else if (this.configData.refreshType === 6) {
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          // 更新当前树
          this.$bus.$emit(
            'reloadArea',
            'treeUpdate',
            this.onlyFlag(),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd
          );
        } else if (this.configData.refreshType === 7) {
          // 关闭当前页
          this.$bus.$emit('closePanel', this.onlyFlag());
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          // 更新上一页树
          this.$bus.$emit(
            'reloadArea',
            'treeUpdate',
            this.getValueFromFather('onlyFlag'),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd
          );
        } else if (this.configData.refreshType === 10) {
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;

          // 更新当前树表
          this.$bus.$emit(
            'reloadArea',
            'treeTableUpdate',
            this.onlyFlag(),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd,
            this.isTableBtn
          );
        } else if (this.configData.refreshType === 11) {
          // 关闭当前页
          this.$bus.$emit('closePanel', this.onlyFlag());
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          // 更新上一页树表
          this.$bus.$emit(
            'reloadArea',
            'treeTableUpdate',
            this.getValueFromFather('onlyFlag'),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd,
            this.isTableBtn
          );
        }
        if (this.showType && this.showType.type === 'flow') {
          const { checkFormConfig = [] } = this.nodeConfig;
          // eslint-disable-next-line max-len
          const currentObj = checkFormConfig.find(
            (item) => item.compId === this.configData.compId && !!item.isRelation
          );
          if (currentObj) {
            // g关联提交按钮
            this.$bus.$emit('do_flow_submit', 1);
          }
        }
      } catch (error) {
        //  console.log(error);
        this.isLoading = false;
        if (error && typeof error !== 'object' && error !== 'cancel') {
          this.$message({
            type: 'warning',
            message: error
          });
        }
      }
    },
    // 获取上级的某个值
    getValueFromFather(v) {
      if (this.getFatherPanel() && this.getFatherPanel()[v]) {
        return this.getFatherPanel()[v];
      }
      return '';
    },
    getDictStr(comp, columnValue) {
      const dictArr = this.$store.getters.getCurDict(comp.dataSource.dictObj.dictKey);
      const obj = dictArr.find((item) => item.value === columnValue);
      if (obj) {
        return `${comp.name}:${obj.name}`;
      }
      return '';
    },
    getShowStr(comp, columnValue, form) {
      if (comp.enableDict && comp.dataSource.dictObj.dictKey) {
        const tempStr = this.getDictStr(comp, columnValue);
        return tempStr;
      }
      const v = form[`${comp.compId}_`];
      return `${comp.name}:${v}`;
    },
    // 遍历处理保存数据
    resolveSaveData(featureArr, area, data) {
      const form = data || featureArr.form;
      const arr = ['create_time', 'create_user_id', 'modify_time', 'modify_user_id'];
      const columnArr = [];
      const formInfo = [];
      formInfo.str = '';

      featureArr.children.forEach((comp) => {
        // 处理步骤条
        if (comp.compType === 27) {
          const columnValue1 = form[comp.compId] == null ? '' : form[comp.compId];
          const columnValue2 = form[comp.relateDateId] == null ? '' : form[comp.relateDateId];
          if (+columnValue1 !== +columnValue2) {
            formInfo.stepObject = {
              recordValue: columnValue2,
              compId: comp.compId,
              sysMenuDesignId: this.sysMenuDesignId()
            };
          }
          return;
        }
        if (
          comp.submitType === 1 ||
          (comp.submitType === 2 && comp.singleStatus !== 4 && comp.canShow)
        ) {
          if (comp.compType === 15) {
            // if (!comp.labelNotChange) {
            //   return;
            // }
            if (!['id', 'parent_id', 'position_id'].includes(comp.dataSource.columnName)) {
              return;
            }
          }

          // 去除修改系统字段的 并且 字段名不能重复
          if (!arr.includes(comp.dataSource.columnName)) {
            let columnValue = form[comp.compId] == null ? '' : form[comp.compId];
            if (comp.compType === 29) {
              columnValue = JSON.stringify(columnValue);
            }
            if (Array.isArray(columnValue)) {
              columnValue = columnValue.join();
            }
            if (comp.compType === 8 && columnValue) {
              if (columnValue.replace && !new Date(columnValue).getTime()) {
                columnValue = columnValue.replace(/-/g, '/');
              }
              columnValue = formatDate(new Date(columnValue), 'yyyy-MM-dd');
            }
            if (comp.compType === 9 && columnValue) {
              if (columnValue.replace && !new Date(columnValue).getTime()) {
                columnValue = columnValue.replace(/-/g, '/');
              }
              columnValue = formatDate(new Date(columnValue), 'yyyy-MM-dd hh:mm:ss');
            }

            if (comp.dataSource.columnName === 'id' && !data) {
              if (columnValue) {
                this.isAdd = false;
              } else {
                this.isAdd = true;
              }
            }
            if (comp.dataSource.columnName !== 'id' || columnValue !== '' || comp.compType === 17) {
              let column = {
                columnName: comp.dataSource.columnName,
                columnType: comp.dataSource.columnTypeDict
              };
              // 数据单选框 从关系里面拉取真正存的字段
              if (comp.compType === 6) {
                const relateName = comp.dataSource.relateName.split('(')[0];
                const index = area.relateTableArr.findIndex(
                  (relate) => relate.relateName === relateName
                );
                if (index !== -1) {
                  const { firstLineColumn } = area.relateTableArr[index].conditionArr[0][0];
                  column = {
                    columnName: firstLineColumn.columnName,
                    columnType: firstLineColumn.columnTypeDict
                  };
                }
              }
              // 按钮是否启用操作日志
              if (this.configData.enableLog && this.configData.logComp.includes(comp.compId)) {
                let str = `${comp.name}:${columnValue}`;
                // 基础组件 不是只读 显示的组件 记录下操作
                if (
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(comp.compType) &&
                  !comp.canReadonly &&
                  comp.canShow
                ) {
                  if ([2, 3, 4].includes(comp.compType) && comp.dataSource.dictObj.dictKey) {
                    const tempStr = this.getDictStr(comp, columnValue);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }
                  if ([6, 7].includes(comp.compType)) {
                    const tempStr = this.getShowStr(comp, columnValue, form);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }
                  formInfo.str += `${str},`;
                }
                if (['id', 'parent_id', 'position_id'].includes(comp.dataSource.columnName)) {
                  formInfo.str += `${str},`;
                }
              }
              if (!columnArr.includes(column.columnName)) {
                columnArr.push(column.columnName);
                formInfo.push({
                  columnName: column.columnName,
                  columnType: column.columnType,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.sysMenuDesignId()
                });
              } else {
                const index = formInfo.findIndex((v) => v.columnName === column.columnName);
                formInfo[index] = {
                  columnName: column.columnName,
                  columnType: column.columnTypeDict,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.sysMenuDesignId()
                };
              }
            }
          }
        }
      });
      return formInfo;
    },
    // 表单区处理保存接口参数
    resolveParams() {
      const { userInfo } = this.$store.state.userCenter;
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      const params = {
        formInfo: [],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: this.tableInfo.tableInfo.tableName,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id || this.$route.query.menuId,
        flowType: this.configData.flowType,
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId
        }
      };
      params.formInfo = this.resolveSaveData(this.featureArr, this.tableInfo);
      // 处理操作日志
      if (params.formInfo.str) {
        const operate = this.isAdd ? '新增' : '编辑';
        logContent += `[${operate}表(${params.tableName})数据:${params.formInfo.str.slice(0, -1)}]`;
      }
      delete params.formInfo.str;
      params.logData.content = Encrypt(logContent);
      if (!this.configData.enableLog || !this.configData.logComp.length) {
        delete params.logData;
      }
      // 处理步骤条
      if (params.formInfo.stepObject) {
        params.stepInfo = params.formInfo.stepObject;
        delete params.formInfo.stepObject;
      }
      return params;
    },
    // 表单区 批量保存接口
    resolveFormParams(area) {
      const params = {
        listInfo: [[]],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName,
        logStr: []
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      params.listInfo[0] = this.resolveSaveData(feature, area);
      // 处理操作日志
      if (params.listInfo[0].str) {
        params.logStr.push(params.listInfo[0].str.slice(0, -1));
      }
      delete params.listInfo[0].str;
      params.isAdd = this.isAdd;
      if (area.isTree || (this.getFatherPanel() && this.getFatherPanel().isTree)) {
        params.isTree = 1;
      }
      // 处理步骤条
      if (params.listInfo[0].stepObject) {
        params.stepObject = params.listInfo[0].stepObject;
        delete params.listInfo[0].stepObject;
      }
      return params;
    },
    // 表格区 批量保存接口
    resolveTableParams(area) {
      const params = {
        listInfo: [],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName,
        logStr: []
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      //  console.log(area);
      if (area.tableData) {
        area.tableData.forEach((data) => {
          if (!data.notChange) {
            const listInfo = this.resolveSaveData(feature, area, data);
            if (listInfo.str) {
              params.logStr.push(listInfo.str.slice(0, -1));
            }
            delete listInfo.str;
            params.listInfo.push(listInfo);
          }
        });
      }
      // //  console.log(params);
      return params;
    },
    // 表格区 批量删除接口
    resolveTableDeleteParams(area, arr) {
      const params = {
        listInfo: [],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      arr.forEach((data) => {
        if (!data.notChange) {
          params.listInfo.push(this.resolveSaveData(feature, area, data));
        }
      });
      // //  console.log(params);
      return params;
    },
    // 批量保存参数设置
    resolveBatchParams(areaArr) {
      // //  console.log(areaArr);
      const { userInfo } = this.$store.state.userCenter;
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      const params = {
        batchInfo: [],
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id || this.$route.query.menuId,
        flowType: this.configData.flowType,
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId
        }
      };
      areaArr.forEach((area) => {
        if (
          area.propertyCompName === 'MenuMainConfig' ||
          area.propertyCompName === 'TreeMainConfig'
        ) {
          const saveInfo = this.resolveFormParams(area);
          if (saveInfo.logStr.length) {
            const operate = saveInfo.isAdd ? '新增' : '编辑';
            logContent += `[${operate}表(${area.tableInfo.tableName})数据:${saveInfo.logStr[0]}],`;
          }
          delete saveInfo.logStr;
          const tempObj = {
            compId: area.compId,
            areaType: area.propertyCompName === 'MenuMainConfig' ? 1 : 2,
            relation: area.relation || [],
            saveInfo
          };
          if (area.propertyCompName === 'MenuMainConfig' && saveInfo.stepObject) {
            tempObj.stepInfo = saveInfo.stepObject;
            delete saveInfo.stepObject;
          }
          params.batchInfo.push(tempObj);
        }
        if (area.propertyCompName === 'TableMainConfig') {
          const saveInfo = this.resolveFormParams(area);
          if (saveInfo.logStr.length) {
            logContent += `[批量保存表(${area.tableInfo.tableName})数据${saveInfo.logStr.length}条`;
          }
          delete saveInfo.logStr;
          params.batchInfo.push({
            compId: area.compId,
            areaType: 3,
            relation: area.relation || [],
            saveInfo: this.resolveTableParams(area)
          });
        }
      });
      params.logData.content = Encrypt(logContent.slice(0, -1));
      if (!this.configData.enableLog || !this.configData.logComp.length) {
        delete params.logData;
      }
      return params;
    },
    // singleSave,batchDelete,singleInsert,singleUpdate
    // 批量新增参数处理
    bulkAddParams(params) {
      if (!this.configData.execFuncName) {
        return;
      }
      const res = this.resolveFormula(true, this.configData.execFuncName);
      // //  console.log(res);
      if (Array.isArray(res) && res.length) {
        params.batchInfo.forEach((area) => {
          if (area.areaType === 1 && area.saveInfo.isAdd) {
            if (res.type === 1) {
              this.resolveListInfo(area.saveInfo.listInfo, res);
            } else {
              this.resolveListOneInfo(area.saveInfo.listInfo, res);
            }
          }
        });
      }
      if (res.type === 3) {
        this.changeCurValue(params.batchInfo, res);
      }
    },
    resolveListInfo(listInfo, multiArr) {
      let j = -1;
      const i = listInfo.findIndex((list) => {
        j = list.findIndex((column) => {
          if (multiArr.includes(column.compId) && column.columnValue) {
            const valueArr = column.columnValue.split(',');
            if (valueArr.length > 1) {
              return true;
            }
          }
          return false;
        });
        if (j !== -1) {
          return true;
        }
        return false;
      });
      if (i !== -1) {
        // //  console.log(i, j);
        const obj = listInfo[i][j];
        const curData = listInfo[i];
        const valueArr = obj.columnValue.split(',');
        const arr = [];
        valueArr.forEach((item) => {
          const pushData = JSON.parse(JSON.stringify(curData));
          pushData[j].columnValue = item;
          arr.push(pushData);
        });
        listInfo.splice(i, 1, ...arr);
        this.resolveListInfo(listInfo, multiArr);
      }
    },
    resolveListOneInfo(listInfo, multiArr) {
      let j = -1;
      const i = listInfo.findIndex((list) => {
        j = list.findIndex((column) => {
          if (multiArr[0] === column.compId && column.columnValue) {
            const valueArr = column.columnValue.split(',');
            if (valueArr.length > 1) {
              return true;
            }
          }
          return false;
        });
        if (j !== -1) {
          return true;
        }
        return false;
      });
      if (i !== -1) {
        const obj = listInfo[i][j];
        const curData = listInfo[i];
        const valueArr = obj.columnValue.split(',');
        const arr = [];
        valueArr.forEach((item, index) => {
          const pushData = JSON.parse(JSON.stringify(curData));
          multiArr.forEach((mul) => {
            const k = curData.findIndex((column) => {
              if (mul === column.compId) {
                return true;
              }
              return false;
            });
            const resArr = curData[k].columnValue ? curData[k].columnValue.split(',') : [];
            if (resArr[index]) {
              pushData[k].columnValue = resArr[index];
            }
          });
          arr.push(pushData);
        });
        listInfo.splice(i, 1, ...arr);
      }
    },
    changeCurValue(arr, obj) {
      arr.forEach((area) => {
        area.saveInfo.listInfo.forEach((list) => {
          list.forEach((column) => {
            if (column.compId === obj.compId) {
              column.columnValue = obj.value;
            }
          });
        });
      });
    },
    // 保存
    async singleSave() {
      if (this.tableInfo.propertyCompName === 'MenuMainConfig') {
        const params = this.resolveParams();
        if (this.tableInfo.isTree || this.tableInfo.compName === 'TreeTable') {
          params.isTree = 1;
        }
        if (
          this.showType &&
          JSON.stringify(this.showType) !== '{}' &&
          this.showType.type === 'flow'
        ) {
          params.flowTask = true;
        }
        await singleSave(params);
      }

      if (this.isTabBtn) {
        // //  console.log(this.featureArr);
        //  console.log('tab按钮区的保存', this.getResArr);
        const params = this.resolveBatchParams(this.getResArr);
        if (
          this.showType &&
          JSON.stringify(this.showType) !== '{}' &&
          this.showType.type === 'flow'
        ) {
          params.flowTask = true;
        }
        if (this.configData.execFunc) {
          this.bulkAddParams(params);
        }
        this.curSaveRes = await batchSave(params);
      }
      if (this.isTable) {
        // //  console.log(this.tableInfo, this.featureArr);
        // //  console.log('表格区的保存');
        const params = this.resolveBatchParams([this.tableInfo]);
        if (
          this.showType &&
          JSON.stringify(this.showType) !== '{}' &&
          this.showType.type === 'flow'
        ) {
          params.flowTask = true;
        }
        await batchSave(params);
      }
    },
    // 处理删除接口参数
    resolveDeleteParams() {
      // //  console.log(this.tableInfo);
      const params = {
        ids: '',
        tableName: this.tableInfo.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id || this.$route.query.menuId,
        batchInfo: [],
        flowType: this.configData.flowType,
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId
        }
      };
      const area = this.tableInfo;
      // 表单区删除 || 表格区表格里面删除
      if (
        this.tableInfo.propertyCompName === 'MenuMainConfig' ||
        this.tableInfo.propertyCompName === 'TreeMainConfig' ||
        this.tableInfo.propertyCompName === 'CardTableConfig' ||
        this.isTableBtn
      ) {
        params.batchInfo.push({
          compId: area.compId,
          relation: area.relation || [],
          saveInfo: this.resolveFormParams(area)
        });
        const { form } = this.featureArr;
        this.featureArr.children.findIndex((comp) => {
          const columnValue = form[comp.compId] == null ? '' : form[comp.compId];
          if (comp.dataSource.columnName === 'id') {
            params.ids = columnValue;
            return true;
          }
          return false;
        });
      }
      // 表单区删除 || 表格区表格里面删除
      if (this.tableInfo.propertyCompName === 'MultiTreeConfig') {
        params.batchInfo.push({
          compId: area.compId,
          relation: area.relation || [],
          saveInfo: this.resolveFormParams(area)
        });

        const { form } = this.featureArr;
        params.tableName = this.tableInfo.multiDataSource[form.dataType - 1].tableInfo.tableName;
        this.featureArr.children.findIndex((comp) => {
          const columnValue = form[comp.compId] == null ? '' : form[comp.compId];
          if (comp.dataSource.columnName === 'id') {
            params.ids = columnValue;
            return true;
          }
          return false;
        });
      }
      // 表格区按钮区的删除
      if (this.isTable && !this.isTableBtn) {
        params.batchInfo.push({
          compId: area.compId,
          relation: area.relation || [],
          saveInfo: this.resolveTableDeleteParams(area, this.multiEntityArr)
        });
        this.multiEntityArr.forEach((row) => {
          if (row[this.getIdCompId]) {
            params.ids += `${row[this.getIdCompId]},`;
          }
        });
        params.ids = params.ids.slice(0, -1);
      }
      const { userInfo } = this.$store.state.userCenter;
      const logContent = `${userInfo.username}(${userInfo.account}):[删除表(${params.tableName})数据:id:${params.ids}]`;
      params.logData.content = Encrypt(logContent);
      if (!this.configData.enableLog) {
        delete params.logData;
      }
      return params;
    },
    // 处理tab区的删除参数
    resolveTabDeleteParams(area) {
      const params = {
        ids: '',
        tableName: area.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id || this.$route.query.menuId,
        batchInfo: [],
        flowType: this.configData.flowType,
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId
        }
      };
      // 表单区删除
      if (area.propertyCompName === 'MenuMainConfig') {
        params.batchInfo.push({
          compId: area.compId,
          relation: area.relation || [],
          saveInfo: this.resolveFormParams(area)
        });
        const featureArr = area.pageType === 2 ? area.children[1] : area.children[0];
        const { form } = featureArr;
        featureArr.children.findIndex((comp) => {
          const columnValue = form[comp.compId] == null ? '' : form[comp.compId];
          //  console.log(comp);
          if (comp.dataSource && comp.dataSource.columnName === 'id') {
            params.ids = columnValue;
            return true;
          }
          return false;
        });
      }

      // 表格区按钮区的删除
      if (area.propertyCompName === 'TableMainConfig') {
        const table = this.menuMain.$refs[area.compId][0];
        params.batchInfo.push({
          compId: area.compId,
          relation: area.relation || [],
          saveInfo: this.resolveTableDeleteParams(area, table.multiEntityArr)
        });
        table.multiEntityArr.forEach((row) => {
          if (row[table.getIdCompId]) {
            params.ids += `${row[table.getIdCompId]},`;
          }
        });
        params.ids = params.ids.slice(0, -1);
        // // //  console.log('删除的id', params.ids);
      }
      const { userInfo } = this.$store.state.userCenter;
      const logContent = `${userInfo.username}(${userInfo.account}):[删除表(${params.tableName})数据:id:${params.ids}]`;
      params.logData.content = Encrypt(logContent);
      if (!this.configData.enableLog) {
        delete params.logData;
      }
      return params;
    },
    // 删除
    async batchDelete() {
      if (this.isTabBtn) {
        if (this.getResArr.length === 0) {
          return this.$message({
            type: 'warning',
            message: '无可删除区域'
          });
        }
        // 找出删除区域的对象
        const index = this.getResArr.findIndex(
          (area) => area.compId === this.configData.deleteArea
        );
        let area = null;
        if (index === -1) {
          [area] = this.getResArr;
        } else {
          area = this.getResArr[index];
        }
        const params = this.resolveTabDeleteParams(area);
        this.deleteShouldReload = true;
        // 表格区按钮区的删除
        if (area.propertyCompName === 'TableMainConfig') {
          const table = this.menuMain.$refs[area.compId][0];
          if (table.multiEntityArr.length === 0) {
            this.$message({
              type: 'warning',
              message: '未选择删除数据'
            });
            return Promise.reject();
          }
          // 行编辑删除不需要刷新，前端刷新
          if (area.lineEditable) {
            this.deleteShouldReload = false;
            table.tableAreaDelete();
          }
        }

        //  有id先走删除接口
        if (params.ids) {
          if (
            area.isTree ||
            (this.getFatherPanel() && this.getFatherPanel().isTree) ||
            area.compName === 'TreeTable'
          ) {
            if (area.compName !== 'MultiTree') {
              params.isTree = 1;
              const idArr = params.ids.split(',');
              if (idArr.includes(1) || idArr.includes('1')) {
                this.$message({
                  type: 'warning',
                  message: '不能删除根节点'
                });
                return Promise.reject();
              }
            }
          }
          this.deleteShouldReload = true;
          if (this.configData.beforeSubmit.type === 2) {
            await this.$confirm(`是否${this.getText}?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
          if (this.configData.beforeSubmit.type === 3) {
            await this.$confirm(this.resolveHtml(this.configData.beforeSubmit.html), '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
          await batchDelete(params);
        }
        this.isLoading = false;
      } else {
        const params = this.resolveDeleteParams();
        // //  console.log(params);
        this.deleteShouldReload = true;

        if (['TableMainConfig', 'TreeTableConfig'].includes(this.tableInfo.propertyCompName)) {
          if (this.multiEntityArr.length === 0 && !this.isTableBtn) {
            this.$message({
              type: 'warning',
              message: '未选择删除数据'
            });
            return Promise.reject();
          }
          // 行编辑删除不需要刷新，前端刷新
          if (this.tableInfo.lineEditable) {
            this.deleteShouldReload = false;
            // 行编辑行内单独删除
            if (this.isTableBtn) {
              this.$emit('tableDelete');
            } else {
              this.$emit('tableAreaDelete');
            }
          }
        }

        //  有id先走删除接口
        if (params.ids) {
          if (
            this.tableInfo.isTree ||
            (this.getFatherPanel() && this.getFatherPanel().isTree) ||
            this.tableInfo.compName === 'TreeTable'
          ) {
            if (this.tableInfo.compName !== 'MultiTree') {
              params.isTree = 1;
              const idArr = params.ids.toString().split(',');
              if (idArr.includes(1) || idArr.includes('1')) {
                this.$message({
                  type: 'warning',
                  message: '不能删除根节点'
                });
                return Promise.reject();
              }
            }
          }
          this.deleteShouldReload = true;
          if (this.configData.beforeSubmit.type === 2) {
            await this.$confirm(`是否${this.getText}?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
          if (this.configData.beforeSubmit.type === 3) {
            await this.$confirm(this.resolveHtml(this.configData.beforeSubmit.html), '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
          await batchDelete(params);
        }
        this.isLoading = false;
      }
    },
    // 下载资料
    async doExportData() {
      this.isLoading = true;
      const params = this.resolveDeleteParams();
      if (this.tableInfo.propertyCompName === 'TableMainConfig') {
        if (this.multiEntityArr.length === 0 && !this.isTableBtn) {
          this.$message({
            type: 'warning',
            message: '未选择数据'
          });
          this.isLoading = false;
          return Promise.reject();
        }
      }
      const { downLoadType = 1, fileColumns = [], layeredStrategy, downloadName } = this.configData;
      const obj = {
        fileColumns: [1, 2].includes(downLoadType) ? fileColumns : [],
        relatedData: [1, 3].includes(downLoadType)
      };
      const param = {
        bizIds: params.ids,
        bizTableName: params.tableName,
        fileScope: obj,
        layeredStrategy: layeredStrategy ? JSON.parse(layeredStrategy) : [],
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId
        }
      };
      const { userInfo } = this.$store.state.userCenter;
      const logContent = `${userInfo.username}(${userInfo.account}):[下载表(${params.tableName})资料:id:${params.ids}]`;
      param.logData.content = Encrypt(logContent);
      if (!this.configData.enableLog) {
        delete param.logData;
      }
      await axios({
        method: 'post',
        url: `${query.DOWNlOAD_RELATIONS_Files}`,
        data: qs.stringify(param, { arrayFormat: 'indices', allowDots: true }),
        responseType: 'blob',
        headers: {
          token: Decrypt(localStorage.getItem('token')),
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        saveAs(res.data, `${downloadName}.zip`);
        this.isLoading = false;
      });
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        panelObj.panelVarObj = {};

        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            if (this.isTableBtn) {
              // 表格里面按钮 点击取值的时候取当前行 当前行的数据在全局form
              panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
            } else if (this.multiEntityArr[0] && this.multiEntityArr[0][compId]) {
              // 其他的先检查当前表格选中数据的第一条，有值就取值，没有就找全部的
              panelObj.panelVarObj[item.compId][compId] = this.multiEntityArr[0][compId];
            } else {
              panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
            }
          });
          if (item.relateDataComp) {
            panelObj.relateDataComp = {};
            panelObj.relateDataComp[item.compId] = {};
            if (this.isTableBtn) {
              panelObj.relateDataComp[item.compId].value =
                this.getAllForm()[item.relateDataComp.compId];
            } else if (
              this.multiEntityArr[0] &&
              this.multiEntityArr[0][item.relateDataComp.compId]
            ) {
              panelObj.relateDataComp[item.compId].value =
                this.multiEntityArr[0][item.relateDataComp.compId];
            } else {
              panelObj.relateDataComp[item.compId].value =
                this.getAllForm()[item.relateDataComp.compId];
            }
            panelObj.relateDataComp[item.compId].tableName = item.relateDataComp.tableName;
          }
          if (item.relateBusiComp) {
            panelObj.relateBusiComp = {};
            panelObj.relateBusiComp[item.compId] = {};
            if (this.isTableBtn) {
              panelObj.relateBusiComp[item.compId].value =
                this.getAllForm()[item.relateBusiComp.compId];
            } else if (
              this.multiEntityArr[0] &&
              this.multiEntityArr[0][item.relateBusiComp.compId]
            ) {
              panelObj.relateBusiComp[item.compId].value =
                this.multiEntityArr[0][item.relateBusiComp.compId];
            } else {
              panelObj.relateBusiComp[item.compId].value =
                this.getAllForm()[item.relateBusiComp.compId];
            }
            panelObj.relateBusiComp[item.compId].tableName = item.relateBusiComp.tableName;
          }
        });

        panelObj.panelFixData = {};
        panelObj.panelData.forEach((item) => {
          if (item.mainComp.type === 2) {
            panelObj.panelFixData[item.paneComp.compId] = item.mainComp.fixedValue;
          } else if (item.mainComp.type === 3) {
            panelObj.panelFixData[item.paneComp.compId] = this.resolveFormula(
              true,
              item.mainComp.fixedValue
            );
          } else if (this.isTableBtn) {
            panelObj.panelFixData[item.paneComp.compId] = this.getAllForm()[item.mainComp.compId];
          } else if (this.multiEntityArr[0] && this.multiEntityArr[0][item.mainComp.compId]) {
            panelObj.panelFixData[item.paneComp.compId] =
              this.multiEntityArr[0][item.mainComp.compId];
          } else {
            panelObj.panelFixData[item.paneComp.compId] = this.getAllForm()[item.mainComp.compId];
          }
        });
        panelObj.panelCompId = this.configData.compId;
        panelObj.relationMenuDesignId = this.sysMenuDesignId();
        panelObj.onlyFlag = this.onlyFlag();
        if (this.tableInfo.isTree && this.tableInfo.compName !== 'MultiTree') {
          panelObj.isTree = true;
        }
        // 树表
        if (this.tableInfo.compName === 'TreeTable') {
          panelObj.isTree = true;
        }
        if (this.configData.dialogTitle) {
          panelObj.panelName = this.configData.dialogTitle;
        }
        return panelObj;
      }
      return null;
    },
    // 新增
    async singleInsert() {
      // //  console.log(this.tableInfo);
      if (this.tableInfo.propertyCompName === 'TableMainConfig' && this.tableInfo.lineEditable) {
        this.$emit('addTableRow');
        return;
      }
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      if (this.panelObj && this.panelObj.panelName) {
        this.panelObj.isAdd = true;
        this.showPanel = true;
      }
    },
    // 编辑
    async singleUpdate() {
      if (this.isTable) {
        if (this.isTableBtn) {
          if (this.tableInfo.lineEditable) {
            return this.$message({
              type: 'warning',
              message: '行编辑状态不需要编辑弹窗'
            });
          }
        } else {
          // 表格按钮区的编辑
          const len = this.multiEntityArr.length;
          if (len !== 1) {
            return this.$message({
              type: 'warning',
              message: '请选中有且仅有一条数据'
            });
          }
        }
      }

      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      // //  console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.panelObj.isEdit = true;
        this.showPanel = true;
      }
    },
    // 普通按钮
    normalClick() {
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      if (this.panelObj && this.panelObj.panelName) {
        this.showPanel = true;
      }

      const { relateType } = this.configData;
      if (!relateType || relateType === 1) {
        this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
        if (this.panelObj && this.panelObj.panelName) {
          this.showPanel = true;
        }
      } else if (relateType === 2) {
        this.jumpMenu();
      } else if (relateType === 3 && this.configData.outerLink) {
        window.open(`${this.configData.outerLink}${this.initParams()}`);
      }
    },
    initParams() {
      this.show = false;
      let str = '?';
      if (this.configData.outerLink.indexOf('?') !== -1) {
        str = '&';
      }

      this.configData.paramsArr.forEach((params) => {
        if (params.type === 1) {
          str += `${params.name}=${params.fixed}&`;
        } else {
          const allComp = this.getAllComp();
          const timeComp = allComp[params && params.formula.replace(/\$/g, '')] || {};
          const { timeInterval, compType } = timeComp;
          let value = this.resolveFormula(true, params.formula);
          if (compType === 8 || compType === 9) {
            let type = '';
            if (compType === 8) {
              type = 'yyyy-MM-dd';
            }
            if (compType === 9) {
              type = 'yyyy-MM-dd hh:mm:ss';
            }
            if (timeInterval) {
              const timeArr = value.split(',');
              const startTime = timeArr[0] && formatDate(new Date(timeArr[0]), type);
              const endTime = timeArr[1] && formatDate(new Date(timeArr[1]), type);
              str += `${params.name}_start=${startTime || ''}&${params.name}_end=${endTime || ''}&`;
            } else {
              if (value) {
                value = formatDate(new Date(value), type);
              }
              str += `${params.name}=${value}&`;
            }
          } else {
            str += `${params.name}=${value}&`;
          }
        }
      });
      return str.slice(0, -1);
    },
    // 跳转菜单
    jumpMenu() {
      if (this.$route.name === 'sharePage') {
        return this.$message({
          type: 'warning',
          message: '分享页面无跳转菜单的权限'
        });
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        // //  console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        //  console.log(obj);
        const menu = this.$store.getters.getCurMenu(obj.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item) => {
            if (item.termParams) {
              const arr = item.termParams.split(',');
              obj.menuVarObj[item.compId] = {};
              arr.forEach((compId) => {
                if (this.isTableBtn) {
                  // 表格里面按钮 点击取值的时候取当前行 当前行的数据在全局form
                  obj.menuVarObj[item.compId][compId] = this.getAllForm()[compId];
                } else if (this.multiEntityArr[0] && this.multiEntityArr[0][compId]) {
                  // 其他的先检查当前表格选中数据的第一条，有值就取值，没有就找全部的
                  obj.menuVarObj[item.compId][compId] = this.multiEntityArr[0][compId];
                } else {
                  obj.menuVarObj[item.compId][compId] = this.getAllForm()[compId];
                }
              });
            }
          });
          const menuObj = sessionStorage.jumpMenuObj ? JSON.parse(sessionStorage.jumpMenuObj) : {};
          menuObj[obj.id] = obj;
          sessionStorage.jumpMenuObj = JSON.stringify(menuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限'
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单'
        });
      }
    },
    // 导入
    handlerImportFun() {
      this.importVisible = true;
      // //  console.log(this.configData);
    },
    importRefresh() {
      if (this.configData.refreshType === 1) {
        this.$bus.$emit('reloadArea', 'all', this.onlyFlag());
      } else if (this.configData.refreshType === 5) {
        this.$bus.$emit('reloadArea', 'current', this.onlyFlag(), this.tableInfo.compId);
      }
    },
    // 导出
    async handleExport() {
      // //  console.log(this.configData, this.multiEntityArr, this.menuMain, this.tableInfo);
      const { exportSetting, needField, templateInfo } = this.configData;
      // const { dropColumnData } = this.menuMain;

      const { templateName } = templateInfo; // templateId 模板ID
      const isHeader = needField ? 1 : 0; // 是否携带表字段（1是 0否）
      const chooseArr = []; // 选中的数组

      const { tableName: mainTable } = this.tableInfo.tableInfo; // 查询主表名 chooseIds
      const collectionArr = []; // 关联表集合
      this.tableData = [];

      const tempArr = []; // 选中转换

      //  console.log(mainTable);

      const { relateTableArr } = this.tableInfo; // 关联关系
      //  console.log(relateTableArr);
      let num = 1;
      // const alias = [
      //   {
      //     name: mainTable,
      //     value: 't0'
      //   }
      // ];
      relateTableArr.forEach((item) => {
        item.conditionArr.forEach((val) => {
          val.forEach((v) => {
            const table1 = v.firstLineTable.tableName;
            const key1 = v.firstLineColumn.columnName;
            const table2 = v.secondIsValue ? v.secondLineValue : v.secondLineTable.tableName;
            const key2 = v.secondIsValue ? v.secondLineValue : v.secondLineColumn.columnName;

            const tableObjA = collectionArr.find((g) => g.table1 === table1) || {};
            const tableObjB = collectionArr.find((g) => g.table2 === table1) || {};
            // const tableObjC = collectionArr.find((g) => g.table1 === table2) || {};
            // const tableObjD = collectionArr.find((g) => g.table2 === table2) || {};

            let alias11 =
              mainTable === table1
                ? 't0'
                : tableObjA.alias11
                  ? tableObjA.alias11
                  : tableObjB.alias12
                    ? tableObjB.alias12
                    : '';
            let alias12 = mainTable === table2 ? 't1' : '';

            //  console.log(alias11, alias12);

            if (!alias11) {
              num += 1;
              alias11 = `t${num}`;
            }
            if (!alias12) {
              num += 1;
              alias12 = `t${num}`;
            }
            // //  console.log(v, table2, key2);
            collectionArr.push({
              table1,
              key1,
              table2,
              key2,
              alias11,
              alias12,
              name: item.relateName
            });
          });
        });
      });

      const tableComp = this.menuMain.getFeatureArr.children;
      // //  console.log(this.multiEntityArr, tableComp, this.tableShowColumn);
      this.multiEntityArr.forEach((data) => {
        const obj = {};
        tableComp.forEach((comp) => {
          obj[comp.dataSource.columnName] = data[comp.compId];
        });
        tempArr.push(obj);
      });

      const dictMap = {};
      this.tableShowColumn.forEach((comp) => {
        if (comp.canShow && !comp.children) {
          // //  console.log(comp);
          const obj = {
            title: comp.name
            // isChecked: true
          };
          const currentObj = collectionArr.find(
            (c) => `${c.name}(${c.key1})` === comp.dataSource.relateName
          );
          let tableName = '';
          const tabletitle = comp.dataSource.tableName;
          if (tabletitle === mainTable) {
            tableName = 't0';
          } else if (currentObj) {
            if (currentObj.table1 === tabletitle) {
              tableName = currentObj.alias11;
            }
            if (currentObj.table2 === tabletitle) {
              tableName = currentObj.alias12;
            }
          }
          if (tableName && comp.dataSource.columnName) {
            let field = `${tableName}.${comp.dataSource.columnName}`;
            if (comp.compType === 8) {
              field = `DATE_FORMAT(${tableName}.${comp.dataSource.columnName}, '%Y-%m-%d')`;
            }
            if (comp.compType === 9) {
              field = `DATE_FORMAT(${tableName}.${comp.dataSource.columnName}, '%Y-%m-%d %H:%i:%s')`;
            }
            obj.columns = `${field} ${comp.compId}`;
          }
          this.tableData.push(obj);
        }
        // comp.compType === 2
        if (comp.dataSource && comp.dataSource.dictObj && comp.dataSource.dictObj.id) {
          dictMap[comp.compId] =
            comp.dataSource && comp.dataSource.dictObj && comp.dataSource.dictObj.id;
        }
      });
      if (exportSetting === 2 || exportSetting === 4) {
        tempArr.forEach((item) => {
          chooseArr.push(item.id);
        });
      }
      // 按模板导出
      if (exportSetting === 1 || exportSetting === 2) {
        let url = `${query.DO_Export_Template}?chooseIds=${chooseArr.join(',')}&id=${
          this.templateId
        }&isHeader=${isHeader}&menuId=${this.$route.params.id || this.$route.query.menuId}&userId=${
          this.$store.state.userCenter.userInfo.id
        }`;
        if (this.configData.enableLog) {
          const { userInfo } = this.$store.state.userCenter;
          const b =
            this.tableArr.length === 1
              ? `表[${this.tableArr.join()}]`
              : `多表[${this.tableArr.join()}]`;
          const logContent = `${userInfo.username}(${userInfo.account})导出${b},模板id:${this.templateId},模板名称:${templateName}`;
          url += `&logData.content=${Encrypt(logContent)}&logData.clientType=PC&logData.curMenuId=${
            this.$route.params.id || this.$route.query.menuId
          }`;
        }
        if (chooseArr.length === 0 && exportSetting === 2) {
          this.isLoading = false;
          return this.$message({
            type: 'warning',
            message: '请选择数据'
          });
        }
        getBlob(
          {
            url,
            token: Decrypt(localStorage.getItem('token') || ''),
            method: 'POST'
          },
          (res) => {
            const names = templateName || '导出模板';
            saveAs(res, `${names}.xls`);
            this.isLoading = false;
          }
        );
      }

      const getAllFormObj = this.getAllForm();
      // 按界面导出
      if (exportSetting === 3 || exportSetting === 4) {
        const getPanelObj = this.getPanel();
        this.paramsObj = {
          getAllFormObj,
          dictMap,
          needField,
          mainTable,
          chooseArr,
          // columns,
          collectionArr,
          // memo,
          getPanelObj,
          tableInfo: this.tableInfo,
          getAllForm: this.getAllForm(),
          configData: this.configData,
          getFatherPanel: this.getFatherPanel()
        };
        if (chooseArr.length === 0 && exportSetting === 4) {
          this.isLoading = false;
          return this.$message({
            type: 'warning',
            message: '请选择数据'
          });
        }
        this.exportVisible = true;
      }
    },
    // 查询
    async handleQuery() {
      await this.menuMain.$refs.form.validate();
      this.$bus.$emit('changeUrl');
    },
    // 重置
    async handleReset() {
      this.featureArr.form = JSON.parse(JSON.stringify(this.initForm));
      await this.menuMain.$refs.form.resetFields();
      this.$bus.$emit('changeUrl');
    },
    // 查询区导出
    async handleQueryExport() {
      const { exportType } = this.configData;
      this.$bus.$emit('queryExport', exportType);
    },
    async printFun(tableArr) {
      const { printTemp = {} } = this.configData;
      const { id = '' } = printTemp;
      if (!id) {
        return this.$message({
          type: 'warning',
          message: '请配置关联打印模板'
        });
      }
      const excelData = await getPrintDesign({ id });
      const { globalConfig, previewObj } = JSON.parse(excelData.desingJson);
      const { paperHeight, paperWidth } = globalConfig;

      const areaHeight = `${paperHeight}mm`;
      const areaWidth = `${paperWidth}mm`;
      const params = {
        previewObj,
        areaHeight,
        areaWidth,
        globalConfig,
        tableArr
      };
      //  console.log(params);
      this.printParams = params;
      // this.$bus.$emit('pringBtn', params);
    },
    // 打印数据转换
    dataConversion(area, data) {
      if (JSON.stringify(area) !== '{}') {
        area.children.forEach((item) => {
          if (item.areaType === 1) {
            item.children.forEach((obj) => {
              if (obj.dataSource.dictObj) {
                const getDictKey = obj.dataSource.dictObj.dictKey;
                const tempData = this.$store.getters.getCurDict(getDictKey) || [];
                //  console.log(tempData, getDictKey);
                if (tempData.length) {
                  //  console.log(obj, data);
                  data.forEach((v) => {
                    if (obj.compId) {
                      const dictObj = tempData.find((j) => j.value === v[obj.compId]);
                      //  console.log(dictObj);
                      v[`${obj.compId}_`] = dictObj.name;
                    }
                  });
                }
              }
            });
          }
        });
        this.printFun(data);
      }
    },
    // 打印按钮
    async handlePrintBtn() {
      let tableArrData = [];
      if (this.isTabBtn) {
        if (this.getResArr.length === 0) {
          return this.$message({
            type: 'warning',
            message: '无可打印区域'
          });
        }
        // 找出删除区域的对象
        const index = this.getResArr.findIndex(
          (area) => area.compId === this.configData.deleteArea
        );
        let area = null;
        if (index === -1) {
          [area] = this.getResArr;
        } else {
          area = this.getResArr[index];
        }
        const params = this.resolveTabDeleteParams(area);
        // 表格区按钮区的删除
        if (area.propertyCompName === 'TableMainConfig') {
          const table = this.menuMain.$refs[area.compId][0];
          if (table.multiEntityArr.length === 0) {
            this.$message({
              type: 'warning',
              message: '未选择打印数据'
            });
            return Promise.reject();
          }
          tableArrData = table.multiEntityArr;
        }
        //  有id先走删除接口
        if (params.ids) {
          this.dataConversion(area, tableArrData);
        }
      } else {
        const params = this.resolveDeleteParams();
        if (['TableMainConfig'].includes(this.tableInfo.propertyCompName)) {
          if (this.multiEntityArr.length === 0 && !this.isTableBtn) {
            this.$message({
              type: 'warning',
              message: '未选择打印数据'
            });
            return Promise.reject();
          }
          tableArrData = this.multiEntityArr;
        }

        //  有id先走删除接口
        if (params.ids) {
          this.dataConversion(this.tableInfo, tableArrData);
        }
      }
      this.isLoading = false;
    },
    // 确认 数据选择框
    async dataSelect() {
      let arr = this.multiEntityArr;
      let tableComp = [];
      let area = null;
      if (this.isTabBtn) {
        [area] = this.featureArr;
        arr = this.menuMain.$refs[area.compId][0].multiEntityArr;
        tableComp = this.menuMain.$refs[area.compId][0].getFeatureArr.children;
      } else {
        tableComp = this.menuMain.getFeatureArr.children;
        area = this.tableInfo;
      }
      if (arr && arr.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择数据'
        });
        return Promise.reject();
      }
      const ids = [];
      arr.forEach((data) => {
        tableComp.forEach((comp) => {
          if (data.id) {
            ids.push(data.id);
          } else if (comp.dataSource.columnName === 'id') {
            ids.push(data[comp.compId]);
          }
        });
      });
      let { tableName } = area.tableInfo;
      if (!tableName) {
        tableName = area.multiDataSource[area.multiDataSource.length - 1].tableInfo.tableName;
      }
      const params = {
        selectContent: '*',
        selectFrom: tableName,
        selectWhere: `${tableName}.id in (${ids.join(',')})`
      };
      this.isLoading = true;
      const data = await selectList(params);
      this.isLoading = false;
      this.$bus.$emit('setDataSel', data, this.onlyFlag());
    },
    resolveHtml(html) {
      const reg = /<messageVar vartype=[$]([A-Za-z0-9]+)>[^<]{0,}<\/messageVar>/g;
      const str = html.replace(reg, (res, v) => {
        if (this.getAllForm()[v]) {
          return this.getAllForm()[v];
        }
        return '';
      });
      return `<div class="btnTip">${str}</div>`;
    },
    mouseenter() {
      this.isHover = true;
    },
    mouseleave() {
      this.isHover = false;
    },
    selectButton() {
      this.configData.btnTypesArr = this.btnTypesArr;
      this.configData.isTabBtn = this.isTabBtn;
      if (this.$route.query.isApp === '1') {
        // app 上按钮多了两种类型
        if (this.configData.compType === 5) {
          if (this.isTabBtn) {
            this.configData.btnTypesArr.push(9);
            this.configData.btnTypesArr.push(10);
          }
          if (this.grandFather && this.grandFather.compName === 'CardMain') {
            this.configData.btnTypesArr.push(9);
            this.configData.btnTypesArr.push(10);
          }
        }
      }
      this.$bus.$emit('changeCurActiveObj', this.configData);
    }
  },

  watch: {
    rowData: {
      handler(v) {
        if (this.isConfig) {
          return;
        }
        if (!v) {
          return;
        }
        if (v[this.getIdCompId] !== this.unique) {
          return;
        }
        // 树节点id为1，即parent_id为0的时候不能删除 有子节点无法删除
        if (this.tableInfo.isTree && this.configData.buttonType === 2) {
          if (+v.parent_id === 0 && v.dataType === '1') {
            this.canShow = false;
            return;
          }
          if (v && +v.childCount !== 0) {
            this.canShow = false;
            return;
          }
          this.canShow = true;
          return;
        }
        const keys = Object.keys(this.getInitComp());
        if (keys.length === 0) {
          return;
        }
        this.canShow = this.showInput;
        this.canReadonly = this.configData.canReadonly || this.configData.singleStatus === 2;
        keys.forEach((key) => {
          const actionIds = Object.keys(this.getInitComp()[key]);
          actionIds.forEach((actionId) => {
            const action = this.getInitComp()[key][actionId];
            if (v || this.tableInfo.isTree) {
              const termRes = this.resolveTerm(action.effectiveConditions, v);
              if (termRes) {
                const affectingComponents = JSON.parse(
                  action.affectingComponents.replace(/\\/g, '')
                );
                affectingComponents.forEach((item) => {
                  if (item.comp.compId === this.configData.compId) {
                    switch (item.affectType) {
                      case 1:
                        // 显隐
                        this.canShow = item.canShow;
                        break;
                      case 2:
                        // 只读
                        this.canReadonly = item.canReadonly;
                        break;
                      default:
                        this.canShow = this.showInput;
                        this.canReadonly =
                          this.configData.canReadonly || this.configData.singleStatus === 2;
                    }
                  }
                });
              }
            }
          });
        });
      },
      deep: true,
      immediate: true
    },
    // 'configData.canShow': function (v) {
    //   this.canShow = v;
    // },
    // 'configData.canReadonly': function (v) {
    //   //  console.log(v);
    // },
    exportVisible(v) {
      if (!v) {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.formButton {
  height: 30px;
  position: relative;
  &.show {
    margin-left: 10px;
  }
  &.notShow {
    // transition: all 0.1s linear;
    opacity: 0;
    width: 0 !important;
    margin-left: 0;
    margin-top: 0;
    ::v-deep {
      .el-button {
        display: none;
      }
    }
  }
  .iconfont {
    color: $--color-primary;
  }
  ::v-deep {
    & > .el-button:not(.is-disabled) {
      width: 100%;
      vertical-align: top;
      color: #333;
      &:hover {
        color: $--color-primary;
        border-color: #c8dcfc;
        background-color: #edf3fe;
      }
    }
    & > .el-button--primary:not(.is-disabled) {
      color: #fff;
      &:hover {
        color: #fff !important;
      }
    }
    & > .el-button--text:not(.is-disabled) {
      color: $--color-primary;
    }
  }
  &.notSidebar {
    ::v-deep {
      & > .el-button {
        width: auto;
      }
    }
  }
  .isTableBtn {
    height: 24px;
    line-height: 22px;
    font-size: 13px;
    // padding: 0 10px;
  }
}
</style>
<style lang='scss'>
.btnTip {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }
}
</style>
