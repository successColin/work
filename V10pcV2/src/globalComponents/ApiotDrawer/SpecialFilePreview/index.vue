<template>
  <apiot-drawer
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    class="panel__dialog"
    direction="btt"
    :with-header="false"
    custom-class="panel__full fullPreview"
    :modal="true"
    :append-to-body="true"
    :hasFooter="false"
  >
    <header class="panel__full--header">
      <apiot-button class="return" @click="closePanle">
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
      <span class="m-l-14">{{
        previewObj && previewObj.sysKlTree
          ? previewObj.sysKlTree.name
          : '文件预览'
      }}</span>
      <apiot-button
        class="downloadBtn"
        @click.stop="
          download(`${previewObj.sysKlTree.url}`, previewObj.sysKlTree.name)
        "
        >下载</apiot-button
      >
    </header>
    <iframe class="panel__full--content" frameborder="0" :src="getSrc"></iframe>
  </apiot-drawer>
</template>

<script>
import { downloadSingle } from '@/api/knowledge';
import { saveAs } from '@/utils/utils';

export default {
  name: '',
  props: {
    previewObj: {
      type: Object,
    },
  },
  data() {
    return {
      Base64: null,
    };
  },
  computed: {
    getSrc() {
      if (this.previewObj && this.previewObj.sysKlTree) {
        let org =
          this.$store.state.globalConfig.ureportConfig.filePreviewOrigin ||
          window.location.origin;
        if (process.env.NODE_ENV === 'development') {
          org = 'https://v10.mingcloud.top';
        }

        const hasHttp = this.previewObj.sysKlTree.url.startsWith('http');
        const hasXie = this.previewObj.sysKlTree.url.startsWith('/');
        const url = this.$parseImgUrl(
          `${hasHttp ? '' : org}${hasXie ? '' : '/'}${
            this.previewObj.sysKlTree.url
          }`,
        );
        console.log(url);
        return `${
          this.$store.state.globalConfig.ureportConfig.filePreviewUrl
        }/preview/onlinePreview?url=${encodeURIComponent(
          /* global Base64 */
          Base64.encode(url),
        )}`;
      }
      return '';
    },
  },
  mounted() {},

  methods: {
    closePanle() {
      this.$emit('update:visible', false);
    },
    async download(url, filename) {
      const data = await downloadSingle({ url });
      saveAs(data, filename);
    },
  },
  watch: {},
};
</script>

<style lang="scss">
.panel__full {
  height: auto !important;
  top: 50px !important;
  bottom: 0;
  background-color: #f6f6f8 !important;
  .drawer__content {
    overflow: hidden;
  }
  &--header {
    height: 46px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    .icon-fenxiang {
      position: absolute;
      color: #909399;
      margin-top: 16px;
      margin-left: 6px;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
  }
  &--content {
    margin: 10px 10px 0;
    box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 30%);
    height: calc(100% - 46px - 10px) !important;
    width: calc(100% - 20px);
  }
  &.fullPreview {
    ::v-deep {
      .drawer__content {
        overflow: hidden !important;
      }
    }
  }
}
.return {
  // position: absolute;
  // left: 0;
  // top: 0;
  z-index: 1;
  width: 100px;
  height: 46px;
  border-width: 0 1px 0 0;
  border-color: #ebebeb;
  border-radius: 0;
  color: #333333;
  font-size: 16px;

  i {
    font-size: 20px;
    margin-right: 8px;
    color: #9b9b9b;
  }

  &:hover,
  &:active,
  &:focus {
    border-color: #ebebeb !important;
    background-color: #fff !important;
    i {
      color: $--color-primary;
    }
  }
}
.downloadBtn {
  position: absolute;
  right: 10px;
  top: 8px;
}
</style>
