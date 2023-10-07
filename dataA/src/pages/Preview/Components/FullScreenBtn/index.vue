/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>

  <div class="singleTextWrap" :style="getContentStyles">
    <CFullScreen :style="getStyles"></CFullScreen>
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
  },

  computed: {
    getList() {
      return this.$store.getters.list;
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getStyles() {
      const {stylesObj: {fontSize, color}} = this.config;
      return {
        color,
        fontSize: `${fontSize}px`
      }
    }
  },
  mounted() {
  },
  watch: {
    // config(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
  },
  methods: {
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick(e) {
      console.log(e, 'handleClick');
      // this.$nextTick(() => {
      //   this.$emit("updateActiveComponent", this.config);
      // })
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .fullScreen {
    color: #FFFFFF;
    font-size: 16px;
  }

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
