<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 底部导航界面
-->
<template>
  <view class="menuHome">
    <apiot-navbar
      navStyle="theme"
      :showBackbtn="false"
      :title="currentTitle || $t('tabNavMenu.home')"
    >
      <div slot="right" v-show="functionInterface.enableRightFunc">
        <div class="menuHome__search" @click="handleJump">
          <i class="appIcon appIcon-sousuo"></i>
          请输入关键字搜索
        </div>
      </div>
    </apiot-navbar>
    <!-- 为了兼容支付宝小程序不支持v-show -->
    <!-- #ifdef MP-ALIPAY --><view class="menuHome__menus" v-if="!isMine"
      ><!-- #endif -->
    <!-- #ifndef MP-ALIPAY --><view class="menuHome__menus" v-show="!isMine"
      ><!-- #endif -->
      <sys-tabnav-home
        :configData="functionInterface"
        :isSuperman="supper"
        :swiperList="swiperList"
        :hornMarkNums="hornMarkNums"
        :announceList="announceList"
      ></sys-tabnav-home>
    </view>
    <!-- #ifdef MP-ALIPAY --><sys-mine v-if="isMine"
      :hornMarkNums="hornMarkNums"></sys-mine><!-- #endif -->
    <!-- #ifndef MP-ALIPAY --><sys-mine v-show="isMine"
      :hornMarkNums="hornMarkNums"></sys-mine><!-- #endif -->
    <apiot-tabbar
      v-if="functionInterface.enableFooter"
      v-model="currentNav"
      :list="getFooterArea"
      :active-color="themeColor"
      :height="98"
      :hornMarkNums="hornMarkNums"
      @change="changeTab"
    ></apiot-tabbar>
    <!-- #ifdef APP-PLUS -->
    <version-upgrade v-if="isGetVersion"></version-upgrade>
    <!-- #endif -->
    <!-- 确认弹窗 -->
    <apiot-modal
      ref="apiotModal"
      cancelTitle="好的"
      :showSure="false"
    ></apiot-modal>
  </view>
</template>

<script>
import { WX_MP } from '@/config';
import { getMenuConfig, getMailCount, getAnnounceList } from '@/api/menuConfig';
import { getPersonalCenterUser, doBindCid } from '@/api/userCenter';
import { getInfoByKey } from '@/api/mine';
import VersionUpgrade from '@/MinePages/VersionUpgrade/index';
import SysTabnavHome from './components/SysTabnavHome';
import SysMine from './components/SysMine';
import hornMarkMixin from './hornMarkMixin';

