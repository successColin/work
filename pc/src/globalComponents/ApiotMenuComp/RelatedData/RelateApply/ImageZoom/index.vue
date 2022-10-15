<!-- 页面 -->
<template>
  <transition name="slide-bottom">
    <div class="zoomWrap" v-loading="loading">
      <div class="headerWrap">
        <div class="headerWrap__title">
          <img :src="imageFile" alt="" />
          <span>{{ getCurrentImage.name }}</span>
        </div>
        <div class="headerWrap__ope">
          <div
            class="action-item"
            @click="doShare"
            v-if="isShowShareBtn && false"
            style="border-right: 1px solid #333333"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.image_show')"
              placement="top-start"
            >
              <div class="action-item-con" :title="$t('knowledge.image_show')">
                <i class="iconfont icon-fenxiang"></i>
              </div>
            </el-tooltip>
          </div>
          <div
            class="action-item"
            @click="download(getCurrentImage.url, getCurrentImage.name)"
            :style="
              isShowDelBtn ? 'border-right: 1px solid #333333;' : 'border:none;'
            "
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.download')"
              placement="top-start"
            >
              <div class="action-item-con" :title="$t('knowledge.download')">
                <i class="iconfont icon-xiazai"></i>
              </div>
            </el-tooltip>
          </div>
          <div
            class="action-item"
            @click="doPreviewDel"
            v-if="isShowDelBtn && false"
            style="border: none"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.delete')"
              placement="top-start"
            >
              <div class="action-item-con" :title="$t('knowledge.delete')">
                <i class="iconfont icon-shanchu"></i>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div class="close" @click="handleClose">
          <span class="iconfont icon-guanbi"></span>
        </div>
        <div class="hoverLine"></div>
      </div>
      <div class="previewContent">
        <div class="previewContent-leftArrow" @click="changeLeftPic">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div
          class="pic"
          :style="
            'transform: scale(' + scaleValue + ') translate3d(-50%, -50%, 0px)'
          "
        >
          <div
            class="imgWrap"
            :style="'transform: rotate(' + rotationAngle + 'deg);width:100%;'"
          >
            <img class="scale-up-center" :src="getUrl" />
          </div>
        </div>
        <div class="previewContent-rightArrow" @click="changeRightPic">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="bottomWrap__ope">
          <div class="action-item" :class="{ active: xuanzhuan }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.image_Spin')"
              placement="top-start"
            >
              <div class="action-item-con" @click="doLeftRotate">
                <i class="iconfont icon-xuanzhuan"></i>
              </div>
            </el-tooltip>
          </div>
          <div class="action-item" :class="{ active: rightXuanZhuan }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.image_SpinR')"
              placement="top-start"
            >
              <div class="action-item-con" @click="doRightRotate">
                <i class="iconfont icon-a-xuanzhuanshun"></i>
              </div>
            </el-tooltip>
          </div>
          <div class="action-item" :class="{ active: fangda }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.image_expand')"
              placement="top-start"
            >
              <div class="action-item-con" @click="doEnlarge">
                <i class="iconfont icon-fangda"></i>
              </div>
            </el-tooltip>
          </div>
          <div class="action-item" :class="{ active: shuoxiao }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('knowledge.image_Narrow')"
              placement="top-start"
            >
              <div class="action-item-con" @click="doNarrow">
                <i class="iconfont icon-suoxiao"></i>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import imageFile from '@/assets/img/imageFile.svg';
import { downloadSingle } from '@/api/knowledge';
import { saveAs, debounce } from '@/utils/utils';

