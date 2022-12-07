import { getDesignMenu } from '@/api/menuConfig.js';

export default {
  props: {},

  provide() {
    return {
      getPanel: this.getMenuPaneObj,
      getMenuPane: this.getMenuPane,
      clickTrigger: this.clickTrigger,
      getTriggers: this.getTriggers,
      initCardStart: this.initCardStart,
      funcCheckObj: this.getFuncCheckObj, // 获取每个功能块选中的数据
      sysMenuDesignId: this.getSysMenuDesignId,
      switchLoadingArea: this.switchLoadingArea,
      selectDataConfig: this.getSelectDataConfig,
    };
  },

  data() {
    return {
      htmlConfig: null, // 菜单界面基础配置
      menuPaneObj: {}, // 菜单弹出面板
      menuJumpObj: {}, // 跳转菜单
      current: -1, // tabs组件的current值，表示当前活动的tab选项
      triggerMap: {},
      canShowTablist: [], // 需要显示的tab页
      sysMenuDesignId: '', // 用户设计组
      configData: null,
      configDataArr: {},
      btnClickTriggerMap: null,
      onlyFlag: null, // 唯一标识
      showType: 1, // 当前展示类型 1=列表；2=树;只有数据选择弹出框时有用
    };
  },

  computed: {
    funcCheckObj() {
      if (!this.configData) return {};
      return this.configData.checkList || {};
    },
    getFuncAreas() {
      return this.getCurrentTab.funcAreas || [];
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
        showTabBtn,
      };
    },
    getAllPane() {
      const obj = {
        formObj: {},
        tabObj: {},
        compObj: {},
        funcObj: {},
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
                            (per) =>
                              per.permissionItemId === permission[buttonType]
                          );
                          // check 1=有权限
                          if (preObj && preObj.check !== '1') {
                            comp.canShow = false;
                          }

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
                              (per) =>
                                per.permissionItemId === permission[buttonType]
                            );
                            // check 1=有权限
                            if (preObj && preObj.check !== '1') {
                              comp.canShow = false;
                            }

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
  },

  methods: {
    // 获取用户设计组
    getSysMenuDesignId() {
      return this.sysMenuDesignId;
    },
    // 获取面板
    getMenuPaneObj() {
      return this.menuPaneObj;
    },
    // 获取菜单基本信息
    getMenuPane() {
      return this.getAllPane;
    },
    // 获取触发器
    getTriggers() {
      return this.triggerMap;
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
        alreadyCheckList: this.value,
      };
    },
    // 修改tab页中功能的展示类型
    changeAreaType(designOverallLayout) {
      const { selShowType } = designOverallLayout;

      // 数据选择框是否要进行切换3=列表，树；5=列表，多表树
      const canShowSwitchType = [2, 3, 4, 5];
      if (canShowSwitchType.indexOf(selShowType) !== -1) {
        // 列表和树进行切换
        const [children] = designOverallLayout.children;
        const tab = children.children;
        const area = tab[0].children[1];

        const { showType } = this;
        if (showType === 2) {
          if (this.htmlConfig.id === 283) {
            // 系统树 - 设备位置树
            area.compName = 'DevicePosTree';
            area.propertyCompName = 'DevicePosTreeConfig';
          } else if (selShowType === 5) {
            // 多表树
            area.compName = 'MultiTree';
            area.propertyCompName = 'TreeMainConfig';
          } else {
            // 单表树
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
          await this.$store.dispatch(
            'getCurrentDict',
            this.configData.dictArr.join()
          );
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
        compObj: obj,
      };
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
      if (panelArry.length > 0) {
        const result = await getDesignMenu({
          panelId: panelArry.join(','),
        });
        result.forEach((panel) => {
          this.$store.commit('setMenuPanelConfig', {
            panelId: panel.panelId,
            config: panel,
          });
        });
      }
    },
    // 获取界面配置信息
    async getMenuConfig() {
      this.mainLoading = true;
      try {
        const { htmlConfig } = this;
        const params = {};
        if (htmlConfig.isPanel || htmlConfig.isProcess) {
          params.panelId = htmlConfig.id;
        } else params.sysMenuId = htmlConfig.id;
        let panelConfig = null;
        let canGetConfig = true; // 是否需要通过接口获取面板信息
        if (htmlConfig.isPanel) {
          panelConfig = JSON.stringify(
            this.$store.state.menu.panelConfig[params.panelId]
          );
          canGetConfig = false;
        }
        // 是否需要通过接口获取面板信息，mustLoad=必须请求接口
        if (canGetConfig || htmlConfig.mustLoad || !panelConfig) {
          const data = await getDesignMenu(params);
          panelConfig = JSON.stringify(data[0]);
        }
        const result = JSON.parse(panelConfig);

        // 设置界面一些基本状态
        this.$emit('initPage', { enableshare: result.enableshare });

        this.configDataArr = result;
        this.initPage();
        const htmlParams = {
          currentBatchAreaCompId: '',
        }; // 页面配置1
        const { designOverallLayout, triggerMap } = result;

        const { children, paneObj, menuObj, selShowType } =
          designOverallLayout[0];

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

        this.mainLoading = false;
      } catch (error) {
        console.error(error);
        this.mainLoading = false;
      }
    },
  },
  mounted() {
    this.getMenuConfig();
  },
};
