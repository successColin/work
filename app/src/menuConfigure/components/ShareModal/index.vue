<!--
 * @Author: sss
 * @Date: 2022-10-17 15:30:01
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-17 15:30:01
 * @Desc: 分享弹出面板
-->
<template>
  <apiot-modal
    ref="shareModal"
    position="bottom"
    cancelColor="#F1F3F6"
    :show.sync="show"
    :automatic="false"
    :titleStyle="{
      fontFamily:
        'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold',
      fontWeight: 600,
      textAlign: 'left',
      marginTop: '10rpx',
    }"
    sureTitle="直接分享"
    :customCancel="true"
    :showTitle="false"
    @cancel="cancel"
    @sure="share"
  >
    <div class="shareModal">
      <image src="../../images/complete.svg" class="icon"></image>
      <p class="title">已生成页面分享链接</p>
      <div class="qrcode">
        <tki-qrcode
          class="tki"
          cid="myQR"
          ref="myQR"
          :val="shareUrl"
          :onval="true"
          :loadMake="true"
          :usingComponents="true"
          :size="260"
        />
      </div>
      <p class="subTitle">长按保存二维码图片</p>
    </div>
    <template slot="cancel">
      <div class="cancelBtn">
        <i
          class="appIcon appIcon-lianjie"
          :class="[`themeColor__font-${getThemeIndex}`]"
          :style="{ fontSize: '38rpx' }"
        ></i>
        <span>复制链接</span>
      </div>
    </template>
  </apiot-modal>
</template>

<script>
import tkiQrcode from 'tki-qrcode';

export default {
  components: { tkiQrcode },

  props: {
    shareUrl: String
  },

  data() {
    return {
      show: false
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    cancel() {
      uni.setClipboardData({
        data: this.shareUrl,
        success: () => {
          this.$apiot.toast('复制成功');
          this.$emit('cancel');
        }
      });
    },
    share() {
      // #ifndef MP-ALIPAY
      uni.setClipboardData({
        data: this.shareUrl,
        success: () => {
          this.$apiot.toast('复制成功,可分享至任意应用');
          this.$emit('cancel');
        }
      });
      // #endif
      // #ifndef MP-ALIPAY
      // #endif
    }
  },

  mounted() {
    this.show = true;
  }
};
</script>

<style lang='scss' scoped>
.shareModal {
  .icon {
    width: 200rpx;
    height: 166rpx;
  }
  .title {
    font-size: 30rpx;
    font-weight: 400;
    color: #333333;
    line-height: 38rpx;
  }
  .qrcode {
    margin: 20rpx auto;
    border: 1rpx solid #e9e9e9;
    width: 260rpx;
    height: 260rpx;
    padding: 12rpx;
    .tki {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .subTitle {
    font-size: 28rpx;
    font-weight: 400;
    color: #808080;
    line-height: 40rpx;
  }
}
</style>