export default {
  props: {
    previewObj: {
      type: Object,
      default: () => {}
    },
    isShowShareBtn: {
      type: Boolean,
      default: true
    },
    isShowDelBtn: {
      type: Boolean,
      default: true
    },
    picList: {
      // 预览图片数组
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      imageFile,
      rotationAngle: 0, // 旋转角度
      xuanzhuan: false,
      fangda: false,
      shuoxiao: false,
      scaleValue: 1, // 放大缩小值
      rightXuanZhuan: false,
      defaultPage: 0, // 文件下标
      loading: false
    };
  },

  components: {},

  computed: {
    getCurrentImage() {
      if (!this.picList.length) {
        return this.previewObj.sysKlTree || {};
      }
      const current = this.picList[this.defaultPage] || {};
      return current.sysKlTree || current;
    },
    getUrl() {
      if (
        this.$store.state.globalConfig.waterConfig.enableWaterMask === '1' &&
        this.getCurrentImage.blob
      ) {
        return this.blobToImg(this.getCurrentImage.blob);
      }
      return this.$parseImgUrl(this.getCurrentImage.url);
    }
  },

  mounted() {
    window.addEventListener('mousewheel', this.handleScroll);
    this.defaultPage = this.picList.findIndex((item) => {
      // 渲染找到当前数据是哪个
      const { id } = item.sysKlTree || item;
      return id === this.previewObj.sysKlTree.id;
    });
  },
  destroyed() {
    window.removeEventListener('mousewheel', this.handleScroll, false);
  },
  methods: {
    // blob -> img
    blobToImg(blob) {
      const url = URL.createObjectURL(blob);
      return url;
    },
    async changeLeftPic() {
      // 点击左边切换
      const n = this.picList.length;
      if (!n) return;
      this.reset();
      let tempPage = this.defaultPage;
      if (tempPage === 0 || tempPage < 0) {
        tempPage = n - 1;
      } else {
        tempPage -= 1;
      }
      if (
        this.$store.state.globalConfig.waterConfig.enableWaterMask === '1' &&
        !this.picList[tempPage].sysKlTree.blob
      ) {
        this.loading = true;
        const data = await downloadSingle({ url: this.picList[tempPage].sysKlTree.url });
        this.loading = false;
        this.picList[tempPage].sysKlTree.blob = data;
      }
      this.defaultPage = tempPage;
    },
    async changeRightPic() {
      // 点击右边切换
      const n = this.picList.length;
      if (!n) return;
      const lastN = n - 1;
      this.reset();
      let tempPage = this.defaultPage;
      if (tempPage === lastN || tempPage > lastN) {
        tempPage = 0;
      } else {
        tempPage += 1;
      }
      if (
        this.$store.state.globalConfig.waterConfig.enableWaterMask === '1' &&
        !this.picList[tempPage].sysKlTree.blob
      ) {
        this.loading = true;
        const data = await downloadSingle({ url: this.picList[tempPage].sysKlTree.url });
        this.loading = false;
        this.picList[tempPage].sysKlTree.blob = data;
      }
      this.defaultPage = tempPage;
    },
    reset() {
      this.scaleValue = 1; // 放大缩小值
      this.rotationAngle = 0; // 旋转角度
    },
    debounceHook() {
      // console.log(33545453);
      debounce(this.handleScroll, 10);
    },
    handleScroll(e) {
      // console.log(333);
      const direction = e.deltaY > 0 ? 'down' : 'up'; // deltaY为正则滚轮向下，为负滚轮向上
      if (direction === 'down' && e.deltaY >= 100) {
        // 125为用户一次滚动鼠标的wheelDelta的值
        if (this.scaleValue <= 0.25) {
          return;
        }
        this.scaleValue -= 0.1;
      }
      if (direction === 'up' && e.deltaY <= -100) {
        this.scaleValue += 0.1;
      }
    },
    doShare() {
      this.$emit('doPreviewShare', this.previewObj);
    },
    async download(url, filename) {
      // 下载
      this.loading = true;
      const data = await downloadSingle({ url });
      this.loading = false;
      saveAs(data, filename);
    },
    doRotate() {
      // 旋转
      this.xuanzhuan = true;
      this.rotationAngle -= 90;
    },
    doLeftRotate() {
      // 旋转
      this.xuanzhuan = true;
      this.rightXuanZhuan = false;
      this.rotationAngle -= 90;
    },
    doRightRotate() {
      this.rightXuanZhuan = true;
      this.xuanzhuan = false;
      this.rotationAngle += 90;
    },
    doEnlarge() {
      // 放大
      this.fangda = true;
      this.shuoxiao = false;
      this.scaleValue += 0.25;
    },
    doNarrow() {
      // 缩小
      this.fangda = false;
      this.shuoxiao = true;
      if (this.scaleValue <= 0.25) {
        return;
      }
      this.scaleValue -= 0.25;
    },
    handleClose() {
      // 取消
      this.$emit('hideImgPreview');
    },
    doPreviewDel() {
      // 删除
      this.$emit('doPreviewDel', this.previewObj);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.zoomWrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 101;
  cursor: move;
  .headerWrap {
    width: 100%;
    height: 50px;
    position: relative;
    padding: 0 18px 0 14px;
    background: #111111;
    overflow: hidden;
    box-sizing: border-box;
    .headerWrap__title {
      float: left;
      height: 50px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 50px;
      & > img {
        margin-top: 13px;
      }
      & > span {
        margin-left: 14px;
        vertical-align: super;
      }
    }
    .headerWrap__ope {
      position: absolute;
      right: 94px;
      top: 8px;
      height: 34px;
      max-width: 144px;
      display: flex;
      border-radius: 4px;
      border: 1px solid #333333;
      box-sizing: border-box;
      .action-item {
        flex: 1;
        width: 48px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;
        box-sizing: border-box;
        & .iconfont {
          font-size: 18px;
          color: #ffffff;
        }
        &:last-child(3) {
          border: none;
        }
        &:hover {
          background: #333333;
        }
      }
    }
    .close {
      position: absolute;
      width: 34px;
      height: 34px;
      right: 20px;
      top: 8px;
      text-align: center;
      line-height: 34px;
      border: 1px solid #333333;
      cursor: pointer;
      box-sizing: border-box;
      & > .iconfont {
        font-size: 18px;
        color: #ffffff;
      }
      &:hover {
        background: #333333;
      }
    }
    .hoverLine {
      position: absolute;
      width: 1px;
      height: 24px;
      background: #333333;
      right: 74px;
      top: 50%;
      margin: -12px 0 0;
    }
  }
  .previewContent {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    overflow: hidden;
    .pic {
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: 0px 0px;
      transition: all 0.1s ease 0s;
      transform: scale(1) translate3d(-50%, -50%, 0px);
      cursor: move;
      & > img {
        display: inline-block;
        vertical-align: middle;
        transform: rotate(0deg);
        transition: all 0.1s ease 0s;
      }
      .imgWrap {
        transition: all 0.1s ease 0s;
      }
    }
    .bottomWrap__ope {
      position: absolute;
      display: flex;
      right: 20px;
      bottom: 20px;
      height: 34px;
      width: 144px;
      border-radius: 4px;
      overflow: hidden;
      box-sizing: border-box;
      .action-item {
        flex: 1;
        text-align: center;
        line-height: 34px;
        border-right: 1px solid #333333;
        cursor: pointer;
        box-sizing: border-box;
        background: #111111;
        & .iconfont {
          font-size: 18px;
          color: #ffffff;
        }
        &:nth-child(3) {
          border: none;
        }
        &:hover {
          background: #333333;
        }
      }
    }
    .previewContent-leftArrow {
      position: absolute;
      display: flex;
      top: 50%;
      width: 45px;
      height: 45px;
      align-items: center;
      justify-content: center;
      background: #67686c;
      border-radius: 50%;
      transform: scale(1) translate3d(40px, -50%, 0px);
      z-index: 11;
    }
    .el-icon-arrow-left,
    .el-icon-arrow-right {
      font-size: 35px;
      cursor: pointer;
      color: #f0f0f0;
      &:hover {
        color: #ffffff;
      }
    }
    .previewContent-rightArrow {
      position: absolute;
      display: flex;
      top: 50%;
      width: 45px;
      height: 45px;
      right: 40px;
      align-items: center;
      justify-content: center;
      background: #67686c;
      border-radius: 50%;
      transform: scale(1) translate3d(0, -50%, 0px);
      z-index: 11;
    }
  }
}
/**
 * ----------------------------------------
 * animation scale-up-center
 * ----------------------------------------
 */
@-webkit-keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.scale-up-center {
  -webkit-animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)
    both;
  animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>
