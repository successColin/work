<template>
  <el-form-item label="帮助信息">
    <apiot-input
      v-model="activeObj.helpInfo"
      placeholder="这里是帮助信息填写"
    ></apiot-input>
  </el-form-item>
</template>

<script>
export default {
  name: '',
  props: {
    activeObj: {
      type: Object
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
