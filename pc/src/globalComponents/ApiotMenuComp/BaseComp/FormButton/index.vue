<template>
  <!--   v-if="canShow && showInput" -->
  <div
    class="formButton"
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
    ></component>
    <!-- </transition> -->

    <import-dialog
      v-if="configData.buttonType === 7"
      :importVisible.sync="importVisible"
      :extraColumnArr="configData.extraColumn"
      :templateId="templateId"
      :tableArr="tableArr"
      :isTree="configData.templateInfo.isTree"
      :sortId="configData.templateInfo.sortId"
      @importRefresh="importRefresh"
    ></import-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import { singleSave, batchSave, batchDelete, selectList } from '@/api/menuConfig';
import { Decrypt, getBlob, saveAs, formatDate } from '@/utils/utils';
import { lighten } from '@/utils/varyColor';

import query from '@/api/query';

import compMixin from '../../compMixin';

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
      allFormStr: ''
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    templateId() {
      const { id } = this.configData.templateInfo;
      return id;
    },
    tableArr() {
      const { tableArr } = this.configData.templateInfo;
      return tableArr;
    },
    getBtnBg() {
      if (this.configData.buttonStyle) {
        return this.isHover ? lighten(this.configData.iconColor, 0.2) : this.configData.iconColor;
      }
      return '#fff';
    },
    getStyle() {
      if (this.configData.buttonStyle === 'text') {
        return 'border:0 none';
      }
      if (this.configData.buttonStyle) {
        if (this.canReadonly || this.configData.canReadonly) {
          return `background:${this.configData.iconColor};border-color:${this.configData.iconColor};opacity: 0.5;`;
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
      // console.log(saveArr);
      let resArr = [];
      saveArr.forEach((comp) => {
        const index = this.featureArr.findIndex((child) => child.compId === comp.compId);
        if (index !== -1) {
          this.featureArr[index].relation = [];
          comp.relation.forEach((relate) => {
            // console.log(relate);
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

  mounted() {},

  inject: [
    'resolveFormula',
    'getAllForm',
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
              type: 'error',
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
        // console.log(this.getResArr);
        const { length } = this.getResArr;
        // let res = true;
        this.getResArr.forEach(async (area, index) => {
          // console.log(index);
          try {
            if (area.propertyCompName === 'MenuMainConfig') {
              // console.log(this.menuMain.$refs[area.compId]);
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
            console.log(error);
            this.resolveError(error);
            // res = false;
            if (error && typeof error !== 'object') {
              // this.$message.close();
              this.$message({
                type: 'error',
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
      // console.log('点击');
      this.isLoading = true;
      try {
        // // console.log(this.menuMain);
        // console.log(this.configData);
        // 树结点的选择
        if (this.tableInfo.isTree) {
          // 选中当前删除的节点
          this.$emit('selectTreeNode');
        }
        const index = this.configData.ruleArr.findIndex((rule) => {
          const res = this.resolveFormula(true, rule.content);
          if (res) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          const msg = this.configData.ruleArr[index].ruleTip || `按钮第${index}条规则校验失败`;
          this.isLoading = false;
          return this.$message({
            type: 'error',
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
            // console.log('tab按钮区的校验');
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
        // 导出
        if (this.configData.buttonType === 8) {
          this.handleExport();
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
        if (this.configData.refreshType === 1) {
          // 刷新当前页
          this.$bus.$emit('reloadArea', 'all', this.onlyFlag());
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
          window.location.reload();
        } else if (this.configData.refreshType === 5) {
          this.$bus.$emit('reloadArea', 'current', this.onlyFlag(), this.tableInfo.compId);
        } else if (this.configData.refreshType === 6) {
          const isAdd = this.getFatherPanel() && this.getFatherPanel().isAdd;
          console.log(123);
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
          // 更新当前树
          this.$bus.$emit(
            'reloadArea',
            'treeUpdate',
            this.getValueFromFather('onlyFlag'),
            this.tableInfo.compId,
            this.configData.buttonType,
            isAdd
          );
        }
        console.log(this.showType, 'zzz', this.nodeConfig);
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
        console.log(error);
        this.isLoading = false;
        if (error && typeof error !== 'object' && error !== 'cancel') {
          this.$message({
            type: 'error',
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
    // 遍历处理保存数据
    resolveSaveData(featureArr, area, data) {
      const form = data || featureArr.form;
      const arr = ['create_time', 'create_user_id', 'modify_time', 'modify_user_id'];
      const columnArr = [];
      const formInfo = [];
      featureArr.children.forEach((comp) => {
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
          // 去除修改系统字段的 并且 字段名不成重复
          if (!arr.includes(comp.dataSource.columnName)) {
            let columnValue = form[comp.compId] == null ? '' : form[comp.compId];
            if (Array.isArray(columnValue)) {
              columnValue = columnValue.join();
            }
            if (comp.compType === 8 && columnValue) {
              columnValue = formatDate(new Date(columnValue), 'yyyy-MM-dd');
            }
            if (comp.compType === 9 && columnValue) {
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
      const params = {
        formInfo: [],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: this.tableInfo.tableInfo.tableName,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id,
        flowType: this.configData.flowType
      };
      params.formInfo = this.resolveSaveData(this.featureArr, this.tableInfo);
      return params;
    },
    // 表单区 批量保存接口
    resolveFormParams(area) {
      const params = {
        listInfo: [[]],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      params.listInfo[0] = this.resolveSaveData(feature, area);
      params.isAdd = this.isAdd;
      if (area.isTree || (this.getFatherPanel() && this.getFatherPanel().isTree)) {
        params.isTree = 1;
      }
      return params;
    },
    // 表格区 批量保存接口
    resolveTableParams(area) {
      const params = {
        listInfo: [],
        removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      area.tableData.forEach((data) => {
        if (!data.notChange) {
          params.listInfo.push(this.resolveSaveData(feature, area, data));
        }
      });
      // console.log(params);
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
      // console.log(params);
      return params;
    },
    // 批量保存参数设置
    resolveBatchParams(areaArr) {
      // console.log(areaArr);
      const params = {
        batchInfo: [],
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id,
        flowType: this.configData.flowType
      };
      areaArr.forEach((area) => {
        if (
          area.propertyCompName === 'MenuMainConfig' ||
          area.propertyCompName === 'TreeMainConfig'
        ) {
          params.batchInfo.push({
            compId: area.compId,
            areaType: area.propertyCompName === 'MenuMainConfig' ? 1 : 2,
            relation: area.relation || [],
            saveInfo: this.resolveFormParams(area)
          });
        }
        if (area.propertyCompName === 'TableMainConfig') {
          params.batchInfo.push({
            compId: area.compId,
            areaType: 3,
            relation: area.relation || [],
            saveInfo: this.resolveTableParams(area)
          });
        }
      });
      return params;
    },
    // singleSave,batchDelete,singleInsert,singleUpdate
    // 批量新增参数处理
    bulkAddParams(params) {
      if (!this.configData.execFuncName) {
        return;
      }
      const res = this.resolveFormula(true, this.configData.execFuncName);
      // console.log(res);
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
        // console.log(i, j);
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
        if (this.tableInfo.isTree) {
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
        // console.log(this.featureArr);
        // console.log('tab按钮区的保存');
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
        await batchSave(params);
      }
      if (this.isTable) {
        // console.log(this.tableInfo, this.featureArr);
        // console.log('表格区的保存');
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
      // console.log(this.tableInfo);
      const params = {
        ids: '',
        tableName: this.tableInfo.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id,
        batchInfo: [],
        flowType: this.configData.flowType
      };
      const area = this.tableInfo;
      // 表单区删除 || 表格区表格里面删除
      if (
        this.tableInfo.propertyCompName === 'MenuMainConfig' ||
        this.tableInfo.propertyCompName === 'TreeMainConfig' ||
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

      return params;
    },
    // 处理tab区的删除参数
    resolveTabDeleteParams(area) {
      const params = {
        ids: '',
        tableName: area.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.$route.params.id,
        batchInfo: [],
        flowType: this.configData.flowType
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
          if (comp.dataSource.columnName === 'id') {
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
        // // console.log('删除的id', params.ids);
      }
      return params;
    },
    // 删除
    async batchDelete() {
      if (this.isTabBtn) {
        if (this.getResArr.length === 0) {
          return this.$message({
            type: 'error',
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
              type: 'error',
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
          if (area.isTree || (this.getFatherPanel() && this.getFatherPanel().isTree)) {
            if (area.compName !== 'MultiTree') {
              params.isTree = 1;
              if (+params.ids === 1) {
                this.$message({
                  type: 'error',
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
        // console.log(params);
        this.deleteShouldReload = true;

        if (this.tableInfo.propertyCompName === 'TableMainConfig') {
          if (this.multiEntityArr.length === 0 && !this.isTableBtn) {
            this.$message({
              type: 'error',
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
          if (this.tableInfo.isTree || (this.getFatherPanel() && this.getFatherPanel().isTree)) {
            if (this.tableInfo.compName !== 'MultiTree') {
              params.isTree = 1;
              if (+params.ids === 1) {
                this.$message({
                  type: 'error',
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
        console.log(this.tableInfo);
        if (this.tableInfo.isTree && this.tableInfo.compName !== 'MultiTree') {
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
      // console.log(this.tableInfo);
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
              type: 'error',
              message: '行编辑状态不需要编辑弹窗'
            });
          }
        } else {
          // 表格按钮区的编辑
          const len = this.multiEntityArr.length;
          if (len !== 1) {
            return this.$message({
              type: 'error',
              message: '请选中有且仅有一条数据'
            });
          }
        }
      }

      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      // console.log(this.panelObj);
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
      }
    },
    // 跳转菜单
    jumpMenu() {
      const curMenuArr = this.getMenu()[this.configData.compId];
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        console.log(obj);
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
      console.log(this.configData);
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
      console.log(this.configData, this.multiEntityArr, this.menuMain, this.tableInfo);
      const { exportSetting, needField, templateInfo } = this.configData;
      // const { dropColumnData } = this.menuMain;
      const tableComp = this.menuMain.getFeatureArr.children;

      const { templateName } = templateInfo; // templateId 模板ID
      const isHeader = needField ? 1 : 0; // 是否携带表字段（1是 0否）
      const chooseArr = []; // 选中的数组

      const { tableName: mainTable } = this.tableInfo.tableInfo; // 查询主表名 chooseIds
      const columns = []; // 查询字段 按顺序排列并带上表名
      const collectionArr = []; // 关联表集合
      const memo = []; // 字段中文名

      const tempArr = []; // 选中转换

      console.log(mainTable);

      const { relateTableArr } = this.tableInfo; // 关联关系
      console.log(relateTableArr);
      let num = 0;
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

            let alias11 = mainTable === table1 ? 't0' : '';
            let alias12 = mainTable === table2 ? 't0' : '';
            if (alias11 !== 't0') {
              num += 1;
              alias11 = `t${num}`;
            }
            if (alias12 !== 't0') {
              num += 1;
              alias12 = `t${num}`;
            }

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

      this.multiEntityArr.forEach((data) => {
        const obj = {};
        tableComp.forEach((comp) => {
          obj[comp.dataSource.columnName] = data[comp.compId];
        });
        tempArr.push(obj);
      });

      console.log(tableComp);
      tableComp.forEach((comp, i) => {
        if (i !== 0) {
          const currentObj = collectionArr.find((c) => c.name === comp.dataSource.relateName);
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
            columns.push(`${tableName}.${comp.dataSource.columnName}`);
          }
          memo.push(comp.name);
        }
      });
      if (exportSetting === 2 || exportSetting === 4) {
        tempArr.forEach((item) => {
          chooseArr.push(item.id);
        });
      }
      // 按模板导出
      if (exportSetting === 1 || exportSetting === 2) {
        // console.log(
        //   `${query.DO_Export_Template}?chooseIds=${chooseArr.join(',')}&id=${
        //     this.templateId
        //   }&isHeader=${isHeader}`,
        //   chooseArr
        // );
        getBlob(
          {
            url: `${query.DO_Export_Template}?chooseIds=${chooseArr.join(',')}&id=${
              this.templateId
            }&isHeader=${isHeader}&menuId=${this.$route.params.id}&userId=${
              this.$store.state.userCenter.userInfo.id
            }`,
            token: Decrypt(localStorage.getItem('token') || ''),
            method: 'GET'
          },
          (res) => {
            const names = templateName || '导出模板';
            saveAs(res, `${names}.xls`);
          }
        );
      }

      const getAllFormObj = this.getAllForm();
      // console.log(11111111, this.$store.state.userCenter.userInfo.id, this.$route.params.id);
      // 按界面导出
      if (exportSetting === 3 || exportSetting === 4) {
        let whereOptions = '';
        let filterTermType = '';
        let filterTermStr = '';
        let filterTermSql = '';
        console.log('金莱尔');
        const getPanelObj = this.getPanel();
        if (JSON.stringify(getPanelObj) !== '{}') {
          filterTermType = this.tableInfo.filterTermType;
          filterTermStr = this.tableInfo.filterTermStr;
          filterTermSql = this.tableInfo.filterTermSql;
        } else {
          const panelFilter = this.getFatherPanel().panelFilter[0];
          filterTermType = panelFilter.filterTermType;
          filterTermStr = panelFilter.filterTermStr;
          filterTermSql = panelFilter.filterTermSql;
        }
        if (filterTermType === 1) {
          if (filterTermStr) {
            const arr = JSON.parse(filterTermStr);
            console.log(arr);
            arr.termArr.forEach((item, z) => {
              whereOptions += '(';
              item.forEach((val, i) => {
                const { tableName, columnName } = val.columnObj;
                const { lambda, content } = val;
                whereOptions += `${tableName}.${columnName}${lambda}${content}`;
                if (i !== item.length - 1) {
                  whereOptions += ' or ';
                }
              });
              if (z === arr.termArr.length - 1) {
                whereOptions += ') ';
              } else {
                whereOptions += ') and ';
              }
              console.log(whereOptions);
            });
          }
          // whereOptions = whereOptions.slice(0, -5);
        } else {
          const idArr = filterTermSql.match(/\$(\S*)\$/g);
          if (idArr) {
            idArr.forEach((item) => {
              whereOptions = filterTermSql.replace(
                /\$(\S*)\$/g,
                getAllFormObj[item.slice(1, item.length - 1)]
              );
            });
          } else {
            whereOptions = filterTermSql;
          }
        }
        console.log(whereOptions);
        console.log(
          `${query.DO_Export_Interface}?isHeader=${
            needField ? 1 : 0
          }&mainTable=${mainTable}&chooseIds=${chooseArr.join(',')}&columns=${columns.join(
            ','
          )}&foreignJson=${encodeURI(JSON.stringify(collectionArr))}&memo=${memo.join(
            ','
          )}&menuId=${this.$route.params.id}&userId=${
            this.$store.state.userCenter.userInfo.id
          }&whereOptions=${whereOptions}&compMap=${encodeURI(JSON.stringify(this.getAllForm()))}`
        );

        console.log(qs.stringify(collectionArr));
        console.log(encodeURI(JSON.stringify(collectionArr)));
        getBlob(
          {
            url: `${query.DO_Export_Interface}?isHeader=${
              needField ? 1 : 0
            }&mainTable=${mainTable}&chooseIds=${chooseArr.join(',')}&columns=${columns.join(
              ','
            )}&foreignJson=${encodeURI(JSON.stringify(collectionArr))}&memo=${memo.join(
              ','
            )}&menuId=${this.$route.params.id}&userId=${
              this.$store.state.userCenter.userInfo.id
            }&whereOptions=${whereOptions}&compMap=${encodeURI(JSON.stringify(this.getAllForm()))}`,
            token: Decrypt(localStorage.getItem('token') || ''),
            method: 'GET'
          },
          (res) => {
            const names = templateName || '导出模板';
            saveAs(res, `${names}.xls`);
          }
        );
      }
    },
    // 查询
    handleQuery() {
      this.$bus.$emit('changeUrl');
    },
    // 重置
    async handleReset() {
      const { form } = this.featureArr;
      Object.keys(form).forEach((item) => {
        form[item] = '';
      });
      this.$bus.$emit('changeUrl');
    },
    // 查询区导出
    async handleQueryExport() {
      const { exportType } = this.configData;
      this.$bus.$emit('queryExport', exportType);
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
          type: 'error',
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
      return str;
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
        const keys = Object.keys(this.getInitComp());
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
        // 树节点id为1，即parent_id为0的时候不能删除 有子节点无法删除
        if (this.tableInfo.isTree && this.configData.buttonType === 2) {
          if (v.parent_id === 0 || (v && v.childCount !== 0)) {
            this.canShow = false;
          }
        }
      },
      deep: true,
      immediate: true
    },
    'configData.canShow': function (v) {
      this.canShow = v;
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
    display: none;
    opacity: 0;
    width: 0 !important;
    margin-left: 0;
    margin-top: 0;
  }
  .iconfont {
    color: $--color-primary;
  }
  ::v-deep {
    & > .el-button {
      width: 100%;
      vertical-align: top;
      color: #333;
      &:hover {
        color: $--color-primary;
        border-color: #c8dcfc;
        background-color: #edf3fe;
      }
    }
    & > .el-button--primary {
      color: #fff;
      &:hover {
        color: #fff !important;
      }
    }
    & > .el-button--text {
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
    height: 28px;
    line-height: 26px;
    font-size: 13px;
    padding: 0 10px;
  }
}
</style>
