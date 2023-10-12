<!--
 * @Author: sss
 * @Date: 2023-05-10 11:44:11
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-10 11:44:11
 * @Desc: 电子签名
-->
<template>
  <view class="signature" :class="[mode]">
    <header class="signature__header" v-if="canChangColor">
      <p
        class="color"
        v-for="color in colors"
        :key="color"
        :style="{ background: color }"
        @click="selectColor(color)"
      >
        <span class="color__white" v-if="lineColor !== color"></span>
      </p>
    </header>
    <view class="handCenter" :style="handCenter">
      <canvas
        class="handWriting"
        disable-scroll="true"
        :canvas-id="canvasId"
        :style="canvasStyle"
        @touchstart="uploadScaleStart"
        @touchmove="uploadScaleMove"
        @touchend="uploadScaleEnd"
      ></canvas>
    </view>
    <footer class="signature__footer">
      <div class="btn">
        <apiot-button
          :custom-style="{
            width: '100%',
            background: '#F1F3F6',
            border: 'none',
            borderRadius: 'none',
          }"
          :hair-line="false"
          @click="reset"
          >重签</apiot-button
        >
      </div>
      <div class="btn">
        <apiot-button
          :custom-style="{
            width: '100%',
          }"
          type="primary"
          @click="save"
          >确定</apiot-button
        >
      </div>
    </footer>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { downloadFile } from '@/api/menuConfig.js';
import Handwriting from './signature';

export default {
  name: 'signature',
  components: {},

  props: {
    // signAbsolute=默认不展示
    mode: {
      type: String,
      default: ''
    },
    canChangColor: Boolean, // 是否能切换签名颜色
    waterColor: {
      type: String,
      default: '#333333'
    },
    watermark: {
      // 水印信息
      type: String,
      default: ''
    },
    // 是否默认显示上次签名图片
    showLastImg: {
      type: Boolean,
      default: false
    },
    lastImgUrl: {
      // 上次签名地址，只有showLastImg为true时生效
      type: String,
      default: ''
    }
  },

  data() {
    return {
      lineColor: '#333333',
      slideValue: 75,
      handwriting: '',
      colors: ['#333333', '#E73D3D', '#4689F5'],
      canvasId: '',
      canvasWidth: 0,
      canvasHeight: 0,
      handCenter: {},
      drawImgInfo: null
    };
  },

  computed: {
    canvasStyle() {
      const { canvasWidth, canvasHeight } = this;
      return { width: `${canvasWidth}px`, height: `${canvasHeight}px` };
    }
  },

  watch: {},

  methods: {
    reset() {
      this.handwriting.retDraw();
      // this.handwriting.watermark({ content: this.watermark });
    },
    selectColor(color) {
      this.lineColor = color;
      this.handwriting.selectColorEvent(color);
    },
    async save() {
      try {
        const path = await this.handwriting.saveCanvas();
        const pathW = await this.handwriting.saveCanvas(this.watermark);
        this.$emit('success', {
          path,
          pathW
        });
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: error
        });
      }
    },
    uploadScaleStart(event) {
      this.handwriting.uploadScaleStart(event);
    },
    uploadScaleMove(event) {
      this.handwriting.uploadScaleMove(event);
    },
    uploadScaleEnd(event) {
      this.handwriting.uploadScaleEnd(event);
    },
    getImagInfo(url) {
      return new Promise((resolve) => {
        if (this.drawImgInfo && this.drawImgInfo.url === url) {
          resolve(this.drawImgInfo);
        }
        uni.getImageInfo({
          src: url,
          success(image) {
            this.drawImgInfo = { ...image, url };
            resolve(image);
          },
          fail() {
            resolve('');
          }
        });
      });
    },
    drawImg() {
      this.handwriting.drawImg(url);
    },
    async showAsyncDraw(opt) {
      if (!this.handwriting) {
        this.init();
      }
      if (opt.drawSrc) {
        const filePath = await downloadFile(opt.drawSrc, false);
        const img = await this.getImagInfo(filePath);
        if (!img) return;
        const { width, height, path } = img;
        if (!this.canvasWidth) {
          let { windowWidth } = uni.getSystemInfoSync();

          if (width > windowWidth) {
            windowWidth -= 60;
            this.canvasWidth = windowWidth;
            this.canvasHeight = height * (windowWidth / width);
          }
          this.handCenter = {
            width: `${this.canvasWidth}px`,
            height: `${this.canvasHeight}px`
          };
        }
        // this.init();
        this.handwriting.restSize(this.canvasWidth, this.canvasHeight);
        await this.handwriting.drawImg(path);
      }
      if (!opt.noSave) {
        const pathW = await this.handwriting.saveCanvas(this.watermark);
        const info = { pathW };
        return info;
      }
    },
    init() {
      if (!this.canvasWidth) {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.handCenter')
          .boundingClientRect((rect) => {
            this.canvasWidth = rect.width || 300;
            this.canvasHeight = rect.height || 205;
          })
          .exec();
      }

      this.handwriting = new Handwriting({
        lineColor: this.lineColor,
        slideValue: this.slideValue, // 0, 25, 50, 75, 100
        canvasName: this.canvasId,
        width: this.canvasWidth,
        height: this.canvasHeight
      });

      if (this.showLastImg) {
        this.showAsyncDraw({
          drawSrc: this.lastImgUrl,
          noSave: true
        });
      }
    }
  },

  mounted() {
    this.lineColor = this.waterColor;
    this.init();
  },

  created() {
    this.canvasId = `handWriting_${this._uid}`;
  }
};
</script>

<style lang='scss' scoped>
.signature {
  padding: 0 33rpx 19rpx 33rpx;
  border-radius: 30rpx 30rpx 0 0;
  background: #fff;
  &.signAbsolute {
    position: absolute;
    left: -1000px;
    top: -1000px;
    width: 100%;
  }

  &__header {
    margin-top: 22rpx;
    height: 80rpx;
    display: flex;
    .color {
      margin-right: 24rpx;
      width: 38rpx;
      height: 38rpx;
      line-height: 38rpx;
      border-radius: 50%;
      text-align: center;
      &__white {
        // margin: auto;
        display: inline-block;
        width: 22rpx;
        height: 22rpx;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
  &__footer {
    padding-top: 20rpx;
    display: flex;
    .btn {
      flex: 1;
      &:first-child {
        margin-right: 20rpx;
      }
    }
  }
}
</style>
