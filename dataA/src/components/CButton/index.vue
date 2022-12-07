/**
* @name: index
* @author: DELL
* @date: 2021/10/30 15:43
* @description：index
* @update: 2021/10/30 15:43
*/
<!-- 页面 -->
<template>
  <el-button v-on="$listeners" v-bind="$attrs">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
</style>
