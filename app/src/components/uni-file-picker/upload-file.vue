<template>
  <view class="uni-file-picker__files">
    <view v-if="!readonly" class="files-button" @click="choose">
      <slot></slot>
    </view>
    <view v-if="list.length > 0" class="uni-file-picker__lists">
      <view
        class="uni-file-picker__lists-box"
        v-for="(item, index) in list"
        :key="index"
        :class="{
          'files-border': index !== 0 && styles.dividline,
        }"
        :style="index !== 0 && styles.dividline && borderLineStyle"
      >
        <view class="uni-file-picker__item">
          <view class="uni-file-picker__item--content">
            <view class="files__image">
              <image
                :src="item | fileUrl"
                @click.stop="prviewImage(item, index)"
              ></image>
            </view>
            <view class="files__name">
              <div class="files__name--neir">
                {{ item.name }}
              </div>
              <div class="files__name--subtitle">
                <span v-if="item.uploadTime" class="file__date">{{
                  item.uploadTime
                }}</span>
                <span class="file__size">{{
                  item.size | filesSizeFilter
                }}</span>
              </div>
            </view>
          </view>
          <i
            v-if="delIcon && !readonly"
            class="appIcon appIcon-shanchu"
            @click="delFile(index)"
          ></i>
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
          v-if="item.status === 'error'"
          class="file-picker__mask"
          @click.stop="uploadFiles(item, index)"
        >
          点击重试
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'uploadFile',
  emits: ['uploadFiles', 'choose', 'delFile'],
  props: {
    filesList: {
      type: Array,
      default() {
        return [];
      }
    },
    delIcon: {
      type: Boolean,
      default: true
    },
    limit: {
      type: [Number, String],
      default: 9
    },
    showType: {
      type: String,
      default: ''
    },
    listStyles: {
      type: Object,
      default() {
        return {
          // 是否显示边框
          border: true,
          // 是否显示分隔线
          dividline: true,
          // 线条样式
          borderStyle: {}
        };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    list() {
      const files = [];
      this.filesList.forEach((v) => {
        files.push(v);
      });
      return files;
    },
    styles() {
      const styles = {
        border: true,
        dividline: true,
        'border-style': {}
      };
      return Object.assign(styles, this.listStyles);
    },
    borderStyle() {
      const { borderStyle, border } = this.styles;
      let obj = {};
      if (!border) {
        obj.border = 'none';
      } else {
        let width = (borderStyle && borderStyle.width) || 1;
        width = this.value2px(width);
        let radius = (borderStyle && borderStyle.radius) || 5;
        radius = this.value2px(radius);
        obj = {
          'border-width': width,
          'border-style': (borderStyle && borderStyle.style) || 'solid',
          'border-color': (borderStyle && borderStyle.color) || '#eee',
          'border-radius': radius
        };
      }
      let classles = '';
      for (const i in obj) {
        classles += `${i}:${obj[i]};`;
      }
      return classles;
    },
    borderLineStyle() {
      const obj = {};
      const { borderStyle } = this.styles;
      if (borderStyle && borderStyle.color) {
        obj['border-color'] = borderStyle.color;
      }
      if (borderStyle && borderStyle.width) {
        let width = (borderStyle && borderStyle.width) || 1;
        let style = (borderStyle && borderStyle.style) || 0;
        if (typeof width === 'number') {
          width += 'px';
        } else {
          width = width.indexOf('px') ? width : `${width}px`;
        }
        obj['border-width'] = width;

        if (typeof style === 'number') {
          style += 'px';
        } else {
          style = style.indexOf('px') ? style : `${style}px`;
        }
        obj['border-top-style'] = style;
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
      this.$emit('uploadFiles', {
        item,
        index
      });
    },
    choose() {
      this.$emit('choose');
    },
    delFile(index) {
      this.$emit('delFile', index);
    },
    value2px(value) {
      if (typeof value === 'number') {
        value += 'px';
      } else {
        value = value.indexOf('px') !== -1 ? value : `${value}px`;
      }
      return value;
    },
    prviewImage(img, index) {
      // const imageType = 'jpg,jpeg,png,gif';
      // const { extname } = img;
      // if (extname) const urls = [];
      // this.list.forEach((i) => {
      //   urls.push(i.url);
      // });
      // uni.previewImage({
      //   urls,
      //   current: index
      // });
    }
  },
  filters: {
    filesSizeFilter(size) {
      if (!size) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'PB', 'TB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return `${(size / Math.pow(k, i)).toPrecision(3)}${sizes[i]}`;
    },
    fileUrl(imag) {
      const { url, name } = imag;
      if (!name) return url;
      const type = name.substring(name.lastIndexOf('.'), name.length).toLocaleLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(type) !== -1) {
        return url;
      }
      if (type === '.pdf') {
        return '../../../static/img/fileType/PDF.svg';
      }
      if (['.doc', '.docx'].indexOf(type) !== -1) {
        return '../../../static/img/fileType/DOC.svg';
      }
      if (['.xls', '.xlsx'].indexOf(type) !== -1) {
        return '../../../static/img/fileType/XLS.svg';
      }
      if (['.ppt', '.pptx'].indexOf(type) !== -1) {
        return '../../../static/img/fileType/PPT.svg';
      }
      if (['.zip', '.rar'].indexOf(type) !== -1) {
        return '../../../static/img/fileType/ZIP.svg';
      }
      if (type === '.mp4') {
        return '../../../static/img/fileType/MP4.svg';
      }
      if (type === '.mp3') {
        return '../../../static/img/fileType/MP3.svg';
      }
      if (type === '.txt') {
        return '../../../static/img/fileType/TXT.svg';
      }

      return '../../../static/img/fileType/OTHER.svg';
    }
  }
};
</script>

<style lang="scss">
.uni-file-picker__files {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  // justify-content: flex-start;
}

.files-button {
  // border: 1px red solid;
}

.uni-file-picker__lists {
  position: relative;
  overflow: hidden;
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
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.4);
}

