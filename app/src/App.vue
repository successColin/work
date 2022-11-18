<script>
export default {
  data() {
    return {
      amapPlugin: null,
      addressName: ''
    };
  },

  methods: {
    // 设置根节点字体
    resizeRoot() {},
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
    // #ifdef APP-PLUS
    plus.push.addEventListener('click', (message) => {
      const clent = uni.getSystemInfoSync().platform;
      if (clent === 'ios') {
        // 如果是IOS
        let { payload } = message;
        if (message.type !== 'click') {
          // APP离线点击包含click属性，这时payload是JSON对象
          payload = JSON.parse(message.payload);
        }
        if (!payload) {
          uni.navigateTo({
            url: '/index/index?source=messageClick'
          });
        }
      }
      if (clent === 'android') {
        uni.navigateTo({
          url: '/index/index?source=messageClick'
        });
      }
      console.log(message, 'push click');
    });
    plus.push.addEventListener('receive', (message) => {
      console.log(message, 'push receive');
      const clent = uni.getSystemInfoSync().platform;
      if (clent === 'ios') {
        // 如果是IOS
        const { payload } = message;
        // 【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）
        // 【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环
        if (message.aps == null && message.type === 'receive') {
          const { title, body } = payload;
          // 创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null
          plus.push.createMessage(body, JSON.stringify(payload), { title });
        }
      }
      if (clent === 'android') {
        const { payload } = message;
        const { title, body } = payload;
        // 创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null 1
        plus.push.createMessage(body, JSON.stringify(payload), { title });
      }
    });
    plus.push.getClientInfoAsync(
      (info) => {
        const cid = info.clientid;
        uni.setStorageSync('cid', cid);
      },
      (err) => {
        console.log(err, 'err');
      }
    );
    // #endif
  },
  onShow() {
    // document.body.addEventListener('touchstart', () => {});
  },
  onHide() {},
  created() {
    // #ifdef H5
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState({
        ...this.$store.state,
        ...JSON.parse(sessionStorage.getItem('store'))
      });
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
    // #endif
  }
};
</script>

<style lang="scss">
// #ifndef APP-PLUS-NVUE
// @import '@/assets/css/reset.css';
// #ifdef APP-PLUS
// @import '@/static/appFont/stylesheet.css';
// #endif
// #ifndef MP
@import url('https://at.alicdn.com/t/c/font_2808920_i99j8z3ezj8.css'); // app独有
@import url('http://at.alicdn.com/t/c/font_3736860_ttujc1jb0lo.css'); // 彩色
@import url('http://at.alicdn.com/t/c/font_2808920_vdnc4h16qa.css'); //纯色
// #endif
// #ifdef MP
@import '@/assets/css/iconfont/appIconfont.css'; // app独有
@import '@/assets/css/iconfont/commonSolid.css'; //纯色
//#endif
@import '@/assets/css/iconfont/commonColour.css'; // 彩色
@import '@/assets/css/iconfont/appIconColour.css'; // app独有彩色
@import '@/assets/iconfont/iconfont.css'; // 纯色
@import '@/assets/css/elementTheme.scss';
// #endif
</style>