export default {
  components: { SysTabnavHome, SysMine, VersionUpgrade },

  props: {},
  mixins: [hornMarkMixin],

  data() {
    return {
      oldNav: 0,
      currentNav: 0,
      location: null,
      pageType: 'home',
      isMine: false,
      isGetVersion: false,
      announceList: [],
      sysNoticeInterval: null
    };
  },

  computed: {
    // 工作台功能区
    functionInterface() {
      return this.$store.state.menu.functionInterface;
    },
    // 是否为超级用户
    supper() {
      return this.$store.state.menu.supper;
    },
    // 底部导航栏
    getFooterArea() {
      return this.$store.getters.getFooterArea;
    },
    // 主体色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    currentTitle() {
      const { enableFooter } = this.functionInterface;
      const { currentNav } = this;
      const navList = this.$store.getters.getFooterArea;
      return enableFooter ? navList[currentNav].text : '';
    },
    // 首页轮播图
    swiperList() {
      const { enableRotation, rotateImg } = this.$store.state.menu.functionInterface;
      return enableRotation ? rotateImg.imgArr : [];
    },
    appVersion() {
      return this.$store.state.base.appVersion;
    },
    baseLatestVersion() {
      return this.$store.state.base.baseLatestVersion;
    },
    // 工作台功能区
    myInterface() {
      return this.$store.state.menu.myInterface;
    },
    // 主体色
    enableNotice() {
      return this.functionInterface.enableNotice;
    }
  },

  methods: {
    // 点击搜索
    handleJump() {
      uni.navigateTo({
        animationType: 'pop-in',
        url: '/PagesGlobalSearch/index'
      });
    },
    // 获取公告列表
    async getAnnounceList() {
      const { userInfo = {} } = this;
      const params = {
        status: 2,
        userId: userInfo.id
      };
      const res = await getAnnounceList(params);
      this.announceList = res;
    },
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
      this.allCount();
      // #ifdef APP-PLUS
      const cid = uni.getStorageSync('cid');
      console.log(cid);
      if (cid && cid !== res.cid) {
        doBindCid({ account: res.account, cid });
      }
      // #endif
    },
    // 获取菜单配置
    async getMenuConfig() {
      try {
        const result = await getMenuConfig();
        this.$store.commit('changMenus', result);
        this.websocketFun();
        this.getSubscriptMenu();
        if (this.enableNotice === 1) {
          this.getAnnounceList();
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取版本信息
    async getSystemVersion() {
      const res = await getInfoByKey({ key: 'UPGRADE_PROPERTIES' });
      const versionInfo = res.parameterJson || [];
      await this.$store.commit('setAppVersion', versionInfo);
      // #ifdef APP-PLUS
      // 如果是app时监测更新，upgradeMode为3是不跳提醒
      this.appUpdater();
      // #endif
    },
    // app升级
    appUpdater() {
      const _this = this;
      plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
        this.$store.commit('setAppBaseInfo', {
          currentVersion: widgetInfo.version, // 当前app版本号
          baseVersion: widgetInfo.versionCode // 当前基座版本号
        });
        if (
          widgetInfo.version !== _this.appVersion ||
          widgetInfo.versionCode !== _this.baseLatestVersion
        ) {
          // pp版本号不一致
          _this.isGetVersion = true;
        }
      });
    },
    // 切换底部
    changeTab(index) {
      const navList = this.$store.getters.getFooterArea;
      const menu = navList[index];
      // 是否是我的
      if (menu.isMine) {
        this.oldNav = index;
        this.isMine = true;
      } else if (menu.isSy) {
        // 首页
        this.isMine = false;
        this.oldNav = index;
        if (this.initHornMarkNums === true) {
          this.getSubscriptNumberFun();
        }
      } else {
        const { id } = menu;
        this.$store.dispatch('jumpMenu', { menuId: id });
      }
    },
    async initMessage() {
      const param = {
        innerMailCategorys: ['WORK_FLOW', 'SYSTEM'],
        hasRead: 2
      };
      const data = (await getMailCount(param)) || 0;
      this.hornMarkNums.sysNotification = data;
    },
    allCount() {
      if (this.fixedMenuMark.sysNotification) {
        this.initMessage();
        this.sysNoticeInterval = setInterval(() => {
          this.initMessage();
        }, 60000);
      }
    },
    // 与 pc 端一样的websocket
    websocketFun() {
      const userCenter = uni.getStorageSync('userCenter');
      console.log(userCenter);
      const { account } = userCenter;
      // 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
      let host;
      // #ifdef H5
      host = '192.168.0.136:8080'; // window.location.host;
      // #endif
      // #ifndef H5
      host = this.$apiot.getComIP();
      // #endif
      const _this = this;
      let url = '';
      if (host.indexOf('http') > -1) {
        const arr = host.split('://');
        if (arr.includes('https')) {
          url += `wss://${arr[1]}/socketServer/${account}:APP`;
        } else {
          url += `ws://${arr[1]}/socketServer/${account}:APP`;
        }
      } else {
        // 少 wss 和 ws 判断
        url += `ws://${host}/socketServer/${account}:APP`;
      }
      url += `?token=${uni.getStorageSync('token')}`;
      uni.connectSocket({
        url,
        success(data) {
          console.log(data, '连接成功');
        },
        fail(data) {
          console.log(data, '连接失败');
        }
      });
      uni.onSocketMessage(async (res) => {
        const e = JSON.parse(res.data);
        console.log(e);
        console.log(`收到服务器内容：${e}`);
        if (e.bizKey === 'SESSION_KICKED') {
          uni.closeSocket();
          try {
            await _this.$refs.apiotModal.showAsyncModal({
              content: '您的账号已被挤下线，回到登录页可重新登录！',
              title: _this.$t('common.tip')
            });
          } catch (error) {
            console.log(error);
            uni.reLaunch({ url: '/Login/index' });
          }
        }
      });
    },
    // 关闭websocket【离开这个页面的时候执行关闭】
    closeSocket() {
      this.socketTask.close({
        success(res) {
          console.log('关闭成功', res);
        }
      });
    }
  },

  onLoad() {
    this.getUserCenterInfo();
    this.getMenuConfig();
    this.getSystemVersion();

    // 获取全局配置
    this.$store.dispatch('getGlobalConfig', 'UREPORT_URL,WATER_MASK,THEME_AND_LOGO');
    // #ifdef H5
    // 获取h5状态下的扫描项目类型2=泸州老窖
    this.$store.dispatch('getCurrentDict', 'SCAN_ITEM_TYPE');
    // #endif
  },

  onShow() {
    const { homePageConfig } = this.$store.state.menu;
    this.currentNav = this.oldNav;
    if (this.initHornMarkNums === true && !homePageConfig.isPreview) {
      this.getSubscriptNumberFun();
    }
  },
  mounted() {
    const { homePageConfig } = this.$store.state.menu;
    if (homePageConfig.isPreview) {
      const { pageConfig } = homePageConfig;
      this.$store.commit('setMenuHomePageConfig', { canclePreview: true });
      // 需要预览
      const { id, title, isPreviewPanel } = pageConfig;
      uni.navigateTo({
        url: `/menuConfigure/index?id=${id}&title=${title}&isPreview=true&mustLoad=true&isPreviewPanel=${isPreviewPanel}`,
        animationType: 'slide-in-right'
      });
    }
  },
  onReady() {
    this.$store.commit('changMenus', '');
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.currentTitle
    });

    // #endif
    // #ifdef APP-PLUS
    // const Color = plus.android.importClass('android.graphics.Color');
    // plus.android.importClass('android.view.Window');
    // const mainActivity = plus.android.runtimeMainActivity();
    // // eslint-disable-next-line camelcase
    // const window_android = mainActivity.getWindow();
    // window_android.setNavigationBarColor(Color.argb(255, 255, 255, 255));
    // #endif
  },
  beforeDestroy() {
    this.$bus.$off('clickMenu');
    // this.closeSocket();
    clearInterval(this.sysNoticeInterval);
  },
  // 微信小程序
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    return {
      title: WX_MP.NAME, // 分享的名称
      path: 'pages/index/index',
      mpId: WX_MP.KEY
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: WX_MP.NAME // 分享的名称
    };
  }
  // #endif
};
</script>

<style lang='scss' scoped>
.menuHome {
  background: #ffffff;

  &__menus {
    padding: 0 30rpx;
  }
  &__search {
    margin-right: 30rpx;
    width: 500rpx;
    height: 58rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.7);
    font-family: PingFangSC-Regular, PingFang SC;
    .appIcon-sousuo {
      font-size: 34rpx;
      margin: 0 13rpx 0 14rpx;
    }
  }
}
</style>
