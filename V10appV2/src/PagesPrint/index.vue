<!--
 * @Author: sss
 * @Date: 2022-08-10 14:30:06
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-10 14:30:06
 * @Desc: 外部连接
-->
<template>
  <view>
    <!-- #ifndef MP -->
    <apiot-navbar
      navStyle="hasBack"
      :title="config.title || '打印标签'"
    ></apiot-navbar>
    <!-- #endif -->
    <web-view
      id="web-view-1"
      class="webview"
      :style="{ top: `${systemInfo.customBar}px` }"
      :src="webviewUrl"
      :webview-styles="webviewStyles"
      @message="getMessage"
    ></web-view>
  </view>
</template>

<script>
import Print from './Print';
import parser from '@/utils/formula';

export default {
  components: {},

  props: {},

  data() {
    return {
      webViewType: 1, // 平台类型：1=app；2=h5；3=钉钉小程序
      config: {
        isOuterLink: false, // 是否为外部链接
        isCustomPage: false, // 是否自定义界面
        customPageId: null, // 自定义界面id
        flag: null // 外部链接为标识
      },
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
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 全局配置-域名相关
    globalDomain() {
      if (!this.config.isCustomPage) return '';
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      const domain = UREPORT_URL.find((item) => item.attributeKey === 'appHomepageUrl') || {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    },
    // 获取自定义界面url
    customUrl() {
      const { globalDomain, config, webViewType } = this;
      if (!globalDomain) return '';
      const { customPageId, uuid } = config;

      return `${globalDomain.trim()}/appCustomPage/${customPageId}?CSMToken=${this.$apiot.getComToken()}&CSMUuid=${uuid}&CSMIsWebview=${webViewType}`;
    },
    // 外部链接跳转
    outerLink() {
      const { config } = this;
      const { isOuterLink, flag } = config;
      if (!isOuterLink) return;
      console.log(this.$store.state.menu.jumpMenuFilter);
      console.log(flag);
      const obj = this.$store.state.menu.jumpMenuFilter[flag] || {};
      const { urlParams = {} } = obj;
      const arry = [];
      Object.keys(urlParams).forEach((key) => {
        arry.push(`${key}=${urlParams[key]}`);
      });

      console.log(obj);

      let { outerLink = '' } = obj;
      if (arry.length > 0) outerLink = `${outerLink}?${arry.join('&')}`;
      return outerLink;
    },
    // webview对应的url
    webviewUrl() {
      const { customUrl, outerLink, config } = this;
      const { url, isCustomPage, isOuterLink } = config;
      console.log(config, this.customUrl, this.outerLink);
      // eslint-disable-next-line no-nested-ternary
      return isCustomPage ? customUrl : isOuterLink ? outerLink : url;
    }
  },

  methods: {
    print(data, num) {
      console.log('=======>', data.length, num);
      const labelPrint = new Print('sun-mi', data, num);
      labelPrint.startPrint();
    },
    getMessage(data) {
      const { isClickPrint, giveData, num } = data.detail.data[0];
      if (isClickPrint) {
        this.print(giveData, num);
      }
    }
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

    console.log(this.customUrl);
    // this.imgToBase64();
  },

  onLoad(option) {
    // #ifdef H5
    this.webViewType = 2;
    // #endif
    // #ifdef MP-ALIPAY
    this.webViewType = 3;
    // #endif
    // #ifdef MP-WEIXIN
    this.webViewType = 4;
    // #endif

    option = option || {};
    this.config = { ...option };
    // 是否为自定义界面
    if (option.isCustomPage === '1') this.config.isCustomPage = true;
    else this.config.isCustomPage = false;
    // 是否为外部链接
    if (option.isOuterLink === '1') this.config.isOuterLink = true;
    else this.config.isOuterLink = false;
    this.config.uuid = this._uid;
  },
  onReady() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.config.title || '打印标签'
    });
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.themeColor
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
</style>
