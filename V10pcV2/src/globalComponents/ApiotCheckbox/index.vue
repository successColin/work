<!-- * @描述: 通用复选框 -->
<template>
  <el-checkbox v-bind="$attrs" v-on="$listeners" class="apiotCheckbox">
    <slot></slot>
  </el-checkbox>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.apiotCheckbox {
}
</style>
