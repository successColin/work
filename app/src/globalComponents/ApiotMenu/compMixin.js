export default {
  props: {
    configData: {
      type: Object,
    },
    // tab唯一标识
    tabId: {
      type: String,
      default: '',
    },
    // 菜单基本配置
    htmlConfig: {
      type: Object,
      default() {
        return {
          id: '', // 面板唯一标识，用于请求面板的配置信息，可能是菜单id，可能是面板id
          title: '',
          isFooter: false,
          sysMenuDesignId: '',
          showTab: false,
          parentCompId: '',
          parentSysMenuDesignId: '',
          menuFlag: null, // 菜单标识，即菜单id
          hiddenRules: null, // tab页显示隐藏条件
          isProcess: false, // 是否是流程面板
          workflowDataId: null, // 具体业务id
          processNodeId: null, // 节点id，用于获取节点配置信息
          instanceId: null, // 流程节点id，用于获取流程进度
        };
      },
    },
    // 界面配置，包括界面控件
    funcConfig: {
      type: Object,
      default() {
        return {
          // 功能名称 功能包括卡片区、表单区
          name: '表单区',
          compId: '', // 功能区id
          areaType: '', // 1-全功能区；2-按钮功能区；3-功能按钮区
          hasCardIcon: false, // 是否启用卡片图标
          iconId: '', // 图标来源 对应控件的compId
          iconColorId: '', // 图标颜色来源 对应控件的compId
          tableInfo: {}, // 面板来源
          // 功能区中的区域，区域包括全功能区、按钮功能区、功能按钮区；areaType=1 功能区；areaType=2 按钮区
          children: [
            {
              name: '',
              compId: '',
              areaType: 1,
              // 控件配置
              children: [],
            },
          ],
          relateTableArr: null, // 控件关系
          layoutStyle: 1, // 表单排布方向 1=上下，2=左右
        };
      },
    },
  },

  inject: ['getAllForm'],

  data() {
    return {};
  },

  computed: {
    getTabs() {
      const { configData } = this;
      if (configData && configData.children) {
        return configData.children[0].children || [];
      }

      return [];
    },
    currentTab() {
      return this.getTabs.find((item) => item.compId === this.tabId) || {};
    },
    // 功能区基本控件
    functionArea() {
      const { funcConfig } = this;
      const { children } = funcConfig;
      return children.find((item) => item.areaType === 1) || {};
    },
    // 功能区域的控件列表
    elementList() {
      const elements = [...this.functionArea.children];
      // if (this.funcConfig.compName === 'CardMain') {
      //   // 如果是卡片，需要考虑卡片按钮
      //   const [btnEle] = elements;
      //   // 如果有按钮区，需要将按钮区删除
      //   if (btnEle.compName === 'BtnsArea') elements.splice(0, 1);
      // }
      return elements || [];
    },
    panelFilter() {
      const { sourceFlagId } = this.htmlConfig;
      if (!sourceFlagId) return {};
      return this.$store.state.menu.panelFilter[sourceFlagId];
    },
    menuFilter() {
      const { id } = this.htmlConfig;
      return this.$store.state.menu.jumpMenuFilter[id];
    },
  },

  methods: {
    getMenuMain() {
      //  为了兼容钉钉小程序vuedom不能直接挂载到data中；错误做法：this.vmdom = this.$parent
      let parent = this.$parent;
      // #ifdef H5
      parent = this.$parent.$parent;
      // #endif
      return parent;
    },
    // 处理面板过滤条件
    getFilterParams() {
      console.log('getFilterParams');
      console.log(this.htmlConfig);
      let obj = {};
      const { compId } = this.funcConfig;
      if (this.panelFilter && this.panelFilter[compId]) {
        obj = this.panelFilter[compId];
      } else if (this.funcConfig.termParams) {
        const compMap = this.getAllForm();
        const arr = this.funcConfig.termParams.split(',');
        arr.forEach((compid) => {
          obj[compid] = compMap[compid];
        });
      }
      // 如果是跳转菜单
      if (this.htmlConfig.isJump === '1') {
        const menuFilter = this.menuFilter[compId] || {};
        obj = { ...obj, ...menuFilter };
      }
      return obj;
    },
    // 处理如果是弹出面板，需要格外将panelFilter传递过去
    getPanelFilter() {
      return this.panelFilter.panelFilter;
    },
    // 处理如果是弹出菜单，需要格外将menuFilter传递过去
    getJumpMenuFilter() {
      return this.menuFilter.menuFilter;
    },
  },
};
