/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：辅助线条
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
    <div class="singleTextWrap">
      <div class="imageContent" :style="getRotateY">
        <div class="imageBox" :style="getTextStyles()">
        </div>
      </div>
    </div>
</template>

<script>
import { menuProperties } from '../../constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return menuProperties;
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
    getRotateY() {
      if (this.config.horizontalMirror) {
        return 'transform: rotateY(180deg);';
      }
      return '';
    },
    getTextStyles() {
      return function () {
        const { stylesObj: { color, rotationAngle, opacity, height, lineStyleType } } = this.config;
        return `transform:rotate(${rotationAngle}deg);opacity:${opacity / 100};border-top-width:${height}px;border-top-style:${lineStyleType};border-top-color:${color};`;
      };
    },
  },
  methods: {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;

  .imageContent {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .imageBox {
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
}
</style>
