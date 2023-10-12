<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 我的界面
-->
<template>
  <view class="menuMine" :class="[mode]">
    <view
      class="menuMine__user"
      @click="goToPages('/MinePages/BasicInfo/index')"
    >
      <view class="menuMine__user--icon">
        <user-icon :userInfo="userInfo"></user-icon>
      </view>
      <view class="menuMine__user--desc">
        <p class="menuMine__user--name">
          {{ userInfo.username }}
          <span class="userpost">
            <image
              src="~@/static/img/common/post_icon.svg"
              class="post"
            ></image>
            {{ userInfo.userPostName || '' }}
          </span>
        </p>
        <p>{{ userInfo.signature || '' }}</p>
      </view>
      <view
        v-if="myInterface.sysModule && myInterface.sysModule.enableQrCode === 1"
        class="menuMine__user--code"
        @click.stop="goToPages('/MinePages/MyCode/index')"
      >
        <i class="appIcon appIcon-erweima"></i>
      </view>
    </view>

    <view class="menuMine__menus" v-if="myInterface.funcArea.groupArr.length">
      <sys-tabnav-home
        :hornMarkNums="hornMarkNums"
        :configData="myInterface"
        :isSuperman="supper"
      ></sys-tabnav-home>
    </view>
    <!-- 修改密码 -->
    <view class="menuMine__links">
      <template v-for="item in fixItems">
        <mine-item v-if="item.isOpen" :value="item" :key="item.id"></mine-item>
      </template>
    </view>
  </view>
</template>

<script>
import { getSysUser } from '@/api/mine';

import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';
import SysTabnavHome from '@/MenuHome/components/SysTabnavHome';
import MineItem from './MineItem';

export default {
  components: { UserIcon, SysTabnavHome, MineItem },

  props: {
    // 角标
    hornMarkNums: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      isGetVersion: false,
      mode: 'list' // card
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
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
    // 固定菜单列表
    fixItems() {
      const { sysModule = {} } = this.myInterface;
      return [
        {
          id: 'changePassword',
          name: this.$t('mine.changePassword'),
          icon: 'appIcon-anquanshezhi',
          color: { color1: '#5ee1a7', color2: '#0fb38f' },
          isOpen: sysModule.enableChangePas === 1
        },
        {
          id: 'feedback',
          name: this.$t('mine.feedback'),
          icon: 'appIcon-yijianfankui',
          color: { color1: '#fe7777', color2: '#f04634' },
          isOpen: sysModule.enableFeedback === 1
        },
        // #ifdef H5
        {
          id: 'systemScan',
          name: '系统扫描',
          icon: 'appIcon-xitongsaomiao',
          color: { color1: '#fccb3a', color2: '#f79c1b' },
          isOpen: true
        },
        // #endif
        {
          id: 'clearCache',
          name: this.$t('mine.clearCache'),
          icon: 'appIcon-qingchuhuancun',
          color: { color1: '#68b1ff', color2: '#3779ff' },
          isOpen: sysModule.enableClearCache === 1
        },
        {
          id: 'upload',
          name: this.$t('mine.aboutVersion'),
          icon: 'appIcon-guanyubanben',
          color: { color1: '#ff9464', color2: '#ff5b34' },
          isOpen: sysModule.enableAboutVersion === 1
        },
        {
          id: 'logoutLogin',
          name: this.$t('mine.LogoutLogin'),
          icon: 'appIcon-zhuxiaodenglu',
          color: { color1: '#fccb3a', color2: '#f79c1b' },
          isOpen: sysModule.enableLogin === 1
        }
      ];
    }
  },

  methods: {
    goToPages(url) {
      uni.navigateTo({
        url
      });
    },
    // 获取用户信息
    async getUserMsg() {
      try {
        const result = await getSysUser();
        this.userInfo = result;
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    }
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: this.$t('mine.mine') // 中文：我的
    });
  }
};
</script>

<style lang='scss' scoped>
.menuMine {
  background: #f6f6f8;
  &__links {
    background: #fff;
  }
  &.card {
    padding: 30rpx;
    .menuMine__user,
    .menuMine__menus,
    .menuMine__links {
      box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
      border-radius: 18rpx !important;
    }
  }
  &.list {
    .menuMine__links {
      .mineItem:nth-child(3) {
        margin-bottom: 18rpx;
        &::after {
          content: '';
          display: block;
          height: 18rpx;
          position: absolute;
          left: 0;
          right: 0;
          background: #f6f6f8;
        }
      }
    }
  }

  &__menus {
    background: #ffffff;
    padding: 0 30rpx;
    overflow: auto;
  }
  &__user {
    font-family: $--font-family;
    padding: 62rpx 0 58rpx 0;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
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
      @include fontBlob(500);
      color: #222222;
      line-height: 50rpx;
      display: flex;
      align-items: center;
      .userpost {
        height: 44rpx;
        line-height: 44rpx;
        padding: 0 15rpx;
        background: #fff1d4;
        border-radius: 22rpx;
        color: #cca65f;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 30rpx;
        .post {
          width: 28rpx;
          height: 28rpx;
          margin-right: 10rpx;
        }
      }
    }
    &--code {
      width: 100rpx;
      height: 100rpx;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      .appIcon-erweima {
        font-size: 48rpx;
        color: #bbc3cd;
      }
    }
  }
  &__menus {
    margin-bottom: 20rpx;
    ::v-deep {
      .modemenu__one {
        // padding: 0 30rpx;
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
  &__links {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
