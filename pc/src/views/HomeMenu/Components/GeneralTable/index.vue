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
    <GeneralTable :config="config" :scale="transitionScaleY" :otherParams="otherParams">
    </GeneralTable>
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
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    transitionScaleY: {
      type: Number
    }
  },
  data() {
    return {
      content: '',
      timer: null
    };
  },

  components: {},

  computed: {
    getContentStyles() {
      return function () {
        const { stylesObj = {}, enableBackground, width, height, top, left } = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
        const {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
        if (enableBackground) {
          styles += ` backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        }
        return styles;
      };
    }
  },
  beforeMount() {
  },
  mounted() {
    console.log('lieb');
  },
  watch: {},
  methods: {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
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
