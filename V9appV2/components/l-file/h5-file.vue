<template>
  <div class="content">
    <div @click="onClose" class="fixed mask"></div>

    <div class="fixed file-content">
      <view class="btn">
        <div class="addBox">
          <div class="addBox__title">上传</div>
          <div class="addBox__line">
            <div
              v-for="(item, index) in updataArr"
              :key="index"
              :ref="item.ref"
            >
              <upload-block :title="item.title" :url="item.url"></upload-block>
            </div>
          </div>
        </div>
      </view>
    </div>
  </div>
</template>

<script>
import UploadBlock from './components/UploadBlock';

export default {
  props: {},
  data() {
    return {
      hFile: '',
      hImg: '',
      hVideo: '',
      updataArr: [
        {
          title: '上传文件',
          url: 'file.svg',
          ref: 'uploadFile',
        },
        {
          title: '上传图片',
          url: 'img.svg',
          ref: 'uploadImg',
        },
        {
          title: '上传视频',
          url: 'video.svg',
          ref: 'uploadVideo',
        },
      ],
    };
  },
  components: { UploadBlock },
  mounted() {
    this.addElement(this.$refs.uploadFile, 'hFile', '');
    this.addElement(this.$refs.uploadImg, 'hImg', '.jpg, .JPEG, .png');
    this.addElement(this.$refs.uploadVideo, 'hVideo', '.mp4');
  },
  methods: {
    addElement(ele, addEle, accept) {
      this[addEle] = document.createElement('input');
      this[addEle].type = 'file';
      this[addEle].value = '';
      this[addEle].accept = accept;
      this[addEle].style.position = 'absolute';
      this[addEle].style.zIndex = 93;
      this[addEle].style.left = 0;
      this[addEle].style.right = 0;
      this[addEle].style.top = 0;
      this[addEle].style.bottom = 0;
      this[addEle].style.height = '100%';
      this[addEle].style.width = '100%';
      this[addEle].style.opacity = 0;
      ele[0].appendChild(this[addEle]);
    },
    onAbort() {
      this.$emit('abort', {});
    },
    onClose() {
      this.$emit('close', {});
    },
  },
};
</script>

<style scoped lang='scss'>
.content {
  background: transparent;
}
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}
.content .mask {
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}
.content .file-content {
  z-index: 1000;
  height: 370rpx;
  background: #fff;
  text-align: center;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}
.btn {
  position: relative;
}
.btn .file {
  position: absolute;
  z-index: 1002;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 60px;
  width: 100%;
  opacity: 0;
}
.tis {
  top: 0;
  z-index: 1005;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tis .tis-content {
  background: #fff;
  width: 60%;
  border-radius: 10px;
  padding: 20px 0;
}
.tis .tis-content img {
  width: 50px;
  height: 50px;
}
.tis-progress {
  margin: 10px 0;
  color: #999;
}
.cancel-btn {
  margin-top: 30px;
  height: 30px;
  width: 60%;
  line-height: 30px;
  font-size: 14px;
  padding: 0 2em;
  background: #e3e3e3;
  color: #898989;
  border: 0 !important;
  border-radius: 5px;
}
.cancel-btn:after {
  height: 0 !important;
  border: 0 !important;
}
.addBox {
  margin: 0 30rpx;
  &__line {
    display: flex;
    div {
      flex: 1;
      position: relative;
    }
  }
  &__title {
    text-align: left;
    margin-top: 30rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
</style>
