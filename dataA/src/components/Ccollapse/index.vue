/**
* @name: index
* @author: DELL
* @date: 2021/8/26 14:15
* @description：index
* @update: 2021/8/26 14:15
*/
<!-- 页面 -->
<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="文本属性设置" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    collapseArr: {
      type: Array,
      default: () => []
    }
  },
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
