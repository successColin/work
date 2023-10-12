<!--
 * @Descripttion:
 * @Author: ytx
 * @Date: 2022-06-19 10:58:39
 * @LastEditors: ytx
 * @LastEditTime: 2022-06-19 10:58:39
-->
<!-- 外部链接面板 -->
<template>
  <view class="webViewTemplate">
    <!-- 顶部 -->
    <apiot-navbar :title="title" class="webViewTemplate__title"></apiot-navbar>
    <!-- <pdf :src="webViewURL"></pdf> -->
    <web-view
      class="webViewTemplate__webView"
      :style="{ top: `${systemInfo.customBar}px` }"
      :src="webViewURL"
      :webview-styles="webviewStyles"
    ></web-view>
  </view>
</template>

<script>
import { Base64 } from 'js-base64';
// import pdf from 'vue-pdf-signature';

export default {
  components: {},
  data() {
    return {
      barTitle: '',
      webViewURL: '',
      webviewStyles: {
        progress: true,
        height: '20px'
      }
    };
  },
  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    title() {
      return this.barTitle.length >= 10 ? `${this.barTitle.slice(0, 10)}...` : this.barTitle;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 全局配置-文件预览服务器
    filePreviewUrl() {
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      const domain = UREPORT_URL.find((item) => item.attributeKey === 'filePreviewUrl') || {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    }
  },
  onReady() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title || '外部链接'
    });
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.themeColor
    });
    // #endif
  },
  onLoad(options) {
    this.webViewURL = `${this.filePreviewUrl}/preview/onlinePreview?url=${encodeURIComponent(
      Base64.encode(options.url)
    )}`;
    this.barTitle = options.fileName;
  },
  mounted() {
    // #ifdef APP-PLUS
    const { windowHeight, customBar } = this.systemInfo;
    const currentWebview = this.$scope.$getAppWebview();
    const wv = currentWebview.children()[0];
    wv.setStyle({
      // 设置web-view距离顶部的距离以及自己的高度，单位为px
      top: customBar,
      height: windowHeight - customBar
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.webViewTemplate {
  &__title {
    ::v-deep {
      .apiotNavbar__content--title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  &__webView {
    position: absolute;
    top: 80rpx;
  }
}
</style>
