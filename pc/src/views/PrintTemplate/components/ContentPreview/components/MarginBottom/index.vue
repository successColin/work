<!--
 * @Descripttion: 下边距
 * @Author: ytx
 * @Date: 2022-07-19 15:43:54
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-19 15:43:54
-->
<template>
  <div
    :style="`
      height: ${marginBottom}mm;
      position: absolute;
      bottom: 0;
      background: #fff;
      width: 100%;
      z-index: 2;
    `"
  ></div>
</template>

<script>
export default {
  props: {
    marginBottom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>