.uni-file-picker__lists-box {
  position: relative;
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 1px solid #e9e9e9;
}
.file-picker__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.files-border {
  border-top: 1px #eee solid;
}

.uni-file-picker__item {
  display: flex;
  align-items: center;
  &--content {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
}

.files__image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  image {
    width: 100%;
    height: 100%;
  }
}

.files__name {
  flex: 1;
  font-size: 13px;
  line-height: 1.5;
  color: #808080;
  overflow: hidden;
  &--neir {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
  }
}
.file__date {
  display: inline-block;
  margin-right: 20rpx;
}

.appIcon-shanchu {
  padding-left: 20rpx;
  flex-shrink: 0;
  font-size: 17px;
  color: #bbc3cd;
}

.is-list-card {
  border: 1px #eee solid;
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.1);
  padding: 5px;
}

.files__image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.header-image {
  width: 100%;
  height: 100%;
}

.is-text-box {
  border: 1px #eee solid;
  border-radius: 5px;
}

.is-text-image {
  width: 25px;
  height: 25px;
  margin-left: 5px;
}

.rotate {
  position: absolute;
  transform: rotate(90deg);
}

.icon-del-box {
  flex-shrink: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  margin: auto 0;
  /* #endif */
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  bottom: 0;
  right: 5px;
  height: 26px;
  width: 26px;
  color: #bbc3cd;
  // border-radius: 50%;
  // background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  transform: rotate(-45deg);
}

.icon-del {
  width: 15px;
  height: 1px;
  background-color: #bbc3cd;
  // border-radius: 1px;
}

/* #ifdef H5 */
@media all and (min-width: 768px) {
  .uni-file-picker__files {
    max-width: 375px;
  }
}

/* #endif */
</style>
