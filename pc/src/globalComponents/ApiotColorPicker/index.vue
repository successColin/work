<template>
  <el-color-picker
    v-model="colorV"
    v-bind="$attrs"
    v-on="$listeners"
    :predefine="colorArr"
    show-alpha
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
    },
    selectColorArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      colorV: '',
      colorArr: []
    };
  },
  components: {},

  methods: {},
  mounted() {
    this.colorV = this.value;
    if (this.selectColorArr.length === 0) {
      this.colorArr = [
        '#EE5E5E',
        '#FC8256',
        '#FAB71C',
        '#10B98A',
        '#0EBEC4',
        '#5A80ED',
        '#8A5AED',
        '#ED437B',
        '#708DB7',
        '#ACB4BE',
        '#FFEAEB',
        '#FFECE5',
        '#FFF5DB',
        '#E3FBF5',
        '#E3FDFD',
        '#E5F0FF',
        '#F7EEFF',
        '#FEE9F0',
        '#EEF4FC',
        '#F2F4F8',
        '#333333',
        '#666666',
        '#808080',
        '#AAAAAA',
        '#C0C0C0',
        '#CACACA',
        '#D7D7D7',
        '#E3E3E3',
        '#EDEDED',
        '#F5F5F5'
      ];
    } else {
      this.colorArr = this.selectColorArr;
    }
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
