/**
* @name: index
* @author: DELL
* @date: 2023/1/17 15:31
* @description：index
* @update: 2023/1/17 15:31
*/
<!-- 页面 -->
<template>
  <div
      id="selectAreaBox"
      class="select-area"
      :style="[
      { width: size.width + 'px' },
      { height: size.height + 'px' },
      { top: point.y + 'px' },
      { left: point.x + 'px' },
    ]"
  >
  </div>
</template>

<script>
export default {
  name: 'SelectArea',
  props: {
    startPoint: {
      type: Object,
      required: true,
    },
    endPoint: {
      type: Object,
      required: true,
    },
    point: {
      type: Object,
      required: true,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    },
    scale: {
      type: Number,
      required: true,
      default: 1
    },
    size: {
      type: Object,
      required: true,
      default() {
        return {
          width: 0,
          height: 0
        };
      }
    },
  },
  computed: {},
};
</script>
<style lang='scss' scoped>
.select-area {
  position: absolute;
  background-color: rgba(255, 192, 203, 0.1);
  border: 1px solid red;
  z-index: 9;
}
</style>
