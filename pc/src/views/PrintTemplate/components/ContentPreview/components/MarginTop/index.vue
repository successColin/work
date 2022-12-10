<template>
  <div
    :style="`
      height: ${marginTop}mm;
      top: 0;
      position: absolute;
      background: #fff;
      width: 100%;
      z-index: 2;
    `"
  ></div>
</template>

<script>
export default {
  props: {
    marginTop: {
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
