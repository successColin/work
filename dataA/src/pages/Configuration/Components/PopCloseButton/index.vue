/**
* @name: index
* @author: DELL
* @date: 2021/8/26 19:16
* @description：index
* @update: 2021/8/26 19:16
*/
<!-- 页面 -->
<template>
  <VueDragResize
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :parentScaleX="scale"
      :parentScaleY="scale"
      :minw="2"
      :minh="2"
      @deactivated="deactivated"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="backgroundBoxWrap" :style="getTextStyles()" @contextmenu.prevent="show">
      <div class="backgroundBox" :style="getRotateY">
        <div class="backgroundBoxContent" :style="getStyles()">
          {{config.stylesObj.content}}
        </div>
      </div>
    </div>
  </VueDragResize>
</template>

<script>
import {screenConfig} from '@/constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default(){
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
    // VueDragResize
  },

  computed: {
    getTextStyles() {
      return function () {
        const {stylesObj, width, height } = this.config;
        const { borderRadius, backgroundImage, zIndex } = stylesObj;
        return {
          width: `${width}px`,
          height: `${height}px`,
          zIndex,
          borderRadius: `${borderRadius}%`,
          backgroundImage: `url(${backgroundImage})`
        }
      };
    },
    getRotateY() {
      const { stylesObj } = this.config;
      const { bgColor, borderRadius } = stylesObj;
      return {
        backgroundColor: bgColor,
        borderRadius: `${borderRadius}%`
      };
    },
    getStyles() {
      return function () {
        const { stylesObj } = this.config;
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
    show(e) { // 右键
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    },
    deactivated(){
      // this.$emit("updateActiveComponent", {})
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
    handleClick() {
      // this.$nextTick(() => {
      //   this.$emit("updateActiveComponent", this.config);
      // })
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.backgroundBoxWrap {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;

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
