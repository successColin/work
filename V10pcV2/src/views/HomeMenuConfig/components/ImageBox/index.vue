/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getRotateX">
    <div class="imageContent" :style="getRotateY">
      <div class="imageBox" :style="getTextStyles()">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return {};
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
    return {};
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
    getRotateX() {
      if (this.config.verticalMirror) {
        return 'transform: rotateX(180deg);';
      }
      return '';
    },
    getTextStyles() {
      return function () {
        let styles = '';
        const { stylesObj = {} } = this.config;
        Object.keys(stylesObj).forEach((item) => {
          if (item === 'backgroundImage') {
            styles += `background-image:url(${this.$parseImgUrl(stylesObj[item])});`;
          } else if (item === 'rotationAngle') {
            styles += `transform:rotate(${stylesObj[item]}deg);`;
          } else {
            styles += `${item}:${stylesObj[item]};`;
          }
        });
        return styles;
      };
    },
  },
  mounted() {
  },
  watch: {
    // config(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
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

    .imageBox {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
