import { getPersonalCenterUser } from '@/api/userCenter';
import { appRouteArr } from '@/config/index.js';
import { getComIconUrl } from '@/utils/globalFunction/libs/common.js';

const regProcess = function(str = '') {
  // 将公式中的特殊字符去除
  if (!str) return '';
  let formulaRes = str
    .replace(/\[|\]/g, '')
    .replace(/!==/g, '<>')
    .replace(/!=/g, '<>')
    .replace(/===(?!=)/g, '=')
    .replace(/==(?!=)/g, '=');
  formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
  const newStr = formulaRes.replace(
    /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
    (...arr) => `${arr[1]}`,
  );
  return newStr;
};

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
    systemMenusConfig: {},
    // 数据选择框扫描的值
    SCAN_VALUE: '',
    // 首页界面显示，即登录后跳转的界面
    homePageConfig: {
      type: 1, // 1=正常首页；2=系统界面；3=配置菜单；4=配置面板
      showBack: true, // 是否显示返回按钮
      path: 'menuConfigure', // 路由
      pageConfig: {
        id: null, // 外联的唯一标识
      },
    },
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
      const { menusObj, functionInterface } = state;
      const { footerArea = {}, enableFooter } = functionInterface;
      const navList = [];
      if (enableFooter) {
        const list = footerArea.groupArr || [{ menuArr: [] }];
        const tabNav = list[0].menuArr || [];
        tabNav.forEach((tab) => {
          const { menuName, isSy, isMine, icon, selectIcon, id } = tab;
          // 类型不是2系统菜单，且不可查看。底部导航栏有2个默认的系统菜单 首页，我的
          const enableView = menusObj[id];
          if (!isMine && !isSy && !enableView) return false;

          const iconPath = getComIconUrl(icon, true);
          const selectPath = getComIconUrl(selectIcon, true);
          const info = {
            iconPath, // 底部导航栏未选中是的图标
            selectedIconPath: selectPath || iconPath, // 底部导航栏选中时的图标
            text: menuName, // 底部导航栏名称
          };

          navList.push({ ...tab, ...info });
        });
      }
      return navList;
    },
  },
  mutations: {
    // 设置外部链接配置信息
    setMenuHomePageConfig(state, config) {
      if (config.canclePreview) {
        // 取消预览
        state.homePageConfig.isPreview = false;
      }
      const homePageConfig = {
        type: 1, // 1=正常首页；2=系统界面；3=配置菜单；4=配置面板;5=预览界面
        showBack: true, // 是否显示返回按钮
        pageConfig: {
          id: null, // 外联的唯一标识
        },
      };

      // 为分享地址
      const {
        isLink,
        flag,
        id,
        canShowNotification,
        canShowProcressDeatail,
        detailId,
        isPreview,
        isPreviewPanel,
        panelName,
      } = config;
      if (isLink === '1') {
        homePageConfig.type = flag === '1' ? 3 : 4;
        homePageConfig.showBack = false;
        homePageConfig.pageConfig = {
          id,
        };
        if (flag === '2') {
          const { config: panelStr } = config;
          // 面板
          const panel = JSON.parse(panelStr);
          const {
            title,
            sourceFlagId,
            parentCompId,
            parentSysMenuDesignId,
            menuFlag,
            panelFilter: paramPanelFilter,
            panelDataTrans: paramPanelDataTrans,
          } = panel;
          homePageConfig.pageConfig = {
            id: panel.id,
            title,
            sourceFlagId,
            parentCompId,
            parentSysMenuDesignId,
            menuFlag,
          };
          const { panelFilter } = state;
          const obj = {};
          obj[sourceFlagId] = paramPanelFilter;
          state.panelFilter = { ...panelFilter, ...obj };

          const { panelDataTrans } = state;
          const panelDataTransObj = {};
          panelDataTransObj[sourceFlagId] = paramPanelDataTrans;
          state.panelDataTrans = { ...panelDataTrans, ...panelDataTransObj };
        }
      } else if (canShowNotification) {
        // 如果是通知消息
        homePageConfig.type = 2;
        homePageConfig.path = 'Message';
        homePageConfig.pageConfig = {
          id,
          title: '消息通知',
          isJump: 0,
        };
      } else if (canShowProcressDeatail) {
        // 如果是流程详情
        homePageConfig.type = 2;
        homePageConfig.path = 'PagesProcess';
        homePageConfig.showBack = false;
        homePageConfig.canShowProcressDeatail = canShowProcressDeatail;
        homePageConfig.pageConfig = {
          id: detailId,
          title: '流程详情',
          taskId: detailId,
        };
      } else if (isPreview) {
        homePageConfig.isPreview = true;
        homePageConfig.pageConfig = {
          id,
          isPreviewPanel,
          title: panelName,
        };
      }
      state.homePageConfig = { ...homePageConfig };
    },
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
      if (!configData) {
        state.menusObj = {};
        state.functionInterface = {};
        return;
      }
      const {
        myInterface = {
          // 功能区
          funcArea: {
            groupArr: [],
          },
        },
        functionInterface = {},
      } = configData;
      state.functionInterface = { ...functionInterface };
      state.myInterface = { ...myInterface };
      state.supper = configData.supper;

      // 设置菜单权限
      // 首页、我的功能区菜单
      let { groupArr } = state.functionInterface.funcArea; // 首页功能区
      groupArr = groupArr.concat(state.functionInterface.footerArea.groupArr); // 底部
      groupArr = groupArr.concat(state.myInterface.funcArea.groupArr); // 我的

      const funcAreaFunc = [];

      groupArr.forEach((group) => {
        if (group.menuArr) funcAreaFunc.push(...group.menuArr);
      });

      // 首页、我的右上角菜单
      const functionRightFunc = state.functionInterface.rightFunc || [];
      const myInterfaceRightFunc = state.myInterface.rightFunc || [];

      // 筛选出有查看权限的菜单
      const { supper } = state;
      const menus = funcAreaFunc.concat(
        myInterfaceRightFunc,
        functionRightFunc,
      );
      const menusObj = {};

      let nextPageConfig = [];
      menus.forEach((menu) => {
        const { id, permission } = menu;
        if (supper) {
          // 如果是超级用户，菜单权限不用控制
          menusObj[id] = menu;
          const { childPageConfig } = menu;
          if (childPageConfig) {
            nextPageConfig = nextPageConfig.concat(
              childPageConfig.funcArea.groupArr,
            );
          }

          return false;
        }
        if (!permission) return false;
        // permissionItemId:1=查看权限；check：1=有；2：无
        const canSeePer =
          menu.permission.find((per) => per.permissionItemId === 1) || {};
        if (canSeePer.check === '1') {
          menusObj[id] = menu;
          const { childPageConfig } = menu;
          if (childPageConfig) {
            nextPageConfig = nextPageConfig.concat(
              childPageConfig.funcArea.groupArr,
            );
          }
        }
      });

      // 第二应用
      const nextMenus = [];
      nextPageConfig.forEach((group) => {
        nextMenus.push(...group.menuArr);
      });
      nextMenus.forEach((menu) => {
        const { id, permission } = menu;
        if (supper) {
          // 如果是超级用户，菜单权限不用控制
          menusObj[id] = menu;
          return false;
        }
        if (!permission) return false;
        // permissionItemId:1=查看权限；check：1=有；2：无
        const canSeePer =
          menu.permission.find((per) => per.permissionItemId === 1) || {};
        if (canSeePer.check === '1') menusObj[id] = menu;
      });
      state.menusObj = menusObj;
    },
    // 保存系统固定菜单配置
    setSystemMenusConfig(state, params) {
      const { systemMenusConfig } = state;
      state.systemMenusConfig = {
        ...systemMenusConfig,
        ...params,
      };
    },
  },
  actions: {
    // 跳转菜单
    jumpMenu(
      { state, commit },
      { menuId, isJump = 0, menuFilter, filters = {}, map = {}, sourceFlagId },
    ) {
      const { menusObj } = state;
      // 判断是否有权限跳转菜单
      const menu = menusObj[menuId];
      if (menu) {
        const { type, id, menuName, groupCompId, customId } = menu;
        sourceFlagId = sourceFlagId || menuId;
        // 如果有菜单过滤条件
        if (menuFilter) {
          commit('setJumpMenuFilter', {
            sourceFlagId,
            data: { ...filters, map },
          });
        }

        // 在缓存里记录当前菜单id,用于权限获取
        uni.setStorageSync('curMenuId', id);

        // 跳转菜单
        // type菜单类型 1-普通菜单；2-系统菜单；3-应用；4-自定义界面
        if (type === 3) {
          uni.navigateTo({
            url: `/MenuHome/applicationTab?menu=${id}&name=${menuName}&areaType=funcArea&groupCompId=${groupCompId}`,
          });
        } else if (type === 2) {
          // isJump:0=正常菜单，1=跳转菜单
          // 固定菜单
          const { routeName, offlineCheck, calendar } = menu;
          if (routeName === 'inspection') {
            commit('setSystemMenusConfig', { [id]: offlineCheck });
          } else if (routeName === 'calendar') {
            commit('setSystemMenusConfig', { [id]: calendar });
          }
          const systemMenu = appRouteArr.find(
            (sys) => sys.routeName === routeName,
          );
          if (systemMenu.url) {
            uni.navigateTo({
              url: `${systemMenu.url}?id=${id}&title=${menuName}&isJump=${isJump}`,
              animationType: 'slide-in-right',
            });
          }
        } else if (type === 4) {
          // 自定义界面
          uni.navigateTo({
            url: `/interfaceCommon/webView?id=${id}&customPageId=${customId}&title=${menuName}&isCustomPage=1`,
          });
        } else {
          uni.navigateTo({
            url: `/menuConfigure/index?id=${id}&title=${menuName}&sourceFlagId=${sourceFlagId}&isJump=${isJump}`,
            animationType: 'slide-in-right',
          });
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有该跳转菜单的权限',
        });
      }
    },
    // 跳转菜单
    jumpPanel(
      { commit },
      {
        panel,
        sourceFlagId,
        isNoVuex = false,
        canJump = true, // 是否需要跳转路由
        panelFixData = {},
        urlParams = {},
        filters = {},
        map = {},
      },
    ) {
      if (!panel) return;

      if (!isNoVuex) {
        commit('setMenuPanelFilter', {
          sourceFlagId,
          data: { ...filters, map },
        });
        commit('setMenuPanelDataTrans', {
          sourceFlagId,
          data: panelFixData,
        });
      }

      if (canJump) {
        const { id, panelName, name: otherName, enableshare } = panel;
        const name = otherName || panelName;
        const params = {
          id,
          title: name,
          isPanel: true,
          sourceFlagId,
          ...urlParams,
        };
        const arry = [];
        Object.keys(params).forEach((key) => {
          arry.push(`${key}=${params[key]}`);
        });
        uni.navigateTo({
          url: `/menuConfigure/index?${arry.join('&')}`,
          animationType: 'slide-in-right',
        });
      }
      return panel;
    },
    // 跳转外部链接
    jumpOuterLink({ commit }, { sourceFlagId, outerLink, urlParams = {} }) {
      if (!outerLink) return;

      commit('setJumpMenuFilter', {
        sourceFlagId,
        data: { outerLink, urlParams },
      });

      uni.navigateTo({
        url: `/interfaceCommon/webView?flag=${sourceFlagId}&isOuterLink=1`,
        animationType: 'slide-in-right',
      });
    },
    // 跳转分享地址
    async jumpHomePage({ dispatch, commit, state }) {
      const { homePageConfig } = state;
      if (homePageConfig.type !== 1) {
        const res = await getPersonalCenterUser();
        commit('setUserInfo', res);
        dispatch('getGlobalConfig', 'UREPORT_URL,WATER_MASK');
        // #ifdef H5
        // 获取h5状态下的扫描项目类型2=泸州老窖
        dispatch('getCurrentDict', 'SCAN_ITEM_TYPE');
        // #endif
      }
      // 固定菜单
      if (homePageConfig.type === 2) {
        const { pageConfig = {}, path } = homePageConfig;
        // 跳转参数
        const param = [];
        Object.keys(pageConfig).forEach((key) => {
          param.push(`${key}=${pageConfig[key]}`);
        });

        let url = `/${path}/index`;
        if (param.length > 0) url = `${url}?${param.join('&')}`;
        uni.redirectTo({
          url,
          animationType: 'slide-in-right',
        });
      } else if (homePageConfig.type === 3) {
        const { pageConfig } = homePageConfig;
        uni.reLaunch({
          url: `/menuConfigure/index?id=${pageConfig.id}&title=分享地址`,
          animationType: 'slide-in-right',
        });
      } else if (homePageConfig.type === 4) {
        // 面板
        const { pageConfig } = homePageConfig;
        const {
          id,
          title,
          sourceFlagId,
          parentCompId,
          parentSysMenuDesignId,
          menuFlag,
        } = pageConfig;
        uni.reLaunch({
          url: `/menuConfigure/index?id=${id}&title=${title}&isPanel=true&sourceFlagId=${sourceFlagId}&parentCompId=${parentCompId}&parentSysMenuDesignId=${parentSysMenuDesignId}&menuFlag=${menuFlag}`,
          animationType: 'slide-in-right',
        });
      } else {
        let url = '/MenuHome/index';
        url = homePageConfig.type === 5 ? `${url}?isNext=true` : url;
        uni.reLaunch({ url });
      }

      // 预览
      // const { pageConfig } = homePageConfig;
      // const { id, title, isPreviewPanel } = pageConfig;
      // uni.reLaunch({
      //   url: `/menuConfigure/index?id=${id}&titl
      // e=${title}&isPreview=true&mustLoad=true&isPreviewPanel=${isPreviewPanel}`,
      //   animationType: 'slide-in-right',
      // });
    },
  },
};
