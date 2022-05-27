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
      ></sys-tabnav-home>
    </view>
    <!-- #ifdef MP-ALIPAY --><sys-mine v-if="isMine"></sys-mine><!-- #endif -->
    <!-- #ifndef MP-ALIPAY --><sys-mine v-show="isMine"></sys-mine><!-- #endif -->
    <apiot-tabbar
      v-if="functionInterface.enableFooter"
      v-model="currentNav"
      :list="getFooterArea"
      :active-color="themeColor"
      :height="98"
      @change="changeTab"
    ></apiot-tabbar>
    <!-- #ifdef APP-PLUS -->
    <version-upgrade v-if="isGetVersion"></version-upgrade>
    <!-- #endif -->
  </view>
</template>

<script>
import { getMenuConfig } from '@/api/menuConfig';
import { getPersonalCenterUser } from '@/api/userCenter';
import { appRouteArr } from '@/config';
// import Location from '@/utils/app/location';
import VersionUpgrade from '@/MinePages/VersionUpgrade/index';
import SysTabnavHome from './components/SysTabnavHome';
import SysMine from './components/SysMine';

export default {
  components: { SysTabnavHome, SysMine, VersionUpgrade },

  props: {},

  data() {
    return {
      oldNav: 0,
      currentNav: 0,
      location: null,
      pageType: 'home',
      isMine: false,
      isGetVersion: false
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
    }
  },

  methods: {
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    // 获取菜单配置
    async getMenuConfig() {
      try {
        const result = await getMenuConfig();
        this.$store.commit('changMenus', result);
      } catch (e) {
        console.error(e);
      }
    },
    // 获取版本信息
    async getSystemVersion() {
      const res = await getPersonalCenterUser();
      const versionInfo = res.list || [];
      this.isGetVersion = true;
      this.$store.commit('setAppVersion', versionInfo);
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
      } else {
        const { type, id, menuName, groupCompId } = menu;
        // type菜单类型 1-普通菜单；2-系统菜单；3-应用
        if (type === 3) {
          uni.navigateTo({
            url: `/pages/MenuHome/applicationTab?menu=${id}&name=${menuName}&areaType=funcArea&groupCompId=${groupCompId}`
          });
        } else if (type === 2) {
          // 固定菜单
          const { routeName, offlineCheck } = menu;
          this.$store.commit('setSystemMenusConfig', { [id]: offlineCheck });
          const systemMenu = appRouteArr.find((sys) => sys.routeName === routeName);
          if (systemMenu.url) {
            uni.navigateTo({
              url: `${systemMenu.url}?id=${id}&title=${menuName}`,
              animationType: 'slide-in-right'
            });
          }
        } else {
          uni.navigateTo({
            url: `/menuConfigure/index?id=${id}&title=${menuName}`,
            animationType: 'slide-in-right'
          });
        }
      }
    }
  },

  onLoad() {
    this.getMenuConfig();
    this.getUserCenterInfo();
  },

  onShow() {
    this.currentNav = this.oldNav;
  },

  onReady() {
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
    // #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY
    // this.location = Location.openLocation({
    //   handleFunc: (position) => {
    //     console.log('position==============');
    //     console.log(position);
    //     // #ifdef APP-PLUS || MP-WEIXIN
    //     this.$store.dispatch('getAddress', position);
    //     // #endif
    //     // #ifdef MP-ALIPAY
    //     this.$store.commit('setLocation', {
    //       location: position.currentLocation,
    //       locations: position.locations
    //     });
    //     // #endif
    //   }
    // });
    // #endif
  },
  beforeDestroy() {
    this.$bus.$off('clickMenu');
  }
};
</script>

<style lang='scss' scoped>
.menuHome {
  background: #ffffff;
  &__menus {
    padding: 0 30rpx;
  }
}
</style>
