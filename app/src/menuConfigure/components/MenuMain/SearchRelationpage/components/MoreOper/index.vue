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
  computed: {
    // 是否需要加水印
    isWatermark() {
      return this.$store.getters.getWatermark;
    }
  },
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
        success: async (res) => {
          if (res.confirm) {
            const file = this.currentObj;
            this.$apiot.preview.fileDownLoad({ file, isWatermark: this.isWatermark });
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
