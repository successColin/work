<!--
 * @Author: sss
 * @Date: 2022-11-25 10:19:04
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-25 10:19:04
 * @Desc: 附件上传
-->
<template>
  <view class="apioUploadFile">
    <upload-files
      :isCer="isCer"
      :mode="mode"
      :showType="showType"
      :fileList="fileList"
      :title="title"
      :limit="limit"
      :disabled="disabled"
      :size="size"
      :automaticUpload="automaticUpload"
      :param="param"
      :gridNum="gridNum"
      :gridHeight="gridHeight"
      :sourceType="sourceType"
      @selectFiles="selectFiles"
      @success="success"
      @delFile="delFile"
    ></upload-files>
  </view>
</template>

<script>
import UploadFiles from './UploadFiles';

export default {
  components: {
    UploadFiles
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
    // 可以选择的文件个数，如果是证件的话，limit为需要上传的个数
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
    otherParam: {
      type: Object,
      default() {
        return {};
      }
    },
    placeholder: String
  },
  computed: {},
  methods: {
    selectFiles(list) {
      this.$emit('selectFiles', { files: list, otherParam: this.otherParam });
    },
    success(list) {
      this.$emit('success', { files: list, otherParam: this.otherParam });
    },
    delFile(list) {
      this.$emit('delFile', { files: list, otherParam: this.otherParam });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
