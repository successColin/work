<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 配置界面
 navStyle="theme"
      :showBackbtn="false"
-->
<template>
  <view>
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar
      v-if="hasTop"
      :navStyle="navStyle"
      :showBackbtn="showBackbtn"
      :title="menuConfig.title"
    >
      <template v-if="!isHomePage && menuConfig.enableshare === 1" slot="right">
        <share-btn :menuConfig="menuConfig"></share-btn>
      </template>
    </apiot-navbar>
    <!-- #endif -->

    <apiot-menu
      v-if="menuConfig.id"
      ref="menuMain"
      :menuConfig="menuConfig"
      :menuHeight="menuHeight"
      @initPage="initPage"
    ></apiot-menu>
  </view>
</template>

<script>
import ApiotMenu from './components/MenuMain';
import ShareBtn from './components/ShareBtn';

export default {
  props: {},

  components: { ShareBtn, ApiotMenu },

  data() {
    return {
      hasDing: false,
      // 菜单界面基础配置
      menuConfig: {
        id: null, // 唯一标识=
        title: null, // 名称
        isAdd: false, // 是否新增
        isPanel: false,
        isFooter: false, // 是否从底部导航栏点击进入
        parentCompId: null, // 父亲唯一标识
        parentSysMenuDesignId: null, // 父亲设计组
        showTab: false, // 是否显示tab页
        sourceFlagId: null, // 如果是弹出面板，来源控件的唯一id
        enableshare: 0 // 是否显示分享按钮
      }
    };
  },

  computed: {
    // 是否为首页
    isHomePage() {
      const { type, pageConfig } = this.homePageConfig;
      if (type !== 1) return pageConfig.id === this.menuConfig.id;
      return false;
    },
    navStyle() {
      const { isHomePage, menuConfig } = this;
      if (isHomePage) return 'theme';

      return menuConfig.isFooter ? 'hasNoBack' : 'hasBack';
    },
    showBackbtn() {
      const { isHomePage } = this;
      if (!isHomePage) return true;

      return this.homePageConfig.showBack;
    },
    homePageConfig() {
      return this.$store.state.menu.homePageConfig;
    },
    hasTop() {
      return !(this.hasDing && !this.menuConfig.isFooter);
    },
    menuHeight() {
      const { windowHeight, customBar, statusBar, bottomNavHeight } =
        this.$store.state.base.systemInfo;
      let height = windowHeight;
      // 有顶部返回栏
      if (this.hasTop) height -= customBar;
      else height -= statusBar;

      // 有底部菜单栏
      if (this.menuConfig.isFooter) height -= bottomNavHeight;
      return height;
    }
  },

  methods: {
    // 刷新菜单
    forceUpdate() {
      this.$refs.menuMain.forceUpdate();
    },
    initPage(config) {
      this.menuConfig.enableshare = config.enableshare;
    }
  },

  onLoad(option) {
    option = option || {};
    this.onlyFlag = this._uid;
    option.isFinish = option.isFinish && option.isFinish === '1';
    if (option.isProcess) option.isProcess = true;
    else option.isProcess = false;
    this.menuConfig = { ...this.menuConfig, ...option };
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
  },
  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.menuConfig.title
    });
    // #endif

    // #ifdef APP-PLUS
    // const Color = plus.android.importClass('android.graphics.Color');
    // plus.android.importClass('android.view.Window');
    // const mainActivity = plus.android.runtimeMainActivity();
    // // eslint-disable-next-line camelcase
    // const window_android = mainActivity.getWindow();
    // window_android.setNavigationBarColor(Color.argb(0, 246, 246, 248));
    // #endif
  },

  onShow() {
    if (!this.menuConfig.isPanel) this.$store.commit('setMenuFlag', this._uid);

    // 在缓存里记录当前菜单id
    if (!this.menuConfig.isPanel && !this.menuConfig.id) {
      uni.setStorageSync('curMenuId', this.menuConfig.id);
    }
  },

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
</style>
