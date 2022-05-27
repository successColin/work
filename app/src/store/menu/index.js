export default {
  state: {
    // 当前菜单唯一标识
    currentOnlyFlag: '',
    // 首页配置
    functionInterface: {
      // 是否启用位置
      enablePos: 0,
      // 是否启用右上角
      enableRightFunc: 0,
      // 是否启用轮播
      enableRotation: 0,
      // 其否启用公告栏
      enableNotice: 0,
      // 是否启用资讯
      enableInfo: 0,
      // 是否启用底部
      enableFooter: 0,
      // 是否启用我的
      enableMine: 0,
      // 右上角按钮
      rightFunc: [],
      // 轮播
      rotateImg: {},
      // 公告信息
      notice: {},
      // 功能区
      funcArea: {
        groupArr: [],
      },
      // 资讯
      info: {},
    },
    // 底部导航栏
    footerArea: [],
    // 是否为超级用户
    supper: true,
    // 我的配置
    myInterface: {
      // 功能区
      funcArea: {
        groupArr: [],
      },
    },
    panelConfig: {},
    panelFilter: {},
    panelDataTrans: {},
    jumpMenuFilter: {},
    // 高级筛选界面
    highSearchConfig: {
      form: {},
      children: [],
    },
    // 菜单权限
    menusObj: {},
    // 固定菜单
    systemMenusConfig: {}
  },
  getters: {
    // 获取首页有权限的菜单
    getFuncArea(state) {
      const { supper, functionInterface } = state;
      const { funcArea = {} } = functionInterface;
      const funcGroupArr = funcArea.groupArr || [];
      if (supper) return funcGroupArr;
      return funcGroupArr.filter((item) => item.permission === '1');
    },
    // 获取我的有权限的菜单
    getMineArea(state) {
      const { supper, myInterface } = state;
      const { funcArea = {} } = myInterface;
      const funcGroupArr = funcArea.groupArr || [];
      if (supper) return funcGroupArr;
      return funcGroupArr.filter((item) => item.permission === '1');
    },
    // 获取底部有权限的菜单
    getFooterArea(state) {
      const { supper, functionInterface } = state;
      const { footerArea = {}, enableFooter } = functionInterface;
      const navList = [];
      if (enableFooter) {
        const list = footerArea.groupArr || [{ menuArr: [] }];
        const tabNav = list[0].menuArr || [];
        tabNav.forEach((tab) => {
          const { menuName, type, permission, icon, selectIcon } = tab;
          const iconNormal = icon.icon && icon.icon.split('-')[1];
          const iconPath = iconNormal || icon.imageUrl;
          const selectPar = selectIcon.icon && selectIcon.icon.split('_')[1];
          const selectPath = selectPar || selectIcon.imageUrl;
          const info = {
            iconPath, // 底部导航栏未选中是的图标
            selectedIconPath: selectPath || iconPath, // 底部导航栏选中时的图标
            text: menuName, // 底部导航栏名称
          };
          const tabPermission = permission || [];
          const enableView = tabPermission.findIndex(
            (per) => per.permissionItemId === 1
          );
          // 如果不是超级用户
          // 类型不是2系统菜单，且不可查看。底部导航栏有2个默认的系统菜单 首页，我的
          if (!supper && type !== 2 && enableView !== -1) return false;

          navList.push({ ...tab, ...info });
        });
      }
      return navList;
    },
  },
  mutations: {
    // 设置高级筛选配置信息
    setMunuHighSearch(state, config) {
      state.highSearchConfig = { ...config };
    },
    // 设置当前菜单的跳转面板
    setMenuPanelConfig(state, { panelId, config }) {
      state.panelConfig[panelId] = config;
    },
    // 设置当前菜单唯一标识
    setMenuFlag(state, onlyFlag) {
      state.currentOnlyFlag = onlyFlag;
    },
    // 设置面板过滤条件信息
    setMenuPanelFilter(state, { sourceFlagId, data }) {
      const { panelFilter } = state;
      const obj = {};
      obj[sourceFlagId] = data;
      const config = { ...panelFilter, ...obj };
      state.panelFilter = { ...config };
    },
    // 设置跳转菜单过滤条件信息
    setJumpMenuFilter(state, { sourceFlagId, data }) {
      const { jumpMenuFilter } = state;
      const obj = {};
      obj[sourceFlagId] = data;
      const config = { ...jumpMenuFilter, ...obj };
      state.jumpMenuFilter = { ...config };
    },
    // 设置面板数据传输
    setMenuPanelDataTrans(state, { sourceFlagId, data }) {
      const { panelDataTrans } = state;
      const panelDataTransObj = {};
      panelDataTransObj[sourceFlagId] = data;
      const config = { ...panelDataTrans, ...panelDataTransObj };
      state.panelDataTrans = { ...config };
    },
    changMenus(state, configData) {
      state.functionInterface = { ...configData.functionInterface };
      state.myInterface = { ...configData.myInterface };
      state.supper = configData.supper;

      // 设置菜单权限
      // 首页、我的功能区菜单
      let { groupArr } = state.functionInterface.funcArea; // 首页功能区
      groupArr = groupArr.concat(state.functionInterface.footerArea.groupArr); // 底部
      groupArr = groupArr.concat(state.myInterface.funcArea.groupArr); // 我的

      const menusObj = {};
      groupArr.forEach((group) => {
        group.menuArr.forEach((menu) => {
          const { id } = menu;
          if (id) menusObj[id] = menu;
        });
      });

      // 首页、我的右上角菜单
      const functionRightFunc = state.functionInterface.rightFunc || [];
      const myInterfaceRightFunc = state.myInterface.rightFunc || [];
      const rightMenuArry = functionRightFunc.concat(myInterfaceRightFunc);
      rightMenuArry.forEach((menu) => {
        const { id } = menu;
        if (id) menusObj[id] = menu;
      });

      state.menusObj = menusObj;
    },
    // 设置菜单信息
    // setMenuProp(state, { menuId, menu }) {
    //   // const menuProp = {};
    //   const tabs = {};
    //   const { showTab, curCompId, children: list } = menu;
    //   // 如果不显示tab
    //   if (!showTab) {
    //     const tab = list.find((item) => item.compId === curCompId);
    //     const { children, ...tabProp } = tab;
    //     const [tabBtn, ...areaList] = children;
    //     let tabBtns = [];
    //     // 如果要显示tab按钮
    //     if (tabProp.showTabBtn) tabBtns = tabBtn;

    //     tabs[tab.compId] = { tabBtns, areaList, ...tabProp };
    //   } else {
    //     list.forEach((tab) => {
    //       const { children, ...tabProp } = tab;
    //       const [tabBtn, ...areaList] = children;
    //       let tabBtns = [];
    //       // 如果要显示tab按钮
    //       if (tabProp.showTabBtn) tabBtns = tabBtn;

    //       tabs[tab.compId] = { tabBtns, areaList, ...tabProp };
    //     });
    //   }

    //   state.menuProp[menuId] = { ...tabs };
    // },
    // 保存系统固定菜单配置
    setSystemMenusConfig(state, params) {
      const { systemMenusConfig } = state;
      console.log(params);
      state.systemMenusConfig = {
        ...systemMenusConfig,
        ...params,
      };
    },
  },
  actions: {},
};
