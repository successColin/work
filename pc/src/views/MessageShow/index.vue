<!--
 * @Author: sss
 * @Date: 2021-07-14 09:22:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-14 09:22:18
 * @Desc: 消息展示
-->
<template>
  <div class="messageShow"
    :class="{openedApprove: approveVisible}">
    <page-tabs
      v-on="$listeners"
      v-bind="$attrs"
      v-model="activeName"
      :tabsArr="tabsArr"
      :showTabs="true"
      :hasUnRead="hasUnRead"
      @tab-click="tabClick"
    >
      <template v-slot:Workflow>
        <message-list
            v-on="$listeners"
            v-bind="$attrs"
            @fetchNodeInfo="fetchNodeInfo"
            @doMessageClick="doMessageClick"
            type="WORK_FLOW"
            ref="Workflow"/>
      </template>
      <template v-slot:SystemMessage>
        <message-list
            v-bind="$attrs"
            v-on="$listeners"
            @fetchNodeInfo="fetchNodeInfo"
            @doMessageClick="doMessageClick"
            type="SYSTEM"
            ref="SystemMessage"/>
      </template>
      <template v-slot:Communication>
        <message-list
            v-on="$listeners"
            v-bind="$attrs"
            type="P2P"
            ref="Communication"/>
      </template>
    </page-tabs>
    <Approve
      :showTabs.sync="approveVisible"
      :com="com"
      v-model="activeName1"
      :approvalInfo="approvalInfo"
      :nodeConfig="nodeConfig"
      isMessage="1"
      @hideMessage="hideMessage"
      class="approve"
    ></Approve>
    <component
      :is="panelConfig.activeObj.dialogName || 'PanelDialog'"
      :showPanel="panelVisible"
      :visible.sync="panelVisible"
      :panelObj="panelObj"
      v-if="JSON.stringify(panelConfig) !== '{}'"
    ></component>
  </div>
</template>

<script>
import { getMailCount, getByCode } from '@/api/messageShow.js';
import Approve from '_v/TaskToDo/Components/Approve';
import { getNodeInfo } from '@/api/flow';
import MessageList from './components/MessageList/index';
import PageTabs from './components/PageTabs';

