<template name="thirdPartyLinks">
  <view style="width: 100%">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-otherweb') }}</block
      ><!--中文：我的二维码-->
    </m-back-bar>
    <view class="otherwebContent" v-if="outLinkList && outLinkList.length > 0">
      <view
        class="item"
        v-for="item in outLinkList"
        :key="item.id"
        @click="openUrl(item.url, item.name)"
      >
        <view class="title">{{ item.name }}</view>
        <view class="webLink">{{
          item.url + (isUrl(item.url) ? '' : $t('pageTip-notweb'))
        }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getHomePageThirdPartyLinks } from '@/common/request/mineApi';
export default {
  data() {
    return {
      outLinkList: '',
    };
  },
  methods: {
    isUrl(url, name) {
      //是否为url
      return /^https:\/\/.*/i.test(url) || /^http:\/\/.*/i.test(url);
    },
    openUrl(url) {
      if (!this.isUrl(url)) {
        this.Static_GlobalFucs.showToast({
          title: this.$t('pageTip-notweb'),
        });
        return;
      }
      // #ifndef H5
      plus.runtime.openURL(url);
      //#endif
      // #ifdef H5
      window.open(url, name);
      //#endif
    },
  },
  created() {
    getHomePageThirdPartyLinks({}, this)
      .then((value) => {
        this.outLinkList = value;
      })
      .catch((error) => {
        this.outLinkList = [];
      });
  },
};
</script>

<style scoped lang="scss">
@import '@/static/scss/common/_function.scss';
.otherwebContent {
  background: #fff;
  padding: 0 pxToREM(30);
  .item {
    font-family: PingFangSC-Regular, PingFang SC;
    .title {
      padding-top: pxToREM(30);
      font-size: pxToREM(34);
      font-weight: 600;
      color: rgba(68, 68, 68, 1);
      line-height: pxToREM(48);
    }
    .webLink {
      padding: pxToREM(10) 0 pxToREM(32) 0;
      font-size: pxToREM(26);
      font-weight: 400;
      color: rgba(136, 136, 136, 1);
      line-height: pxToREM(30);
    }
  }
  .item:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #e0e0e0;
  }
}
</style>
