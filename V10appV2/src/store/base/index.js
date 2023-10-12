import { listByKeys } from '@/api/userCenter';
import { deflautTheme, selectColorArr } from '@/config/index.js';
import { Decrypt } from '@/utils';

export default {
  state: {
    themeColor: deflautTheme, // 主题色
    themeColor1: '#EE5E5E', // 主题色
    statusBarHeight: uni.getSystemInfoSync().statusBarHeight, // 状态栏高度
    systemInfo: {
      windowHeight: 0, // 手机高度
      statusBar: 0, // 状态栏高度
      navbarHeight: 45, // 标题栏高度（ApiotNavbar 45px）
      customBar: 0, // 状态栏高度 + 默认导航栏
      titleBarHeight: 0, // 标题栏高度，支付宝小程序支持
      language: '', // 语言
      platform: 'android', // // 客户端平台，值域为：ios、android
      bottomNavHeight: 50, // 底部菜单栏
    },
    // 为了解决遮罩层后底部滑动问题,建议放到滚动的最外面一层，避免引起里面的样式变化
    maskOverhiddenClass: '',
    isMask: false,
    appVersion: '', // 服务器上app版本号
    baseVersion: '', // 当前基座版本号
    baseLatestVersion: '', // 最新基座版本号
    currentVersion: '', // 当前手机对应的版本号
    upgradeMode: '', // 更新类型，1-更新包；2-安装包；3-手动下载
    appUploadUrl: {
      // app更新地址
      installAtionPackAgeURL: '', // 手动更新地址
      androidDownloadUrl: '', // 安卓安装包地址
      iosDownloadUrl: '', // ios安装包地址
      upgradeURL: '', // 升级包地址
    },
    globalLogin: {}, // app登录配置
    globalConfig: {
      // 全局配置
      UREPORT_URL: [], // 域名地址相关
      WATER_MASK: [], // 水印配置信息
      THEME_AND_LOGO: [], // 顶部及主题相关选项
    },
  },
  getters: {
    // 是否启动水印功能
    getWatermark(state) {
      const { WATER_MASK } = state.globalConfig;
      const waterMask =
        WATER_MASK.find((item) => item.attributeKey === 'enableWaterMask') ||
        {};
      if (!waterMask.attributeValue) return false;
      return waterMask.attributeValue === '1';
    },
    getThemeIndex(state) {
      // 主题色的序号，该序号要与主题颜色保持一致
      return selectColorArr.findIndex((color) => color === state.themeColor);
    },
    // 字体主题色
    getThemeColorFont(state, getters) {
      return `themeColor__font-${getters.getThemeIndex}`;
    },
    getThemeColorRGB(state) {
      const { themeColor } = state;
      console.log(themeColor);
      const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!reg.test(themeColor)) {
        return;
      }
      let newStr = themeColor.toLowerCase().replace('#', '');
      const len = newStr.length;
      if (len === 3) {
        let t = '';
        for (let i = 0; i < len; i += 1) {
          t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1));
        }
        newStr = t;
      }
      const arr = []; // 将字符串分隔，两个两个的分隔
      for (let i = 0; i < 6; i += 2) {
        const s = newStr.slice(i, i + 2);
        arr.push(parseInt(s, 16));
      }
      return arr.join(',');
    },
    // 按钮主题色
    getThemeColorBtn(state, getters) {
      return `themeColor__btn-${getters.getThemeIndex}`;
    },
    // 背景主题色
    getThemeColorBg(state, getters) {
      return `themeColor__bg-${getters.getThemeIndex}`;
    },
  },
  mutations: {
    // 设置
    setBaseGlobalConfig(state, { key, data }) {
      state.globalConfig[key] = data;
    },
    // 设置是否有弹窗
    setIsMask(state, value) {
      console.log(value);
      state.isMask = value;
    },
    // 设置系统信息
    setBaseSystemInfo(state, info) {
      state.systemInfo = { ...state.systemInfo, ...info };
    },
    // 如果有遮罩层设置maskOverhiddenClass为maskOverhidden
    setmaskOverhiddenClass(state, status) {
      if (status) state.maskOverhiddenClass = 'maskOverhidden';
      else state.maskOverhiddenClass = '';
    },
    setAppVersion(state, appversions) {
      state.appVersion = appversions.appVersion || ''; // 最新app版本号
      state.baseLatestVersion = appversions.baseLatestVersion || ''; // 最新基座版本号
      state.upgradeMode = appversions.upgradeMode || ''; // 更新类型
      state.appUploadUrl.upgradeURL = appversions.upgradeURL || ''; // 更新包地址
      state.appUploadUrl.androidDownloadUrl =
        appversions.androidDownloadUrl || ''; // 安卓安装包地址
      state.appUploadUrl.iosDownloadUrl = appversions.iosDownloadUrl || ''; // ios安装包地址
      state.appUploadUrl.installAtionPackAgeURL =
        appversions.installAtionPackAgeURL || ''; // 手动更新地址
    },
    setAppBaseInfo(state, info) {
      state.currentVersion = info.currentVersion || ''; // 当前手机对应的版本号
      state.baseVersion = info.baseVersion || ''; // 当前基座版本号
    },
    // 设置app登录配置
    setGlobalLogin(state, value) {
      state.globalLogin = value;
      state.themeColor = selectColorArr[value.themeColor - 1];
    },
  },
  actions: {
    async getGlobalConfig({ commit }, parameterKey) {
      const data = await listByKeys({ parameterKey });
      console.log(data);

      const tempRes = JSON.parse(Decrypt(data));
      const keys = Object.keys(tempRes);

      keys.forEach((key) => {
        commit('setBaseGlobalConfig', {
          key,
          data: tempRes[key],
        });
      });
    },
  },
};
