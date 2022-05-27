import { deflautTheme, selectColorArr } from '@/config/index.js';

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
    appVersion: '0.0.1', // app版本号
    baseVersion: '', // 当前基座版本号
    baseLatestVersion: '915000', // 最新基座版本号
    currentVersion: '', // 当前手机对应的版本号
    upgradeMode: 1, // 更新类型，1-更新包；2-安装包；3-手动下载
    appUploadUrl: {
      // app更新地址
      installAtionPackAgeURL: 'http://47.110.141.124/eam/images/app/apioteam/APIoT915014001.wgt', // 手动更新地址
      androidDownloadUrl: 'http://47.110.141.124/eam/images/app/apioteam/APIoT915011.apk', // 安卓安装包地址
      iosDownloadUrl: 'https:www.pgyer.com/bijj', // ios安装包地址
      upgradeURL: 'http://47.110.141.124/eam/images/app/apioteam/APIoT915014001.wgt', // 升级包地址
    },
  },
  getters: {
    getThemeIndex(state) {
      // 主题色的序号，该序号要与主题颜色保持一致
      return selectColorArr.findIndex((color) => color === state.themeColor);
    },
    // 字体主题色
    getThemeColorFont(state, getters) {
      return `themeColor__font-${getters.getThemeIndex}`;
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
      state.currentVersion = appversions.currentVersion || ''; // app版本号
      state.baseVersion = appversions.baseVersion || ''; // 基座版本号
    },
  },
  actions: {},
};
