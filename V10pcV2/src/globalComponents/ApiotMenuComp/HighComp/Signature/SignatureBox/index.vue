<!--
 * @Author: sss
 * @Date: 2023-05-10 11:44:11
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-10 11:44:11
 * @Desc: 电子签名1
-->
<template>
  <section class="signatureBox">
    <div class="handCenter" id="handCenter" ref="handCenter">
      <canvas
        id="handWriting"
        disable-scroll="true"
        :width="width"
        :height="height"
        @mousedown="uploadScaleStart"
        @mousemove="uploadScaleMove"
        @mouseup="uploadScaleEnd"
      ></canvas>
    </div>
    <div class="signatureBox__colors" v-if="canChangColor">
      <p
        class="color"
        v-for="color in colors"
        :key="color"
        :style="{ background: color }"
        @click="selectColor(color)"
      >
        <span class="color__white" v-if="lineColor !== color"></span>
      </p>
    </div>
  </section>
</template>

<script>
import Handwriting from './signature';

export default {
  components: {},

  props: {
    show: Boolean,
    canChangColor: Boolean, // 是否能切换签名颜色
    waterColor: {
      // 默认签名颜色
      type: String,
      default: '#333333',
    },
    // 是否默认显示上次签名图片
    showLastImg: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      lineColor: '#333333',
      slideValue: 75,
      handwriting: '',
      colors: ['#333333', '#E73D3D', '#4689F5'],
      watermark: '', // s水印信息
      width: 300,
      height: 300,
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
  },

  watch: {},

  methods: {
    reset() {
      this.handwriting.retDraw();
    },
    selectColor(color) {
      this.lineColor = color;
      this.handwriting.selectColorEvent(color);
    },
    save(watermarkInfo) {
      return this.handwriting.saveCanvas(watermarkInfo);
    },
    uploadScaleStart(event) {
      console.log(event);
      this.handwriting.uploadScaleStart(event);
    },
    uploadScaleMove(event) {
      this.handwriting.uploadScaleMove(event);
    },
    uploadScaleEnd(event) {
      this.handwriting.uploadScaleEnd(event);
    },
    // 画出上次电子签名
    async drawLastImg() {
      const { signatureImage } = this.userInfo;
      if (signatureImage) {
        const url = this.$parseImgUrl(signatureImage);
        await this.handwriting.setImg(url);
      }
    },
    init() {
      const query = this.$refs.handCenter;
      this.width = query.offsetWidth;
      this.height = query.offsetHeight;
      this.$nextTick(() => {
        this.handwriting = new Handwriting({
          lineColor: this.lineColor,
          slideValue: this.slideValue, // 0, 25, 50, 75, 100
          canvasName: 'handWriting',
          width: this.width,
          height: this.height,
        });
        if (this.showLastImg) {
          this.drawLastImg();
        }
      });
    },
  },

  mounted() {
    this.lineColor = this.waterColor;
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.signatureBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  .handCenter {
    flex: 1;
    // canvas {
    //   width: 100%;
    //   height: 100%;
    // }
  }
  &__colors {
    height: 32px;
    display: flex;
    justify-content: flex-end;

    .color {
      margin-right: 12px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 50%;
      text-align: center;
      &__white {
        margin: auto;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
}
</style>
