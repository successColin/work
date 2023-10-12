<!--
 * @Author: sss
 * @Date: 2022-11-21 16:01:10
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-21 16:01:10
 * @Desc: 错误界面
-->
<template>
  <view class="errorPage 500">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :showBackbtn="false">
      <view slot="content" class="title">网络错误</view></apiot-navbar
    >
    <!-- #endif -->
    <div class="errorPage__content">
      <div class="errorPage__saomiao" @click.stop="gotoScan"></div>
      <image
        class="item"
        mode="widthFix"
        src="./images/networkError.svg"
      ></image>
      <p class="errorPage__msg">请仔细检查网络是否连接,服务器是否正确!</p>
      <div class="errorPage__btn">
        <apiot-button
          type="primary"
          btnClass="primary"
          size="medium"
          shape="circle"
          @click="refresh"
          >刷新</apiot-button
        >
      </div>
    </div>
    <u-notify ref="uTips"></u-notify>
  </view>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    refresh() {
      uni.setStorageSync('showErrorPage', false);
      uni.reLaunch({
        url: '/pages/index/index'
      });
    },
    // 扫描
    async gotoScan() {
      let result = '';
      try {
        const qrResult = await this.$apiot.scanCode();
        result = qrResult.result;
        // 如果是服务器默认地址二维码1
        if (result && result.indexOf('APIoT_STATIC_SERVERURL') !== -1) {
          const serveUrl = result.match(/APIoT_STATIC_SERVERURL(\S*)SERVERURL_END/);
          if (serveUrl.length > 1) {
            const str = serveUrl[1];
            const obj = JSON.parse(str);
            this.$refs.uTips.show({
              message: '服务器地址设置成功',
              type: 'success',
              safeAreaInsetTop: true,
              fontSize: 18
            });
            this.$store.commit('setServerInfoAddress', obj);
            this.refresh();
          }
        }
      } catch (error) {
        if (result) {
          this.$refs.uTips.show({
            message: `二维码信息：${result}`,
            type: 'error',
            safeAreaInsetTop: true,
            fontSize: 18
          });
        }

        console.error(error);
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.errorPage {
  position: relative;
  height: 100vh;
  background: #ffffff;
  .title {
    width: 100%;
    text-align: center;
  }
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    image {
      width: 380rpx;
    }
  }
  &__msg {
    font-size: 28rpx;
    color: #aaaaaa;
    line-height: 40rpx;
    white-space: nowrap;
  }
  &__btn {
    width: 160rpx;
    height: 62rpx;
    margin: 20rpx auto;
  }
  &__saomiao {
    position: absolute;
    width: 78rpx;
    height: 78rpx;
    top: 116rpx;
    left: 136rpx;
    z-index: 10;
  }
}
</style>