const FIXED_OBJ = {}; // 保存
const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();
export default {
  name: 'MessageShow',
  components: { MessageList, PageTabs, Approve },

  props: {
    showTaskMessage: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeName: 'WORK_FLOW',
      tabsArr: [{
        label: this.$t('messageShow.Workflow'),
        slotName: 'Workflow',
        key: 'WORK_FLOW'
      }, {
        label: this.$t('messageShow.SystemMessage'),
        slotName: 'SystemMessage',
        key: 'SYSTEM'
      }],
      // , {
      //   label: this.$t('messageShow.Communication'),
      //   slotName: 'Communication',
      //   key: 'PLATFORM'
      // }
      visible: true,
      hasUnRead: {
        WORK_FLOW: null,
        SYSTEM: null,
        PLATFORM: null,
      },
      approvalInfo: {},
      nodeConfig: {},
      com: '',
      approveVisible: false,
      activeName1: 'Approve',
      panelVisible: false,
      panelConfig: {} // 面板属性
    };
  },

  computed: {
    panelObj() {
      const { activeObj, curPaneObj } = this.panelConfig;
      return {
        ...curPaneObj,
        ...activeObj,
        panelVarObj: {},
        panelName: activeObj.dialogTitle
      };
    },
  },
  watch: {
    approveVisible(v) {
      if (!v) {
        this.$emit('update:showTaskMessage', false);
      }
    }
  },

  methods: {
    tabClick(e) {
      if (this.hasUnRead[e.name]) {
        this.hasUnRead[e.name] = 0;
      }
    },
    queryMailCount(type) {
      try {
        const param = {
          innerMailCategorys: [type],
          hasRead: false
        };
        getMailCount(param).then((res) => {
          this.hasUnRead[type] = res;
        });
      } catch (err) {
        console.log(err);
      }
    },
    async fetchNodeInfo(variablesStr) {
      try {
        this.approvalInfo = await getByCode({ code: variablesStr });
        const { taskType, nodeId } = this.approvalInfo;
        if (taskType === 3 || taskType === 5) {
          // 该节点属于审批节点，需要去获取配置
          this.getNodeInfo(nodeId);
          return;
        }
        this.approveVisible = true; //  审批界面弹框
        this.$emit('update:showTaskMessage', true);
      } catch (err) {
        this.$message({
          type: 'warning',
          message: '没有流程信息'
        });
      }
    },
    hideMessage() {
      this.approveVisible = false;
      this.$emit('update:showTaskMessage', false);
      this.$refs.Workflow.getPageInnerMailList();
    },
    async getNodeInfo(nodeId) {
      try {
        const data = await getNodeInfo({ nodeId });
        const config = data.attributes ? JSON.parse(data.attributes) : {};
        this.nodeConfig = config;
        this.approveVisible = true; //  审批界面弹框
      } catch (err) {
        console.log(err);
      }
    },
    doMessageClick(skipMenuConfig, variablesStr, type) {
      if (+type === 2) {
        this.doSpringPanel(skipMenuConfig, variablesStr);
      } else if (+type === 3) {
        this.doSkipMenu(skipMenuConfig, variablesStr);
      }
    },
    doSkipMenu(skipMenuConfig, variablesStr) {
      // 跳菜单
      const menuConfig = skipMenuConfig.find((item) => {
        if (!item.jumpTerm) {
          // 如果没有条件，默认跳
          return true;
        }
        const isFlag = this.formulaConversion(item.jumpTerm, variablesStr);
        return isFlag;
      });
      if (menuConfig) {
        // 获取目标菜单
        const menu = this.$store.getters.getCurMenu(menuConfig.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          menuConfig.menuVarObj = {};
          menuConfig.menuFilter.forEach((item, index) => {
            // 将公式值处理成固定值
            const { filterTermStr, filterTermSql, filterTermType } = item;
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(filterTermStr, variablesStr);
              menuConfig.menuFilter[index].filterTermStr = JSON.stringify(newFilterTermStr);
            }
            if (filterTermType === 2) {
              // sql过滤条件
              const str = this.reduceSqlFilter(filterTermSql);
              menuConfig.menuFilter[index].filterTermSql = str;
            }
          });
          const menuObj = {};
          menuObj[menuConfig.id] = menuConfig;
          const { jumpMenuObj = '{}' } = sessionStorage;
          const newJumpMenuObj = JSON.parse(jumpMenuObj);
          newJumpMenuObj[menuConfig.id] = menuConfig;
          sessionStorage.jumpMenuObj = JSON.stringify(newJumpMenuObj);
          this.$emit('update:showMessage', false);
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
    // 跳转面板
    doSpringPanel(panelConfig, variablesStr) {
      const { curPaneObj } = panelConfig;
      if (curPaneObj && curPaneObj.id) {
        curPaneObj.panelFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermSql, filterTermType } = item;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr, variablesStr);
            curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
              ? JSON.stringify(newFilterTermStr)
              : '';
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);
            curPaneObj.panelFilter[index].filterTermSql = str;
          }
        });
        const { panelData } = curPaneObj;
        const panelFixData = {};
        if (panelData && panelData.length) {
          panelData.forEach((item) => {
            const {
              field,
              paneComp: { compId }
            } = item;
            panelFixData[compId] = FIXED_OBJ[field] || field;
          });
        }
        curPaneObj.panelFixData = panelFixData;
        this.panelConfig = panelConfig;
        this.$nextTick(() => {
          this.panelVisible = true;
        });
      }
    },
    reduceNormalFilter(filterTermStr, variablesStr) {
      // 处理普通的过滤条件
      const newFilterTermStr = filterTermStr ? JSON.parse(filterTermStr) : {};
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            if (content.indexOf('$variable_') !== -1) {
              term.valueType = 1;
              term.content = this.formulaVariable(content, variablesStr);
            } else {
              const result = this.formulaConversion(content);
              term.valueType = 1;
              term.content = result;
            }
          }
        });
      });
      if (JSON.stringify(newFilterTermStr) === '{}') {
        return '';
      }
      return newFilterTermStr;
    },
    reduceSqlFilter(filterTermSql) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    regProcess(str = '', variablesStr) {
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      let newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      if (variablesStr) {
        newStr = newStr.replace(/\$variable_+([a-zA-Z0-9]+)\$/g, (...arr) =>
          variablesStr[arr[1]]);
      }
      console.log(newStr);
      return newStr;
    },
    // 处理公式
    formulaConversion(formulaStr, variablesStr) {
      console.log(formulaStr);
      let str = this.regProcess(formulaStr, variablesStr);
      let res = parser.parse(`${str}`);
      if (res.error) {
        str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // console.log(res);
      // 最终错误把字符串返回
      if (res.error) {
        return false;
      }
      return res.result;
    },
    formulaVariable(text, variablesStr) {
      const res = text.replace(/\$variable_+([a-zA-Z0-9]+)\$/g, (...arr) =>
        variablesStr[arr[1]]);
      return res;
    }
  },

  activated() {
  },

  mounted() {
    if (this.$store.state.globalConfig.themeConfig.enableApprovalProcess !== '1') {
      this.tabsArr = [{
        label: this.$t('messageShow.SystemMessage'),
        slotName: 'SystemMessage',
        key: 'SYSTEM'
      }];
      this.activeName = 'SYSTEM';
    } else {
      this.queryMailCount('SYSTEM');
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
