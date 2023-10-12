<template>
  <el-form-item :label="labelName">
    <el-input
      v-model="activeObj.placeholder"
      :placeholder="`请输入${labelName}`"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: '',
  props: {
    activeObj: {
      type: Object
    },
    labelName: {
      type: String,
      default: '占位提示'
    }
  },
  data() {
    return {};
  },
  components: {}
};
</script>

<style lang='scss' scoped>
</style>
