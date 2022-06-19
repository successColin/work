<!--
 * @Descripttion: 更多操作
 * @Author: ytx
 * @Date: 2022-01-08 09:29:19
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 09:29:19
-->
<template>
  <div class="moreOper">
    <apiot-actionsheet
      :actions="moreOper"
      :show="isShowMoreOper"
      @select="handleMoreOpen"
      @close="handleClose"
    ></apiot-actionsheet>
  </div>
</template>

<script>
import { PREVIEW_DOWNLOAD_FILE } from '@/utils/preview.js';

export default {
  props: {
    isShowMoreOper: {
      type: Boolean,
      default: false
    },
    currentObj: {
      type: Object,
      default: () => {}
    },
    funcConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moreOper: []
    };
  },
  watch: {
    isShowMoreOper(v) {
      if (v) {
        this.moreOper = [];
        if (this.funcConfig.showDownload) {
          this.moreOper.push({ name: '下载', methods: this.handleDownload });
        }
      }
    }
  },
  components: {},
  computed: {},
  methods: {
    handleClose() {
      this.$emit('update:isShowMoreOper', false);
    },
    // 更多
    handleMoreOpen(v) {
      v.methods();
    },
    // 下载
    handleDownload() {
      // app文件下载
      uni.showModal({
        title: '提示',
        content: '是否下载',
        success: (res) => {
          if (res.confirm) {
            const { id, name, url } = this.currentObj;
            PREVIEW_DOWNLOAD_FILE({ id, name, url }, this);
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
