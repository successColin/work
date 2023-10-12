<!--
 * @Author: sss
 * @Date: 2023-03-01 10:40:38
 * @Last Modified by: sss
 * @Last Modified time: 2023-03-01 10:40:38
 * @Desc: 我的固定菜单
-->
<template>
  <view class="mineItem">
    <view class="mineItem__content" @click.stop="clickItem">
      <gradient-icon
        :icon="value.icon"
        iconfont="appIcon"
        :size="62"
        :enableGradient="1"
        :gradientObj="value.color"
      ></gradient-icon>
      <span class="title">{{ value.name }}</span>
      <view class="mineItem-arrow">
        <span class="newVersion" v-if="isShowUpload">
          {{ $t('mine.newUpdateVersion') }}</span
        >
        <span v-if="showVersion">{{ showVersion }}</span>
        <span v-if="showCache">{{ cacheSize }}</span>
        <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
      </view>
    </view>
    <!-- 注销登录确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
    <!-- #ifdef APP-PLUS -->
    <template v-if="isGetVersion">
      <version-upgrade :isGetVersion.sync="isGetVersion"></version-upgrade>
    </template>
    <!-- #endif -->
  </view>
</template>

<script>
import { Encrypt } from '@/utils';
import { logout } from '@/api/mine';
import GradientIcon from '../../GradientIcon';
import VersionUpgrade from '@/MinePages/VersionUpgrade/index';

export default {
  components: { GradientIcon, VersionUpgrade },

  props: {
    value: Object,
    url: String,
    iconName: String
  },

  data() {
    return {
      cacheSize: '',
      storageKeys: [],
      isGetVersion: false
    };
  },

  computed: {
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
    },
    // 是否需要显示更新标识
    isShowUpload() {
      const { appVersion, currentVersion, baseVersion, baseLatestVersion } = this;
      const { id } = this.value;
      if (id !== 'upload') return false;
      let canUpload = false;
      // #ifdef APP-PLUS
      canUpload = appVersion !== currentVersion || baseVersion !== baseLatestVersion;
      // #endif
      return canUpload;
    },
    // 版本号
    showVersion() {
      const { appVersion, currentVersion, baseVersion } = this;
      const { id } = this.value;
      if (id !== 'upload') return false;
      let version = appVersion;
      // #ifdef APP-PLUS
      version = `${currentVersion}_${baseVersion}`;
      // #endif
      return version;
    },
    showCache() {
      const { id } = this.value;
      return id === 'clearCache';
    }
  },

  methods: {
    clickItem() {
      const { value } = this;
      const { id } = value;
      if (id === 'clearCache') {
        // 清除缓存
        this.clearCache();
      } else if (id === 'changePassword') {
        uni.navigateTo({
          url: '/MinePages/ChangePassword/index'
        });
      } else if (id === 'logoutLogin') this.logoutLogin();
      else if (id === 'feedback') this.openFeedBack();
      else if (id === 'upload') this.showUpdate();
    },
    showUpdate() {
      if (this.isShowUpload) {
        this.isGetVersion = true;
      }
    },
    // 扫码
    async gotoScan() {
      let result = '';
      try {
        const qrResult = await this.$apiot.scanCode();
        result = qrResult.result;
        if (result && result.indexOf('APIoT_STATIC_PREVIEW') !== -1) {
          const info = result.match(/APIoT_STATIC_PREVIEW(\S*)PREVIEW_END/);
          if (info.length > 1) {
            const str = info[1];
            const obj = JSON.parse(str);
            const { id, panelName: title, isPreviewPanel } = obj;
            if (id) {
              setTimeout(() => {
                uni.navigateTo({
                  url: `/menuConfigure/index?id=${id}&title=${title}&isPreview=true&mustLoad=true&isPreviewPanel=${isPreviewPanel}`,
                  animationType: 'slide-in-right'
                });
              }, 4);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 注销
    async logoutLogin() {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: `${this.$t('mine.isLoginOut')}`
        });
        await logout();
        uni.removeStorageSync('token');
        uni.reLaunch({ url: '/pages/index/index?source=logout' });
      } catch (error) {
        console.error(error);
      }
    },
    // 打开外部地址
    openFeedBack() {
      // 打开反馈中心地址
      const { tenantVO, account } = this.userInfo;
      const { tenantCode } = tenantVO;
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
    // 清除缓存
    async clearCache() {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: this.$t('mine.isClearCache')
        });
        for (let i = 0; i < this.storageKeys.length; i += 1) {
          const key = this.storageKeys[i];
          if (
            key !== 'token' &&
            key !== 'apiotLanguage' &&
            key !== 'username' &&
            key !== 'password' &&
            key !== 'currentServe' &&
            key !== 'userCenter'
          ) {
            uni.removeStorageSync(key);
          }
        }
        uni.showToast({
          title: this.$t('mine.pageTip-cacheClearanceSuccessful'),
          duration: 1000
        });
        this.cacheSize = 0;
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {},
  created() {
    if (this.value.id === 'clearCache') {
      uni.getStorageInfo({
        success: (res) => {
          this.cacheSize =
            res.currentSize > 1024
              ? `${parseInt((res.currentSize * 10) / 1024, 10) / 10}MB`
              : `${res.currentSize}KB`;
          this.storageKeys = res.keys;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.mineItem {
  padding: 0 30rpx;
  // background: #ffffff;
  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 108rpx;
    font-size: 30rpx;
    color: #333333;
    // background: #ffffff;
    box-shadow: inset 0px -1rpx 0px 0px #e9e9e9;
  }

  .title {
    margin-left: 22rpx;
    flex: 1;
  }
  &-arrow {
    width: 160rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #808080;
    .newVersion {
      width: 98rpx;
      height: 38rpx;
      color: #ffffff;
      font-size: 20rpx;
      line-height: 38rpx;
      text-align: center;
      padding-right: 10rpx;
      box-sizing: border-box;
      background: url('~@/static/img/app/version_image.svg') center no-repeat;
      background-size: 100% 100%;
      flex-shrink: 0;
    }
  }
}
</style>
