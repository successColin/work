<!--
 * @Author: sss
 * @Date: 2022-11-26 11:20:29
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-26 11:20:29
 * @Desc: 文件
-->
<template>
  <view class="file" :class="[showType === 'grid' ? 'gridFile' : 'listFile']">
    <view class="fileContent" @click.stop="prview">
      <template v-if="showType !== 'grid'">
        <view class="fileContent__image">
          <i class="fileIconName appIcon" :class="fileIconName"></i>
        </view>
      </template>
      <div class="fileContent__content">
        <template v-if="showType !== 'grid'">
          <p class="title">{{ file.name }}</p>
          <div class="subtitle">
            <span v-if="file.uploadTime" class="date">{{
              $apiot.dateFormat(file.uploadTime, 'yyyy-MM-dd hh:mm')
            }}</span>
          </div>
        </template>
        <template v-else>
          <image
            v-if="fileType === 'image'"
            :src="fileUrl"
            :disabled="false"
            :controls="false"
            :autoplay="false"
            mode="aspectFill"
          ></image>
          <i v-else class="fileIconName appIcon" :class="fileIconName"></i>
        </template>
      </div>
      <i
        v-if="!disabled && showType !== 'grid'"
        class="appIcon appIcon-guanbi"
        @click.stop="delFile"
      ></i>
    </view>
    <template v-if="showType === 'grid' && !disabled">
      <div class="icon-del-box" @click.stop="delFile">
        <i class="appIcon appIcon-guanbi"></i>
      </div>
    </template>
    <template v-if="file.isLoading">
      <apiot-toast status="loading" :isFull="true"></apiot-toast>
    </template>
    <template v-if="file.isError">
      <div class="error">上传失败</div>
    </template>
  </view>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  props: {
    file: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 序号
    index: {
      type: Number,
      default: -1
    },
    // 展示风格 grid:大图；list-card：列表
    showType: {
      type: String,
      default: 'list-card'
    }
  },

  data() {
    return {};
  },

  computed: {
    // 图标
    fileIconName() {
      const { file } = this;
      const { name, url } = file;
      const fileName = name || url;
      return this.$apiot.preview.getFileIconName(fileName);
    },
    // 文件类型
    fileType() {
      const { file } = this;
      const { name, url } = file;
      const fileName = name || url;
      const suffix = this.$apiot.preview.getFileSuffix(fileName);
      return this.$apiot.preview.getFileType(suffix);
    },
    fileUrl() {
      const { isLoading, url } = this.file;
      if (isLoading) return url;
      return this.$apiot.getComUrlByToken(url);
    }
  },

  methods: {
    delFile() {
      const { fileType, file, index } = this;
      this.$emit('delFile', { fileType, file, index });
    },
    prview() {
      const { fileType, file, index } = this;
      if (index !== -1) {
        this.$emit('prviewFile', { fileType, file, index });
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.file {
  position: relative;
  border-radius: 12rpx;
  border: 2rpx solid #e9e9e9;
  box-sizing: border-box;
  &.gridFile {
    height: 100%;
    .fileContent {
      height: 100%;
      &__content {
        height: 100%;
        image,
        .fileIconName {
          width: 100%;
          height: 100%;
          border-radius: 12rpx;
        }
      }
    }

    .icon-del-box {
      box-sizing: border-box;
      padding: 0 0 6rpx 4rpx;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      height: 34rpx;
      width: 34rpx;
      border-radius: 0 48rpx 0 100px;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2;
      .appIcon-guanbi {
        color: #fff;
        font-size: 18rpx;
      }
    }
  }
  &.listFile {
    margin-top: 20rpx;
    padding: 26rpx 20rpx 26rpx 26rpx;
  }
  .fileContent {
    width: 100%;
    display: flex;
    align-items: center;

    &__image {
      margin-right: 20rpx;
      .fileIconName {
        width: 80rpx;
        height: 80rpx;
      }
    }
    &__content {
      flex: 1;
      overflow: hidden;
      .title {
        width: 100%;
        color: #333333;
        font-size: $form-el-fontSize;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle {
        margin-top: 12rpx;
        color: #808080;
        font-size: 26rpx;
      }
    }
    .appIcon-guanbi {
      flex-shrink: 0;
      padding-left: 26rpx;
      color: #bbc3cd;
      font-size: 38rpx;
    }
  }
  .error {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
  }
}
</style>
