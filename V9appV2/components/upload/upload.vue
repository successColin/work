<template>
  <view class="backmask" v-if="showUpload && uplaodType">
    <view class="APP_upload">
      <image
        v-if="themeColor == 'red'"
        src="../../static/images/Iogo-upload.png"
        mode="widthFix"
        class="APP_upload-headerimg"
        style="
           {
            height: 100%;
            width: 100%;
          }
        "
      ></image>
      <image
        v-else-if="themeColor == 'blue'"
        src="../../static/images/Iogo-upload-blue.png"
        mode="widthFix"
        class="APP_upload-headerimg"
        style="
           {
            height: 100%;
            width: 100%;
          }
        "
      ></image>
      <image
        v-else
        src="../../static/images/Iogo-upload.png"
        mode="widthFix"
        class="APP_upload-headerimg"
        style="
           {
            height: 100%;
            width: 100%;
          }
        "
      ></image>
      <view class="APP_upload-content">
				<view class="findVersion">发现版本</view>
        <view class="version">{{
          uplaodType !== 2
            ? `${$t('choiceTip-uploadUpgrade') + appVersion}?`
            : `当前基座:${baseVersion},升级至最新基座${baseLatestVersion}!`
        }}</view>
        <!-- 中文：是否升级到 -->
        <scroll-view
          v-if="uplaodType !== 2"
          class="version-content"
          :scroll-top="0"
          scroll-y="true"
        >
          <text decode="true" class="scroll-view-item">{{
            currenversionmemo
          }}</text>
        </scroll-view>
      </view>
      <view class="APP_upload-footer">
        <m-button
          :btnTilte="uploadBtnTile"
          class="btn-item"
          btnClass="mainColor"
          @elementClick="uploadApp"
        ></m-button
        ><!--中文：更新-->
        <m-button
          v-if="uplaodType !== 2"
          :btnTilte="$t('page-noteUpdate')"
          class="btn-item noupload"
          btnClass="whiteColor"
          @elementClick="cancel"
        ></m-button
        ><!--中文：暂不更新-->
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'upload',
  data() {
    return {
      uplaodType: 0,
      uploadMsg: {
        1: 'page-versionUpdate', //版本更新
        2: 'page-pdestalRenewal', //基座更新
        3: 'page-manualUpdate', //手动更新
      },
    };
  },
  computed: {
    ...mapState([
      'appUploadUrl',
      'token',
      'appVersion',
      'currentVersion',
      'showUpload',
      'appVersionInfo',
      'upgradeMode',
      'themeColor',
      'baseVersion',
      'baseLatestVersion',
    ]),
    currenversionmemo() {
      const appVersion = this.appVersion;
      const currentversion =
        this.appVersionInfo.find((item) => item.version == appVersion) || {};
      return currentversion.memo;
    },
    uploadBtnTile() {
      return this.$t(`${this.uploadMsg[this.uplaodType] || ''}`);
    },
  },
  methods: {
    ...mapMutations(['SHOW_UPLOAD']),
    cancel() {
      this.SHOW_UPLOAD(false);
    },
    manualUpdate() {
      //手动更新
      let { installAtionPackAgeURL } = this.appUploadUrl;
      if (installAtionPackAgeURL) plus.runtime.openURL(installAtionPackAgeURL);
      //浏览器打开手动更新地址进行更新
      else {
        //如果没有手动更新地址
        this.Static_GlobalFucs.showModal(
          this,
          {
            content: this.$t('check-installAtionPackAgeURL'),
          },
          'error'
        );
      }
    },
    versionUpdate(url, tipMsg) {
      //版本更新
      const _this = this;
      if (!url) {
        this.Static_GlobalFucs.showModal(
          this,
          {
            content: `${tipMsg + this.$t('check-installAtionPackAgeURL')}`,
          },
          'error'
        );
        return;
      }
      uni.showLoading({
        title: `${tipMsg + this.$t('basic-download')}...`,
        mask: true,
      });
      this.SHOW_UPLOAD(false);
      uni.downloadFile({
        //下载
        url: url,
        success: (downloadResult) => {
          if (downloadResult.statusCode === 200) {
            uni.showLoading({
              title: `${tipMsg + this.$t('pageTip-uploadInstallation')}...`,
              mask: true,
            });
            plus.runtime.install(
              downloadResult.tempFilePath,
              { force: true },
              function (e) {
                uni.hideLoading();
                _this.$http.post('logout');
                plus.runtime.restart();
              },
              function (e) {
                uni.hideLoading();
                this.Static_GlobalFucs.showToast({ title: e.message });
              }
            );
          } else {
            uni.hideLoading();
            this.Static_GlobalFucs.showModal(
              this,
              {
                content: downloadResult,
              },
              'error'
            );
          }
        },
        fail: () => {
          uni.hideLoading();
          this.Static_GlobalFucs.showToast({
            title: `${tipMsg + this.$t('pageTip-downloadFailed')}...`,
          }); // 中文：下载失败
        },
      });
    },
    pdestalRenewal() {
      //基座更新
      const appplatform = uni.getSystemInfoSync().platform;
      let iosDownloadUrl =
        this.appUploadUrl.iosDownloadUrl ||
        'https://apps.apple.com/cn/app/id1262402097'; //默认appStore地址
      if (appplatform === 'ios') plus.runtime.openURL(iosDownloadUrl);
      else
        this.versionUpdate(
          this.appUploadUrl.androidDownloadUrl,
          this.$t('page-installationPackage')
        );
    },
    uploadApp() {
      //升级app
      //升级app分手动更新、基座更新、版本更新
      //基座更新为强制更新
      if (this.uplaodType === 3) this.manualUpdate();
      //手动更新
      else if (this.uplaodType === 2) this.pdestalRenewal();
      else
        this.versionUpdate(
          `${this.appUploadUrl.upgradeURL}?token=${this.token}`,
          this.$t('page-updatePackage')
        );
    },
  },
  created() {
    if (this.upgradeMode === 3) this.uplaodType = 3;
    //手动更新
    else {
      //如果不是手动更新，那么就只有升级包更新
      //如果是升级包更新，需要在更新之前判断基座是否匹配
      //如果基座不匹配，需要先升级基座，如何再进行升级
      if (this.baseVersion !== this.baseLatestVersion) this.uplaodType = 2;
      //基座更新
      else this.uplaodType = 1; //升级包更新
    }
  },
};
</script>

<style scoped="true">
.backmask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.51);
  z-index: 201;
}
</style>
