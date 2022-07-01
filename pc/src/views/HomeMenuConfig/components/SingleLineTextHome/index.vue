/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles()">
    <div
        class="singleTextContent"
        :style="getTextStyles()"
        :class="{ellipsis: config.enableEllipsis}"
        :title="renderContent"
    >
      {{ renderContent }}
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
    };
  },

  components: {},

  computed: {
    renderContent() {
      const { dataType, dataConfig, apiDataConfig, SqlDataConfig } = this.config;
      const { takeEffect, staticValue } = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        return obj[takeEffect] || '';
      }
      if (dataType === 2) {
        const { apiEffect, apiFilterResponse } = apiDataConfig;
        const obj = JSON.parse(apiFilterResponse);
        return obj[apiEffect] || '';
      }
      if (dataType === 3) {
        const { SQLEffect, SQLFilterResponse } = SqlDataConfig;
        const obj = JSON.parse(SQLFilterResponse);
        return obj[SQLEffect] || '';
      }
      return '';
    },
    getContentStyles() {
      return function () {
        const { stylesObj = {}, enableBackground } = this.config;
        const {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
        if (enableBackground) {
          return `backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        }
        return '';
      };
    },
    getTextStyles() {
      return function () {
        const { stylesObj = {}, gradientType, enableBackground, enableEllipsis } = this.config;
        let styles = enableEllipsis ? `line-height:${this.config.height}px;` : `line-height:${stylesObj.fontSize + 10}px;`;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          borderColor,
          ...rest
        } = stylesObj;
        Object.keys(rest).forEach((item) => {
          let singStyle = `${item}:${stylesObj[item]}`;
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px';
          }

          styles += `${singStyle}${singStyle ? ';' : ''}`;
        });

        if (gradientType === 1 && color1 && color2) { // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`;
        } else if (gradientType === 2 && color1 && color2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`;
        } else if (color1 || color2) {
          styles += `color: ${color1 || color2};`;
        } else {
          styles += 'color: rgba(255, 255, 255, 0);';
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};`;
        }
        return styles;
      };
    },
  },
  watch: {},
  methods: {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
