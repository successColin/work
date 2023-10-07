/**
* @name: index
* @author: DELL
* @date: 2021/8/26 19:16
* @description：index
* @update: 2021/8/26 19:16
*/
<!-- 页面 -->
<template>
  <div class="backgroundBoxWrap" :style="getTextStyles()" @click="handleCancel">
    <div class="backgroundBox" :style="getRotateY">
      <div class="backgroundBoxContent" :style="getStyles()">
        {{ config.stylesObj.content }}
      </div>
    </div>
  </div>
</template>

<script>
import {screenConfig} from '@/constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
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
  },

  computed: {
    getTextStyles() {
      return function () {
        const {stylesObj, width, height, top, left} = this.config;
        const {borderRadius, backgroundImage, zIndex} = stylesObj;
        return {
          width: `${width}px`,
          height: `${height}px`,
          zIndex,
          top: `${top}px`,
          left: `${left}px`,
          borderRadius: `${borderRadius}%`,
          backgroundImage: `url(${backgroundImage})`
        }
      };
    },
    getRotateY() {
      const {stylesObj} = this.config;
      const {bgColor, borderRadius} = stylesObj;
      return {
        backgroundColor: bgColor,
        borderRadius: `${borderRadius}%`
      };
    },
    getStyles() {
      return function () {
        const {stylesObj} = this.config;
        const {
          color,
          fontSize,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
        return {
          color,
          fontSize: `${fontSize}px`,
          borderRadius: `${borderRadius}%`,
          borderColor,
          borderWidth: `${borderWidth}px`,
          borderStyle
        }
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
    // config(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
  },
  methods: {
    handleCancel() {
      window.parent.postMessage({
        message: 'modalClose',
        visible: false
      }, '*');
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.backgroundBoxWrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  box-sizing: border-box;

  .backgroundBox {
    width: 100%;
    height: 100%;

    .backgroundBoxContent {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
}
</style>
