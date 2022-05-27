<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 菜单
-->
<template>
  <view class="menuConfig" :style="{ height: `${menuHeight}px` }">
    <!-- tab区 -->
    <u-sticky
      :customNavHeight="customBar"
      :disabled="htmlConfig.isSelectDataBox"
    >
      <div :class="[`compute--area-${onlyFlag}`]">
        <apiot-tabs
          v-if="htmlConfig.showTab"
          class="menuConfig__tabs"
          :list="canShowTablist"
          :is-scroll="false"
          :current="current"
          @change="tabsChange"
        ></apiot-tabs>
        <section class="popBox__selectMsg" v-if="htmlConfig.isSelectDataBox">
          <span>{{ popTitle }}</span>
          <span v-if="htmlConfig.multiple"
            >已选择({{ getCheckList.length }})</span
          >
        </section>
      </div>
    </u-sticky>
    <!-- 实际界面区 -->
    <tab-page v-if="getFuncAreas.length > 0">
      <template v-for="area in getFuncAreas">
        <div
          class="menuConfig__tab"
          :key="area.compId"
          v-if="area.compName !== 'BtnsArea'"
        >
          <div
            class="menuConfig__tab--c"
            :class="
              getComputedFuncArea.indexOf(area.compId) !== -1
                ? `compute--area-${onlyFlag}`
                : ''
            "
          >
            <config-form
              v-if="area.compName === 'MenuMain'"
              ref="formConfig"
              :tabId="getCurrentTab.compId"
              :title="getCurrentTab.name"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              @handleTrgger="handleTrgger"
            ></config-form>

            <config-list
              v-else-if="area.compName === 'CardMain'"
              ref="listConfig"
              :tabId="getCurrentTab.compId"
              :checkFlagId="checkFlagId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @setBatchArea="setBatchArea"
              @switchType="switchShowType"
            ></config-list>

            <config-tree
              v-else-if="area.compName === 'TreeMain'"
              ref="treeConfig"
              :tabId="getCurrentTab.compId"
              :checkFlagId="checkFlagId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @switchType="switchShowType"
            ></config-tree>

            <tree-device-pos
              v-else-if="area.compName === 'DevicePosTree'"
              ref="DevicePosTree"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @switchType="switchShowType"
            ></tree-device-pos>
          </div>
        </div>
      </template>
      <view
        v-if="getCurrentTab.showTabBtn"
        class="menuConfig__tab--btns"
        :class="[`compute--area-${onlyFlag}`]"
      >
        <config-btns
          :tabProp="canShowTablist[current]"
          :tabId="getCurrentTab.compId"
          :htmlConfig="htmlConfig"
          :featureArr="getFuncAreas.slice(1)"
          :isTabBtn="true"
          @setBatchArea="setBatchArea"
          @checkedAllClick="checkedAll"
        ></config-btns>
      </view>
    </tab-page>
  </view>
</template>

<script>
import { getDesignMenu, operationTriggers, selectList } from '@/api/menuConfig.js';
import TabPage from '../TabPage';
import ConfigList from '../ConfigList';
import ConfigForm from '../ConfigForm';
import configTree from '../ConfigTree';
import ConfigBtns from '../ConfigBtns';
import TreeDevicePos from '../TreeDevicePos';
import ApiotTabs from '@/globalComponents/ApiotTabs';

import parser from '@/utils/formula';

let getAllPaneBack = null;

