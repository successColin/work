<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 我的界面
-->
<template>
  <view class="menuMine">
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
            <image src="~@/static/img/common/post_icon.svg" class="post"></image>
            管理员
          </span>
        </p>
        <p>{{ userInfo.signature }}</p>
      </view>
      <view
        class="menuMine__user--code"
        @click.stop="goToPages('/MinePages/MyCode/index')"
      >
        <i class="appIcon appIcon-erweima"></i>
      </view>
    </view>

    <view class="menuMine__menus">
      <sys-tabnav-home
        :configData="myInterface"
        :isSuperman="supper"
      ></sys-tabnav-home>
    </view>
    <!-- 修改密码 -->
    <view class="menuMine__links">
      <view class="link" @click="goToPages('/MinePages/ChangePassword/index')">
        <view class="link-name">
          <i class="appIcon appIcon-anquanshezhi"></i>
          <span>修改密码</span>
        </view>
        <view class="link-arrow">
          <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
        </view>
      </view>
      <view class="link">
        <view class="link-name" @click="openFeedBack">
          <i class="appIcon appIcon-yijianfankui"></i>
          <span>意见反馈</span>
        </view>
        <view class="link-arrow">
          <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
        </view>
      </view>
      <view class="link" @click="handleDeleteCache">
        <view class="link-name">
          <i class="appIcon appIcon-qingchuhuancun"></i>
          <span>清除缓存</span>
        </view>
        <view class="link-arrow">
          <view class="storageInfo" v-show="storageInfo">{{
            storageInfo
          }}</view>
          <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
        </view>
      </view>
      <view class="link">
        <view class="link-name">
          <i class="appIcon appIcon-guanyubanben"></i>
          <span>关于版本</span>
        </view>
        <view class="link-arrow">
          <span class="newVersion" @click="showUpdate"
            v-if="appVersion !== currentVersion || baseVersion !== baseLatestVersion">新版本</span>
          <span v-else>{{appVersion}}</span>
          <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
        </view>
      </view>
      <view class="link" @click="showLogout">
        <view class="link-name">
          <i class="appIcon appIcon-zhuxiaodenglu"></i>
          <span>注销登录</span>
        </view>
        <view class="link-arrow">
          <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
        </view>
      </view>
    </view>

    <!-- 注销登录确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
    <!-- #ifdef APP-PLUS -->
    <!-- #endif -->
    <version-upgrade :isGetVersion.sync="isGetVersion" v-if="isGetVersion"></version-upgrade>
  </view>
</template>

<script>
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';
import SysTabnavHome from '@/pages/MenuHome/components/SysTabnavHome';
import VersionUpgrade from '@/MinePages/VersionUpgrade/index';
import { getSysUser, logout } from '@/api/mine';
import { Encrypt } from '@/utils';

export default {
  components: { UserIcon, SysTabnavHome, VersionUpgrade },

  props: {},

  data() {
    return {
      storageInfo: '',
      showDeleteConfirm: false,
      isGetVersion: false
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
    appVersion() {
      return this.$store.state.base.appVersion;
    },
    baseVersion() {
      return this.$store.state.base.baseVersion;
    },
    baseLatestVersion() {
      return this.$store.state.base.baseLatestVersion;
    },
    currentVersion() {
      return this.$store.state.base.currentVersion;
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
    showeleteCache() {
      this.showDeleteConfirm = true;
    },
    // 清除缓存
    async handleDeleteCache() {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: this.$t('mine.isClearCache')
        });
        for (let i = 0; i < this.storageKeys.length; i += 1) {
          const key = this.storageKeys[i];
          if (
            key !== 'language' &&
            key !== 'baseUrl' &&
            key !== 'inTestServer' &&
            key !== 'formalServer' &&
            key !== 'outTestServer' &&
            key !== 'otherTestServer' &&
            key !== 'baseUrlIndex'
          ) {
            uni.removeStorageSync(key);
          }
        }
        uni.showToast({
          title: this.$t('pageTip-cacheClearanceSuccessful'),
          duration: 1000
        });
        this.storageInfo = 0;
      } catch (error) {
        console.error(error);
      }
    },
    async showLogout() {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: `是否${this.$t('mine.isLoginOut')}`
        });
        await logout();
        uni.removeStorageSync('token');
        uni.removeStorageSync('automatic');
        uni.reLaunch({ url: '/pages/index/index' });
      } catch (error) {
        console.error(error);
      }
    },
    openFeedBack() {
      // 打开反馈中心地址
      const { tenantVO, account } = this.userInfo;
      const { tenantCode } = tenantVO;
      console.log(this.userInfo);
      console.log(Encrypt(account));
      const url = `http://121.196.97.165?userInfo=${Encrypt({
        userInfo: JSON.stringify({ companyKey: tenantCode, account })
      })}`;
      // #ifdef H5
      window.open(url);
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.openURL(url);
      // #endif
    },
    goToPages(url) {
      uni.navigateTo({
        url
      });
    },
    showUpdate() {
      this.isGetVersion = true;
    }
  },
  mounted() {
    console.log('mysel');
    uni.getStorageInfo({
      success: (res) => {
        this.storageInfo =
          res.currentSize > 1024
            ? `${parseInt((res.currentSize * 10) / 1024, 10) / 10}MB`
            : `${res.currentSize}KB`;
        this.storageKeys = res.keys;
      }
    });
    uni.setNavigationBarTitle({
      title: '我的' // 中文：我的
    });
  }
};
</script>

<style lang='scss' scoped>
.menuMine {
  background: #f6f6f8;
  &__menus {
    background: #ffffff;
    padding: 0 30rpx;
    overflow: auto;
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
    margin: 20rpx 0;
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
  &__links {
    width: 100%;
    box-sizing: border-box;
    .link {
      height: 108rpx;
      box-shadow: inset 0px -1rpx 0px 0px #e9e9e9;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      align-items: center;
      color: #333333;
      background: #ffffff;
      padding: 0 30rpx;
      .link-name {
        display: flex;
        align-items: center;
        .appIcon-anquanshezhi {
          background: linear-gradient(180deg, #5ee1a7 0%, #0fb38f 100%);
        }
        .appIcon-yijianfankui {
          background: linear-gradient(180deg, #fe7777 0%, #f04634 100%);
        }
        .appIcon-qingchuhuancun {
          background: linear-gradient(180deg, #68b1ff 0%, #3779ff 100%);
        }
        .appIcon-guanyubanben {
          background: linear-gradient(180deg, #ff9464 0%, #ff5b34 100%);
        }
        .appIcon-zhuxiaodenglu {
          background: linear-gradient(180deg, #fccb3a 0%, #f79c1b 100%);
        }
        .appIcon {
          margin-right: 22rpx;
          font-size: 60rpx;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .link-arrow {
        width: 160rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #808080;
        .newVersion{
          width: 98rpx;
          height: 38rpx;
          color: #FFFFFF;
          font-size: 20rpx;
          line-height: 38rpx;
          text-align: center;
          padding-right: 10rpx;
          box-sizing: border-box;
          // background: url('../../../../MinePages/images/version_image.svg')
            // center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .link:nth-child(3) {
      margin-bottom: 18rpx;
    }
  }
}
</style>
