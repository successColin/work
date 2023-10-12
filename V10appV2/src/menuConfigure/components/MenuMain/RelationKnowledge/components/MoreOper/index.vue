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
import ApiotActionsheet from '../../../ApiotActionsheet';

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
  components: {
    ApiotActionsheet
  },
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
      if (v.methods) {
        v.methods();
      } else {
        const obj = this.moreOper.find((item) => item.name === v.name);
        if (obj.methods) {
          obj.methods();
        }
      }
    },
    // 下载
    async handleDownload() {
      await this.$refs.apiotModalDel
        .showAsyncModal({
          content: '是否下载？'
        })
        .then(async () => {
          const file = this.currentObj;
          this.$apiot.preview.fileDownLoad({ file, isWatermark: this.isWatermark });
        });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
