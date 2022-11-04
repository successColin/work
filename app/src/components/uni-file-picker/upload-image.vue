<template>
  <view class="uni-file-picker__container">
    <view
      v-if="filesList.length < limit && !readonly"
      class="file-picker__box"
      :style="boxStyle"
    >
      <view
        class="file-picker__box-content is-add 123543"
        :style="borderStyle"
        @click="choose"
      >
        <slot>
          <view class="icon-add"></view>
          <view class="icon-add rotate"></view>
        </slot>
      </view>
    </view>
    <view
      class="file-picker__box"
      v-for="(item, index) in filesList"
      :key="index"
      :style="boxStyle"
    >
      <view class="file-picker__box-content" :style="borderStyle">
        <view class="file-image 3333" @click.stop="prviewImage(item, index)">
          <!-- <image
            class="file-image"
            :src="item.url"
            mode="aspectFill"
            @click.stop="prviewImage(item, index)"
          ></image> -->
          <!-- #ifdef H5 -->
          <!-- <video
            v-if="fileType(item, ['.mp4', '.webm', '.ogg'])"
            :src="item.url"
            object-fit="cover"
            @play="prviewImage(item, index)"
          ></video> -->
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <!-- <video
            v-if="fileType(item, ['.mp4', '.webm', '.ogg'])"
            :src="item.url"
            object-fit="cover"
            :poster="item.url"
            @play="prviewImage(item, index)"
          ></video> -->
          <!-- #endif -->
          <!-- <image v-else mode="aspectFill" :src="item | fileUrl"></image> -->
          <image
            v-if="isImage(item.name || item.url)"
            :src="$apiot.getComUrlByToken(item.url)"
            :disabled="false"
            :controls="false"
            :autoplay="false"
            mode="aspectFill"
          ></image>
          <i
            v-else
            class="fileIconName appIcon"
            :class="[fileIconName(item.name || item.url)]"
          ></i>
        </view>
        <view
          v-if="delIcon && !readonly"
          class="icon-del-box"
          @click.stop="delFile(index)"
        >
          <view class="icon-del"></view>
          <view class="icon-del rotate"></view>
        </view>
        <view
          v-if="(item.progress && item.progress !== 100) || item.progress === 0"
          class="file-picker__progress"
        >
          <progress
            class="file-picker__progress-item"
            :percent="item.progress === -1 ? 0 : item.progress"
            stroke-width="4"
            :backgroundColor="item.errMsg ? '#ff5a5f' : '#EBEBEB'"
          />
        </view>
        <view
          v-if="item.errMsg"
          class="file-picker__mask"
          @click.stop="uploadFiles(item, index)"
        >
          点击重试
        </view>
      </view>
    </view>
    <Player ref="player"></Player>
  </view>
</template>

<script>
import Player from './components/player.vue';

