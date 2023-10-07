/**
* @name: SelectArea
* @author: DELL
* @date: 2023/1/12 8:50
* @description：SelectArea
* @update: 2023/1/12 8:50
*/
<!-- 页面 -->
<template>
  <div
      id="selectAreaBox"
      class="select-area"
      :style="[
      { width: size.width + 'px' },
      { height: size.height + 'px' },
      { top: Point.y + 'px' },
      { left: Point.x + 'px' },
    ]"
  >
  </div>
</template>

<script>
export default {
  props: {
    startPoint: {
      type: Object,
      required: true
    },
    endPoint: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    Point() {
      let x = this.endPoint.x === 0 ? this.startPoint.x : Math.min(this.startPoint.x, this.endPoint.x);
      let y = this.endPoint.y === 0 ? this.startPoint.y : Math.min(this.startPoint.y, this.endPoint.y);
      return {
        x,
        y
      };
    },
    size(){
      let width = this.endPoint.x === 0 ? 0 : Math.abs(this.startPoint.x - this.endPoint.x);
      let height = this.endPoint.y === 0 ? 0 : Math.abs(this.startPoint.y - this.endPoint.y);
      return {
        width,
        height
      };
    }
  },

  mounted() {
  },

  methods: {},
  name: 'SelectArea'
};
</script>

<style lang='scss' scoped>
.select-area {
  position: fixed;
  background-color: rgba(255, 192, 203, 0.1);
  border: 1px solid red;
  z-index: 9;
}
</style>
