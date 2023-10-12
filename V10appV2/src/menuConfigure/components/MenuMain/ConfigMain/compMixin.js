export default {
  props: {
    menuHeight: Number,
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
          isSelectDataBox: false, // 是否为弹出面板
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

  inject: ['getMenuPane', 'getAllForm', 'getMenuFlag', 'switchLoadingArea'],

  data() {
    return {};
  },

  computed: {
    // 流程节点配置信息
    processConfig() {
      const { processNodeId, isProcess } = this.htmlConfig;
      if (!isProcess) return {};
      const { processConfigs } = this.$store.state.process;
      return processConfigs[processNodeId] || {};
    },
    isShow() {
      const { type } = this.htmlConfig;
      return type !== 'Completed';
    },
    // 撤回按钮
    isShowRevokeBtn() {
      const { type, triggerUserId } = this.htmlConfig;

      const { id: userId } = this.$store.state.userCenter.userInfo;
      return (
        (+triggerUserId === +userId && type === 'IN_PROGRESS') ||
        (+triggerUserId === +userId && type === 'LeaveItToMe')
      );
    },
    isShowRejectBtn() {
      const { type, triggerUserId, taskType } = this.htmlConfig;
      // 被驳回 已撤回 草稿
      return (
        (+triggerUserId === +this.userId &&
          ['REJECTED', 'REVOKED', 'DRAFT'].includes(type)) ||
        (+triggerUserId === +this.userId && +taskType === 1)
      );
    },
    // 流程节点按钮
    processBtns() {
      const {
        instanceId,
        processNodeId,
        isFinish,
        isCcTom,
        isProcess,
      } = this.htmlConfig;
      if (!isProcess) return;
      const {
        buttonAttributes,
        allowReferral,
        allowAddCheck,
        allowRejectTo,
        workflowVersionId,
      } = this.processConfig;

      // 是否已经完成

      if (isFinish) return [];

      const btnList = [];
      const baseConfig = {
        isProcess: true,
        iconType: 1,
        workflowVersionId,
        instanceId,
        processNodeId,
        allowRejectTo,
      };
      // 是否允许转审
      if (allowReferral && !isCcTom && this.isShow) {
        btnList.push({
          compId: 'static_zhuanshen',
          name: '转审',
          iconFont: 'appIcon-zhuanshen',
          iconColor: '#FAB71C',
          fontColor: '#fff',
          ...baseConfig,
        });
      }
      // 通过，驳回按钮
      if (buttonAttributes && !isCcTom && this.isShow) {
        const { reasonForRejectionRequired } = buttonAttributes;
        btnList.push({
          compId: 'static_bohui',
          name: buttonAttributes.rejectText,
          reasonForRejectionRequired,
          iconFont: 'appIcon-bohui',
          iconColor: '#EE5E5E',
          fontColor: '#fff',
          ...baseConfig,
        });
        btnList.push({
          compId: 'static_tongguo',
          name: buttonAttributes.passText,
          reasonForRejectionRequired: false,
          iconFont: 'appIcon-tongguo',
          iconColor: '#34C7BE',
          fontColor: '#fff',
          ...baseConfig,
        });
      }
      // 是否允许加签
      if (allowAddCheck && !isCcTom && this.isShow) {
        btnList.push({
          compId: 'static_jiaqian',
          name: '加签',
          iconFont: 'appIcon-jiaqian',
          iconColor: '#FC8256',
          fontColor: '#fff',
          ...baseConfig,
        });
      }

      // 撤回
      if (this.isShowRevokeBtn) {
        btnList.push({
          compId: 'static_chehui',
          name: '撤回',
          iconFont: 'appIcon-huitui',
          iconColor: '#4689f5',
          fontColor: '#fff',
          ...baseConfig,
        });
      }
      // 提交审批
      if (this.isShowRejectBtn) {
        btnList.push({
          compId: 'static_tijiao',
          name: '提交流程',
          iconFont: 'appIcon-shenpi',
          iconColor: '#4689f5',
          fontColor: '#fff',
          ...baseConfig,
        });
      }

      return btnList;
    },
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
    // 计算高度
    allComp() {
      return this.getMenuPane().compObj;
    },
    // 计算tab区按钮的高度
    tabsBtnHight() {
      const { showTabBtn, children } = this.currentTab;
      if (!showTabBtn) return 0;
      const { allComp } = this;
      const { appRadius = 1, appSort } = children[0];
      if (appSort === 2) return 0; // 如果时竖向按钮不计算高度

      const elements = children[0].children;
      const btnList = elements.filter((el) => {
        const comp = allComp[el.compId] || {};
        el = { ...el, ...comp };
        return el.canShow && el.compName !== 'SearchCondition';
      });

      let h = 88; // 横向按钮高度
      if (appRadius === 1) h += 20 * 2; // 如果按钮类型是椭圆时，需要算上边距
      // 128rpx = 20*2rpx(边距) + 88rpx(高度)底部按钮区的高度
      if (btnList.length > 0) return this.$apiot.rpx2px(h);
      return 0;
    },
    // 计算功能区按钮高度
    areaBtnHight() {
      const { functionBtns, functionBtnArea } = this;
      if (functionBtns.length === 0) return 0;
      const { appRadius = 1, appSort } = functionBtnArea;
      if (appSort === 2) return 0; // 如果时竖向按钮不计算高度

      let h = 88; // 横向按钮高度
      if (appRadius === 1) h += 20 * 2; // 如果按钮类型是椭圆时，需要算上边距
      return this.$apiot.rpx2px(h);
    },
    computedHeight() {
      const {
        htmlConfig,
        menuHeight,
        tabsBtnHight,
        areaBtnHight,
        hasSearch,
        hasConvenient,
      } = this;
      const { showTab, isSelectDataBox } = htmlConfig;

      let listHeight = menuHeight - tabsBtnHight;
      if (showTab) listHeight -= 45; // 顶部tab高度
      if (hasSearch) listHeight -= 44; // 顶部搜索高度
      if (isSelectDataBox) listHeight -= 41; // 如果是数据选择框的话，顶部空余高度
      if (hasConvenient) listHeight -= this.$apiot.rpx2px(88); // 如果有便捷搜索时，顶部便捷搜索高度
      if (areaBtnHight) listHeight -= areaBtnHight; // 有按钮区时，需要减掉按钮区高度
      if (this.isProcessNode) listHeight -= this.$apiot.rpx2px(120);
      return listHeight;
    },
    // 区域按钮
    functionBtns() {
      const { funcConfig, functionBtnArea } = this;
      const { pageType } = funcConfig;
      if (pageType !== 2 && pageType !== 3) return [];
      if (!functionBtnArea) return [];
      return functionBtnArea.children.filter(
        (el) => el.compType === 5 && el.canShow,
      );
    },
    // 按钮区
    functionBtnArea() {
      const { children } = this.funcConfig;
      return children.find((item) => item.areaType === 2);
    },
    // 功能区基本控件
    functionArea() {
      const { funcConfig } = this;
      const { children } = funcConfig;
      return children.find((item) => item.areaType === 1) || {};
    },
    // 功能区域的控件列表
    elementList() {
      // 需要考虑弹出框的多表树情况，控件是存在backChildren中的
      const { isSelectDataBox } = this.htmlConfig;
      const { compName } = this.funcConfig;
      const { backChildren = [], children } = this.functionArea;
      let arry = [];
      if (isSelectDataBox && compName === 'MultiTree') arry = [...backChildren];
      else arry = [...children];

      const elements = arry;
      // if (this.funcConfig.compName === 'CardMain') {
      //   // 如果是卡片，需要考虑卡片按钮
      //   const [btnEle] = elements;
      //   // 如果有按钮区，需要将按钮区删除
      //   if (btnEle.compName === 'BtnsArea') elements.splice(0, 1);
      // }
      return elements || [];
    },
    panelFilter() {
      const { sourceFlagId, isPanel } = this.htmlConfig;
      if (!isPanel) return {};
      return this.$store.state.menu.panelFilter[sourceFlagId];
    },
    menuFilter() {
      const { sourceFlagId } = this.htmlConfig;
      return this.$store.state.menu.jumpMenuFilter[sourceFlagId];
    },
    // 是否有其他界面过来的传递条件
    isHasOtherPageFilter() {
      const { compId } = this.funcConfig;
      const { isPanel, isJump } = this.htmlConfig;
      let filter = null;
      if (isJump === '1') {
        // 如果是跳转菜单
        filter = this.menuFilter;
      } else if (isPanel) {
        // 如果是跳转面板
        filter = this.panelFilter;
      }
      if (filter && filter[compId]) return filter;
      return false;
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
      const { isHasOtherPageFilter } = this;
      let obj = {};
      const { compId } = this.funcConfig;
      if (isHasOtherPageFilter && isHasOtherPageFilter[compId]) {
        // 如果有面板过来条件
        obj = isHasOtherPageFilter[compId] || {};
      } else if (this.funcConfig.termParams) {
        const compMap = this.getAllForm();
        const arr = this.funcConfig.termParams.split(',');
        arr.forEach((compid) => {
          obj[compid] = compMap[compid];
        });
      }

      return obj;
    },
    // 处理compMap
    getCompMap() {
      let map = {};
      const { isHasOtherPageFilter } = this;
      if (!isHasOtherPageFilter && this.funcConfig.termParams) {
        const compMap = this.getAllForm();
        const arr = this.funcConfig.termParams.split(',');
        arr.forEach((compid) => {
          map[compid] = compMap[compid];
        });
      } else {
        map = this.panelFilter.map || {};
        if (this.htmlConfig.isJump === '1') {
          const menuFilterMap = this.menuFilter.map || {};
          map = { ...map, ...menuFilterMap };
        }
      }
      // 并且要将MENU_ID也传递过去，对应公式[GET_MENU_ID]()
      map.MENU_ID = this.getMenuFlag();
      return map;
    },
    // 处理如果是弹出菜单，需要格外将menuFilter传递过去
    getJumpMenuFilter() {
      return this.menuFilter.menuFilter;
    },
  },
};
