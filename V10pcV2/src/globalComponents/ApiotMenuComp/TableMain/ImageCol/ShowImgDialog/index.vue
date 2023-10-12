<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    title="图片总览"
    destroy-on-close
    class="showImgDialog"
    :append-to-body="true"
    :isShowFooter="false"
  >
    <el-form v-if="config">
      <ImgAndVideo
        :configData="config"
        :parent="parent"
        :isTableDialog="true"
        ref="img"
      ></ImgAndVideo>
    </el-form>
  </apiot-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    configData: {
      type: Object
    },
    parent: {
      type: Object
    },
    fileShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      config: null
    };
  },
  mounted() {},
  components: {},
  watch: {
    configData: {
      handler(v) {
        this.config = null;
        this.$nextTick(() => {
          const temp = JSON.parse(JSON.stringify(v));
          temp.canReadonly = true;
          temp.showLabelTitle = false;
          this.config = temp;
        });
      },
      deep: true
    },
    fileShow(v) {
      if (v) {
        setTimeout(() => {
          this.$refs.img.getFileList();
        }, 200);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.showImgDialog {
  ::v-deep {
    .imgAndVideo.noHover {
      padding: 0 !important;
    }
  }
}
</style>
