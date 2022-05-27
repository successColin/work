<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 底部导航界面
-->
<template>
  <!-- <page-meta background-color="#ffffff"> </page-meta> -->
  <view class="menuMine">
    <apiot-navbar
      navStyle="theme"
      :showBackbtn="false"
      :title="currentTitle"
    ></apiot-navbar>
    <view class="menuMine__user">
      <view class="menuMine__user--icon">
        <user-icon :userInfo="userInfo"></user-icon>
      </view>
      <!-- <user-icon class="menuMine__user--icon" :userInfo="userInfo"></user-icon> -->
      <view class="menuMine__user--desc">
        <p class="menuMine__user--name">{{ userInfo.username }}</p>
        <p>{{ userInfo.signature }}</p>
      </view>
    </view>

    <view class="menuMine__menus">
      <sys-tabnav-home
        :configData="myInterface"
        :isSuperman="supper"
      ></sys-tabnav-home>
    </view>
    <apiot-tabbar
      v-if="enableFooter"
      v-model="currentNav"
      :list="getFooterArea"
      :active-color="themeColor"
      @change="changeTab"
    ></apiot-tabbar>
  </view>
</template>

<script>
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';
import SysTabnavHome from '@/pages/MenuHome/components/SysTabnavHome';
import { getSysUser } from '@/api/mine';

export default {
  components: { UserIcon, SysTabnavHome },

  props: {},

  data() {
    return {
      currentNav: 0
      // userInfo: {}
    };
  },

  computed: {
    // 是否显示底部导航栏
    enableFooter() {
      return this.$store.state.menu.functionInterface.enableFooter;
    },
    // 工作台功能区
    myInterface() {
      return this.$store.state.menu.myInterface;
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
      const { enableFooter } = this.$store.state.menu.functionInterface;
      const { currentNav } = this;
      const navList = this.$store.getters.getFooterArea;
      return enableFooter ? navList[currentNav].text : '';
    },
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  methods: {
    // 获取用户信息
    async getUserMsg() {
      try {
        const result = await getSysUser();
        this.userInfo = result;
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    },
    // 切换底部
    changeTab(index) {
      const navList = this.$store.getters.getFooterArea;
      const menu = navList[index];
      // eslint-disable-next-line no-undef
      const pageLevel = getCurrentPages();
      // 是否是主页
      if (menu.isSy) {
        uni.navigateBack({
          delta: pageLevel.length
        });
      } else {
        // 配置界面
        uni.navigateTo({
          url: `/menuConfigure/index?isFooter=true&footerIndex=${index}`,
          animationType: 'slide-in-right'
        });
      }
    }
  },

  onLoad() {
    this.currentNav = this.$store.getters.getFooterArea.length - 1;
  },

  onShow() {
    this.currentNav = this.$store.getters.getFooterArea.length - 1;
    // this.getUserMsg();
  },

  onReady() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.currentTitle
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.menuMine {
  height: 100vh;
  background: #f6f6f8;
  &__menus {
    background: #ffffff;
    padding: 0 30rpx;
  }
  &__user {
    font-family: PingFangSC-Regular, PingFang SC;
    padding: 62rpx 0 58rpx 0;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--icon {
      width: 100rpx;
      height: 100rpx;
      flex-shrink: 0;
      margin: 0 40rpx;
    }
    &--desc {
      flex: 1;
      font-size: 26rpx;
      color: #888888;
      line-height: 37rpx;
    }
    &--name {
      font-size: 36rpx;
      font-weight: 600;
      color: #222222;
      line-height: 50rpx;
    }
  }
  &__menus {
    margin-top: 20rpx;
    ::v-deep {
      .modemenu__one {
        padding: 0 30rpx;
        .showIcon {
          height: 108rpx;
          &:last-child {
            border-bottom: none;
          }
        }
        &--content {
          padding: 0;
        }
      }
      .modemenu__four {
        padding-bottom: 20rpx;
      }
    }
  }
}
</style>
