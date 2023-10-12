<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 菜单
-->
<template>
  <view
    class="menuConfig"
    :style="{ height: htmlConfig.isSelectDataBox ? `${menuHeight}px` : '' }"
  >
    <!-- tab区 -->
    <apiot-tabs
      v-if="htmlConfig.showTab && canShowTablist.length > 1"
      class="menuConfig__tabs"
      :list="canShowTablist"
      :is-scroll="false"
      :current="current"
      @change="tabsChange"
    ></apiot-tabs>
    <apiot-toast
      v-if="isLoading && getFuncAreas.length > 0"
      status="loading"
      :isFull="true"
    ></apiot-toast>
    <apiot-modal ref="apiotModal"></apiot-modal>
    <!-- 实际界面区1-->
    <tab-page v-if="getFuncAreas.length > 0">
      <template v-for="area in getFuncAreas">
        <div
          class="menuConfig__tab"
          :key="area.compId"
          v-if="area.compName !== 'BtnsArea'"
        >
          <div class="menuConfig__tab--c">
            <config-form
              v-if="area.compName === 'MenuMain'"
              ref="formConfig"
              :tabId="getCurrentTab.compId"
              :title="getCurrentTab.name"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @handleTrgger="handleTrgger"
            ></config-form>

            <config-list
              v-else-if="area.compName === 'CardMain'"
              ref="listConfig"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @setBatchArea="setBatchArea"
            ></config-list>

            <config-tree
              v-else-if="
                area.compName === 'TreeMain' || area.compName === 'MultiTree'
              "
              ref="treeConfig"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
            ></config-tree>

            <tree-device-pos
              v-else-if="area.compName === 'DevicePosTree'"
              ref="DevicePosTree"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
            ></tree-device-pos>

            <relation-knowledge
              v-else-if="area.compName === 'RelatedData'"
              :funcConfig="area"
            ></relation-knowledge>
          </div>
        </div>
      </template>
      <view
        v-if="!isLoading && (getCurrentTab.showTabBtn || htmlConfig.isProcess)"
        class="menuConfig__tab--btns"
        style="display: none"
      >
        <tab-btns
          :tabProp="canShowTablist[current]"
          :tabId="getCurrentTab.compId"
          :htmlConfig="htmlConfig"
          :showTabBtn="getCurrentTab.showTabBtn"
          :featureArr="getFuncAreas.slice(1)"
          :isTabBtn="true"
          :menuConfig="menuConfig"
          @setBatchArea="setBatchArea"
          @checkedAllClick="checkedAll"
        ></tab-btns>
      </view>
    </tab-page>
  </view>
</template>

<script>
import { operationTriggers, selectList } from '@/api/menuConfig.js';

import mainMixin from '../../../mainMixin';
import parser from '@/utils/formula';

import TabPage from '../../../TabPage';
import ConfigList from '../../../ConfigMain/ConfigList';
import ConfigForm from '../../../ConfigMain/ConfigForm';
import configTree from '../../../ConfigMain/ConfigTree';
import TreeDevicePos from '../../../ConfigMain/ConfigTree/TreeDevicePos.vue';
import RelationKnowledge from '../../../RelationKnowledge';
import TabBtns from '../../../ConfigMain/ConfigBtns/TabBtns.vue';

let getAllPaneBack = null;

