<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 配置界面
-->
<template>
  <view>
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar
      v-if="hasTop"
      :navStyle="menuConfig.isFooter ? 'hasNoBack' : 'hasBack'"
      :title="menuConfig.title"
    ></apiot-navbar>
    <!-- #endif -->

    <apiot-menu
      v-if="menuConfig.id"
      ref="menuMain"
      :menuConfig="menuConfig"
      :menuHeight="menuHeight"
    ></apiot-menu>
  </view>
</template>

<script>
export default {
  props: {},

  components: {},

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
        sourceFlagId: null // 如果是弹出面板，来源控件的唯一id
      }
    };
  },

  computed: {
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
    }
  },

  onLoad(option) {
    option = option || {};
    this.onlyFlag = this._uid;
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
  },

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
</style>
