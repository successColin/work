<template>
  <div>{{ rows }}</div>
</template>

<script>
export default {
  props: {
    printParams: {
      type: Object,
      default: () => {}
    },
    rows: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    previewObj() {
      return this.printParams.previewObj;
    },
    maxWidth() {
      return this.previewObj.maxWidth;
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>
