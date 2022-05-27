<template>
  <el-color-picker
    v-model="colorV"
    v-bind="$attrs"
    v-on="$listeners"
  ></el-color-picker>
</template>

<script>
export default {
  name: '',
  props: {
    value: {
      type: String
    },
    initColor: {
      type: String,
      default: '#333333'
    }
  },
  data() {
    return {
      colorV: ''
    };
  },
  components: {},

  methods: {},
  mounted() {
    this.colorV = this.value;
  },
  watch: {
    colorV(v) {
      if (!v) {
        this.colorV = this.initColor;
      }
      this.$emit('input', v);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
