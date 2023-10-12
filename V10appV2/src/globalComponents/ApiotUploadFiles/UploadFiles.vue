<!--
 * @Author: sss
 * @Date: 2022-11-25 10:19:04
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-25 10:19:04
 * @Desc: 附件上传
-->
<template>
  <view class="enclosure">
    <div class="enclosure__content" :class="[showType]" :style="[gridStyle]">
      <template v-if="canShowBtn">
        <view
          class="chooseFileBtn item"
          :style="[gridFileStyle]"
          @click.stop="chooseFiles"
        >
          <slot>
            <template v-if="isCer">
              <div class="is-add">
                <div class="addBtn">
                  <i class="appIcon appIcon-shangchuantubiao"></i>
                </div>
              </div>
            </template>
            <template v-else-if="showType === 'list-card' && !isCer">
              <button type="default">
                <i
                  class="appIcon appIcon-shangchuan"
                  :class="[`themeColor__font-${getThemeIndex}`]"
                ></i>
                {{ title }}
              </button>
            </template>
            <template v-else>
              <div class="is-add">
                <div class="addBtn">
                  <i class="appIcon appIcon-tianjiagongneng"></i>
                  <P>{{ title }}</P>
                </div>
              </div>
            </template>
          </slot>
        </view>
      </template>
      <template v-for="(file, index) in files">
        <view :key="file.id" class="item" :style="[gridFileStyle]">
          <file-item
            :key="file.id"
            :file="file"
            :index="index"
            :showType="showType"
            :disabled="disabled"
            @prviewFile="prviewFile"
            @delFile="delFile"
          ></file-item>
        </view>
      </template>
    </div>

    <template v-if="!disabled && mode === 'file'">
      <apiot-popup :show="showChooseFile" :title="title" @close="handleClose">
        <choose-file-div
          @uploadFiles="uploadFiles"
          :count="canChooseNum"
          :sourceType="sourceType"
          :param="param"
        ></choose-file-div>
      </apiot-popup>
    </template>

    <u-toast ref="uToast"></u-toast>

    <!-- 视频或者语音预览 -->
    <Player ref="player"></Player>

    <!-- 遮罩层 -->
    <div
      v-if="loading"
      class="mask"
      @touchmove.prevent
      @mousewheel.prevent
      @click.stop="clickMask"
    ></div>
  </view>
</template>

<script>
import { fileUpload } from '@/api/menuConfig';
import mpMixin from '@/mixin/mpMixin';

import chooseFileMixin from './chooseFileMixin';
import Player from './components/Player';
import FileItem from './components/FileItem';
import ChooseFileDiv from './components/ChooseFileDiv';

