<!--
 * @Author: sss
 * @Date: 2022-05-12 10:49:02
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-12 10:49:02
 * @Desc: 二维码下载
-->
<template>
  <section class="qrcodeDown">
    <div class="qrcodes">
      <vue-qr :text="qrcodeUrl" :size="110" :margin="10"></vue-qr>
      <vue-qr
        ref="qrcodeAll"
        :text="qrcodeUrl"
        :size="400"
        :margin="10"
        style="display: none"
      ></vue-qr>
    </div>
    <p class="title">{{ title }}二维码</p>
    <apiot-button @click="getQrcode()">
      <i class="iconfont icon-xiazai m-r-4"></i>下载
    </apiot-button>
  </section>
</template>

<script>
import vueQr from 'vue-qr';

export default {
  components: { vueQr },

  props: {
    value: [String, Object],
    title: String,
  },

  data() {
    return {};
  },

  computed: {
    qrcodeUrl() {
      return `APIoT_STATIC_SERVERURL${JSON.stringify(this.value)}SERVERURL_END`;
    },
  },

  methods: {
    getQrcode() {
      const iconUrl = this.$refs.qrcodeAll.$el.src;
      if (iconUrl) {
        const a = document.createElement('a');
        a.download = `${this.title}二维码`;
        a.href = iconUrl;
        a.click();
      }
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.qrcodeDown {
  text-align: center;
  .qrcodes {
    ::v-deep {
      img {
        border: 1px solid #e9e9e9;
      }
    }
  }
  .title {
    margin: 14px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .iconfont {
    color: #4689f5;
  }
}
</style>
