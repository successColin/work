<template>
  <div>
    <apiot-modal ref="apiotModal" class="backmask">
    <!-- <apiot-modal v-if="showUpload && uplaodType" ref="apiotModal" class="backmask"> -->
      <image class="updateImg" mode="aspectFit" src="../images/updateVersion.svg"></image>
      <view class="large">发现新版本</view>
      <view class="normal">是否升级到{{appVersion}}？</view>
    </apiot-modal>
    <apiot-modal ref="apiotConfirmModal" class="backmask">
    </apiot-modal>
  </div>
</template>

<script>

export default {
  name: 'VersionUpgrade',
  data() {
    return {
      uplaodType: 0,
      uploadMsg: {
        1: 'mine.versionUpdate', // 版本更新
        2: 'mine.pdestalRenewal', // 基座更新
        3: 'mine.manualUpdate', // 手动更新
      },
    };
  },
  computed: {
    appUploadUrl() {
      return this.$store.state.base.appUploadUrl;
    },
    appVersion() {
      return this.$store.state.base.appVersion;
    },
    currentVersion() {
      return this.$store.state.base.currentVersion;
    },
    showUpload() {
      return this.$store.state.base.showUpload;
    },
    appVersionInfo() {
      return this.$store.state.base.appVersionInfo;
    },
    upgradeMode() {
      return this.$store.state.base.upgradeMode;
    },
    baseVersion() {
      return this.$store.state.base.baseVersion;
    },
    baseLatestVersion() {
      return this.$store.state.base.baseLatestVersion;
    },
    currenversionmemo() {
      const { appVersion } = this;
      const currentversion =
        this.appVersionInfo.find((item) => item.version === appVersion) || {};
      return currentversion.memo;
    },
    uploadBtnTile() {
      return this.$t(`${this.uploadMsg[this.uplaodType] || ''}`);
    },
  },
  methods: {
    manualUpdate() {
      // 手动更新
      const { installAtionPackAgeURL } = this.appUploadUrl;
      if (installAtionPackAgeURL) plus.runtime.openURL(installAtionPackAgeURL);
      // 浏览器打开手动更新地址进行更新
      else {
        // 如果没有手动更新地址
        this.showConfirm(this.$t('mine.installAtionPackAgeURL'));
      }
    },
    versionUpdate(url, tipMsg) {
      console.log(url);
      // 版本更新
      if (!url) {
        this.showConfirm(`${tipMsg + this.$t('mine.installAtionPackAgeURL')}`);
        return;
      }
      uni.showLoading({
        title: `${tipMsg + this.$t('common.download')}...`,
        mask: true,
      });
      this.showUpgrade(false);
      uni.downloadFile({
        // 下载
        url,
        success: (downloadResult) => {
          if (downloadResult.statusCode === 200) {
            uni.showLoading({
              title: `${tipMsg + this.$t('mine.uploadInstallation')}...`,
              mask: true,
            });
            plus.runtime.install(
              downloadResult.tempFilePath,
              { force: true },
              () => {
                uni.hideLoading();
                plus.runtime.restart();
              },
              (e) => {
                uni.hideLoading();
                uni.showToast({
                  title: e.message,
                });
              }
            );
          } else {
            uni.hideLoading();
            this.showConfirm(downloadResult);
          }
        },
        fail: () => {
          uni.hideLoading();
          // 中文：下载失败
          uni.showToast({
            title: `${tipMsg + this.$t('mine.downloadFailed')}...`,
          });
        },
      });
    },
    pdestalRenewal() {
      // 基座更新
      const appplatform = uni.getSystemInfoSync().platform;
      const iosDownloadUrl =
        this.appUploadUrl.iosDownloadUrl ||
        'https://apps.apple.com/cn/app/id1262402097'; // 默认appStore地址
      if (appplatform === 'ios') {
        plus.runtime.openURL(iosDownloadUrl);
      } else {
        this.versionUpdate(
          this.appUploadUrl.androidDownloadUrl,
          this.$t('mine.installationPackage')
        );
      }
    },
    uploadApp() {
      // 升级app
      // 升级app分手动更新、基座更新、版本更新
      // 基座更新为强制更新
      if (this.uplaodType === 3) this.manualUpdate();
      // 手动更新
      else if (this.uplaodType === 2) this.pdestalRenewal();
      else {
        this.versionUpdate(
          `${this.appUploadUrl.upgradeURL}?token=${uni.getStorageSync('token')}`,
          this.$t('mine.updatePackage')
        );
      }
    },
    async showUpgrade() {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          showTile: false,
          cancelTitle: this.$t('common.NotUpdated'),
          sureTitle: this.$t('common.UpdateNow'),
        });
        this.uploadApp();
      } catch (error) {
        this.$emit('update:isGetVersion', false);
        console.error(error);
      }
    },
    async showConfirm(content) {
      try {
        await this.$refs.apiotConfirmModal.showAsyncModal({
          content,
          showCancel: false
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    if (this.upgradeMode !== 3) {
      // 如果不是手动更新，那么就只有升级包更新
      // 如果是升级包更新，需要在更新之前判断基座是否匹配
      // 如果基座不匹配，需要先升级基座，如何再进行升级
      if (this.baseVersion !== this.baseLatestVersion) {
        this.uplaodType = 2;
        // 基座更新
      } else {
        this.uplaodType = 1; // 升级包更新
      }
    } else {
      // 手动更新
      this.uplaodType = 3;
    }
    this.$nextTick(() => {
      this.showUpgrade();
    });
  },
};
</script>

<style lang='scss' scoped="true">
.backmask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  .updateImg{
    width: 240rpx;
    height: 207rpx;
    margin-bottom: 20rpx;
  }
  .large{
    font-size: 34rpx;
    color: #333333;
    line-height: 58rpx;
  }
  .normal{
    font-size: 28rpx;
    color: #808080;
    line-height: 56rpx;
  }
}
</style>
