/**
* @name: index
* @author: DELL
* @date: 2021/8/26 19:16
* @description：index
* @update: 2021/8/26 19:16
*/
<!-- 页面 -->
<template>

  <div class="backgroundBoxWrap" :style="getTextStyles()">
    <div class="backgroundBox" :style="getRotateY">
      <div class="backgroundBoxContent" :style="getStyles()">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      // width: 200,
      // height: 200,
      // top: 0,
      // left: 0,
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getTextStyles() {
      return function () {
        const { stylesObj: { zIndex, xShadow, yShadow, blurRadius, shadowDistance, shadowColor },
          width, height, verticalMirror, enableShadows } = this.config;
        let styles = `width: ${width}px;height: ${height}px;line-height:${height}px;zIndex:${zIndex};`;
        console.log(enableShadows, verticalMirror);
        if (verticalMirror) {
          styles += 'transform: rotateX(180deg);';
        }
        if (enableShadows) {
          styles += `boxShadow: ${xShadow}px ${yShadow}px ${blurRadius}px ${shadowDistance}px ${shadowColor};`;
        }
        return styles;
      };
    },
    getRotateY() {
      if (this.config.horizontalMirror) {
        return 'transform: rotateY(180deg);';
      }
      return '';
    },
    getStyles() {
      return function () {
        let styles = '';
        const {
          gradientType,
          bgType,
          stylesObj
        } = this.config;
        const {
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle,
          color1,
          color2,
          backgroundImage,
          opacity,
          rotationAngle
        } = stylesObj;
        if (bgType === 'bgColor') {
          if (color1 && color2) {
            if (gradientType === 1) {
              styles += `background-image: linear-gradient(to right, ${color1} , ${color2});`;
            } else {
              styles += `background-image: linear-gradient(${color1} , ${color2});`;
            }
          } else if (color1 || color2) {
            styles += `background-color: ${color1 || color2};`;
          } else {
            styles += 'background: \'\';';
          }
          styles += `borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        } else {
          styles += `background-image:url(${backgroundImage});`;
          styles += `transform:rotate(${rotationAngle}deg);opacity:${opacity};`;
        }
        return styles;
      };
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  beforeMount() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.backgroundBoxWrap {
  width: 100%;
  height: 100%;

  .backgroundBox {
    width: 100%;
    height: 100%;

    .backgroundBoxContent {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
