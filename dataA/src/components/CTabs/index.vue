/**
* @name: index
* @author: DELL
* @date: 2021/11/29 14:25
* @description：index
* @update: 2021/11/29 14:25
*/
<!-- 页面 -->
<template>
  <el-tabs
      v-bind="$attrs"
      v-on="$listeners"
  >
    <el-tab-pane
        v-for="item in tabArr"
        :label="item.label"
        :name="item.key"
        :key="item.key"
    >
      <slot :name="item.compName"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tabArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    handleClick() {
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
</style>