export default {
  mixins: [mainMixin],

  props: {
    menuConfig: {
      type: Object
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    menuStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    menuHeight: {
      type: Number,
      default: 100
    },
    popTitle: {
      type: String,
      default: '添加'
    },
    appCheckAgreeFormConfig: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  components: {
    // TabPage: () => import('../../../TabPage'),
    // ConfigList: () => import('../../../ConfigMain/ConfigList'),
    // ConfigForm: () => import('../../../ConfigMain/ConfigForm'),
    // ConfigTree: () => import('../../../ConfigMain/ConfigTree'),
    // TreeDevicePos: () => import('../../../ConfigMain/ConfigTree/TreeDevicePos'),
    // RelationKnowledge: () => import('../../../RelationKnowledge')

    TabPage,
    ConfigList,
    ConfigForm,
    configTree,
    TreeDevicePos,
    RelationKnowledge,
    TabBtns
  },

  data() {
    return {
      notValueChange: false, // 不进行值变化
      watchArr: [],
      // 不同控件对应的权限项
      permission: {
        1: 63, // 保存1
        2: 4, // 删除
        3: 2, // 新增
        4: 3, // 编辑
        7: 5, // 导入
        8: 6, // 导出
        9: 4 // 批量删除和删除一样的权限
      },
      // 记录每个功能块加载的状态
      areaLoadStatue: {},
      // 加载区域
      loadingAreas: {},
      mainLoading: true
    };
  },

  provide() {
    return {
      munuOnlyFlag: this.getMenuOnlyFlag,
      getJumpMenu: this.getJumpMenu,
      getAllForm: this.getAllForm,
      changeNotValueChange: this.changeNotValueChange,
      onlyFlag: this.getFlag,
      getMenuFlag: this.getMenuFlag,
      getLoadStatue: this.getAreaLoadStatue, // 获取每个功能块加载的状态1
      resolveTerm: this.resolveTerm,
      resolveFormula: this.resolveFormula,
      getSelDataColumn: this.getSelDataColumn
    };
  },

  computed: {
    // 获取需要显示的tab
    getCurrentTab() {
      if (this.current === -1) return {};
      const tab = this.canShowTablist[this.current];
      if (!tab) return {};
      const { compId, name, showTabBtn, children: funcAreas } = tab;
      const areaArr = [];
      const computedFuncArea = [];
      let canComputed = true;
      const { isProcess, processNodeId } = this.htmlConfig;

      funcAreas.forEach((area) => {
        if (area.compName === 'CardMain') canComputed = false;
        if (canComputed) computedFuncArea.push(area.compId);

        // area 有流程走流程配置
        if (isProcess) {
          this.appCheckAgreeFormConfig.forEach((v) => {
            if (area.compId === v.compId) {
              area.notShowTab = !v.canShow;
            }
          });
        }
        if (!area.notShowTab) {
          areaArr.push(area);
        }
      });
      return {
        computedFuncArea,
        funcAreas: areaArr,
        compId,
        name,
        showTabBtn
      };
    },
    approvalInfo() {
      const { triggerUserName, title: instanceName } = this.menuConfig;
      return {
        instanceName,
        triggerUserName
      };
    },
    // 固定的tab页面
    firstShowTabId() {
      const area = this.configData.children[0];
      return area.firstShowTabId;
    },
    isLoading() {
      const { mainLoading, loadingAreas } = this;
      if (mainLoading) return true;

      let status = false;
      Object.keys(loadingAreas).forEach((key) => {
        if (loadingAreas[key]) status = true;
      });

      return status;
    },
    getCheckList() {
      const { funcCheckObj, getFuncAreas } = this;
      const area = getFuncAreas.find((item) => item.areaType === 1);
      if (!area) return [];
      return funcCheckObj[area.compId] || [];
    },
    // 获取所有tab
    getTabs() {
      const tabs = [];
      Object.keys(this.getAllPane.tabObj).forEach((key) => {
        tabs.push(this.getAllPane.tabObj[key]);
      });
      return tabs;
    },
    maskOverhidden() {
      return this.$store.state.base.maskOverhiddenClass;
    },
    // 是否显示底部导航栏
    enableFooter() {
      return this.$store.state.menu.functionInterface.enableFooter;
    },
    // 工作台功能区
    myInterface() {
      return this.$store.state.menu.myInterface;
    },
    // 是否为超级用户
    supper() {
      return this.$store.state.menu.supper;
    },
    // 获取菜单权限
    getMenuPer() {
      // 如果是超级用户就不走权限
      if (this.supper) return '';
      const { isPanel, id, menuFlag } = this.htmlConfig || {};
      const menuID = isPanel ? menuFlag : id;
      const menu = this.$store.state.menu.menusObj[menuID] || {};
      return menu.permission || '';
    },
    // 主体色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    }
  },

  watch: {
    'getAllPane.tabObj': function(newV) {
      // 需要隐藏的tab
      const hiddenTabsArr = [];
      const { hiddenRules = [], isProcess, processNodeId } = this.htmlConfig;
      hiddenRules.forEach((rule) => {
        const res = this.resolveFormula(true, rule.content);
        if (res) {
          hiddenTabsArr.push(...rule.tabs);
        }
      });
      // 所有需要隐藏的tab去重
      const result = Array.from(new Set(hiddenTabsArr));
      const tabs = [];
      Object.keys(newV).forEach((key) => {
        // 去除 不要的tab
        if (!result.includes(key)) {
          const tab = newV[key];
          // tabs 有流程走流程配置
          if (isProcess) {
            tab.notShowTab = true;
            this.appCheckAgreeFormConfig.forEach((v) => {
              tab.children.forEach((item) => {
                if (item.compName === 'BtnsArea') {
                  item.children.forEach((vv) => {
                    if (vv.compId === v.compId) {
                      tab.notShowTab = !v.isRelationPass;
                    }
                  });
                }
              });
            });
          }
          if (!tab.notShowTab) {
            tabs.push(tab);
          }
          // eslint-disable-next-line max-len
          if (this.firstShowTabId === tab.compId && this.current === -1) this.current = tabs.length - 1;
        }
      });
      if (this.current === -1) this.current = 0;
      this.canShowTablist = [...tabs];
    }
  },

  methods: {
    switchLoadingArea(compId, status) {
      const obj = { ...this.loadingAreas };
      obj[compId] = status;
      this.loadingAreas = obj;
    },
    // 获取每个功能块加载的状态
    getAreaLoadStatue() {
      return this.areaLoadStatue;
    },
    getMenuFlag() {
      const { isPanel, id, menuFlag } = this.htmlConfig || {};
      return isPanel ? menuFlag : id;
    },
    getFlag() {
      return this.onlyFlag;
    },
    // 改变notValueChange
    changeNotValueChange(v) {
      this.notValueChange = v;
    },
    // 获取菜单唯一标识
    getMenuOnlyFlag() {
      return this.$store.state.menu.currentOnlyFlag;
    },
    // 获取表单数据池
    getAllForm() {
      return this.getCompMap();
    },
    // 获取跳转菜单
    getJumpMenu() {
      return this.menuJumpObj;
    },
    // tabs通知swiper切换
    tabsChange(tab) {
      this.current = tab.index;
    },
    // 处理所有值给后端
    getCompMap() {
      const idArry = [];
      let obj = {};

      const { funcCheckObj } = this;
      const { currentBatchAreaCompId } = this.htmlConfig;
      const checkList = currentBatchAreaCompId ? funcCheckObj[currentBatchAreaCompId] : [];

      const keys = Object.keys(this.getAllPane.formObj);
      keys.forEach((key) => {
        obj = Object.assign(obj, this.getAllPane.formObj[key].form);
      });
      if (checkList && checkList.length !== 0) {
        const areaKeys = Object.keys(this.getAllPane.funcObj);
        const compId = areaKeys.find(
          (A) => this.getAllPane.funcObj[A][0].compId === currentBatchAreaCompId
        );
        const area = this.getAllPane.funcObj[compId][0];
        const func = area.areaType !== 2 ? area.children[0] : area.children[1];
        func.children.forEach((comp) => {
          const arry = [];
          checkList.forEach((V) => {
            if (comp.name === 'id') idArry.push(V[comp.compId]);
            arry.push(V[comp.compId]);
          });
          obj[comp.compId] = arry.join();
        });
      }

      // Object.keys(obj).forEach((key) => {
      //   if (Array.isArray(obj[key])) {
      //     obj[key] = obj[key].join();
      //   }
      // });
      obj.CUR_SELECTED_IDS = idArry ? idArry.join() : '';
      // 并且要将MENU_ID也传递过去，对应公式[GET_MENU_ID]()
      obj.MENU_ID = this.getMenuFlag();
      return obj;
    },
    async resolveOtherApi(linkcode, actionArr) {
      // 预览状态后端触发器、http请求都不能操作
      if (this.htmlConfig.isPreview) {
        return false;
      }

      const params = {
        triggerMap: {}
      };
      params.triggerMap[linkcode] = actionArr;
      params.compMap = this.getCompMap();
      const data = await operationTriggers(JSON.stringify(params));
      const lastAction = actionArr[actionArr.length - 1];
      const triggerId = lastAction.id;
      if (data[triggerId].code) {
        if (data[triggerId].code !== 200) {
          this.$refs.apiotModal.showAsyncModal({
            title: '警告',
            content: `存储过程报错：${data[triggerId].message || ''}`
          });
        }
      }
      if (Object.keys(data).length === 1) {
        return;
      }
      if (lastAction.returnValue) {
        const returnValue = JSON.parse(lastAction.returnValue.replace(/\\/g, ''));
        const lastData = data[triggerId].data;
        if (!lastData) return;
        returnValue.forEach((v) => {
          const form = this.findForm(v.comp);
          if (form) {
            form.form[v.comp.compId] = this.resolveReturnValue(lastData, v.apiValue);
          }
        });
      }
    },
    // 处理返回值 获取单个值
    resolveReturnValue(data, value) {
      const arr = value.split('.');
      let curValue = data;
      arr.forEach((v) => {
        const tempArr = v.split('[');
        const last = tempArr[tempArr.length - 1];
        if (last.indexOf(']') !== -1) {
          tempArr[tempArr.length - 1] = last.slice(0, -1);
        }
        tempArr.forEach((t) => {
          if (t) {
            curValue = curValue[t];
          }
        });
      });
      return `${curValue}`;
    },
    // 处理链路
    async resolveLink(data, key) {
      // 预览状态后端触发器、http请求都不能操作
      if (this.htmlConfig.isPreview) {
        return false;
      }
      // 按照优先级进行排序
      const keys = Object.keys(data[key]).sort(
        (a, b) => data[key][a][0].triggerPriority - data[key][b][0].triggerPriority
      );
      keys.forEach((linkcode) => {
        const linkArr = [];
        data[key][linkcode].forEach((action) => {
          if (action.triggerType === 1 || linkArr.length === 0) {
            linkArr.push([action]);
          } else {
            const len = linkArr.length;
            linkArr[len - 1].push(action);
          }
        });
        // 执行每条链路的初始化过程
        linkArr.forEach(async (actionArr) => {
          // 判断第一个是否是前端触发器，是则触发，不是则判断该组是否只存在前端触发器，然后进行调用后端触发器
          if (actionArr[0].triggerType === 1) {
            this.resolveAfffetComp(actionArr[0]);
            if (actionArr.length !== 1) {
              await this.resolveOtherApi(linkcode, actionArr);
            }
          } else {
            await this.resolveOtherApi(linkcode, actionArr);
          }
        });
      });
    },
    // 处理影响数组
    resolveAfffetComp(action) {
      const termRes = this.resolveTerm(action.effectiveConditions);
      const affectingComponents = JSON.parse(action.affectingComponents.replace(/\\/g, ''));
      if (termRes) {
        affectingComponents.forEach(async (item) => {
          const comp = this.getAllPane.compObj[item.comp.compId];
          if (!comp) {
            return;
          }
          let tab = null;
          if (comp) {
            switch (item.affectType) {
              case 1:
                // 显隐
                comp.canShow = item.canShow;
                break;
              case 2:
                // 只读
                comp.canReadonly = item.canReadonly;
                break;
              case 5:
                {
                  // 必填
                  comp.shouldRequired = item.canRequired;
                  const area = this.findForm(comp);
                  const ruleArr = area.rules[comp.compId] || [];
                  // 必填
                  const ruleObj = {
                    flag: 'requiredRule',
                    required: true,
                    message: `${comp.name}不能为空`,
                    trigger: 'change'
                  };
                  const index = ruleArr.findIndex((v) => v.flag === 'requiredRule');
                  if (index === -1 && comp.shouldRequired) {
                    ruleArr.push(ruleObj);
                  }
                  if (index !== -1 && !item.canRequired) {
                    ruleArr.splice(index, 1);
                  }
                  area.rules[comp.compId] = ruleArr;
                  this.$set(area, 'refershRule', new Date().getTime());
                }

                break;
              case 3:
                // 固定值
                tab = this.findForm(comp);
                if (tab) {
                  let v = item.normalValue;
                  if (comp.compType === 2) {
                    if (comp.dropDownType === 1) {
                      if (v) {
                        v = +v;
                      } else {
                        v = '';
                      }
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    v = +v;
                  }
                  if ([4, 25].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }
                  tab.form[comp.compId] = v;
                }
                break;
              case 4: {
                // 公式
                tab = this.findForm(comp);
                if (tab) {
                  let v = this.resolveFormula(true, item.normalValue);
                  if (typeof v === 'object' && v.error) {
                    return;
                  }
                  // 显示值赋值
                  if (typeof v === 'object' && v.selectContent) {
                    const data = await selectList(v);
                    const showArr = [];
                    data.forEach((tempV) => {
                      if (tempV[v.selectContent]) {
                        showArr.push(tempV[v.selectContent]);
                      }
                    });
                    v.showValue = showArr.join();
                  }
                  if (comp.compType === 2) {
                    if (comp.dropDownType === 1) {
                      if (v !== '') {
                        v = +v;
                      }
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    if (v !== '') {
                      v = +v;
                    }
                  }
                  if ([4, 25].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }

                  if ([6, 7, 15].includes(comp.compType)) {
                    if (v || v.value === '') {
                      tab.form[comp.compId] = '';
                      tab.form[`${comp.compId}_`] = '';
                      if (typeof v === 'object') {
                        this.$nextTick(async () => {
                          tab.form[`${comp.compId}_`] = v.showValue;
                          tab.form[comp.compId] = v.value;
                        });
                      } else {
                        tab.form[comp.compId] = `${v}`;
                      }
                    }
                  } else if (v || v === '') {
                    tab.form[comp.compId] = `${v}`;
                  }
                }
                break;
              }

              default:
                break;
            }
          }
        });
      }
      this.setProcessConfig();
    },
    setProcessConfig() {
      // 需要判断如果是从流程那边过来，以流程那边的配置为准
      const { processNodeId, isProcess } = this.htmlConfig;
      if (isProcess) {
        this.appCheckAgreeFormConfig.forEach((item) => {
          const comp = this.getAllPane.compObj[item.compId];
          // 显隐
          if ('canShow' in item) comp.canShow = item.canShow;
          // 只读
          if ('canReadonly' in item) comp.canReadonly = item.canEdit;
          // 必填
          if ('shouldRequired' in item) {
            const area = this.findForm(comp);
            const ruleArr = area.rules[comp.compId];
            const ruleObj = {
              flag: 'requiredRule',
              required: true,
              message: `${comp.name}不能为空`,
              trigger: 'change'
            };
            if (ruleArr && ruleArr.length !== 0) {
              const index = ruleArr.findIndex((v) => v.flag === 'requiredRule');
              if (index === -1 && comp.shouldRequired) {
                ruleArr.push(ruleObj);
              }
              if (index !== -1 && !item.shouldRequired) {
                ruleArr.splice(index, 1);
              }
            } else if (item.shouldRequired) {
              this.$set(area.rules, comp.compId, [ruleObj]);
            }
          }
        });
      }
    },
    // 根据id值获取对应数据
    async getShowValue(value, tableName) {
      const params = {
        selectContent: '*',
        selectFrom: tableName,
        selectWhere: `${tableName}.id in (${value})`
      };
      const data = await selectList(params);
      return data;
    },
    // 处理条件
    resolveTerm(term, data) {
      if (!term) {
        return true;
      }
      const termObj = JSON.parse(term.replace(/\\/g, ''));
      if (termObj.termType === 1) {
        // 表示外层 and 内层 or
        const res = termObj.termArr.findIndex((andTerm) => {
          const index = andTerm.findIndex((orTerm) => {
            const tab = (data && Object.prototype.hasOwnProperty.call(data, orTerm.comp.compId)
              ? { form: data }
              : this.findForm(orTerm.comp)) || { form: {} };
            // 如果未找到该表单值，直接不通过
            // if (!tab && !orTerm.comp.isFormula) {
            //   return false;
            // }

            let orTermRes = false;
            const { compId } = orTerm.comp;
            // 1 代表固定值 2 代表公式
            let beforeValue =
              orTerm.comp.isFormula === 2
                ? `${this.resolveFormula(true, orTerm.comp.name, data)}`
                : this.getFormValue(tab.form[compId]);
            const content = this.resolveFormula(orTerm.valueType === 2, orTerm.content, data);
            switch (orTerm.lambda) {
              case '=':
                orTermRes = beforeValue === `${content}`;
                break;
              case '!=':
                orTermRes = beforeValue !== `${content}`;
                break;
              case '>=':
                orTermRes = +beforeValue >= +content;
                break;
              case '<=':
                orTermRes = +beforeValue <= +content;
                break;
              case '>':
                orTermRes = +beforeValue > +content;
                break;
              case '<':
                orTermRes = +beforeValue < +content;
                break;
              case 'in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexIn = beforeValue.findIndex((v) => {
                  if (!contentArr.includes(v)) {
                    return true;
                  }
                  return false;
                });
                orTermRes = indexIn === -1;
                break;
              }
              case 'not in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexNotIn = contentArr.findIndex((v) => {
                  if (beforeValue.includes(v)) {
                    return true;
                  }
                  return false;
                });
                orTermRes = indexNotIn === -1;
                break;
              }
              default:
                break;
            }
            // 为true 则这一组or条件都为true，跳出
            if (orTermRes) {
              return true;
            }
            return false;
          });
          if (index === -1) {
            return true;
          }
          return false;
        });
        // 没值，说明and没有找到错误
        if (res === -1) {
          return true;
        }
        return false;
      }

      if (termObj.termType === 2) {
        // 表示外层 or 内层 and
        const res = termObj.termArr.findIndex((orTerm) => {
          const index = orTerm.findIndex((andTerm) => {
            const { comp } = andTerm;
            const { compId } = comp;
            const tab = (data && Object.prototype.hasOwnProperty.call(data, compId)
              ? { form: data }
              : this.findForm(comp)) || { form: {} };
            let andTermRes = false;

            // 1 代表固定值 2 代表公式
            let beforeValue =
              comp.isFormula === 2
                ? `${this.resolveFormula(true, comp.name, data)}`
                : this.getFormValue(tab.form[compId]);
            const content = this.resolveFormula(andTerm.valueType === 2, andTerm.content, data);
            switch (andTerm.lambda) {
              case '=':
                andTermRes = beforeValue === `${content}`;
                break;
              case '!=':
                andTermRes = beforeValue !== `${content}`;
                break;
              case '>=':
                andTermRes = +beforeValue >= +content;
                break;
              case '<=':
                andTermRes = +beforeValue <= +content;
                break;
              case '>':
                andTermRes = +beforeValue > +content;
                break;
              case '<':
                andTermRes = +beforeValue < +content;
                break;
              case 'in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexIn = beforeValue.findIndex((v) => {
                  if (!contentArr.includes(v)) {
                    return true;
                  }
                  return false;
                });
                andTermRes = indexIn === -1;
                break;
              }
              case 'not in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexNotIn = contentArr.findIndex((v) => {
                  if (beforeValue.includes(v)) {
                    return true;
                  }
                  return false;
                });
                andTermRes = indexNotIn === -1;
                break;
              }
              default:
                break;
            }
            // 为false 则这一组and条件都为false，跳出
            if (!andTermRes) {
              return true;
            }

            return false;
          });
          if (index === -1) {
            return true;
          }
          return false;
        });
        // 有值，说明or至少有一个条件正确
        if (res !== -1) {
          return true;
        }
        return false;
      }
    },
    resolveFormula(flag, formulaStr, data) {
      if (!flag) {
        // false 代表不是公式是固定值
        return formulaStr;
      }
      // 暂存组件
      getAllPaneBack = this.getAllPane;
      let formulaRes = formulaStr
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      // 数据选择框的替换
      formulaRes = formulaRes.replace(
        /GET_SELDATA\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){1,4}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      // 批量新增数据替换
      formulaRes = formulaRes.replace(
        /BULK_ADD\(\$([A-Za-z0-9]{6})\$(,\$([A-Za-z0-9]{6})\$){0,}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      formulaRes = formulaRes.replace(
        /BULK_ONE_ADD\(\$([A-Za-z0-9]{6})\$(,\$([A-Za-z0-9]{6})\$){0,}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      // 获取数据选择框显示值，不是数据选择框返回空
      formulaRes = formulaRes.replace(/GET_SHOW_VALUE\(\$([A-Za-z0-9]{6})\$\)/g, (v) => {
        const str = v.replace(/\$/g, "'");
        return str;
      });
      // 获取表格选中列的该值
      formulaRes = formulaRes.replace(/GET_TABLE_VALUE\(\$([A-Za-z0-9]{6})\$\)(|,1|,2)/g, (v) => {
        const str = v.replace(/\$/g, "'");
        return str;
      });
      // 更改值
      formulaRes = formulaRes.replace(
        /CREATE_UNIQUE\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){0,1}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );

      formulaRes = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );

      let str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
        const form =
          data && Object.prototype.hasOwnProperty.call(data, v1)
            ? { form: data }
            : this.findForm({
              compId: v1
            });
        if (form && form.form[v1]) {
          const res = form.form[v1];
          return Number.isNaN(+res) ? `'${res}'` : res;
        }
        return '""';
      });
      let res = parser.parse(str);
      if (res.error) {
        str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // 最终错误把字符串返回
      if (res.error) {
        return `${str}`;
      }
      return res.result;
    },
    // 找到组件对应的tab的form
    findForm(comp = {}, orTerm) {
      const { formObj } = this.getAllPane;
      const formId = Object.keys(formObj).find((key) => {
        if (Object.prototype.hasOwnProperty.call(formObj[key].form, comp.compId)) {
          return true;
        }
        return false;
      });
      return formObj[formId];
    },
    // 获取值，当获取的值为数组时，转为，隔开的字符串
    getFormValue(value) {
      if (Array.isArray(value)) {
        return value.join();
      }
      return `${value}`;
    },
    // 处理值去设置
    resolveRes(v) {
      if (v) {
        const arr = v.split(',');
        arr.forEach((item, index) => {
          arr[index] = +item;
        });
        return arr;
      }
      return [];
    },
    // 触发条件满足情况
    handleEffective(term) {
      if (!term) return true;
      const termObj = JSON.parse(term);
      const { termType } = termObj;
      // 表示外层 and 内层 or
      if (termType === 1) {
        const res = -1;
        if (res === -1) {
          return true;
        }
        return false;
      }
    },
    // 表单请求成功后回调初始化
    async handleTrgger({ triggerType, elementList, pageType, funId }) {
      const { triggerMap } = this.configDataArr;
      if (triggerMap) {
        // 处理值变化，值变化如果包含初始化时，在初始化就要执行
        const change = triggerMap[2] || {};
        const obj = {};
        Object.keys(change).forEach((item) => {
          const trigger = change[item];
          Object.keys(trigger).forEach((i) => {
            const arry = trigger[i];
            if (arry[0].triggerContainStart === 1) {
              obj[item] = {};
              obj[item][i] = arry;
            }
          });
        });
        triggerMap[1] = triggerMap[1] ? { ...triggerMap[1], ...obj } : obj;
        if (triggerType === 1 && JSON.stringify(triggerMap[1]) !== '{}') {
          await this.initStart(triggerMap[triggerType]);
        } else this.setProcessConfig();
        // 初始化后，再处理值变化。兼容刷新当前功能块逻辑，防止重复创建监听
        if (pageType !== 'reloadData' && triggerMap[2]) {
          this.createWatchMap(triggerMap[2], elementList);
        }
        // 初始化后，需要修改reloadArea中状态，用于记录每个功能块的加载状态
        this.changAreaLoadStatue(funId, true);
      } else this.setProcessConfig();
    },
    changAreaLoadStatue(funId, status) {
      this.areaLoadStatue[funId] = status;
    },
    // 表单触发器-初始化
    initStart(data) {
      // 获取动作为初始化下面的触发组件
      Object.keys(data).forEach(async (key) => {
        this.resolveLink(data, key);
      });
    },
    // 获取数据选择框*的具体字段
    getSelDataColumn(compId) {
      const { triggerMap } = this.configDataArr;
      const obj = triggerMap[2] && triggerMap[2][compId];
      const columnArr = ['id'];
      console.log(this.configDataArr, compId);
      if (obj) {
        const keys = Object.keys(obj);
        keys.forEach((linkCode) => {
          const linkArr = obj[linkCode];
          linkArr.forEach((linkObj) => {
            if (linkObj.affectingComponents) {
              const affectArr = JSON.parse(linkObj.affectingComponents);
              affectArr.forEach((affectObj) => {
                if (affectObj.affectType === 4) {
                  const reg = /\[GET_SELDATA\]\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){1,4}\)/g;
                  const reg1 = /'(.*)'/g;
                  const resArr = affectObj.normalValue.match(reg);
                  resArr.forEach((res) => {
                    const strArr = res.match(reg1);
                    if (strArr.length) {
                      const str = strArr[0].slice(1, -1);
                      columnArr.push(str);
                      console.log(columnArr);
                    }
                  });
                }
              });
            }
          });
        });
      }
      return [...new Set(columnArr)].join(',');
    },
    // 触发器-值变化
    createWatchMap(data, elementList) {
      // 获取动作为初始化下面的触发组件
      const keys = Object.keys(data).filter(
        (key) => elementList.findIndex((el) => el.compId === key) !== -1
      );
      keys.forEach((key) => {
        const form = this.findForm({ compId: key });
        if (form) {
          const unWatch = this.$watch(`getAllPane.formObj.${form.compId}.form.${key}`, () => {
            if (!this.notValueChange) {
              // eslint-disable-next-line no-const-assign
              getAllPaneBack = this.getAllPane;
              this.resolveLink(data, key);
            }
          });
          this.watchArr.push(unWatch);
        }
      });
    },
    // 触发-点击
    async clickTrigger(btn, onlyFlag, form, formId) {
      if (
        this.btnClickTriggerMap &&
        this.btnClickTriggerMap[btn.compId] &&
        this.onlyFlag === onlyFlag
      ) {
        // 如果是卡片区的按钮
        if (btn.isCardBtn) this.getAllPane.formObj[formId].form = form;
        await this.resolveLink(this.btnClickTriggerMap, btn.compId);
      }
    },

    // 初始化自定的方法
    initFunc() {
      parser.setFunction('GET_VAR', (params) => {
        if (params.length === 0) {
          return '';
        }
        return params[0];
      });
      // 数据选择框选择数据公式，只在影响控件里面有
      parser.setFunction('GET_SELDATA', (params) => {
        // 公式函数内部包裹必须定义外部变量，不然引用有问题
        if (!getAllPaneBack) {
          return '';
        }

        const comp = getAllPaneBack.compObj[params[0]];
        if (comp && comp.selData) {
          if (comp.compType === 6 || comp.compType === 7) {
            if (params.length === 4 || params.length === 5) {
              // 0 组件id 1 真实值 2 表名 3 显示值 4 关联字段
              const ids = [];
              comp.selData.forEach((data) => {
                // 第一项是值
                if (data[params[1]]) {
                  ids.push(data[params[1]]);
                }
              });
              if (ids.length) {
                const relateColumn = params[4] ? params[4] : 'id';
                const p = {
                  value: ids.join(','),
                  selectContent: params[3],
                  selectFrom: params[2],
                  selectWhere: `${params[2]}.${relateColumn} in (${ids.join(',')})`
                };
                return p;
              }
              return '';
            }
            const vArr = [];
            comp.selData.forEach((data) => {
              // 第一项是值
              if (data[params[1]]) {
                vArr.push(data[params[1]]);
              }
            });
            return vArr.join();
          }
        }
        return {
          error: 'error'
        };
      });

      parser.setFunction('BULK_ADD', (params) => {
        const arr = [];
        params.forEach((compId) => {
          const comp = getAllPaneBack.compObj[compId];
          if (comp) {
            arr.push(compId);
          }
        });
        arr.type = 1;
        return arr;
      });
      parser.setFunction('BULK_ONE_ADD', (params) => {
        const arr = [];
        params.forEach((compId) => {
          const comp = getAllPaneBack.compObj[compId];
          // if (comp && comp.compType === 7) {
          if (comp) {
            arr.push(compId);
          }
        });
        arr.type = 2;
        return arr;
      });
      parser.setFunction('GET_SHOW_VALUE', (params) => {
        const keys = Object.keys(getAllPaneBack.formObj);
        let obj = {};
        keys.forEach((key) => {
          obj = Object.assign(obj, getAllPaneBack.formObj[key].form);
        });
        Object.keys(obj).forEach((key) => {
          if (Array.isArray(obj[key])) {
            obj[key] = obj[key].join();
          }
        });
        return obj[`${params[0]}_`];
      });
      // GET_TABLE_VALUE
      parser.setFunction('GET_TABLE_VALUE', (params) => {
        const { formObj } = getAllPaneBack;
        const formId = Object.keys(formObj).find((key) => {
          if (Object.prototype.hasOwnProperty.call(formObj[key].form, params[0])) {
            return true;
          }
          return false;
        });
        let multiArr = [];
        this.$bus.$emit('getSelMultiArr', this.onlyFlag, formObj[formId].parentCompId, (arr) => {
          multiArr = arr;
        });
        if (multiArr.length) {
          const obj = multiArr[0];
          let flag = false;
          if (params.length === 2) {
            flag = params[1] === 2;
          }
          // 取显示值
          if (flag) {
            return obj[`${params[0]}_`];
          }
          return obj[`${params[0]}`];
        }
        return '';
      });

      parser.setFunction('GET_TIME_GAP', (params) => {
        const start = new Date(
          params[0].replace ? params[0].replace(/-/g, '/') : params[0]
        ).getTime();
        const end = new Date(
          params[1].replace ? params[1].replace(/-/g, '/') : params[1]
        ).getTime();
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          const dis = (end - start) / 1000; // 间隔为秒
          let res = 0;
          if (
            params[2] &&
            ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].includes(params[2])
          ) {
            switch (params[2]) {
              case 'seconds':
                res = dis;
                break;
              case 'minutes':
                res = dis / 60;
                break;
              case 'hours':
                res = dis / 60 / 60;
                break;
              case 'days':
                res = dis / 60 / 60 / 24;
                break;
              case 'weeks':
                res = dis / 60 / 60 / 24 / 7;
                break;
              case 'months':
                res = dis / 60 / 60 / 24 / 30;
                break;
              case 'years':
                res = dis / 60 / 60 / 24 / 365;
                break;
              default:
                res = dis / 60 / 60 / 24;
            }
          } else {
            res = dis / (1 * 24 * 3600);
          }
          return res.toFixed(1);
        }
        return '';
      });

      const resolveTime = (Y, M, D, h, m, s) => {
        if (M > 12) {
          Y += 1;
          M -= 12;
        }
        if (M <= 0) {
          Y -= 1;
          M += 12;
        }
        const maxDay = new Date(Y, parseInt(M, 10), 0).getDate();
        if (D > maxDay) {
          D = maxDay;
        }
        return new Date(`${Y}/${M}/${D} ${h}:${m}:${s}`).getTime();
      };
      parser.setFunction('GET_TIME_RES', (params) => {
        // 第一个参数代表类型 1是 相加 2是相减
        // 第二个参数代表起始时间
        // 第三个参数代表天数
        // 第4个参数代表间隔类型 1 是天 2 是周 3 是月 4 是年
        // 返回结果日期
        const start = new Date(params[1].replace ? params[1].replace(/-/g, '/') : params[1]);
        const curTime = start.getTime();
        const year = start.getFullYear();
        const month = start.getMonth() + 1; // 0-11表示1-12月
        const day = start.getDate();
        const hour = start.getHours();
        const min = start.getMinutes();
        const second = start.getSeconds();
        const dis = params[2];
        let res;
        if (+params[0] === 1) {
          if (params[3] && +params[3] !== 1) {
            if (+params[3] === 2) {
              res = curTime + dis * 7 * 24 * 3600 * 1000;
            }
            if (+params[3] === 3) {
              const resM = +month + +dis;
              res = resolveTime(year, resM, day, hour, min, second);
            }
            if (+params[3] === 4) {
              const resY = +year + +dis;
              res = resolveTime(resY, month, day, hour, min, second);
            }
          } else {
            res = curTime + dis * 24 * 3600 * 1000;
          }
        } else if (params[3] && +params[3] !== 1) {
          if (+params[3] === 2) {
            res = curTime - dis * 7 * 24 * 3600 * 1000;
          }
          if (+params[3] === 3) {
            const resM = +month - +dis;
            res = resolveTime(year, resM, day, hour, min, second);
          }
          if (+params[3] === 4) {
            const resY = +year - +dis;
            res = resolveTime(resY, month, day, hour, min, second);
          }
        } else {
          res = curTime - dis * 24 * 3600 * 1000;
        }
        return formatDate(new Date(res), 'YYYY-MM-dd hh:mm:ss');
      });

      // 生成唯一标识
      parser.setFunction('CREATE_UNIQUE', (params) => {
        const obj = {};
        [obj.compId] = params;
        obj.value = this.$apiot.guid();
        if (params[1]) {
          [, obj.value] = params;
        }
        obj.type = 3;
        return obj;
      });

      parser.setFunction('GET_TABLE_IDS', (params) => {
        if (params.length !== 0) {
          return new Error('获取表格id集合公式无参数');
        }
        return sessionStorage.__current__mulArr__id || '';
      });

      parser.setFunction('GET_USER_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户公式无参数');
        }
        return this.$store.state.userCenter.userInfo.id;
      });
      parser.setFunction('GET_ORG_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.orgId;
      });
      parser.setFunction('GET_ROLES_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.roleIds;
      });
      parser.setFunction('GET_DATE', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return this.$apiot.dateFormat(new Date(), 'yyyy-MM-dd');
      });
      parser.setFunction('GET_DATETIME', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return this.$apiot.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
      });
      parser.setFunction('GET_YEAR', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getFullYear();
      });
      parser.setFunction('GET_MONTH', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getMonth();
      });
      parser.setFunction('GET_WEEK', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDay();
      });
      parser.setFunction('GET_DAY', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDate();
      });
      parser.setFunction('GET_TIMESTAMP', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getTime();
      });
      parser.setFunction('GET_MENU_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单id公式无参数');
        }
        return this.htmlConfig.id;
      });
      // app特有
      parser.setFunction('GET_SCAN_VALUE', (params) => {
        if (params.length !== 0) {
          return new Error('获取扫描结果无参数');
        }
        return this.$store.state.menu.SCAN_VALUE;
      });
      // GET_TEXT
      parser.setFunction('GET_TEXT', (params) => {
        const keys = Object.keys(getAllPaneBack.formObj);
        let obj = {};
        keys.forEach((key) => {
          obj = Object.assign(obj, getAllPaneBack.formObj[key].form);
        });
        if (getAllPaneBack.backData) {
          obj = Object.assign(obj, getAllPaneBack.backData);
        }
        Object.keys(obj).forEach((key) => {
          if (Array.isArray(obj[key])) {
            obj[key] = obj[key].join();
          }
        });
        return obj[`${params[0]}`];
      });
      parser.setFunction('SUB_STRING', (params) => {
        let str = '';
        params.forEach((s) => {
          str += s;
        });
        return str;
      });
    },
    // 强制刷新整个界面
    forceUpdate(refreshType) {
      const { formConfig = [], listConfig = [] } = this.$refs;
      formConfig.forEach((el) => {
        if (el.reloadData) el.reloadData(refreshType);
      });
      listConfig.forEach((el) => {
        if (el.reloadData) el.reloadData(refreshType);
      });
    },
    // 记录目前正处于批量操作的功能区
    setBatchArea(compId, type) {
      const { currentBatchAreaCompId } = this.htmlConfig;
      const { funcCheckObj } = this;
      const checkList = funcCheckObj[currentBatchAreaCompId] || [];
      if (type === 'cancel' && checkList.length !== 0) {
        const thisVM = this.$refs.listConfig.find(
          (item) => item.funcConfig && item.funcConfig.compId === currentBatchAreaCompId
        );
        thisVM.resetCheck();
      }
      this.htmlConfig.currentBatchAreaCompId = compId;
    },
    checkedAll(isChecked) {
      const { currentBatchAreaCompId } = this.htmlConfig;
      const thisVM = this.$refs.listConfig.find(
        (item) => item.funcConfig && item.funcConfig.compId === currentBatchAreaCompId
      );
      thisVM.checkedAll(isChecked);
    }
  },

  created() {
    this.initFunc();
    this.onlyFlag = this._uid;
    this.htmlConfig = { ...this.menuConfig };
  },

  beforeDestroy() {
    if (!this.htmlConfig.isPanel) this.$store.commit('setMenuFlag', '');
    // 销毁时，只有最外部的菜单才会将按钮触发器监听去除
    // if (!this.htmlConfig.isPanel && this.htmlConfig.isJump !== '2') this.$bus.$off('btnTrigger');

    // 取消值变化的监听
    this.watchArr.forEach((unWatch) => {
      if (unWatch) {
        unWatch();
      }
    });
    this.watchArr = [];
  }
};
</script>

<style lang='scss' scoped>
.popBox__selectMsg {
  padding: 0 30rpx;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  @include fontBlob(500);
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  background: #fff;
}
.menuConfig {
  &__checkedList {
    position: relative;
  }
  &__tab {
    display: flex;
    flex-direction: column;

    &--c {
      flex: 1;
    }
    &--btns {
      flex-shrink: 0;
    }
  }
}
::v-deep {
  .columnForm .element {
    padding: 0 !important;
  }
}
</style>
