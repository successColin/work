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
    <web-view :src="webViewURL" class="webViewTemplate__webView"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      barTitle: '',
      webViewURL: '',
      webviewStyles: {
        top: '44px',
        progress: {
          color: '#FF3333'
        }
      }
    };
  },
  computed: {
    title() {
      return this.barTitle.length >= 10 ? `${this.barTitle.slice(0, 10)}...` : this.barTitle;
    }
  },
  onLoad(options) {
    this.webViewURL = options.url;
    this.barTitle = options.fileName;
  },
  mounted() {}
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
