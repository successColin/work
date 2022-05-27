<script>
export default {
  data() {
    return {
      amapPlugin: null,
      addressName: ''
    };
  },

  methods: {
    // 获取系统基本信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          const { statusBarHeight, titleBarHeight, language, platform, windowHeight } = res;
          // statusBar: 状态栏高度
          // navigationBar: 导航栏的高度
          // customBar = 状态栏高度 + 导航栏高度
          const statusBar = statusBarHeight || 0;
          let customBar = statusBar + 45;
          // #ifdef MP
          // if (res.platform === 'android') customBar = statusBar + 50;
          // #endif

          // // #ifdef MP-WEIXIN
          // const menuButton = wx.getMenuButtonBoundingClientRect();
          // console.log(menuButton);
          // customBar = (menuButton.top - statusBarHeight) * 2 + menuButton.height;
          // // #endif

          // #ifdef MP-ALIPAY
          customBar = titleBarHeight + statusBarHeight;
          // #endif

          this.$store.commit('setBaseSystemInfo', {
            statusBar,
            titleBarHeight,
            customBar,
            language,
            platform,
            windowHeight
          });
        }
      });
    }
  },

  onLaunch() {
    this.getSystemInfo();
  },
  onShow() {
    // document.body.addEventListener('touchstart', () => {});
  },
  onHide() {}
};
</script>

<style lang="scss">
// #ifndef APP-PLUS-NVUE
@import '@/assets/css/reset.css';
// #ifndef MP
// app独有
@import url('https://at.alicdn.com/t/font_2808920_9l2b75434a.css');
// app与pc共有
@import url('https://at.alicdn.com/t/font_2516478_vw78gt5teg.css');
// #endif
// #ifdef MP
@import '@/assets/css/iconfont/appIconfont.css';
@import '@/assets/css/iconfont/commonIconfont.css';
//#endif
@import '@/assets/css/elementTheme.scss';
// #endif
</style>