export default {
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
    menuHeight: Number,
    popTitle: {
      type: String,
      default: '添加'
    },
    // 用于匹配列表、树是否选中的字段，业务字段没有
    checkFlagId: {
      type: String,
      default: 'id'
    }
  },

  components: { ApiotTabs, TabPage, ConfigList, ConfigForm, configTree, ConfigBtns, TreeDevicePos },

  data() {
    return {
      // 菜单界面基础配置
      htmlConfig: null,
      sysMenuDesignId: '', // 用户设计组
      menuPaneObj: {}, // 菜单弹出面板
      menuJumpObj: {}, // 跳转菜单

      current: -1, // tabs组件的current值，表示当前活动的tab选项
      triggerMap: {},
      configData: null,
      configDataArr: {},
      notValueChange: false, // 不进行值变化
      btnClickTriggerMap: null,
      onlyFlag: null, // 唯一标识
      listHeight: 0,
      watchArr: [],
      // 不同控件对应的权限项
      permission: {
        1: 63, // 保存
        2: 4, // 删除
        3: 2, // 新增
        4: 3, // 编辑
        7: 5, // 导入
        8: 6, // 导出
        9: 4 // 批量删除和删除一样的权限
      },
      // 记录每个功能块加载的状态
      areaLoadStatue: {},
      // 需要显示的tab页
      canShowTablist: [],
      // 当前展示类型 1=列表；2=树;只有数据选择弹出框时有用
      showType: 1
    };
  },

  provide() {
    return {
      munuOnlyFlag: this.getMenuOnlyFlag,
      sysMenuDesignId: this.getSysMenuDesignId,
      getPanel: this.getMenuPaneObj,
      getJumpMenu: this.getJumpMenu,
      getAllForm: this.getAllForm,
      getTriggers: this.getTriggers,
      getMenuPane: this.getMenuPane,
      changeNotValueChange: this.changeNotValueChange,
      onlyFlag: this.getFlag,
      getMenuFlag: this.getMenuFlag,
      selectDataConfig: this.getSelectDataConfig,
      funcCheckObj: this.getFuncCheckObj, // 获取每个功能块选中的数据
      getLoadStatue: this.getAreaLoadStatue, // 获取每个功能块加载的状态
      resolveTerm: this.resolveTerm,
      resolveFormula: this.resolveFormula,
      initCardStart: this.initCardStart
    };
  },

  computed: {
    funcCheckObj() {
      if (!this.configData) return {};
      return this.configData.checkList || {};
    },
    getCheckList() {
      const { funcCheckObj } = this;
      let checkList = [];
      Object.keys(funcCheckObj).forEach((key) => {
        checkList = checkList.concat(funcCheckObj[key]);
      });
      return checkList;
    },
    getAllPane() {
      const obj = {
        formObj: {},
        tabObj: {},
        compObj: {},
        funcObj: {}
      };
      const { getMenuPer, permission } = this;
      if (this.configData && this.configData.children.length) {
        // app 只有一个大区域
        this.configData.children.forEach((bigArea) => {
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj.tabObj[tab.compId] = tab;
              obj.tabObj[tab.compId].compType = 'TAB';
              if (tab.children.length) {
                obj.funcObj[tab.compId] = [];
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    // tab区按钮
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        if (getMenuPer) {
                          // 菜单权限
                          const { buttonType } = comp;
                          const preObj = getMenuPer.find(
                            (per) => per.permissionItemId === permission[buttonType]
                          );
                          // check 1=有权限
                          if (preObj && preObj.check !== '1') comp.canShow = false;
                          obj.compObj[comp.compId] = comp;
                        } else obj.compObj[comp.compId] = comp;
                      });
                    }
                  } else if (area.children.length) {
                    obj.funcObj[tab.compId].push(area);
                    area.children.forEach((smallArea) => {
                      if (smallArea.areaType === 1) {
                        // 代表功能区
                        obj.formObj[smallArea.compId] = smallArea;
                      }
                      if (smallArea.children) {
                        smallArea.children.forEach((comp) => {
                          if (smallArea.areaType === 2 && getMenuPer) {
                            // 功能区按钮
                            const { buttonType } = comp;
                            const preObj = getMenuPer.find(
                              (per) => per.permissionItemId === permission[buttonType]
                            );
                            // check 1=有权限
                            if (preObj && preObj.check !== '1') comp.canShow = false;
                            obj.compObj[comp.compId] = comp;
                          } else obj.compObj[comp.compId] = comp;

                          if (comp.children) {
                            comp.children.forEach((btn) => {
                              if (comp.compName === 'BtnsArea') {
                                btn.isCardBtn = true;
                              }
                              obj.compObj[btn.compId] = btn;
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
      return obj;
    },
    // 获取所有tab
    getTabs() {
      const tabs = [];
      Object.keys(this.getAllPane.tabObj).forEach((key) => {
        tabs.push(this.getAllPane.tabObj[key]);
      });
      return tabs;
    },
    // 获取需要显示的tab
    getCurrentTab() {
      if (this.current === -1) return {};
      const tab = this.canShowTablist[this.current];
      if (!tab) return {};
      const { compId, name, showTabBtn, children: funcAreas } = tab;
      const computedFuncArea = [];
      let canComputed = true;
      funcAreas.forEach((area) => {
        if (area.compName === 'CardMain') canComputed = false;
        if (canComputed) computedFuncArea.push(area.compId);
      });
      return {
        computedFuncArea,
        funcAreas,
        compId,
        name,
        showTabBtn
      };
    },
    getComputedFuncArea() {
      return this.getCurrentTab.computedFuncArea || [];
    },
    getFuncAreas() {
      return this.getCurrentTab.funcAreas || [];
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
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      if (this.htmlConfig.isSelectDataBox) height = 15;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  watch: {
    'getAllPane.tabObj': function (newV) {
      // 需要隐藏的tab
      const hiddenTabsArr = [];
      const { hiddenRules = [] } = this.htmlConfig;
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
        if (!result.includes(key)) tabs.push(newV[key]);
      });
      this.canShowTablist = [...tabs];
    }
  },

  methods: {
    // 树和列表切换
    switchShowType(type) {
      this.showType = type;
      this.changeAreaType(this.configData);
    },

    // 获取每个功能块加载的状态
    getAreaLoadStatue() {
      return this.areaLoadStatue;
    },
    // 获取每个功能块选中的数据
    getFuncCheckObj() {
      return this.funcCheckObj;
    },
    // 获取数据选择信息,只有可以编辑时才会生效
    getSelectDataConfig() {
      let { multiple } = this.htmlConfig;
      // 如果不是选择框，则默认多选
      if (!this.htmlConfig.isSelectDataBox) multiple = true;
      return {
        multiple,
        alreadyCheckList: this.value
      };
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
    // 获取菜单基本信息
    getMenuPane() {
      return this.getAllPane;
    },
    // 获取菜单唯一标识
    getMenuOnlyFlag() {
      return this.$store.state.menu.currentOnlyFlag;
    },
    // 获取触发器
    getTriggers() {
      return this.triggerMap;
    },
    // 获取表单数据池
    getAllForm() {
      return this.getCompMap();
    },
    // 获取用户设计组
    getSysMenuDesignId() {
      return this.sysMenuDesignId;
    },
    // 获取跳转菜单
    getJumpMenu() {
      return this.menuJumpObj;
    },
    // 获取面板
    getMenuPaneObj() {
      return this.menuPaneObj;
    },
    // tabs通知swiper切换
    tabsChange(index) {
      this.current = index;
    },
    // 获取跳转面板详细
    async getPanelConfig(paneObj) {
      const list = Object.keys(paneObj);
      const obj = {};
      const panelArry = [];
      for (let i = 0, len = list.length; i < len; i += 1) {
        const key = list[i];
        const paneconfig = paneObj[key];
        // 如果没有id，默认页不请求接口
        if (paneconfig.id && !(paneconfig.id in obj)) {
          // 如果该面板已经请求过了，将不再请求
          if (paneconfig.id in obj) return;

          panelArry.push(paneconfig.id);

          // const params = { panelId: paneconfig.id };
          obj[paneconfig.id] = ''; // 用于记录该面板是否已经请求
        }
      }
      console.log('panelArry=====');
      if (panelArry.length > 0) {
        const result = await getDesignMenu({
          panelId: panelArry.join(',')
        });
        result.forEach((panel) => {
          console.log(panel);
          this.$store.commit('setMenuPanelConfig', { panelId: panel.panelId, config: panel });
        });
      }
    },
    // 获取界面配置信息
    async getMenuConfig() {
      try {
        const { htmlConfig } = this;
        const params = {};
        if (htmlConfig.isPanel) params.panelId = htmlConfig.id;
        else params.sysMenuId = htmlConfig.id;
        let panelConfig = null;
        if (htmlConfig.isPanel) {
          panelConfig = JSON.stringify(this.$store.state.menu.panelConfig[params.panelId]);
        } else {
          const data = await getDesignMenu(params);
          panelConfig = JSON.stringify(data[0]);
        }
        const result = JSON.parse(panelConfig);

        this.configDataArr = result;
        this.initPage();
        const htmlParams = {
          currentBatchAreaCompId: ''
        }; // 页面配置1
        const { designOverallLayout, triggerMap } = result;

        const { children, paneObj, menuObj, selShowType } = designOverallLayout[0];

        this.getPanelConfig(paneObj);
        // app配置只有全屏配置，所以默认只有1块区域
        const menuProp = children[0];
        const { showTab, hiddenRules } = menuProp;
        htmlParams.showTab = showTab;
        htmlParams.hiddenRules = hiddenRules;
        htmlParams.selShowType = selShowType;
        this.triggerMap = triggerMap;
        this.menuPaneObj = paneObj;
        this.menuJumpObj = menuObj;
        this.htmlConfig = { ...this.htmlConfig, ...htmlParams };
        this.current = 0;
      } catch (error) {
        console.error(error);
      }
    },
    // 处理所有值给后端
    getCompMap() {
      const { currentBatchAreaCompId } = this.htmlConfig;
      // const { funcCheckObj } = this;
      // const checkList = funcCheckObj[currentBatchAreaCompId] || [];
      let obj = {};
      const keys = Object.keys(this.getAllPane.formObj);
      keys.forEach((key) => {
        const { funcCheckObj } = this;
        const checkList = funcCheckObj[currentBatchAreaCompId] || [];
        if (currentBatchAreaCompId && checkList.length !== 0) {
          // 为了兼容批量处理情况
          const areaKeys = Object.keys(this.getAllPane.funcObj);
          const compId = areaKeys.find(
            (A) => this.getAllPane.funcObj[A][0].compId === currentBatchAreaCompId
          );
          const area = this.getAllPane.funcObj[compId][0];
          const func = area.areaType === 2 ? area.children[0] : area.children[1];
          func.children.forEach((comp) => {
            const arry = [];
            checkList.forEach((V) => {
              arry.push(V[comp.compId]);
            });
            obj[comp.compId] = arry.join();
          });
        } else obj = Object.assign(obj, this.getAllPane.formObj[key].form);
      });

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].join();
        }
      });
      return obj;
    },
    async resolveOtherApi(linkcode, actionArr) {
      const params = {
        triggerMap: {}
      };
      params.triggerMap[linkcode] = actionArr;
      params.compMap = this.getCompMap();
      const data = await operationTriggers(JSON.stringify(params));
      const lastAction = actionArr[actionArr.length - 1];
      if (lastAction.returnValue) {
        const returnValue = JSON.parse(lastAction.returnValue.replace(/\\/g, ''));
        const triggerId = lastAction.id;
        const lastData = data[triggerId].data;
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
    resolveLink(data, key) {
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
    // 处理前端触发器
    resolveAfffetComp(action) {
      const { effectiveConditions } = action;
      // 条件是否满足
      const termRes = this.resolveTerm(effectiveConditions);
      console.log('前端触发器');
      console.log(termRes);
      if (termRes) {
        const affectingComponents = JSON.parse(action.affectingComponents.replace(/\\/g, ''));
        affectingComponents.forEach((item) => {
          const comp = this.getAllPane.compObj[item.comp.compId];
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
              case 3:
                // 固定值
                tab = this.findForm(comp);
                if (tab) {
                  let v = item.normalValue;
                  if (comp.compType === 2) {
                    // dropDownType 1=单选；2=多选
                    if (comp.dropDownType === 1) {
                      v = +v;
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    v = +v;
                  }
                  if ([4].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }
                  tab.form[comp.compId] = v;
                }
                break;
              case 4:
                // 公式
                tab = this.findForm(comp);
                if (tab) {
                  let v = this.resolveFormula(true, item.normalValue);
                  if (typeof v === 'object' && v.error) {
                    return;
                  }
                  let tempV = null;
                  if (typeof v !== 'string' || v.showValue) {
                    tempV = v;
                    v = v.value;
                  }
                  if (comp.compType === 2) {
                    if (comp.dropDownType === 1) {
                      v = +v;
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    v = +v;
                  }
                  if ([4].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }

                  if ([6, 7, 15].includes(comp.compType)) {
                    if (tempV || tempV.value === '') {
                      tab.form[comp.compId] = '';
                      tab.form[`${comp.compId}_`] = '';
                      if (typeof tempV === 'object') {
                        this.$nextTick(async () => {
                          tab.form[`${comp.compId}_`] = tempV.showValue;
                          tab.form[comp.compId] = tempV.value;
                        });
                      } else {
                        tab.form[comp.compId] = `${tempV}`;
                      }
                    }
                  } else if (v || v === '') {
                    tab.form[comp.compId] = `${v}`;
                  }
                }
                break;
              default:
                break;
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
            const tab =
              data && Object.prototype.hasOwnProperty.call(data, orTerm.comp.compId)
                ? { form: data }
                : this.findForm(orTerm.comp);
            // 如果未找到该表单值，直接不通过
            if (!tab && !orTerm.comp.isFormula) {
              return false;
            }

            let orTermRes = false;
            const { compId } = orTerm.comp;
            // 1 代表固定值 2 代表公式
            let beforeValue = orTerm.comp.isFormula
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
                orTermRes = beforeValue >= content;
                break;
              case '<=':
                orTermRes = beforeValue <= content;
                break;
              case '>':
                orTermRes = beforeValue > content;
                break;
              case '<':
                orTermRes = beforeValue < content;
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
            const tab =
              data && Object.prototype.hasOwnProperty.call(data, orTerm.comp.compId)
                ? { form: data }
                : this.findForm(orTerm.comp);
            // 如果未找到该表单值，直接不通过
            if (!tab && !andTerm.comp.isFormula) {
              return false;
            }
            let andTermRes = false;
            const { compId } = andTerm.comp;
            // 1 代表固定值 2 代表公式
            let beforeValue = andTerm.comp.isFormula
              ? `${this.resolveFormula(true, andTerm.comp.name, data)}`
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
                andTermRes = beforeValue >= content;
                break;
              case '<=':
                andTermRes = beforeValue <= content;
                break;
              case '>':
                andTermRes = beforeValue > content;
                break;
              case '<':
                andTermRes = beforeValue < content;
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
    // 处理公式
    resolveFormula(flag, formulaStr, data) {
      if (!flag) {
        // false 代表不是公式是固定值
        return formulaStr;
      }
      console.log(`resolveFormula===${formulaStr}`);
      let formulaRes = formulaStr
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      // 数据选择框的替换
      formulaRes = formulaRes.replace(
        /GET_SELDATA\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){1,3}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      let str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
        const form =
          data && Object.prototype.hasOwnProperty.call(data, v1)
            ? { form: data }
            : this.findForm({
              compId: v1
            });
        if (form) {
          const res = form.form[v1];
          return Number.isNaN(+res) ? `'${res}'` : res;
        }
        return "''";
      });
      let res = parser.parse(str);
      if (res.error) {
        str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      return res.result;
    },
    // 找到组件对应的tab的form
    findForm(comp) {
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
    // 修改tab页中功能的展示类型
    changeAreaType(designOverallLayout) {
      const { selShowType } = designOverallLayout;
      if (selShowType === 3) {
        // 列表和树进行切换

        const [children] = designOverallLayout.children;
        const tab = children.children;
        const area = tab[0].children[1];

        const { showType } = this;
        if (showType === 2) {
          if (this.htmlConfig.id === 283) {
            area.compName = 'DevicePosTree';
            area.propertyCompName = 'DevicePosTreeConfig';
          } else {
            area.compName = 'TreeMain';
            area.propertyCompName = 'TreeMainConfig';
          }
        } else {
          area.compName = 'CardMain';
          area.propertyCompName = 'CardMainConfig';
        }
      }
      return designOverallLayout;
    },
    // 初始化菜单
    async initPage() {
      const configDataPage = this.configDataArr;
      if (configDataPage.designOverallLayout) {
        this.sysMenuDesignId = configDataPage.id;
        const [designOverallLayout] = configDataPage.designOverallLayout;
        this.configData = this.changeAreaType(designOverallLayout);
        // 获取字典值
        if (this.configData.dictArr.length) {
          await this.$store.dispatch('getCurrentDict', this.configData.dictArr.join());
        }
      }

      const { triggerMap } = this.configDataArr;
      this.triggerMap = triggerMap;
      if (triggerMap) {
        // 按钮点击触发变化
        if (triggerMap[3]) {
          /* eslint-disable prefer-destructuring  */
          this.btnClickTriggerMap = triggerMap[3];
        }
      }
    },
    // 表单请求成功后回调初始化
    async handleTrgger({ triggerType, elementList, pageType, funId }) {
      const { triggerMap } = this.configDataArr;
      if (triggerMap) {
        // 处理初始化
        if (triggerType === 1 && triggerMap[1]) {
          await this.initStart(triggerMap[triggerType]);
        }
        // 初始化后，再处理值变化。兼容刷新当前功能块逻辑，防止重复创建监听
        if (pageType !== 'reloadData' && triggerMap[2]) {
          this.createWatchMap(triggerMap[2], elementList);
        }
        // 初始化后，需要修改reloadArea中状态，用于记录每个功能块的加载状态
        this.changAreaLoadStatue(funId, true);
      }
    },
    changAreaLoadStatue(funId, status) {
      this.areaLoadStatue[funId] = status;
    },
    // 卡片触发器-初始化和值变化
    initCardStart(data, form, formId, elementsObj) {
      // 卡片初始化时，默认会走一步初始，和值变化
      this.getAllPane.formObj[formId].form = form;
      this.getAllPane.compObj = { ...this.getAllPane.compObj, ...elementsObj };

      Object.keys(data).forEach((key) => {
        this.resolveLink(data, key);
      });
      const { compObj, formObj } = this.getAllPane;
      const obj = {};
      Object.keys(elementsObj).forEach((key) => {
        if (key in compObj) obj[key] = { ...compObj[key] };
      });
      return {
        form: { ...formObj[formId].form },
        compObj: obj
      };
    },
    // 表单触发器-初始化
    initStart(data) {
      // 获取动作为初始化下面的触发组件
      Object.keys(data).forEach(async (key) => {
        this.resolveLink(data, key);
      });
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
            console.log('触发器-值变化===');
            console.log(this.getAllPane.compObj);
            console.log(this.configData);
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
        console.log('获取参数');
        // 公式函数内部包裹必须定义外部变量，不然引用有问题
        if (!getAllPaneBack) {
          return '';
        }
        console.log('获取参数111');

        const comp = getAllPaneBack.compObj[params[0]];
        if (comp && comp.selData) {
          if (comp.compType === 6 || comp.compType === 7) {
            if (params[3] && params[3] === 'showValue') {
              const arr = [];
              comp.selData.forEach((data) => {
                // 第一项是值
                if (data[`${params[1]}_${params[2]}`]) {
                  arr.push(data[`${params[1]}_${params[2]}`]);
                }
              });
              return arr.join();
            }
            const arr = [];
            const vArr = [];
            comp.selData.forEach((data) => {
              // 第一项是值
              if (data[params[1]]) {
                vArr.push(data[params[1]]);
              }
              // 第二项是显示值 单选框 多选框 label 可能用到
              if (params[2] && data[params[2]]) {
                arr.push(data[params[2]]);
              }
            });
            return {
              value: vArr.join(),
              showValue: arr.join()
            };
          }
        }
        return {
          error: 'error'
        };
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
    },

    // 界面初始化
    init() {
      this.getMenuConfig();
    },
    // 强制刷新整个界面
    forceUpdate() {
      const { formConfig = [], listConfig = [] } = this.$refs;
      formConfig.forEach((el) => {
        if (el.reloadData) el.reloadData();
      });
      listConfig.forEach((el) => {
        if (el.reloadData) el.reloadData();
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
    const { windowHeight, customBar } = this.$store.state.base.systemInfo;
    console.log(
      `menuHeight===${this.menuHeight},windowHeight=${windowHeight},customBar=${customBar}`
    );
  },

  mounted() {
    this.init();
    this.$bus.$on('btnTrigger', this.clickTrigger);
  },

  beforeDestroy() {
    if (!this.htmlConfig.isPanel) this.$store.commit('setMenuFlag', '');
    // 销毁时，只有最外部的菜单才会将按钮触发器监听去除
    if (!this.htmlConfig.isPanel && this.htmlConfig.isJump !== '2') this.$bus.$off('btnTrigger');

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
  font-family: PingFangSC-Medium, PingFang SC;
  color: #333333;
  font-weight: 550;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  background: #fff;
}
.menuConfig {
  height: 100%;
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
</style>
