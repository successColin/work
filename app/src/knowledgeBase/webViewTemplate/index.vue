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
    <web-view :src="webViewURL" class="webViewTemplate__webView"></web-view>
  </view>
</template>

<script>
// import pdf from 'vue-pdf-signature';

export default {
  components: {},
  data() {
    return {
      barTitle: '',
      webViewURL: '',
      webviewStyles: {
        top: '44px',
        progress: {
          color: '#FF3333'
        }
      },
      // 需要加水印的文件类型有
      waterMarkType: ['jpg', 'jpeg', 'png', 'pdf']
    };
  },
  computed: {
    title() {
      return this.barTitle.length >= 10 ? `${this.barTitle.slice(0, 10)}...` : this.barTitle;
    }
  },
  onLoad(options) {
    // const { type } = options;
    // const serveURL = this.$apiot.common.getComServeUrl();
    // console.log(serveURL);
    // if (type && this.waterMarkType.indexOf(type.toLowerCase()) !== -1) {
    //   this.webViewURL = `${serveURL}system/waterMark/addWaterMark?url=${
    //     options.url
    //   }&token=${this.$apiot.common.getComToken()}`;
    // } else
    this.webViewURL = `/hybrid/html/web/viewer.html?isToken=true&interface=${options.url}&token=${options.token}`;
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
