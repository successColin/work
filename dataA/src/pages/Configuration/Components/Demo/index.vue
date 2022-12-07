<!-- 页面 -->
<template>
  <VueDragResize
      :isActive="true"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
  >
    <div style="width: 200px;height: 200px; border: 1px solid red; box-sizing: border-box;">
      <h3>Hello World!</h3>
      <p style="color: #f5f7fa">{{ top }} х {{ left }} </p>
      <p style="color: #f5f7fa">{{ width }} х {{ height }}</p>
    </div>
  </VueDragResize>
</template>

<script>
// import VueDragResize from 'vue-drag-resize'
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
    }
  },
  data() {
    return {
      width: 200,
      height: 200,
      top: 0,
      left: 0
    };
  },

  components: {
    // VueDragResize
  },

  computed: {},
  beforeMount() {
    const {offsetY, offsetX} = this.config;
    const lastTop = offsetY / this.scale - this.height / 2;
    const lastLeft = offsetX / this.scale - this.width / 2;
    this.top = lastTop;
    this.left = lastLeft;
  },
  mounted() {
    // this.top = this.config.offsetY;
    // console.log(this.top, 'top', this.config.offsetY);
    // this.left = this.config.offsetX;
    const {offsetY, offsetX} = this.config;
    const lastTop = offsetY / this.scale - this.height / 2;
    const lastLeft = offsetX / this.scale - this.width / 2;
    this.top = lastTop;
    this.left = lastLeft;
  },
  watch: {
    // top(val, oldVal){ // 普通的watch监听
    //     console.log("a: "+val, oldVal);
    // },
  },
  methods: {
    dragstop(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },
    dragging(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
</style>
