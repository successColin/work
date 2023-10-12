<!-- 页面 -->
<template>
  <transition name="slide-bottom">
    <div class="zoomWrap">
      <div class="headerWrap">
        <div class="headerWrap__title">
          <img :src="imageFile" alt=""/>
          <span>{{ imageFileName }}</span>
        </div>
        <div class="headerWrap__ope">
          <div
              class="action-item"
              @click="
              download(imageFileUrl, imageFileName)
            "
          >
            <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top-start"
            >
              <div class="action-item-con">
                <i class="el-icon-download" style="color: #FFFFFF;"></i>
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
        <div
            class="pic"
            :style="
            'transform: scale(' + scaleValue + ') translate3d(-50%, -50%, 0px)'
          "
        >
          <img
              :style="'transform: rotate(' + rotationAngle + 'deg)'"
              :src="imageFileUrl"
              alt=""
          />
        </div>
        <div class="bottomWrap__ope">
          <div class="action-item" :class="{ active: xuanzhuan }">
            <el-tooltip
                class="item"
                effect="dark"
                content="旋转"
                placement="top-start"
            >
              <div class="action-item-con" @click="doRotate">
                <i class="el-icon-refresh" style="color: #ffffff;"></i>
              </div>
            </el-tooltip>
          </div>
          <div class="action-item" :class="{ active: fangda }">
            <el-tooltip
                class="item"
                effect="dark"
                content="放大"
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
                content="缩小"
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
import { saveAs, getBlob, debounce } from '@/utils/utils';
import Bus from '@/utils/bus';

export default {
  props: {
    imageFileName: {
      type: String
    },
    imageFileUrl: {
      type: String
    }
  },
  data() {
    return {
      imageFile,
      rotationAngle: 0, // 旋转角度
      xuanzhuan: false,
      fangda: false,
      shuoxiao: false,
      scaleValue: 1 // 放大缩小值
    };
  },

  components: {},

  computed: {},

  mounted() {
    window.addEventListener('mousewheel', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('mousewheel', this.handleScroll, false);
  },
  methods: {
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
    download(url, filename) {
      // 下载
      getBlob(url, (blob) => {
        saveAs(blob, filename);
      });
    },
    doRotate() {
      // 旋转
      this.xuanzhuan = true;
      this.rotationAngle -= 90;
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
      Bus.$emit('previewOpera', {
        visible: false,
        imageFileName: '',
        imageFileUrl: ''
      });
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
  background: rgba(0, 0, 0, 0.6);
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
      font-size: 14px;
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
  }
}
</style>
