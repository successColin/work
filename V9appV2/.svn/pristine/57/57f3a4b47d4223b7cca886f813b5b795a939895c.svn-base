<template>
  <view class="versioninfo content">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-versionInformation') }}</block
      ><!--版本信息-->
    </m-back-bar>
    <view class="head-logo">
      <image class="version-logo" :src="image"></image>
      <view>{{ appName }}</view>
    </view>
    <view class="update-list current-version">
      <!-- #ifdef APP-PLUS -->
      <view class="version-title"
        ><span
          >{{ $t('lang-versioninfo-now') }}:{{ currentVersion }}</span
        ></view
      ><!--中文：当前版本-->
      <!-- #endif -->
      <!-- #ifndef APP-PLUS -->
      <view class="version-title"
        ><span>{{ $t('lang-versioninfo-now') }}:{{ appVersion }}</span></view
      ><!--中文：当前版本-->
      <!-- #endif -->
      <view class="history-version">
        <text decode="true">{{ currenversionmemo }}</text>
      </view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <view
      class="history-version-title manual-update"
      v-if="upgradeMode === 3"
      @tap="manualUpdate"
    >
      <span>{{ $t('lang-versioninfo-update') }}</span
      ><!--中文：手动更新-->
      <view class="arrow-right"><span></span></view>
    </view>
    <!-- #endif -->
    <view class="history-version-title" @click="toggleHistory">
      <span>{{ $t('lang-versioninfo-history') }}</span
      ><!--中文：历史版本-->
      <view class="arrow-right"
        ><span v-bind:class="isopened ? 'opened' : ''"></span
      ></view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <view
      v-show="isopened"
      class="update-list history-versions"
      v-for="(item, index) in list"
      :key="index"
    >
      <view>
        <view class="version-info"
          ><span>{{ item.version }}</span></view
        >
        <view class="history-version">
          <text decode="true">{{ item.memo }}</text>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <view
      v-show="isopened"
      class="update-list history-versions"
      v-for="(item, index) in list"
      :key="index"
    >
      <view v-if="index != 0">
        <view class="version-info"
          ><span>{{ item.version }}</span></view
        >
        <view class="history-version">
          <text decode="true">{{ item.memo }}</text>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import updateLogo from '@/static/images/updateLogo.png';
export default {
  data() {
    return {
      image: updateLogo,
      pageSize: 10,
      pageNum: 1,
      basetype: 2,
      list: [],
      isopened: false,
      currentVersionMemo: '',
    };
  },
  computed: {
    ...mapState([
      'appVersion',
      'currentVersion',
      'appName',
      'appVersionInfo',
      'upgradeMode',
      'appUploadUrl',
    ]),
    currenversionmemo() {
      let appVersion = '';
      //#ifndef APP-PLUS
      appVersion = this.currentVersion;
      //#endif
      //#ifdef APP-PLUS
      appVersion = this.appVersion;
      //#endif
      const currentversion =
        this.appVersionInfo.find((item) => item.version == appVersion) || {};
      return currentversion.memo;
    },
  },
  methods: {
    manualUpdate() {
      //手动更新
      if (this.upgradeMode === 3 && this.appUploadUrl.installAtionPackAgeURL)
        plus.runtime.openURL(this.appUploadUrl.installAtionPackAgeURL);
    },
    handleTopClick() {
      //处理顶部按钮的点击事件
      let url = '/pages/home/home?pageType=myself';
      uni.navigateTo({
        url: url,
      });
    },
    selectPages() {
      const param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        basetype: this.basetype,
      };
      this.$http
        .post('systemVersion/selectPage', param)
        .then((res) => {
          const result = res.data;
          if (result.success) {
            this.list = result.data.list;
            this.checkCurrentVersion();
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    toggleHistory() {
      this.isopened = this.isopened ? false : true;
    },
    checkCurrentVersion() {
      for (let i = 0; i < this.list.length; i++) {
        if (this.currentVersion == this.list[i].version) {
          this.currentVersionMemo = this.list[i].memo;
          return;
        }
      }
    },
  },
  mounted() {
    this.list = [];
    this.selectPages();
  },
  onReachBottom() {
    // 上拉加载
    this.pageNum++;
    this.selectPages();
  },
};
</script>
<style scoped>
.manual-update {
  margin-bottom: 24upx;
}
.history-version {
  font-size: 24upx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: rgba(128, 128, 128, 1);
}
.versioncode {
  font-size: 28upx;
  font-weight: 600;
}
.versionmsg {
  padding: 10upx 0;
  font-weight: 400;
}
.currentversionmsg {
  padding: 10upx 0;
  font-weight: 400;
  font-size: 24upx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: rgba(128, 128, 128, 1);
}
</style>