export default {
  name: 'uploadImage',
  emits: ['uploadFiles', 'choose', 'delFile'],
  components: { Player },
  props: {
    filesList: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disablePreview: {
      type: Boolean,
      default: false
    },
    limit: {
      type: [Number, String],
      default: 9
    },
    imageStyles: {
      type: Object,
      default() {
        return {
          width: 'auto',
          height: 'auto',
          border: {}
        };
      }
    },
    delIcon: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 图标
    fileIconName() {
      return function (name) {
        return this.$apiot.preview.getFileIconName(name);
      };
    },
    // 是否为图片
    isImage() {
      return function (name) {
        const type = this.$apiot.preview.getFileSuffix(name);
        return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(type) !== -1;
      };
    },
    // 是否需要加水印
    isWatermark() {
      const { WATER_MASK } = this.$store.state.base.globalConfig;
      const waterMask = WATER_MASK.find((item) => item.attributeKey === 'enableWaterMask') || {};
      if (!waterMask.attributeValue) return false;
      return waterMask.attributeValue === '1';
    },
    fileType() {
      return function (imag, typeArry) {
        const { url, name } = imag;
        if (!name) return false;
        const type = name.substring(name.lastIndexOf('.'), name.length).toLocaleLowerCase();
        return typeArry.indexOf(type) !== -1;
      };
    },
    styles() {
      const styles = {
        width: 'auto',
        height: 'auto',
        border: {}
      };
      return Object.assign(styles, this.imageStyles);
    },
    boxStyle() {
      const { width = 'auto', height = 'auto' } = this.styles;
      console.log(width);
      const obj = {};
      if (height === 'auto') {
        if (width !== 'auto') {
          obj.height = this.value2px(width);
          obj['padding-top'] = 0;
        } else {
          obj.height = 0;
        }
      } else {
        obj.height = this.value2px(height);
        obj['padding-top'] = 0;
      }

      if (width === 'auto') {
        if (height !== 'auto') {
          obj.width = this.value2px(height);
        } else {
          obj.width = '33.3%';
        }
      } else {
        obj.width = this.value2px(width);
      }

      let classles = '';
      for (const i in obj) {
        classles += `${i}:${obj[i]};`;
      }
      return classles;
    },
    borderStyle() {
      const { border } = this.styles;
      let obj = {};
      const widthDefaultValue = 1;
      const radiusDefaultValue = 3;
      if (typeof border === 'boolean') {
        obj.border = border ? '1px #eee solid' : 'none';
      } else {
        let width = (border && border.width) || widthDefaultValue;
        width = this.value2px(width);
        let radius = (border && border.radius) || radiusDefaultValue;
        radius = this.value2px(radius);
        obj = {
          'border-width': width,
          'border-style': (border && border.style) || 'solid',
          'border-color': (border && border.color) || '#eee',
          'border-radius': radius
        };
      }
      let classles = '';
      for (const i in obj) {
        classles += `${i}:${obj[i]};`;
      }
      return classles;
    }
  },
  methods: {
    uploadFiles(item, index) {
      this.$emit('uploadFiles', item);
    },
    choose() {
      this.$emit('choose');
    },
    delFile(index) {
      this.$emit('delFile', index);
    },
    async prviewImage(img) {
      const { name, url } = img;
      const suffix = this.$apiot.preview.getFileSuffix(url);
      const fileType = this.$apiot.preview.getFileType(suffix);
      if (['video', 'audio'].indexOf(fileType) !== -1) {
        await this.$refs.player.showAsyncModal({
          type: fileType,
          url
        });
      } else {
        let file = [img];
        if (fileType === 'image') file = [...this.filesList];
        this.$apiot.preview.previewFile({
          file,
          isWatermark: this.isWatermark,
          fileParamUrl: 'url',
          fileParamName: 'name',
          current: img
        });
      }
    },
    value2px(value) {
      if (typeof value === 'number') {
        value += 'px';
      } else if (value.indexOf('%') === -1) {
        value = value.indexOf('px') !== -1 ? value : `${value}px`;
      }
      return value;
    }
  },
  filters: {
    filesSizeFilter(size) {
      if (!size) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'PB', 'TB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return `${(size / Math.pow(k, i)).toPrecision(3)}${sizes[i]}`;
    }
  }
};
</script>

<style lang="scss">
.uni-file-picker__container {
  /* #ifndef APP-NVUE */
  display: flex;
  box-sizing: border-box;
  /* #endif */
  flex-wrap: wrap;
  margin: -5px;
}

.file-picker__box {
  position: relative;
  // flex: 0 0 33.3%;
  width: 33.3%;
  height: 0;
  padding-top: 33.33%;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
}

.file-picker__box-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 10rpx;
  border: 1px #eee solid;
  border-radius: 10rpx;
  overflow: hidden;
}

.file-picker__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  /* border: 1px red solid; */
  z-index: 2;
}

.file-picker__progress-item {
  width: 100%;
}

.file-picker__mask {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  color: #fff;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.4);
}

.file-image {
  width: 100%;
  height: 100%;
  video,
  image {
    height: 100%;
    width: 100%;
  }
}

.is-add {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
}

.icon-add {
  width: 50px;
  height: 5px;
  background-color: #f1f1f1;
  border-radius: 2px;
}

.rotate {
  position: absolute;
  transform: rotate(90deg);
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
  border-radius: 0 0 0 100px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.icon-del {
  width: 16rpx;
  height: 1px;
  background-color: #fff;
  border-radius: 2px;
  transform: rotate(45deg);
  &.rotate {
    transform: rotate(135deg);
  }
}
</style>
