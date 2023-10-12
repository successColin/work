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
      <div class="backgroundBoxContent" :style="getStyles()"></div>
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
    }
  },
  data() {
    return {
    };
  },

  components: {
  },

  computed: {
    getTextStyles() {
      return function () {
        const { stylesObj: { zIndex }, width, height, top, left, verticalMirror } = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;line-height:${height}px;zIndex:${zIndex};`;
        if (verticalMirror) {
          styles += 'transform: rotateX(180deg);';
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
        const { gradientType, bgType, stylesObj, enableShadows } = this.config;
        const {
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle,
          color1,
          color2,
          backgroundImage,
          opacity,
          rotationAngle,
          xShadow,
          yShadow,
          blurRadius,
          shadowDistance,
          shadowColor
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
          styles += `background-image:url(${this.$parseImgUrl(backgroundImage)});`;
          styles += `transform:rotate(${rotationAngle}deg);opacity:${opacity};`;
        }
        if (enableShadows) {
          styles += `boxShadow: ${xShadow}px ${yShadow}px ${blurRadius}px ${shadowDistance}px ${shadowColor};`;
        }
        return styles;
      };
    },
  },
  beforeMount() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
  },
  name: 'BackgroundBox'
};
</script>

<style lang='scss' scoped>
.backgroundBoxWrap {
  position: absolute;
  background-size: 100% 100%;
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
