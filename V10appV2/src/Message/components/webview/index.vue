<!--
 * @Author: sss
 * @Date: 2022-08-10 14:30:06
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-10 14:30:06
 * @Desc: 外部连接
-->
<template>
  <view class="webViewTemplate">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar
      class="webViewTemplate__title"
      navStyle="hasBack"
      title="外部链接"
    ></apiot-navbar>
    <!-- #endif -->
    <web-view
      class="webViewTemplate__webView"
      :src="webViewURL"
      :fullscreen="false"
      :webview-styles="webviewStyles"
    ></web-view>
  </view>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {
      webviewStyles: {
        progress: true,
        height: '20px'
      }
    };
  },

  computed: {
  },

  methods: {
  },

  mounted() {
  },

  beforeDestroy() {
  },

  onLoad(option) {
    this.webViewURL = option.url;
  }
};
</script>

<style lang='scss' scoped>
.webViewTemplate {
  position: relative;
  &__title {
    height: 80rpx;
    background: red;
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
