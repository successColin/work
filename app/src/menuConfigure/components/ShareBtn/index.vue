<!--
 * @Author: sss
 * @Date: 2022-10-17 13:48:50
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-17 13:48:50
 * @Desc: 面板分享
-->
<template>
  <view>
    <section class="shareBtn">
      <apiot-button-font
        iconName="fenxiang1"
        :isTheme="true"
        @click="share"
      ></apiot-button-font>
    </section>
    <share-modal
      v-if="showShareModal"
      :shareUrl="shareUrl"
      @cancel="cancelShareModal"
    ></share-modal>
  </view>
</template>

<script>
import { shortLink } from '@/api/menuConfig';
import ShareModal from '../ShareModal';

export default {
  components: {
    ShareModal
  },

  props: {
    menuConfig: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      showShareModal: false,
      shareUrl: null
    };
  },

  computed: {
    panelFilter() {
      const { sourceFlagId } = this.menuConfig;
      if (!sourceFlagId) return {};
      return this.$store.state.menu.panelFilter[sourceFlagId];
    },
    panelDataTrans() {
      const { sourceFlagId } = this.menuConfig;
      if (!sourceFlagId) return {};
      return this.$store.state.menu.panelDataTrans[sourceFlagId];
    },
    link() {
      const { menuConfig, panelFilter, panelDataTrans } = this;
      const config = { ...menuConfig, panelFilter, panelDataTrans };
      return `http://192.168.0.26:8081/onlineApp?isLink=1&flag=2&config=${JSON.stringify(config)}`;
    },
    shareUrlIp() {
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      const domain = UREPORT_URL.find((item) => item.attributeKey === 'shareUrl') || {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    }
  },

  methods: {
    // 分享
    share() {
      this.showShareModal = true;
    },
    cancelShareModal() {
      this.showShareModal = false;
    },
    async initUrl() {
      const { link, shareUrlIp } = this;
      const data = await shortLink({
        originalUrl: encodeURI(link)
      });
      this.shareUrl = `${shareUrlIp}/share/${data}`;
    }
  },

  mounted() {
    this.initUrl();
  }
};
</script>

<style lang='scss' scoped>
.shareBtn {
  padding-right: 30rpx;
}
</style>
