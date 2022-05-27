<template>
  <div class="content">
    <div @click="onClose" class="fixed mask"></div>

    <div v-if="showTip" align="center" class="fixed tis">
      <div class="tis-content">
        <div>
          <img src="../../static/logo.png" />
        </div>
        <div class="tis-progress">
          努力上传中
          <text v-if="progress < 100">..{{ progress }}%</text>
        </div>
        <div class="cancel">
          <button @click="onAbort" type="button" class="cancel-btn">
            取消上传
          </button>
        </div>
      </div>
    </div>

    <div class="fixed file-content">
      <view class="btn">
        <div class="addBox">
          <div class="addBox__title">新建</div>
          <!-- 第一行 -->
          <div class="addBox__line">
            <div @click="handleAdd">
              <upload-block></upload-block>
            </div>
            <div></div>
            <div></div>
          </div>
          <!-- 第二行 -->
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

    <rename-list
      title="新建文件夹"
      :show.sync="addFileShow"
      @close="handleCloseAdd"
      @ok="handleAddFolder"
    ></rename-list>
  </div>
</template>

<script>
import RenameList from '@/knowledgeBase/components/components/MoreOper/components/RenameList';
import UploadBlock from './components/UploadBlock';

export default {
  props: {
    progress: {
      type: [Number, String],
      default: 0
    },
    showTip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hFile: '',
      hImg: '',
      hVideo: '',
      addFileShow: false, // 点击新增文件夹
      updataArr: [
        {
          title: '上传文件',
          url: 'OTHER.svg',
          ref: 'uploadFile'
        },
        {
          title: '上传图片',
          url: 'IMAG.svg',
          ref: 'uploadImg'
        },
        {
          title: '上传视频',
          url: 'MP4.svg',
          ref: 'uploadVideo'
        }
      ]
    };
  },
  components: { UploadBlock, RenameList },
  mounted() {
    this.addElement(this.$refs.uploadFile, 'hFile', '');
    this.addElement(this.$refs.uploadImg, 'hImg', '.jpg, .JPEG, .png');
    this.addElement(this.$refs.uploadVideo, 'hVideo', '.mp4');
  },
  watch: {
    addFileShow(v) {
      console.log(222222, v);
      this.$store.commit('setIsMask', v);
    }
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
    // 点击新增文件夹
    handleAdd() {
      this.addFileShow = true;
    },
    // 新增文件夹弹出层关闭
    handleCloseAdd() {
      this.addFileShow = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    // 新增文件夹弹出层确定
    handleAddFolder() {
      console.log('ok');
    }
  }
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
  height: 580rpx;
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