export default {
  mixins: [chooseFileMixin, mpMixin],
  // #ifdef APP-PLUS
  provide() {
    return {
      uploadFilesApp: this.uploadFilesApp
    };
  },
  // #endif

  components: {
    Player,
    FileItem,
    ChooseFileDiv
  },

  props: {
    // 是否为证件
    isCer: {
      type: Boolean,
      default: false
    },
    // image,veido,file
    mode: {
      type: String,
      default: 'image'
    },
    // 展示风格 grid:大图；list-card：列表
    showType: {
      type: String,
      default: 'list-card'
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: '文件上传'
    },

    // 可以选择的文件个数
    limit: {
      type: Number,
      default: 9999
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片尺寸，以MB为单位
    size: {
      type: Number,
      default: 2
    },
    // 是否自动上传
    automaticUpload: {
      type: Boolean,
      default: true
    },
    // 图片上传参数
    param: {
      type: Object,
      default() {
        return {};
      }
    },
    // 一行几个,只有showType为grid时有效
    gridNum: {
      type: Number,
      default: 3
    },
    // 文件高度,只有showType为grid时有效
    gridHeight: {
      type: String,
      default: '210rpx'
    },
    sourceType: {
      type: Array,
      default() {
        return ['album', 'camera'];
      }
    },
    placeholder: String
  },

  data() {
    return {
      showChooseFile: false,
      upList: [],
      finshRequest: [],
      successUp: [],
      loadNum: 0,
      deleteFiles: [],
      files: []
    };
  },

  computed: {
    gridFileStyle() {
      const { gridHeight, showType, isCer } = this;
      if (isCer) return { height: '250rpx' };
      if (showType !== 'grid') return {};
      return {
        height: gridHeight
      };
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 还剩余可以选择的文件
    canChooseNum() {
      const { list, limit } = this;
      return limit - list.length;
    },
    // 是否可以选择图片
    canShowBtn() {
      const { canChooseNum, disabled } = this;
      if (disabled) return false;
      if (canChooseNum <= 0) return false;
      return true;
    },
    list() {
      const { fileList, upList } = this;
      return fileList.concat(upList);
    },
    loading() {
      const { loadNum, finshRequest } = this;
      if (loadNum === finshRequest.length) return false;
      return true;
    },
    gridStyle() {
      const { gridNum, mode, showType, isCer } = this;
      if (showType !== 'grid' || isCer) return {};
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridNum}, 1fr)`,
        gridGap: '20rpx'
      };
    },
    // 是否需要加水印
    isWatermark() {
      return this.$store.getters.getWatermark;
    }
  },

  watch: {
    loading(status) {
      if (!status) {
        this.finshRequest = [];
        this.loadNum = 0;
        this.successUp = [];
        this.$emit('success', this.list);
      }
    },
    fileList: {
      handler() {
        this.upList = [];
      },
      immediate: true
    },

    list: {
      handler(V) {
        this.files = [...V];
      },
      immediate: true
    }
  },

  methods: {
    // 预览
    async prviewFile(info) {
      const { fileType, file: preview, index } = info;
      if (['video', 'audio'].indexOf(fileType) !== -1) {
        const { url } = preview;
        await this.$refs.player.showAsyncModal({
          type: fileType,
          url
        });
      } else {
        let file = [preview];
        if (fileType === 'image') file = [...this.list];
        this.$apiot.preview.previewFile({
          file,
          isWatermark: this.isWatermark,
          fileParamUrl: 'url',
          fileParamName: 'name',
          current: preview,
          currentIndex: index
        });
      }
    },
    // 删除
    delFile({ index }) {
      if (index !== -1) this.files.splice(index, 1);
      this.$emit('delFile', this.files);
    },
    // 上传
    async upload(file) {
      const index = this.upList.length;
      const { path, size, name } = file;
      this.upList.push({
        isLoading: true,
        url: path,
        size,
        name
      });
      try {
        const images = await fileUpload(path, this.param);
        // eslint-disable-next-line prefer-destructuring
        if (images.length > 0) {
          const img = images[0];
          this.successUp.push(img);
          this.$set(this.upList, index, img);
        }
      } catch (error) {
        console.error(error);
        this.$set(this.upList, index, { isLoading: false, url: path, size, name, isError: true });
      } finally {
        this.finshRequest.push(index);
      }
    },
    contrastSize(files) {
      const { size: configSize } = this;
      let index = -1;
      const path = [];
      for (let i = 0, len = files.length; i < len; i += 1) {
        const file = files[i];
        const { size = 0, tempFilePath, url } = file;
        if (size > configSize * 1024 * 1024) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        this.$refs.uToast.show({
          type: 'error',
          message: `单文件不能超过${configSize}MB`
        });
        return [];
      }
      return files;
    },
    handleClose() {
      this.showChooseFile = false;
    },
    // 上传文件
    chooseFiles() {
      const { mode } = this;
      if (mode === 'file') {
        this.showChooseFile = true;
      } else if (mode === 'veido') this.chooseVideos();
      else this.chooseImages();
    },
    // 选择视频
    async chooseVideos() {
      const { sourceType } = this;
      const files = await this.chooseVideo({ sourceType });
      this.uploadFiles({ files });
    },
    // 选择图片
    async chooseImages() {
      const { canChooseNum, sourceType } = this;
      const files = await this.chooseImage({ canChooseNum, sourceType });
      this.uploadFiles({ files });
    },
    // #ifdef APP-PLUS
    uploadFilesApp(res) {
      let { index } = res;
      if (index === -1) {
        const files = this.contrastSize(res.files);
        if (files.length === 0) {
          index = -1;
          return;
        }
        this.$emit('selectFiles', files);

        if (this.automaticUpload) {
          this.loadNum = files.length;
          index = this.upList.length;
          const file = files[0];
          const { path, size, name } = file;
          this.upList.push({
            isLoading: true,
            url: path,
            size,
            name
          });
        }
      } else {
        const { result = {} } = res;
        const { isSuccess, file } = result;
        if (isSuccess) {
          const img = file;
          this.successUp.push(img);
          this.$set(this.upList, index, img);
        } else {
          const { path, size, name } = file;
          this.$set(this.upList, index, { isLoading: false, url: path, size, name, isError: true });
        }

        this.finshRequest.push(index);
        this.showChooseFile = false;
        index = -1;
      }
      return index;
    },
    // #endif
    uploadFiles(res) {
      this.showChooseFile = false;
      const files = this.contrastSize(res.files);

      if (files.length === 0) return;
      this.$emit('selectFiles', files);
      if (this.automaticUpload) {
        this.loadNum = files.length;
        for (let i = 0, len = files.length; i < len; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          this.upload(files[i], res.isNoUpload);
        }
      }
    },
    clickMask() {
      this.$refs.uToast.show({
        type: 'error',
        message: '文件上传中，请稍后操作'
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.enclosure {
  .grid {
    .item {
      overflow: hidden;
    }
  }
  .list-card {
    .item {
      margin-top: 20rpx;
    }
  }
  .is-add {
    box-sizing: border-box;
    height: 100%;
    position: relative;
    .addBtn {
      position: absolute;
      left: 50%;
      top: 50%;

      transform: translate(-50%, -50%);
      text-align: center;
      p {
        white-space: nowrap;
        color: #c1c1c1;
      }
    }
    .appIcon {
      display: block;
      color: #bbc3cd;
      font-size: 68rpx;
    }
  }

  .chooseFileBtn {
    width: 100%;
    border-radius: 12rpx;
    border: 1px solid #e9e9e9;
    .appIcon-shangchuan {
      display: inline-block;
      margin-right: 4rpx;
      font-size: 38rpx;
    }
    button {
      height: 78rpx !important;
      font-size: 30rpx;
      background-color: #fff !important;
      line-height: 78rpx;
      color: #333333;
      &::after {
        border: none;
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}
</style>
