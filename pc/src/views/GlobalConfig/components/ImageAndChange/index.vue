<!-- 页面 -->
<template>
  <div class="contentWrap" :class="[{ isSmall: isSmall }]">
    <el-upload
      class="uploadWrap"
      :class="{ oneFiles: fileList.length === 1 }"
      list-type="picture-card"
      action="/"
      :on-success="handleChange"
      :multiple="false"
      :before-upload="beforeUpload"
      :accept="accept"
      :file-list="fileList"
      :http-request="doUpload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <el-image
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          fit="cover "
        ></el-image>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-slider
      v-if="showSlider"
      class="sliderWrap"
      :min="min"
      :max="max"
      :value="imgWidth"
      @input="changeWidth"
    ></el-slider>
    <span class="sizeWrap" v-if="showSlider">{{ imgWidth }}px</span>
  </div>
</template>

<script>
export default {
  props: {
    imgObj: {
      type: Object,
      default: () => {}
    },
    imgWidth: {
      type: Number,
      default: 20
    },
    min: {
      type: Number,
      default: 16
    },
    max: {
      type: Number,
      default: 25
    },
    showSlider: {
      type: Boolean,
      default: true
    },
    maxKb: {
      type: Number
    },
    isSmall: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accept: '.png,.svg,.jpg, .jpeg',
      fileList: []
    };
  },

  components: {},

  computed: {},

  mounted() {},
  watch: {
    imgObj: {
      immediate: true,
      deep: true,
      handler(newValue, old) {
        if (!old && !!newValue && newValue.attributeValue) {
          // eslint-disable-next-line max-len
          this.fileList = [
            { url: newValue.attributeValue.substr(0, newValue.attributeValue.length - 1) }
          ];
        }
        if (
          !!newValue &&
          old &&
          newValue.attributeValue &&
          newValue.attributeValue !== old.attributeValue
        ) {
          // eslint-disable-next-line max-len
          this.fileList = [
            { url: newValue.attributeValue.substr(0, newValue.attributeValue.length - 1) }
          ];
        }
      }
    }
  },
  methods: {
    handleRemove() {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.image') }),
        this.$t('common.delete', { name: this.$t('helpCenter.image') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(() => {
        this.fileList = [];
        this.$emit('removeSuccesss');
      });
    },
    handleChange(response, file) {
      this.fileList.push(file);
      this.$emit('uploadSuccess');
    },
    changeWidth(width) {
      this.$emit('change-image-width', width);
    },
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        let newSize = false;
        if (this.maxKb) {
          newSize = size / 1024 < this.maxKb;
        } else {
          newSize = size / 1024 < 200;
        }
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          if (this.maxKb) {
            this.$message({
              type: 'error',
              message: `文件格式大于${this.maxKb}KB，请压缩文件之后再上传!`
            });
            reject(file);
            return;
          }
          this.$message({
            type: 'error',
            message: this.$t('icon.beforeUploading')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  display: flex;

  .uploadWrap {
    ::v-deep {
      .el-upload--picture-card {
        width: 48px;
        height: 48px;
        line-height: 48px;
      }

      .el-upload-list--picture-card .el-upload-list__item {
        width: 48px;
        height: 48px;
      }
      .el-checkbox {
        line-height: 20px;
      }
      .el-upload--picture-card i {
        font-size: 16px !important;
      }
      .el-upload-list--picture-card {
        position: absolute;
      }
      .el-upload-list--picture-card
        .el-upload-list__item-actions
        .el-upload-list__item-delete {
        position: absolute;
        font-size: inherit;
        color: inherit;
        font-size: 13px;
        right: 5px;
      }
    }
  }
  .el-upload-list__item-thumbnail {
    width: 48px;
    height: 48px;
  }
  &.isSmall {
    ::v-deep {
      .el-upload--picture-card {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }

      .el-upload-list--picture-card .el-upload-list__item {
        width: 32px;
        height: 32px;
      }
    }
    .el-upload-list__item-thumbnail {
      width: 30px;
      height: 30px;
    }
  }
  .sliderWrap {
    width: 256px;
    margin-left: 30px;

    ::v-deep {
      .el-slider__runway {
        margin: 21px 0;
      }
    }
  }

  .sizeWrap {
    margin-left: 15px;
    line-height: 48px;
  }
}
</style>
